import { Server, Socket } from 'socket.io';
import { prisma } from './db.js';
import {
  assignRoles,
  resolveVotes,
  calcPS,
  calcGQS,
  calcSS,
  calcFPS,
  resolveArchetypes,
  resolveBeneficiaries
} from './gameEngine.js';
import {
  SCENARIOS,
  SECRET_INFO,
  ROLE_DESCRIPTIONS,
  ROLE_OBJECTIVES,
  PlayerRole,
  GameStateValues,
  BENEFIT_THRESHOLDS
} from './gameConstants.js';

// Active countdown timers mapped by roomCode
const activeTimers = new Map<string, { interval: NodeJS.Timeout; secondsRemaining: number }>();

function getRoleDescription(role: PlayerRole, lang: string = 'en'): string {
  const dict = ROLE_DESCRIPTIONS[lang] || ROLE_DESCRIPTIONS['en'];
  return dict[role];
}

function getRoleObjective(role: PlayerRole, lang: string = 'en'): string {
  const dict = ROLE_OBJECTIVES[lang] || ROLE_OBJECTIVES['en'];
  return dict[role];
}

function getLocalizedScenario(index: number, lang: string = 'en') {
  const s = SCENARIOS[index];
  if (!s) return null;
  
  return {
    id: s.id,
    title: s.title[lang] || s.title['en'],
    description: s.description[lang] || s.description['en'],
    challengeSummary: s.challengeSummary[lang] || s.challengeSummary['en'],
    stakeholderPositions: s.stakeholderPositions[lang] || s.stakeholderPositions['en'],
    options: {
      A: { ...s.options.A, label: s.options.A.label[lang] || s.options.A.label['en'], description: s.options.A.description[lang] || s.options.A.description['en'], advantages: s.options.A.advantages[lang] || s.options.A.advantages['en'], risks: s.options.A.risks[lang] || s.options.A.risks['en'] },
      B: { ...s.options.B, label: s.options.B.label[lang] || s.options.B.label['en'], description: s.options.B.description[lang] || s.options.B.description['en'], advantages: s.options.B.advantages[lang] || s.options.B.advantages['en'], risks: s.options.B.risks[lang] || s.options.B.risks['en'] },
      C: { ...s.options.C, label: s.options.C.label[lang] || s.options.C.label['en'], description: s.options.C.description[lang] || s.options.C.description['en'], advantages: s.options.C.advantages[lang] || s.options.C.advantages['en'], risks: s.options.C.risks[lang] || s.options.C.risks['en'] },
    },
    reflection: s.reflection[lang] || s.reflection['en']
  };
}

