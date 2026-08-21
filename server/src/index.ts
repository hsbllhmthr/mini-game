import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './db.js';
import { generateRoomCode, generateFacilitatorToken } from './utils.js';
import { registerSocketHandlers } from './socketHandler.js';
import { generateExport } from './export.js';
import { adminRouter } from './admin.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Mount Admin REST Router
app.use('/api/v1/admin', adminRouter);

// REST API Endpoints
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: process.env.OFFLINE_MODE === 'true' ? 'offline' : 'online',
  });
});

// POST /rooms: Create a new room
app.post('/api/v1/rooms', async (req, res, next) => {
  try {
    let roomCode = generateRoomCode();
    let isUnique = false;
    let retries = 0;

    // Resolve collision
    while (!isUnique && retries < 5) {
      const existing = await prisma.session.findUnique({
        where: { roomCode },
      });
      if (!existing) {
        isUnique = true;
      } else {
        roomCode = generateRoomCode();
        retries++;
      }
    }

    if (!isUnique) {
      res.status(500).json({ error: 'Failed to generate a unique room code.' });
      return;
    }

    const facilitatorToken = generateFacilitatorToken();

    const session = await prisma.session.create({
      data: {
        roomCode,
        facilitatorToken,
        status: 'waiting',
        phase: 'lobby',
        scenarioIndex: 0,
      },
    });

    res.status(201).json({
      room_code: session.roomCode,
      facilitator_token: session.facilitatorToken,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /rooms/:code: Validate room code for join screen
app.get('/api/v1/rooms/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    if (!code) {
      res.status(400).json({ error: 'Room code is required' });
      return;
    }

    const session = await prisma.session.findUnique({
      where: { roomCode: code.toUpperCase() },
      include: {
        _count: {
          select: { players: true },
        },
      },
    });

    if (!session) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    if (session.status === 'completed') {
      res.status(410).json({ error: 'Session already completed' });
      return;
    }

    res.status(200).json({
      room_code: session.roomCode,
      status: session.status,
      phase: session.phase,
      player_count: session._count.players,
      max_players: 12,
    });
  } catch (error) {
    console.error('Error validation room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /rooms/:code/export: Generate and download .xlsx export for a completed session
app.get('/api/v1/rooms/:code/export', async (req, res, next) => {
  try {
    const { code } = req.params;
    const facilitatorToken = req.headers['x-facilitator-token'] as string;

    if (!code) {
      res.status(400).json({ error: 'Room code is required' });
      return;
    }

    if (!facilitatorToken) {
      res.status(401).json({ error: 'Facilitator token is required' });
      return;
    }

    const session = await prisma.session.findUnique({
      where: { roomCode: code.toUpperCase() },
    });

    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    if (session.facilitatorToken !== facilitatorToken) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    if (session.status !== 'completed') {
      res.status(400).json({ error: 'Session is not completed' });
      return;
    }

    const buffer = await generateExport(code);
    const dateStr = new Date().toISOString().split('T')[0];
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="TPA_Results_${code.toUpperCase()}_${dateStr}.xlsx"`);
    res.send(buffer);
  } catch (error) {
    console.error('Error generating export:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register socket.io event handlers
registerSocketHandlers(io);

// Serve static client assets in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// Fallback for single page app routing
app.use((req, res, next) => {
  if (req.path.startsWith('/api/v1')) {
    next();
    return;
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`[Server] Running in ${process.env.OFFLINE_MODE === 'true' ? 'OFFLINE' : 'ONLINE'} mode on port ${PORT}`);
});
