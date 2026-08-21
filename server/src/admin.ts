import { Router, Request, Response } from 'express';
import { prisma } from './db.js';
import { generateExport } from './export.js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_TOKEN = 'tpa_admin_token_secret_session_2026';

export const adminRouter = Router();

// Middleware to verify admin token
function verifyAdminToken(req: Request, res: Response, next: () => void) {
  const token = req.headers['x-admin-token'] as string;
  if (!token || token !== ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized admin access' });
    return;
  }
  next();
}

// POST /api/v1/admin/login
adminRouter.post('/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ error: 'Invalid admin password' });
  }
});

// GET /api/v1/admin/stats
adminRouter.get('/stats', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const totalSessions = await prisma.session.count();
    const activeSessions = await prisma.session.count({ where: { status: 'active' } });
    const completedSessions = await prisma.session.count({ where: { status: 'completed' } });
    const totalPlayers = await prisma.player.count();

    const completedGameStates = await prisma.gameState.findMany({
      where: { session: { status: 'completed' } },
      select: { fps: true, ps: true, gqs: true, ss: true }
    });

    const avgFps = completedGameStates.length > 0
      ? completedGameStates.reduce((acc, curr) => acc + (curr.fps || 0), 0) / completedGameStates.length
      : 0;

    res.json({
      total_sessions: totalSessions,
      active_sessions: activeSessions,
      completed_sessions: completedSessions,
      total_players: totalPlayers,
      avg_fps: Number(avgFps.toFixed(2))
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// GET /api/v1/admin/sessions
adminRouter.get('/sessions', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { status, query } = req.query;

    const whereClause: any = {};
    if (status && status !== 'all') {
      whereClause.status = status as string;
    }
    if (query) {
      whereClause.roomCode = { contains: (query as string).toUpperCase() };
    }

    const sessions = await prisma.session.findMany({
      where: whereClause,
      include: {
        _count: { select: { players: true, votes: true } },
        gameState: {
          select: {
            fps: true,
            archetypes: true,
            beneficiaries: true,
            scenario0Choice: true,
            scenario1Choice: true,
            scenario2Choice: true,
            scenario3Choice: true,
            scenario4Choice: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    const formatted = sessions.map(s => ({
      id: s.id,
      room_code: s.roomCode,
      status: s.status,
      phase: s.phase,
      scenario_index: s.scenarioIndex,
      player_count: s._count.players,
      created_at: s.createdAt,
      started_at: s.startedAt,
      ended_at: s.endedAt,
      fps: s.gameState?.fps || null,
      archetypes: s.gameState?.archetypes || null,
      choices: s.gameState ? [
        s.gameState.scenario0Choice,
        s.gameState.scenario1Choice,
        s.gameState.scenario2Choice,
        s.gameState.scenario3Choice,
        s.gameState.scenario4Choice
      ].filter(Boolean) : []
    }));

    res.json({ sessions: formatted });
  } catch (error) {
    console.error('Error listing admin sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// GET /api/v1/admin/sessions/:id
adminRouter.get('/sessions/:id', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        players: {
          include: {
            votes: {
              orderBy: { scenarioIndex: 'asc' }
            }
          }
        },
        gameState: true,
        votes: true
      }
    });

    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    const beneficiariesList = session.gameState?.beneficiaries
      ? session.gameState.beneficiaries.split(',').map(b => b.trim())
      : [];

    const playersFormatted = session.players.map(p => {
      const votesByScenario: Record<number, string> = {};
      p.votes.forEach(v => {
        votesByScenario[v.scenarioIndex] = v.choice;
      });

      const isBeneficiary = p.role ? beneficiariesList.includes(p.role) : false;

      return {
        id: p.id,
        full_name: p.fullName,
        display_name: p.displayName,
        country: p.country,
        role: p.role,
        is_connected: p.isConnected,
        joined_at: p.joinedAt,
        votes: votesByScenario,
        is_beneficiary: isBeneficiary
      };
    });

    res.json({
      session: {
        id: session.id,
        room_code: session.roomCode,
        status: session.status,
        phase: session.phase,
        scenario_index: session.scenarioIndex,
        created_at: session.createdAt,
        started_at: session.startedAt,
        ended_at: session.endedAt,
        game_state: session.gameState,
        players: playersFormatted
      }
    });
  } catch (error) {
    console.error('Error fetching admin session detail:', error);
    res.status(500).json({ error: 'Failed to fetch session detail' });
  }
});

// DELETE /api/v1/admin/sessions/:id
adminRouter.delete('/sessions/:id', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.session.delete({
      where: { id }
    });

    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// POST /api/v1/admin/reset: Clear all sessions, players, votes, and game states
adminRouter.post('/reset', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    await prisma.vote.deleteMany();
    await prisma.player.deleteMany();
    await prisma.gameState.deleteMany();
    await prisma.session.deleteMany();

    res.json({ success: true, message: 'All database session records reset successfully' });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

// GET /api/v1/admin/sessions/:code/export
adminRouter.get('/sessions/:code/export', verifyAdminToken, async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const buffer = await generateExport(code);
    const dateStr = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="TPA_Admin_Export_${code.toUpperCase()}_${dateStr}.xlsx"`);
    res.send(buffer);
  } catch (error) {
    console.error('Error exporting admin session:', error);
    res.status(500).json({ error: 'Failed to generate export' });
  }
});