export function registerSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // --- PLAYER LOBBY JOIN ---
    socket.on('player:join', async ({ room_code, full_name, country, lang = 'en' }) => {
      try {
        const roomCode = room_code.toUpperCase();
        const session = await prisma.session.findUnique({
          where: { roomCode },
          include: { players: true }
        });

        if (!session) {
          socket.emit('error', { code: 'ROOM_NOT_FOUND', message: 'Room not found' });
          return;
        }

        socket.data.lang = lang; // Store player's preferred language

        if (session.status !== 'waiting') {
          // If game started, check if this is a reconnection attempt (name exists and disconnected)
          const existingPlayer = session.players.find(
            p => p.fullName.toLowerCase() === full_name.toLowerCase()
          );

          if (existingPlayer && !existingPlayer.isConnected) {
            console.log(`[Socket] Treating join as reconnection for ${full_name} in room ${roomCode}`);
            // Update connected state
            await prisma.player.update({
              where: { id: existingPlayer.id },
              data: { isConnected: true }
            });

            socket.data.playerId = existingPlayer.id;
            socket.data.roomCode = roomCode;
            socket.data.fullName = full_name;
            if (existingPlayer.role) {
              socket.data.role = existingPlayer.role;
            }

            socket.join(roomCode);

            // Broadcast reconnection
            io.to(roomCode).emit('room:player_reconnected', {
              player_id: existingPlayer.id,
              full_name: existingPlayer.fullName
            });

            // Emit state restore payload
            const restorePayload: any = {
              phase: session.phase,
              scenario_index: session.scenarioIndex,
              role: existingPlayer.role
            };

            if (existingPlayer.role) {
              const pLang = socket.data.lang || 'en';
              const secretDict = SECRET_INFO[pLang] || SECRET_INFO['en'];
              restorePayload.role_info = {
                role: existingPlayer.role,
                description: getRoleDescription(existingPlayer.role, pLang),
                objective: getRoleObjective(existingPlayer.role, pLang),
                secret_info: secretDict[existingPlayer.role]
              };
            }

            const gameState = await prisma.gameState.findUnique({ where: { sessionId: session.id } });
            if (gameState) {
              restorePayload.indicators = {
                economic_growth: gameState.economicGrowth,
                government_budget: gameState.governmentBudget,
                people_welfare: gameState.peopleWelfare,
                public_trust: gameState.publicTrust,
                environmental_quality: gameState.environmentalQuality,
                transparency: gameState.transparency
              };
            }

            socket.emit('player:state_restored', restorePayload);
            return;
          }

          socket.emit('error', { code: 'GAME_ALREADY_STARTED', message: 'Session has already started' });
          return;
        }

        if (session.players.length >= 12) {
          socket.emit('error', { code: 'ROOM_FULL', message: 'Room is full (max 12 players)' });
          return;
        }

        const nameExists = session.players.some(
          p => p.fullName.toLowerCase() === full_name.toLowerCase()
        );

        if (nameExists) {
          socket.emit('error', { code: 'NAME_TAKEN', message: 'This name is already taken in this room' });
          return;
        }

        // Create player
        const player = await prisma.player.create({
          data: {
            sessionId: session.id,
            fullName: full_name,
            displayName: full_name,
            country,
            isConnected: true
          }
        });

        // Store session info on socket
        socket.data.playerId = player.id;
        socket.data.roomCode = roomCode;
        socket.data.fullName = full_name;

        socket.join(roomCode);
        console.log(`[Socket] Player ${full_name} joined room ${roomCode}`);

        // Broadcast updated player list
        const updatedPlayers = await prisma.player.findMany({
          where: { sessionId: session.id },
          select: { id: true, fullName: true, country: true, isConnected: true, role: true }
        });

        io.to(roomCode).emit('room:player_joined', {
          players: updatedPlayers.map(p => ({
            id: p.id,
            full_name: p.fullName,
            country: p.country,
            is_connected: p.isConnected,
            role: p.role
          }))
        });
      } catch (error) {
        console.error('Error in player:join:', error);
        socket.emit('error', { code: 'SERVER_ERROR', message: 'Failed to join lobby' });
      }
    });

    // --- PLAYER/FACILITATOR RECONNECT ---
    socket.on('player:reconnect', async ({ room_code, full_name, lang = 'en' }) => {
      try {
        const roomCode = room_code.toUpperCase();
        const session = await prisma.session.findUnique({
          where: { roomCode },
          include: { gameState: true }
        });

        if (!session) {
          socket.emit('error', { code: 'ROOM_NOT_FOUND', message: 'Room not found' });
          return;
        }

        if (session.status === 'completed') {
          socket.emit('error', { code: 'SESSION_COMPLETED', message: 'Session has already ended' });
          return;
        }

        socket.data.lang = lang;

        const sessionPlayers = await prisma.player.findMany({
          where: { sessionId: session.id }
        });

        const player = sessionPlayers.find(
          p => p.fullName.toLowerCase() === full_name.toLowerCase()
        );

        if (!player) {
          socket.emit('error', { code: 'PLAYER_NOT_FOUND', message: 'Player not registered in this session' });
          return;
        }

        // Update connected state
        const updatedPlayer = await prisma.player.update({
          where: { id: player.id },
          data: { isConnected: true }
        });

        socket.data.playerId = updatedPlayer.id;
        socket.data.roomCode = roomCode;
        socket.data.fullName = full_name;
        if (updatedPlayer.role) {
          socket.data.role = updatedPlayer.role;
        }

        socket.join(roomCode);
        console.log(`[Socket] Player ${full_name} reconnected to room ${roomCode}`);

        // Broadcast reconnection
        io.to(roomCode).emit('room:player_reconnected', {
          player_id: player.id,
          full_name: player.fullName
        });

        // Broadcast updated player list to sync lobby/waiting room players
        io.to(roomCode).emit('room:player_joined', {
          players: sessionPlayers.map(p => ({
            id: p.id,
            full_name: p.fullName,
            country: p.country,
            is_connected: p.id === player.id ? true : p.isConnected,
            role: p.role
          }))
        });

        // Emit state restore payload to player
        const restorePayload: any = {
          phase: session.phase,
          scenario_index: session.scenarioIndex,
          role: updatedPlayer.role,
          players: sessionPlayers.map(p => ({
            id: p.id,
            full_name: p.fullName,
            country: p.country,
            is_connected: p.id === player.id ? true : p.isConnected,
            role: p.role
          }))
        };

        // Add additional outcome details if in outcome phase
        if (session.phase === 'outcome_reveal' && session.gameState) {
          const idx = session.scenarioIndex;
          const choice = idx === 0 ? session.gameState.scenario0Choice : idx === 1 ? session.gameState.scenario1Choice : session.gameState.scenario2Choice;
          
          if (choice) {
            const scenario = SCENARIOS[idx];
            const option = scenario.options[choice as 'A' | 'B' | 'C'];
            restorePayload.choice = choice;
            restorePayload.veto_used = idx === 0 ? session.gameState.scenario0Veto : idx === 1 ? session.gameState.scenario1Veto : session.gameState.scenario2Veto;
            restorePayload.justification = idx === 0 ? session.gameState.scenario0VetoReason : idx === 1 ? session.gameState.scenario1VetoReason : session.gameState.scenario2VetoReason;
            restorePayload.indicator_changes = {
              economic_growth: option.indicators.economicGrowth,
              government_budget: option.indicators.governmentBudget,
              people_welfare: option.indicators.peopleWelfare,
              public_trust: option.indicators.publicTrust,
              environmental_quality: option.indicators.environmentalQuality,
              transparency: option.indicators.transparency
            };
          }
        }

        if (updatedPlayer.role) {
          const pLang = socket.data.lang || 'en';
          const secretDict = SECRET_INFO[pLang] || SECRET_INFO['en'];
          restorePayload.role_info = {
            role: updatedPlayer.role,
            description: getRoleDescription(updatedPlayer.role, pLang),
            objective: getRoleObjective(updatedPlayer.role, pLang),
            secret_info: secretDict[updatedPlayer.role]
          };
        }

        if (session.gameState) {
          restorePayload.indicators = {
            economic_growth: session.gameState.economicGrowth,
            government_budget: session.gameState.governmentBudget,
            people_welfare: session.gameState.peopleWelfare,
            public_trust: session.gameState.publicTrust,
            environmental_quality: session.gameState.environmentalQuality,
            transparency: session.gameState.transparency
          };
        }

        socket.emit('player:state_restored', restorePayload);
      } catch (error) {
        console.error('Error in player:reconnect:', error);
        socket.emit('error', { code: 'SERVER_ERROR', message: 'Failed to reconnect' });
      }
    });

    // --- FACILITATOR CONNECT/RECONNECT ---
    socket.on('facilitator:join', async ({ room_code, facilitator_token, lang = 'en' }) => {
      try {
        const roomCode = room_code.toUpperCase();
        const session = await prisma.session.findUnique({
          where: { roomCode }
        });

        if (!session) {
          socket.emit('error', { code: 'ROOM_NOT_FOUND', message: 'Room not found' });
          return;
        }

        if (session.facilitatorToken !== facilitator_token) {
          socket.emit('error', { code: 'UNAUTHORIZED', message: 'Invalid facilitator token' });
          return;
        }

        socket.data.roomCode = roomCode;
        socket.data.isFacilitator = true;
        socket.data.lang = lang;
        socket.join(roomCode);
        console.log(`[Socket] Facilitator joined room ${roomCode}`);

        // Get current game state and players to allow restoration
        const [gameState, sessionPlayers] = await Promise.all([
          prisma.gameState.findUnique({ where: { sessionId: session.id } }),
          prisma.player.findMany({ where: { sessionId: session.id } })
        ]);
        
        const responsePayload: any = {
          room_code: session.roomCode,
          facilitator_token: session.facilitatorToken,
          phase: session.phase,
          scenario_index: session.scenarioIndex,
          players: sessionPlayers.map(p => ({
            id: p.id,
            full_name: p.fullName,
            country: p.country,
            is_connected: p.isConnected,
            role: p.role
          })),
          indicators: gameState ? {
            economic_growth: gameState.economicGrowth,
            government_budget: gameState.governmentBudget,
            people_welfare: gameState.peopleWelfare,
            public_trust: gameState.publicTrust,
            environmental_quality: gameState.environmentalQuality,
            transparency: gameState.transparency
          } : undefined
        };

        // Add additional outcome details if in outcome phase
        if (session.phase === 'outcome_reveal' && gameState) {
          const idx = session.scenarioIndex;
          const choice = idx === 0 ? gameState.scenario0Choice : idx === 1 ? gameState.scenario1Choice : gameState.scenario2Choice;
          
          if (choice) {
            const scenario = SCENARIOS[idx];
            const option = scenario.options[choice as 'A' | 'B' | 'C'];
            responsePayload.choice = choice;
            responsePayload.veto_used = idx === 0 ? gameState.scenario0Veto : idx === 1 ? gameState.scenario1Veto : gameState.scenario2Veto;
            responsePayload.justification = idx === 0 ? gameState.scenario0VetoReason : idx === 1 ? gameState.scenario1VetoReason : gameState.scenario2VetoReason;
            responsePayload.indicator_changes = {
              economic_growth: option.indicators.economicGrowth,
              government_budget: option.indicators.governmentBudget,
              people_welfare: option.indicators.peopleWelfare,
              public_trust: option.indicators.publicTrust,
              environmental_quality: option.indicators.environmentalQuality,
              transparency: option.indicators.transparency
            };
          }
        }

        socket.emit('facilitator:room_created', responsePayload);
      } catch (error) {
        console.error('Error in facilitator:join:', error);
        socket.emit('error', { code: 'SERVER_ERROR', message: 'Facilitator join failed' });
      }
    });

    // --- CANCEL SESSION (FACILITATOR) ---
    socket.on('facilitator:cancel_session', async ({ room_code, facilitator_token }) => {
      try {
        const roomCode = room_code.toUpperCase();
        const session = await prisma.session.findUnique({
          where: { roomCode }
        });

        if (!session) return;
        if (session.facilitatorToken !== facilitator_token) {
          socket.emit('error', { code: 'UNAUTHORIZED', message: 'Invalid facilitator token' });
          return;
        }

        // Broadcast to everyone in the room that the session has been cancelled
        io.to(roomCode).emit('room:cancelled');

        // Delete the session (Cascade deletes players and gameState automatically)
        await prisma.session.delete({
          where: { id: session.id }
        });

        console.log(`[Socket] Session ${roomCode} has been cancelled by facilitator`);
      } catch (error) {
        console.error('Error in facilitator:cancel_session:', error);
        socket.emit('error', { code: 'SERVER_ERROR', message: 'Failed to cancel session' });
      }
    });

    // --- START GAME (FACILITATOR) ---
    socket.on('facilitator:start_game', async ({ room_code, facilitator_token }) => {
      try {
        const roomCode = room_code.toUpperCase();
        const session = await prisma.session.findUnique({
          where: { roomCode },
          include: { players: true }
        });

        if (!session) return;
        if (session.facilitatorToken !== facilitator_token) {
          socket.emit('error', { code: 'UNAUTHORIZED', message: 'Invalid facilitator token' });
          return;
        }

        if (session.players.length < 2 || session.players.length > 12) {
          socket.emit('error', { code: 'INVALID_PLAYER_COUNT', message: 'Must have 2-12 players to start the game' });
          return;
        }

        // Assign roles
        const assigned = assignRoles(
          session.players.map(p => ({ id: p.id, fullName: p.fullName, country: p.country })),
          session.players.length
        );

        // Update database in transaction
        await prisma.$transaction([
          ...assigned.map(p =>
            prisma.player.update({
              where: { id: p.id },
              data: { role: p.role }
            })
          ),
          prisma.session.update({
            where: { id: session.id },
            data: {
              status: 'active',
              phase: 'role_reveal',
              startedAt: new Date()
            }
          }),
          prisma.gameState.create({
            data: {
              sessionId: session.id,
              economicGrowth: 50,
              governmentBudget: 50,
              peopleWelfare: 50,
              publicTrust: 50,
              environmentalQuality: 50,
              transparency: 50
            }
          })
        ]);

        // Broadcast started
        io.to(roomCode).emit('game:started', { phase: 'role_reveal' });

        // Broadcast updated player list with roles (so facilitator sees them)
        const playersWithRoles = await prisma.player.findMany({
          where: { sessionId: session.id },
          select: { id: true, fullName: true, country: true, isConnected: true, role: true }
        });

        io.to(roomCode).emit('room:player_joined', {
          players: playersWithRoles.map(p => ({
            id: p.id,
            full_name: p.fullName,
            country: p.country,
            is_connected: p.isConnected,
            role: p.role
          }))
        });

        // Private messaging: Assign role to each player socket
        const clientSockets = await io.in(roomCode).fetchSockets();
        for (const player of assigned) {
          const clientSock = clientSockets.find(s => s.data.fullName === player.fullName);
          if (clientSock) {
            clientSock.data.role = player.role;
            const pLang = clientSock.data.lang || 'en';
            const secretDict = SECRET_INFO[pLang] || SECRET_INFO['en'];
            clientSock.emit('player:role_assigned', {
              role: player.role,
              description: getRoleDescription(player.role, pLang),
              objective: getRoleObjective(player.role, pLang),
              secret_info: secretDict[player.role]
            });
          }
        }
      } catch (error) {
        console.error('Error starting game:', error);
        socket.emit('error', { code: 'SERVER_ERROR', message: 'Failed to start game' });
      }
    });

    // --- OPEN SCENARIO (FACILITATOR) ---
    socket.on('facilitator:open_scenario', async ({ room_code, facilitator_token }) => {
      try {
        const roomCode = room_code.toUpperCase();
        const session = await prisma.session.findUnique({
          where: { roomCode }
        });

        if (!session) return;
        if (session.facilitatorToken !== facilitator_token) return;

        await prisma.session.update({
          where: { id: session.id },
          data: { phase: 'scenario_display' }
        });

        // We need to send localized scenario to each participant based on their language
        const clientSockets = await io.in(roomCode).fetchSockets();
        for (const clientSock of clientSockets) {
          const pLang = clientSock.data.lang || 'en';
          clientSock.emit('game:scenario_opened', {
            scenario_index: session.scenarioIndex,
            scenario: getLocalizedScenario(session.scenarioIndex, pLang)
          });
        }
      } catch (error) {
        console.error('Error opening scenario:', error);
      }
    });

    // --- START DISCUSSION (FACILITATOR) ---
    socket.on('facilitator:start_discussion', async ({ room_code, facilitator_token, duration_seconds }) => {
      try {
        const roomCode = room_code.toUpperCase();
        const session = await prisma.session.findUnique({
          where: { roomCode }
        });

        if (!session) return;
        if (session.facilitatorToken !== facilitator_token) return;

        await prisma.session.update({
          where: { id: session.id },
          data: { phase: 'discussion' }
        });

        // Clear existing timer if running
        if (activeTimers.has(roomCode)) {
          clearInterval(activeTimers.get(roomCode)!.interval);
        }

        io.to(roomCode).emit('game:discussion_started', { duration_seconds });

        let secondsRemaining = duration_seconds;
        const interval = setInterval(async () => {
          secondsRemaining--;
          io.to(roomCode).emit('game:timer_update', { seconds_remaining: secondsRemaining });

          if (secondsRemaining <= 0) {
            clearInterval(interval);
            activeTimers.delete(roomCode);
            await triggerVotingPhase(io, session.id, roomCode, session.scenarioIndex);
          } else {
            // Update time remaining in memory map
            const timerInfo = activeTimers.get(roomCode);
            if (timerInfo) {
              timerInfo.secondsRemaining = secondsRemaining;
            }
          }
        }, 1000);

        activeTimers.set(roomCode, { interval, secondsRemaining });
      } catch (error) {
        console.error('Error starting discussion:', error);
      }
    });

    // --- END DISCUSSION EARLY (FACILITATOR) ---
    socket.on('facilitator:end_discussion', async ({ room_code, facilitator_token }) => {
      try {
        const roomCode = room_code.toUpperCase();
        const session = await prisma.session.findUnique({
          where: { roomCode }
        });

        if (!session) return;
        if (session.facilitatorToken !== facilitator_token) return;

        // Clear timer
        if (activeTimers.has(roomCode)) {
          clearInterval(activeTimers.get(roomCode)!.interval);
          activeTimers.delete(roomCode);
        }

        await triggerVotingPhase(io, session.id, roomCode, session.scenarioIndex);
      } catch (error) {
        console.error('Error ending discussion:', error);
      }
    });

    // --- PLAYER CAST VOTE (PLAYER) ---
    socket.on('player:vote', async ({ room_code, player_id, choice }) => {
      try {
        const roomCode = room_code.toUpperCase();
        const session = await prisma.session.findUnique({
          where: { roomCode },
          include: { players: true, votes: true }
        });

        if (!session) return;
        if (session.phase !== 'voting') {
          socket.emit('error', { code: 'INVALID_PHASE', message: 'Voting is not open' });
          return;
        }

        // Upsert vote
        await prisma.vote.upsert({
          where: {
            sessionId_playerId_scenarioIndex: {
              sessionId: session.id,
              playerId: player_id,
              scenarioIndex: session.scenarioIndex
            }
          },
          update: { choice },
          create: {
            sessionId: session.id,
            playerId: player_id,
            scenarioIndex: session.scenarioIndex,
            choice
          }
        });

        socket.emit('player:vote_confirmed', { choice });

        // Get total vote count
        const votes = await prisma.vote.findMany({
          where: {
            sessionId: session.id,
            scenarioIndex: session.scenarioIndex
          }
        });

        // Broadcast count
        const connectedPlayers = session.players.filter(p => p.isConnected);
        io.to(roomCode).emit('game:vote_cast', {
          votes_cast: votes.length,
          total_players: connectedPlayers.length
        });

        // If all connected players voted, close voting automatically
        if (votes.length >= connectedPlayers.length) {
          await triggerMayorDecisionPhase(io, session.id, roomCode, session.scenarioIndex);
        }
      } catch (error) {
        console.error('Error submitting vote:', error);
      }
    });

    // --- FORCE CLOSE VOTING (FACILITATOR) ---
    socket.on('facilitator:force_close_voting', async ({ room_code, facilitator_token }) => {
      try {
        const roomCode = room_code.toUpperCase();
        const session = await prisma.session.findUnique({
          where: { roomCode }
        });

        if (!session) return;
        if (session.facilitatorToken !== facilitator_token) return;

        await triggerMayorDecisionPhase(io, session.id, roomCode, session.scenarioIndex);
      } catch (error) {
        console.error('Error force closing voting:', error);
      }
    });

    // --- MAYOR ACTION: ACCEPT DECISION ---
    socket.on('mayor:accept', async ({ room_code, player_id, choice }) => {
      try {
        const roomCode = room_code.toUpperCase();
        await handleMayorSubmission(io, roomCode, player_id, choice, false, null);
      } catch (error) {
        console.error('Error in mayor:accept:', error);
      }
    });

    // --- MAYOR ACTION: VETO DECISION ---
    socket.on('mayor:veto', async ({ room_code, player_id, choice, justification }) => {
      try {
        const roomCode = room_code.toUpperCase();
        await handleMayorSubmission(io, roomCode, player_id, choice, true, justification);
      } catch (error) {
        console.error('Error in mayor:veto:', error);
      }
    });

    // --- NEXT SCENARIO (FACILITATOR) ---
    socket.on('facilitator:next_scenario', async ({ room_code, facilitator_token }) => {
      try {
        const roomCode = room_code.toUpperCase();
        const session = await prisma.session.findUnique({
          where: { roomCode }
        });

        if (!session) return;
        if (session.facilitatorToken !== facilitator_token) return;
        if (session.scenarioIndex >= 2) return; // Only 3 scenarios (0, 1, 2)

        const nextIndex = session.scenarioIndex + 1;

        await prisma.session.update({
          where: { id: session.id },
          data: {
            scenarioIndex: nextIndex,
            phase: 'scenario_display'
          }
        });

        const clientSockets = await io.in(roomCode).fetchSockets();
        for (const clientSock of clientSockets) {
          const pLang = clientSock.data.lang || 'en';
          clientSock.emit('game:scenario_opened', {
            scenario_index: nextIndex,
            scenario: getLocalizedScenario(nextIndex, pLang)
          });
        }
      } catch (error) {
        console.error('Error progressing to next scenario:', error);
      }
    });

    // --- END GAME (FACILITATOR) ---
    socket.on('facilitator:end_game', async ({ room_code, facilitator_token }) => {
      try {
        const roomCode = room_code.toUpperCase();
        const session = await prisma.session.findUnique({
          where: { roomCode },
          include: { gameState: true, players: true }
        });

        if (!session || !session.gameState) return;
        if (session.facilitatorToken !== facilitator_token) return;

        const gs = session.gameState;
        const stateValues: GameStateValues = {
          economicGrowth: gs.economicGrowth,
          governmentBudget: gs.governmentBudget,
          peopleWelfare: gs.peopleWelfare,
          publicTrust: gs.publicTrust,
          environmentalQuality: gs.environmentalQuality,
          transparency: gs.transparency
        };

        const ps = calcPS(stateValues);
        const gqs = calcGQS(stateValues);
        const ss = calcSS(stateValues);
        const fps = calcFPS(stateValues);

        const archetypes = resolveArchetypes(stateValues);
        const beneficiaries = resolveBeneficiaries(stateValues, session.players);

        await prisma.$transaction([
          prisma.gameState.update({
            where: { sessionId: session.id },
            data: {
              ps,
              gqs,
              ss,
              fps,
              archetypes: archetypes.join(','),
              beneficiaries: beneficiaries.join(',')
            }
          }),
          prisma.session.update({
            where: { id: session.id },
            data: {
              status: 'completed',
              phase: 'final_reflection',
              endedAt: new Date()
            }
          })
        ]);

        io.to(roomCode).emit('game:final', {
          indicators: {
            economic_growth: stateValues.economicGrowth,
            government_budget: stateValues.governmentBudget,
            people_welfare: stateValues.peopleWelfare,
            public_trust: stateValues.publicTrust,
            environmental_quality: stateValues.environmentalQuality,
            transparency: stateValues.transparency
          },
          ps,
          gqs,
          ss,
          fps,
          archetypes,
          beneficiaries
        });
      } catch (error) {
        console.error('Error ending game:', error);
      }
    });

    // --- DISCONNECT ---
    socket.on('disconnect', async () => {
      try {
        const { playerId, roomCode, fullName, isFacilitator } = socket.data;
        if (isFacilitator) {
          console.log(`[Socket] Facilitator disconnected from room ${roomCode}`);
          return;
        }

        if (playerId && roomCode) {
          // Check if player still exists (they might be deleted if session was cancelled)
          const playerExists = await prisma.player.findUnique({
            where: { id: playerId }
          });

          if (playerExists) {
            // Update database
            await prisma.player.update({
              where: { id: playerId },
              data: { isConnected: false }
            });

            console.log(`[Socket] Player ${fullName} disconnected from room ${roomCode}`);

            // Broadcast disconnection
            io.to(roomCode).emit('room:player_disconnected', {
              player_id: playerId,
              full_name: fullName
            });
          }
        }
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  });
}

// --- HELPER FUNCTIONS ---

async function triggerVotingPhase(io: Server, sessionId: string, roomCode: string, scenarioIndex: number) {
  await prisma.session.update({
    where: { id: sessionId },
    data: { phase: 'voting' }
  });

  io.to(roomCode).emit('game:voting_opened', { scenario_index: scenarioIndex });
}

async function triggerMayorDecisionPhase(io: Server, sessionId: string, roomCode: string, scenarioIndex: number) {
  // Update phase in DB
  await prisma.session.update({
    where: { id: sessionId },
    data: { phase: 'mayor_decision' }
  });

  // Calculate vote summary
  const votes = await prisma.vote.findMany({
    where: { sessionId, scenarioIndex }
  });

  const summary = resolveVotes(votes.map(v => ({ choice: v.choice })));

  // Broadcast voting closed
  io.to(roomCode).emit('game:voting_closed', {});

  // Send private vote summary to Mayor and Facilitator
  const clientSockets = await io.in(roomCode).fetchSockets();
  
  // Find Mayor socket
  const mayorSocket = clientSockets.find(s => s.data.role === 'mayor');
  if (mayorSocket) {
    mayorSocket.emit('mayor:vote_summary', {
      A: summary.tally.A,
      B: summary.tally.B,
      C: summary.tally.C,
      total: votes.length,
      is_tie: summary.is_tie,
      tied_options: summary.tied_options
    });
  }

  // Find Facilitator socket
  const facilitatorSocket = clientSockets.find(s => s.data.isFacilitator === true);
  if (facilitatorSocket) {
    facilitatorSocket.emit('facilitator:vote_summary', {
      A: summary.tally.A,
      B: summary.tally.B,
      C: summary.tally.C,
      total: votes.length
    });
  }
}

async function handleMayorSubmission(
  io: Server,
  roomCode: string,
  playerId: string,
  choice: string,
  vetoUsed: boolean,
  justification: string | null
) {
  // Verify that the player is indeed the Mayor
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    include: { session: { include: { gameState: true } } }
  });

  if (!player || player.role !== 'mayor') {
    throw new Error('Player is not the Mayor or not found');
  }

  const session = player.session;
  if (!session.gameState) {
    throw new Error('Game state not initialized');
  }

  const currentScenario = SCENARIOS[session.scenarioIndex];
  const option = currentScenario.options[choice as 'A' | 'B' | 'C'];
  if (!option) {
    throw new Error('Invalid choice option');
  }

  const gs = session.gameState;
  const changes = option.indicators;

  // Compute updated indicators (clamped 0 - 100)
  const updatedIndicators = {
    economicGrowth: Math.min(100, Math.max(0, gs.economicGrowth + changes.economicGrowth)),
    governmentBudget: Math.min(100, Math.max(0, gs.governmentBudget + changes.governmentBudget)),
    peopleWelfare: Math.min(100, Math.max(0, gs.peopleWelfare + changes.peopleWelfare)),
    publicTrust: Math.min(100, Math.max(0, gs.publicTrust + changes.publicTrust)),
    environmentalQuality: Math.min(100, Math.max(0, gs.environmentalQuality + changes.environmentalQuality)),
    transparency: Math.min(100, Math.max(0, gs.transparency + changes.transparency))
  };

  // Prepare game state updates
  const updateData: any = {
    ...updatedIndicators
  };

  if (session.scenarioIndex === 0) {
    updateData.scenario0Choice = choice;
    updateData.scenario0Veto = vetoUsed;
    updateData.scenario0VetoReason = justification;
  } else if (session.scenarioIndex === 1) {
    updateData.scenario1Choice = choice;
    updateData.scenario1Veto = vetoUsed;
    updateData.scenario1VetoReason = justification;
  } else if (session.scenarioIndex === 2) {
    updateData.scenario2Choice = choice;
    updateData.scenario2Veto = vetoUsed;
    updateData.scenario2VetoReason = justification;
  }

  // Save to DB
  await prisma.$transaction([
    prisma.gameState.update({
      where: { sessionId: session.id },
      data: updateData
    }),
    prisma.session.update({
      where: { id: session.id },
      data: { phase: 'outcome_reveal' }
    })
  ]);

  // Broadcast results
  io.to(roomCode).emit('game:mayor_decided', {
    choice,
    veto_used: vetoUsed,
    justification
  });

  io.to(roomCode).emit('game:outcome_revealed', {
    choice,
    indicator_changes: {
      economic_growth: changes.economicGrowth,
      government_budget: changes.governmentBudget,
      people_welfare: changes.peopleWelfare,
      public_trust: changes.publicTrust,
      environmental_quality: changes.environmentalQuality,
      transparency: changes.transparency
    },
    new_indicators: {
      economic_growth: updatedIndicators.economicGrowth,
      government_budget: updatedIndicators.governmentBudget,
      people_welfare: updatedIndicators.peopleWelfare,
      public_trust: updatedIndicators.publicTrust,
      environmental_quality: updatedIndicators.environmentalQuality,
      transparency: updatedIndicators.transparency
    }
  });
}
