import { useState, useEffect } from 'react';
import { socket } from './socket.js';
import { useI18n } from './i18n.js';

// Sub-views
import { OnboardingView } from './components/OnboardingView.js';
import { LandingView } from './components/LandingView.js';
import { LanguageSelectView } from './components/LanguageSelectView.js';
import { CreateRoomView } from './components/CreateRoomView.js';
import { JoinRoomView } from './components/JoinRoomView.js';
import { LobbyView } from './components/LobbyView.js';
import type { LobbyPlayer } from './components/LobbyView.js';
import { RoleRevealView } from './components/RoleRevealView.js';
import type { RoleInfo } from './components/RoleRevealView.js';
import { ScenarioView } from './components/ScenarioView.js';
import { DiscussionView } from './components/DiscussionView.js';
import { VotingView } from './components/VotingView.js';
import { MayorDecisionView } from './components/MayorDecisionView.js';
import { OutcomeRevealView } from './components/OutcomeRevealView.js';
import { ReflectionView } from './components/ReflectionView.js';
import { Dashboard } from './components/Dashboard.js';
import type { Indicators } from './components/Dashboard.js';
import { AdminDashboardView } from './components/AdminDashboardView.js';

// Icons
import { SCENARIOS, ROLE_DESCRIPTIONS, ROLE_OBJECTIVES, SECRET_INFO, type PlayerRole, type Scenario } from './gameConstants.js';

type ScreenState = 
  | 'onboarding'
  | 'landing' 
  | 'language_select'
  | 'create_room' 
  | 'join_room' 
  | 'lobby' 
  | 'role_reveal' 
  | 'scenario_display' 
  | 'discussion' 
  | 'voting' 
  | 'mayor_decision' 
  | 'outcome_reveal' 
  | 'final_reflection'
  | 'admin';

function App() {
  const { lang, setLang } = useI18n();

  // Navigation / Connection States
  const [screen, setScreen] = useState<ScreenState>(() => {
    if (window.location.pathname === '/admin' || window.location.search.includes('admin')) {
      return 'admin';
    }
    return 'onboarding';
  });
  const [roomCode, setRoomCode] = useState('');
  const [facilitatorToken, setFacilitatorToken] = useState('');
  const [isFacilitator, setIsFacilitator] = useState(false);
  const [fullName, setFullName] = useState('');
  const [_country, setCountry] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [isCancelled, setIsCancelled] = useState(false);

  // Game Play States
  const [players, setPlayers] = useState<LobbyPlayer[]>([]);
  const [role, setRole] = useState<PlayerRole | null>(null);
  const [roleInfo, setRoleInfo] = useState<RoleInfo | null>(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  
  // Timer States
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  // Voting & Decisions
  const [votesCast, setVotesCast] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [voteSummary, setVoteSummary] = useState<any>(null);
  const [choice, setChoice] = useState('');
  const [vetoUsed, setVetoUsed] = useState(false);
  const [justification, setJustification] = useState<string | null>(null);

  // Dashboard Indicators
  const [indicators, setIndicators] = useState<Indicators>({
    economic_growth: 50,
    government_budget: 50,
    people_welfare: 50,
    public_trust: 50,
    environmental_quality: 50,
    transparency: 50
  });
  const [previousIndicators, setPreviousIndicators] = useState<Indicators | undefined>(undefined);
  const [indicatorChanges, setIndicatorChanges] = useState<Indicators>({
    economic_growth: 0,
    government_budget: 0,
    people_welfare: 0,
    public_trust: 0,
    environmental_quality: 0,
    transparency: 0
  });
  const [newIndicators, setNewIndicators] = useState<Indicators>({
    economic_growth: 50,
    government_budget: 50,
    people_welfare: 50,
    public_trust: 50,
    environmental_quality: 50,
    transparency: 50
  });

  // End Game Reflections
  const [ps, setPs] = useState(0);
  const [gqs, setGqs] = useState(0);
  const [ss, setSs] = useState(0);
  const [fps, setFps] = useState(0);
  const [archetypes, setArchetypes] = useState<string[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<string[]>([]);

  // Toggle mobile dashboard view overlay
  const [showMobileDashboard, setShowMobileDashboard] = useState(false);



  // Connect socket and register listeners
  const connectAndRegisterSocket = (code: string, name: string, isFacil: boolean, isReconnection: boolean = false) => {
    console.log(`[Socket] Connecting... (isFacil: ${isFacil}, isReconnection: ${isReconnection})`);
    
    if (socket.connected) {
      socket.disconnect();
    }
    
    socket.removeAllListeners();
    socket.connect();

    // Common handlers
    socket.on('error', (err: { code: string; message: string }) => {
      console.error('[Socket Error]', err);
      // alert(err.message);
      
      // ONLY clear storage and redirect if it's a definitive "NOT FOUND" or "UNAUTHORIZED"
      // Avoid clearing on network blips or temporary server restarts
      if (err.code === 'ROOM_NOT_FOUND' || err.code === 'PLAYER_NOT_FOUND' || err.code === 'UNAUTHORIZED') {
        alert(`Session Error: ${err.message}`);
        clearSessionStorage();
        setScreen('landing');
      }
    });

    socket.on('room:player_joined', ({ players: lobbyPlayers }) => {
      console.log('[Socket] Players update received (player_joined):', lobbyPlayers.length, 'players');
      setPlayers(lobbyPlayers);
      setTotalPlayers(lobbyPlayers.length);
      const me = name ? lobbyPlayers.find((p: any) => p.full_name.toLowerCase() === name.toLowerCase()) : null;
      if (me) {
        setPlayerId(me.id);
      }
    });

    socket.on('room:player_disconnected', ({ player_id }) => {
      setPlayers(prev => prev.map(p => p.id === player_id ? { ...p, is_connected: false } : p));
    });

    socket.on('room:player_reconnected', ({ player_id, full_name }) => {
      setPlayers(prev => prev.map(p => p.id === player_id ? { ...p, is_connected: true } : p));
      if (name && full_name.toLowerCase() === name.toLowerCase()) {
        setPlayerId(player_id);
      }
    });

    socket.on('room:cancelled', () => {
      console.log('[Socket] Room cancelled by facilitator');
      setIsCancelled(true);
    });

    socket.on('facilitator:room_created', (payload: any) => {
      console.log('[Socket] Facilitator state received:', payload);
      setRoomCode(payload.room_code);
      setFacilitatorToken(payload.facilitator_token);
      setIsFacilitator(true);
      
      if (payload.players) {
        console.log('[Socket] Restoring players count:', payload.players.length);
        setPlayers(payload.players);
        setTotalPlayers(payload.players.length);
      }
      
      // If phase is not lobby, it's a reconnection/refresh
      if (payload.phase && payload.phase !== 'lobby') {
        console.log('[Facilitator Reconnection] Restoring phase:', payload.phase);
        const currentLang = localStorage.getItem('tpa_lang') || 'en';
        
        setScreen(payload.phase as ScreenState);
        setScenarioIndex(payload.scenario_index);
        
        // Localize scenario data
        const targetIdx = payload.actual_scenario_index !== undefined ? payload.actual_scenario_index : payload.scenario_index;
        const rawScenario = SCENARIOS[targetIdx];
        if (rawScenario) {
          const localizedScenario: Scenario = {
            id: rawScenario.id,
            title: (rawScenario.title as any)[currentLang] || rawScenario.title.en,
            description: (rawScenario.description as any)[currentLang] || rawScenario.description.en,
            challengeSummary: (rawScenario.challengeSummary as any)[currentLang] || rawScenario.challengeSummary.en,
            stakeholderPositions: (rawScenario.stakeholderPositions as any)[currentLang] || rawScenario.stakeholderPositions.en,
            options: {
              A: { 
                ...rawScenario.options.A, 
                label: (rawScenario.options.A.label as any)[currentLang] || rawScenario.options.A.label.en,
                description: (rawScenario.options.A.description as any)[currentLang] || rawScenario.options.A.description.en,
                advantages: (rawScenario.options.A.advantages as any)[currentLang] || rawScenario.options.A.advantages.en,
                risks: (rawScenario.options.A.risks as any)[currentLang] || rawScenario.options.A.risks.en,
              },
              B: { 
                ...rawScenario.options.B, 
                label: (rawScenario.options.B.label as any)[currentLang] || rawScenario.options.B.label.en,
                description: (rawScenario.options.B.description as any)[currentLang] || rawScenario.options.B.description.en,
                advantages: (rawScenario.options.B.advantages as any)[currentLang] || rawScenario.options.B.advantages.en,
                risks: (rawScenario.options.B.risks as any)[currentLang] || rawScenario.options.B.risks.en,
              },
              C: { 
                ...rawScenario.options.C, 
                label: (rawScenario.options.C.label as any)[currentLang] || rawScenario.options.C.label.en,
                description: (rawScenario.options.C.description as any)[currentLang] || rawScenario.options.C.description.en,
                advantages: (rawScenario.options.C.advantages as any)[currentLang] || rawScenario.options.C.advantages.en,
                risks: (rawScenario.options.C.risks as any)[currentLang] || rawScenario.options.C.risks.en,
              },
            },
            reflection: (rawScenario.reflection as any)[currentLang] || rawScenario.reflection.en
          };
          setScenario(localizedScenario);
        }

        if (payload.indicators) {
          setIndicators(payload.indicators);
        }

        if (payload.votes_cast !== undefined) {
          setVotesCast(payload.votes_cast);
        }
        if (payload.total_players !== undefined) {
          setTotalPlayers(payload.total_players);
        }
        if (payload.vote_summary) {
          setVoteSummary(payload.vote_summary);
        }

        if (payload.phase === 'outcome_reveal') {
          setChoice(payload.choice || '');
          setVetoUsed(payload.veto_used || false);
          setJustification(payload.justification || null);
          setIndicatorChanges(payload.indicator_changes || {
            economic_growth: 0,
            government_budget: 0,
            people_welfare: 0,
            public_trust: 0,
            environmental_quality: 0,
            transparency: 0
          });
          setNewIndicators(payload.indicators);
        }
      } else {
        setScreen('lobby');
      }
    });

    socket.on('game:started', ({ phase }) => {
      setScreen(phase);
    });

    socket.on('player:role_assigned', (assignedRoleInfo) => {
      setRole(assignedRoleInfo.role);
      const currentLang = localStorage.getItem('tpa_lang') || 'en';
      const roleKey = assignedRoleInfo.role as PlayerRole;
      if (roleKey && ROLE_DESCRIPTIONS[currentLang] && ROLE_OBJECTIVES[currentLang] && SECRET_INFO[currentLang]) {
        setRoleInfo({
          role: roleKey,
          description: ROLE_DESCRIPTIONS[currentLang][roleKey] || assignedRoleInfo.description,
          objectives: ROLE_OBJECTIVES[currentLang]?.[roleKey] || assignedRoleInfo.objectives || assignedRoleInfo.objective,
          secretInfo: SECRET_INFO[currentLang]?.[roleKey] || assignedRoleInfo.secretInfo || assignedRoleInfo.secret_info,
        });
      } else {
        setRoleInfo(assignedRoleInfo);
      }
    });

    socket.on('game:scenario_opened', ({ scenario_index, actual_scenario_index, scenario: scenarioData }) => {
      setScenarioIndex(scenario_index);
      const currentLang = localStorage.getItem('tpa_lang') || 'en';
      const targetIdx = actual_scenario_index !== undefined ? actual_scenario_index : scenario_index;
      const rawScenario = SCENARIOS[targetIdx];
      if (rawScenario) {
        setScenario({
          id: rawScenario.id,
          title: (rawScenario.title as any)[currentLang] || rawScenario.title.en,
          description: (rawScenario.description as any)[currentLang] || rawScenario.description.en,
          challengeSummary: (rawScenario.challengeSummary as any)[currentLang] || rawScenario.challengeSummary.en,
          stakeholderPositions: (rawScenario.stakeholderPositions as any)[currentLang] || rawScenario.stakeholderPositions.en,
          options: {
            A: { 
              ...rawScenario.options.A, 
              label: (rawScenario.options.A.label as any)[currentLang] || rawScenario.options.A.label.en,
              description: (rawScenario.options.A.description as any)[currentLang] || rawScenario.options.A.description.en,
              advantages: (rawScenario.options.A.advantages as any)[currentLang] || rawScenario.options.A.advantages.en,
              risks: (rawScenario.options.A.risks as any)[currentLang] || rawScenario.options.A.risks.en,
            },
            B: { 
              ...rawScenario.options.B, 
              label: (rawScenario.options.B.label as any)[currentLang] || rawScenario.options.B.label.en,
              description: (rawScenario.options.B.description as any)[currentLang] || rawScenario.options.B.description.en,
              advantages: (rawScenario.options.B.advantages as any)[currentLang] || rawScenario.options.B.advantages.en,
              risks: (rawScenario.options.B.risks as any)[currentLang] || rawScenario.options.B.risks.en,
            },
            C: { 
              ...rawScenario.options.C, 
              label: (rawScenario.options.C.label as any)[currentLang] || rawScenario.options.C.label.en,
              description: (rawScenario.options.C.description as any)[currentLang] || rawScenario.options.C.description.en,
              advantages: (rawScenario.options.C.advantages as any)[currentLang] || rawScenario.options.C.advantages.en,
              risks: (rawScenario.options.C.risks as any)[currentLang] || rawScenario.options.C.risks.en,
            },
          },
          reflection: (rawScenario.reflection as any)[currentLang] || rawScenario.reflection.en,
        });
      } else {
        setScenario(scenarioData);
      }
      setScreen('scenario_display');
      setVoteSummary(null);
      setChoice('');
      setVetoUsed(false);
      setJustification(null);
    });

    socket.on('game:discussion_started', ({ duration_seconds }) => {
      setSecondsRemaining(duration_seconds);
      setTotalDuration(duration_seconds);
      setScreen('discussion');
    });

    socket.on('game:timer_update', ({ seconds_remaining }) => {
      setSecondsRemaining(seconds_remaining);
    });

    socket.on('game:voting_opened', () => {
      setScreen('voting');
      setVotesCast(0);
      setTotalPlayers(prev => (prev > 0 ? prev : players.length));
    });

    socket.on('game:vote_cast', ({ votes_cast, total_players: tot }) => {
      setVotesCast(votes_cast);
      setTotalPlayers(tot);
    });

    socket.on('game:voting_closed', () => {
      setScreen('mayor_decision');
    });

    socket.on('mayor:vote_summary', (summary) => {
      setVoteSummary(summary);
    });

    socket.on('facilitator:vote_summary', (summary) => {
      setVoteSummary(summary);
    });

    socket.on('game:mayor_decided', ({ choice: optChosen, veto_used, justification: reason }) => {
      setChoice(optChosen);
      setVetoUsed(veto_used);
      setJustification(reason);
    });

    socket.on('game:outcome_revealed', ({ choice: optChosen, indicator_changes, new_indicators }) => {
      // Store current as previous for difference animations
      setPreviousIndicators(indicators);
      setIndicators(new_indicators);
      setChoice(optChosen);
      setIndicatorChanges(indicator_changes);
      setNewIndicators(new_indicators);
      setScreen('outcome_reveal');
    });

    socket.on('game:final', ({ indicators: finalInds, ps: finalPs, gqs: finalGqs, ss: finalSs, fps: finalFps, archetypes: finalArchs, beneficiaries: finalBenes }) => {
      setIndicators(finalInds);
      setPs(finalPs);
      setGqs(finalGqs);
      setSs(finalSs);
      setFps(finalFps);
      setArchetypes(finalArchs);
      setBeneficiaries(finalBenes);
      setScreen('final_reflection');
    });

    // Reconnection listener
    socket.on('player:state_restored', (restorePayload) => {
      console.log('[Reconnection] State restored:', JSON.stringify(restorePayload, null, 2));
      const currentLang = localStorage.getItem('tpa_lang') || 'en';
      
      setScreen(restorePayload.phase);
      setScenarioIndex(restorePayload.scenario_index);
      
      // Localize scenario data from raw SCENARIOS array
      const targetIdx = restorePayload.actual_scenario_index !== undefined ? restorePayload.actual_scenario_index : restorePayload.scenario_index;
      const rawScenario = SCENARIOS[targetIdx];
      if (rawScenario) {
        const localizedScenario: Scenario = {
          id: rawScenario.id,
          title: (rawScenario.title as any)[currentLang] || rawScenario.title.en,
          description: (rawScenario.description as any)[currentLang] || rawScenario.description.en,
          challengeSummary: (rawScenario.challengeSummary as any)[currentLang] || rawScenario.challengeSummary.en,
          stakeholderPositions: (rawScenario.stakeholderPositions as any)[currentLang] || rawScenario.stakeholderPositions.en,
          options: {
            A: { 
              ...rawScenario.options.A, 
              label: (rawScenario.options.A.label as any)[currentLang] || rawScenario.options.A.label.en,
              description: (rawScenario.options.A.description as any)[currentLang] || rawScenario.options.A.description.en,
              advantages: (rawScenario.options.A.advantages as any)[currentLang] || rawScenario.options.A.advantages.en,
              risks: (rawScenario.options.A.risks as any)[currentLang] || rawScenario.options.A.risks.en,
            },
            B: { 
              ...rawScenario.options.B, 
              label: (rawScenario.options.B.label as any)[currentLang] || rawScenario.options.B.label.en,
              description: (rawScenario.options.B.description as any)[currentLang] || rawScenario.options.B.description.en,
              advantages: (rawScenario.options.B.advantages as any)[currentLang] || rawScenario.options.B.advantages.en,
              risks: (rawScenario.options.B.risks as any)[currentLang] || rawScenario.options.B.risks.en,
            },
            C: { 
              ...rawScenario.options.C, 
              label: (rawScenario.options.C.label as any)[currentLang] || rawScenario.options.C.label.en,
              description: (rawScenario.options.C.description as any)[currentLang] || rawScenario.options.C.description.en,
              advantages: (rawScenario.options.C.advantages as any)[currentLang] || rawScenario.options.C.advantages.en,
              risks: (rawScenario.options.C.risks as any)[currentLang] || rawScenario.options.C.risks.en,
            },
          },
          reflection: (rawScenario.reflection as any)[currentLang] || rawScenario.reflection.en
        };
        setScenario(localizedScenario);
      }
      
      if (restorePayload.players) {
        setPlayers(restorePayload.players);
        const me = name ? restorePayload.players.find((p: any) => p.full_name.toLowerCase() === name.toLowerCase()) : null;
        if (me) {
          setPlayerId(me.id);
        }
      }
      
      if (restorePayload.role) {
        setRole(restorePayload.role);
        setRoleInfo(restorePayload.role_info);
      }
      
      if (restorePayload.indicators) {
        setIndicators(restorePayload.indicators);
      }

      if (restorePayload.votes_cast !== undefined) {
        setVotesCast(restorePayload.votes_cast);
      }
      if (restorePayload.total_players !== undefined) {
        setTotalPlayers(restorePayload.total_players);
      }
      if (restorePayload.vote_summary) {
        setVoteSummary(restorePayload.vote_summary);
      }
      if (restorePayload.player_voted_choice) {
        setChoice(restorePayload.player_voted_choice);
      }

      if (restorePayload.phase === 'outcome_reveal') {
        setChoice(restorePayload.choice || '');
        setVetoUsed(restorePayload.veto_used || false);
        setJustification(restorePayload.justification || null);
        setIndicatorChanges(restorePayload.indicator_changes || {
          economic_growth: 0,
          government_budget: 0,
          people_welfare: 0,
          public_trust: 0,
          environmental_quality: 0,
          transparency: 0
        });
        setNewIndicators(restorePayload.indicators);
      }
    });

    // Fire actual join event
    if (isFacil) {
      const facilToken = localStorage.getItem('tpa_facilitator_token') || '';
      socket.emit('facilitator:join', { room_code: code, facilitator_token: facilToken, lang });
    } else {
      if (isReconnection) {
        socket.emit('player:reconnect', { room_code: code, full_name: name, lang });
      } else {
        socket.emit('player:join', { room_code: code, full_name: name, country: localStorage.getItem('tpa_player_country') || '', lang });
      }
    }
  };

  const handleFacilitatorSuccess = (code: string, token: string) => {
    console.log('[Facilitator] Successfully identified for room:', code);
    setRoomCode(code);
    setFacilitatorToken(token);
    setIsFacilitator(true);
    setIsCancelled(false);
    
    // Explicitly store room code for facilitator auto-reconnection
    sessionStorage.setItem('tpa_facilitator_room_code', code);
    sessionStorage.setItem('tpa_facilitator_token', token);
    localStorage.setItem('tpa_facilitator_room_code', code);
    localStorage.setItem('tpa_facilitator_token', token);

    // Keep current screen if we're already in a game state, otherwise go to lobby
    setScreen(prev => {
      const gameScreens: ScreenState[] = ['role_reveal', 'scenario_display', 'discussion', 'voting', 'mayor_decision', 'outcome_reveal', 'final_reflection'];
      return gameScreens.includes(prev) ? prev : 'lobby';
    });
    
    connectAndRegisterSocket(code, '', true);
  };

  const handlePlayerJoin = async (code: string, name: string, userCountry: string, isReconnection: boolean = false) => {
    try {
      setRoomCode(code);
      setFullName(name);
      setCountry(userCountry);
      setIsFacilitator(false);
      setIsCancelled(false);
      
      // If reconnecting, show a simple loading/lobby state until state is restored
      setScreen('lobby');

      // Cache details in sessionStorage (isolated per tab) & localStorage
      sessionStorage.setItem('tpa_player_room_code', code);
      sessionStorage.setItem('tpa_player_name', name);
      sessionStorage.setItem('tpa_player_country', userCountry);
      localStorage.setItem('tpa_player_room_code', code);
      localStorage.setItem('tpa_player_name', name);
      localStorage.setItem('tpa_player_country', userCountry);

      connectAndRegisterSocket(code, name, false, isReconnection);
    } catch (err) {
      console.error(err);
      setScreen('landing');
    }
  };

  // Auto-restore session state on mount / page refresh
  useEffect(() => {
    // Prioritize sessionStorage (tab-isolated) over shared localStorage
    const facilRoomCode = sessionStorage.getItem('tpa_facilitator_room_code') || localStorage.getItem('tpa_facilitator_room_code');
    const facilToken = sessionStorage.getItem('tpa_facilitator_token') || localStorage.getItem('tpa_facilitator_token');
    const playerRoomCode = sessionStorage.getItem('tpa_player_room_code') || localStorage.getItem('tpa_player_room_code');
    const playerName = sessionStorage.getItem('tpa_player_name') || localStorage.getItem('tpa_player_name');
    const playerCountry = sessionStorage.getItem('tpa_player_country') || localStorage.getItem('tpa_player_country') || '';

    if (facilRoomCode && facilToken && !playerRoomCode) {
      console.log('[Auto-Reconnect] Restoring facilitator session:', facilRoomCode);
      handleFacilitatorSuccess(facilRoomCode, facilToken);
    } else if (playerRoomCode && playerName) {
      console.log('[Auto-Reconnect] Restoring player session:', playerRoomCode, playerName);
      handlePlayerJoin(playerRoomCode, playerName, playerCountry, true);
    }
  }, []);

  const handleExit = () => {
    if (confirm('Are you sure you want to exit? Your session data will be preserved for reconnection.')) {
      socket.disconnect();
      setScreen('landing');
    }
  };

  const clearSessionStorage = () => {
    sessionStorage.removeItem('tpa_player_room_code');
    sessionStorage.removeItem('tpa_player_name');
    sessionStorage.removeItem('tpa_player_country');
    sessionStorage.removeItem('tpa_facilitator_token');
    sessionStorage.removeItem('tpa_facilitator_room_code');
    localStorage.removeItem('tpa_player_room_code');
    localStorage.removeItem('tpa_player_name');
    localStorage.removeItem('tpa_player_country');
    localStorage.removeItem('tpa_facilitator_token');
    localStorage.removeItem('tpa_facilitator_room_code');
    // Clear room keys
    const keys = Object.keys(localStorage);
    keys.forEach(k => {
      if (k.startsWith('tpa_room_code_')) {
        localStorage.removeItem(k);
      }
    });
  };

  const handleRestart = () => {
    if (confirm('Create a new room? This will clear current session results.')) {
      socket.disconnect();
      clearSessionStorage();
      setScreen('landing');
    }
  };

  const cancelSession = () => {
    const confirmMsg = isFacilitator 
      ? 'Cancel this session? This will close the room for all players.' 
      : 'Leave this waiting room?';
    if (confirm(confirmMsg)) {
      if (isFacilitator) {
        socket.emit('facilitator:cancel_session', { room_code: roomCode, facilitator_token: facilitatorToken });
      }
      socket.disconnect();
      clearSessionStorage();
      setIsCancelled(false);
      setScreen('landing');
    }
  };

  // Facilitator socket controls
  const startSession = () => socket.emit('facilitator:start_game', { room_code: roomCode || localStorage.getItem('tpa_facilitator_room_code'), facilitator_token: facilitatorToken || localStorage.getItem('tpa_facilitator_token') });
  const openScenario = () => socket.emit('facilitator:open_scenario', { room_code: roomCode || localStorage.getItem('tpa_facilitator_room_code'), facilitator_token: facilitatorToken || localStorage.getItem('tpa_facilitator_token') });
  const startDiscussion = (duration: number) => socket.emit('facilitator:start_discussion', { room_code: roomCode || localStorage.getItem('tpa_facilitator_room_code'), facilitator_token: facilitatorToken || localStorage.getItem('tpa_facilitator_token'), duration_seconds: duration });
  const endDiscussionEarly = () => socket.emit('facilitator:end_discussion', { room_code: roomCode || localStorage.getItem('tpa_facilitator_room_code'), facilitator_token: facilitatorToken || localStorage.getItem('tpa_facilitator_token') });
  const forceCloseVoting = () => socket.emit('facilitator:force_close_voting', { room_code: roomCode || localStorage.getItem('tpa_facilitator_room_code'), facilitator_token: facilitatorToken || localStorage.getItem('tpa_facilitator_token') });
  const forceCloseMayorDecision = (choiceVal?: string) => {
    const rCode = roomCode || localStorage.getItem('tpa_facilitator_room_code') || '';
    const fToken = facilitatorToken || localStorage.getItem('tpa_facilitator_token') || '';
    console.log('[Facilitator] Emitting force_close_mayor_decision for room:', rCode, 'choice:', choiceVal);
    socket.emit('facilitator:force_close_mayor_decision', { room_code: rCode, facilitator_token: fToken, choice: choiceVal });
  };
  const nextScenario = () => socket.emit('facilitator:next_scenario', { room_code: roomCode || localStorage.getItem('tpa_facilitator_room_code'), facilitator_token: facilitatorToken || localStorage.getItem('tpa_facilitator_token') });
  const endGame = () => socket.emit('facilitator:end_game', { room_code: roomCode || localStorage.getItem('tpa_facilitator_room_code'), facilitator_token: facilitatorToken || localStorage.getItem('tpa_facilitator_token') });

  // Player socket controls
  const submitVote = (choiceVal: string) => socket.emit('player:vote', { room_code: roomCode, player_id: playerId || fullName, choice: choiceVal });
  const mayorAccept = (choiceVal: string) => socket.emit('mayor:accept', { room_code: roomCode, player_id: playerId || fullName, choice: choiceVal });
  const mayorVeto = (choiceVal: string, justString: string) => socket.emit('mayor:veto', { room_code: roomCode, player_id: playerId || fullName, choice: choiceVal, justification: justString });

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans transition-colors duration-300">
      {/* Main layout routing */}
      <main className="flex-grow w-full flex justify-center items-center">
        <div key={screen} className="w-full min-h-screen flex flex-col animate-page-transition">
          {screen === 'scenario_display' && scenario && (
            <ScenarioView
              isFacilitator={isFacilitator}
              scenarioIndex={scenarioIndex}
              scenario={scenario}
              indicators={indicators}
              onStartDiscussion={startDiscussion}
              onCancelSession={cancelSession}
              roomCode={roomCode}
              playerRole={role || undefined}
            />
          )}
          {screen === 'final_reflection' && (
            <ReflectionView
              isFacilitator={isFacilitator}
              roomCode={roomCode}
              facilitatorToken={facilitatorToken}
              indicators={indicators}
              ps={ps}
              gqs={gqs}
              ss={ss}
              fps={fps}
              archetypes={archetypes}
              beneficiaries={beneficiaries}
              onRestartSession={handleRestart}
              onExit={handleExit}
            />
          )}
          {screen === 'outcome_reveal' && scenario && (
            <OutcomeRevealView
              isFacilitator={isFacilitator}
              scenario={scenario}
              scenarioIndex={scenarioIndex}
              choice={choice}
              vetoUsed={vetoUsed}
              justification={justification}
              indicatorChanges={indicatorChanges}
              newIndicators={newIndicators}
              onNextStep={scenarioIndex < 4 ? nextScenario : endGame}
              onCancelSession={cancelSession}
              indicators={indicators}
              roomCode={roomCode}
              playerRole={role || undefined}
            />
          )}
          {screen === 'mayor_decision' && scenario && (
            <MayorDecisionView
              isFacilitator={isFacilitator}
              isMayor={role === 'mayor'}
              scenario={scenario}
              voteSummary={voteSummary}
              onMayorAccept={mayorAccept}
              onMayorVeto={mayorVeto}
              onForceCloseMayorDecision={forceCloseMayorDecision}
              scenarioIndex={scenarioIndex}
              onCancelSession={cancelSession}
              indicators={indicators}
              roomCode={roomCode}
              playerRole={role || undefined}
            />
          )}
          {screen === 'discussion' && (
            <DiscussionView
              isFacilitator={isFacilitator}
              secondsRemaining={secondsRemaining}
              totalDuration={totalDuration}
              onEndDiscussionEarly={endDiscussionEarly}
              scenarioTitle={scenario?.title || 'New Industrial Zone'}
              scenarioIndex={scenarioIndex}
              scenario={scenario}
              onCancelSession={cancelSession}
              indicators={indicators}
              roomCode={roomCode}
              playerRole={role || undefined}
            />
          )}
          {screen === 'voting' && scenario && (
            <VotingView
              isFacilitator={isFacilitator}
              scenario={scenario}
              votesCast={votesCast}
              totalPlayers={totalPlayers}
              onVoteSubmitted={submitVote}
              onForceCloseVoting={forceCloseVoting}
              scenarioIndex={scenarioIndex}
              onCancelSession={cancelSession}
              onToggleStats={() => setShowMobileDashboard(!showMobileDashboard)}
              initialVotedChoice={choice}
              roomCode={roomCode}
              playerRole={role || undefined}
            />
          )}
          {screen === 'onboarding' && (
            <OnboardingView durationMs={2500} onComplete={() => setScreen('landing')} />
          )}
          {screen === 'landing' && (
            <LandingView
              onCreateRoom={() => setScreen('create_room')}
              onJoinRoom={() => setScreen('join_room')}
              lang={lang}
              onSelectLanguageClick={() => setScreen('language_select')}
            />
          )}
          {screen === 'admin' && (
            <AdminDashboardView onBackToApp={() => setScreen('landing')} />
          )}
          {screen === 'language_select' && (
            <LanguageSelectView
              onBack={() => setScreen('landing')}
              onSelectLanguage={(selectedLang) => {
                setLang(selectedLang);
                localStorage.setItem('tpa_lang', selectedLang);
              }}
              currentLang={lang}
            />
          )}
          {screen === 'create_room' && (
            <CreateRoomView
              onSuccess={handleFacilitatorSuccess}
              onBack={() => setScreen('landing')}
            />
          )}
          {screen === 'join_room' && (
            <JoinRoomView
              onSuccess={handlePlayerJoin}
              onBack={() => setScreen('landing')}
            />
          )}
          {screen === 'lobby' && (
            <LobbyView
              roomCode={roomCode}
              players={players}
              isFacilitator={isFacilitator}
              onStartGame={startSession}
              onCancelSession={cancelSession}
              isCancelled={isCancelled}
            />
          )}
          {screen === 'role_reveal' && (
            <RoleRevealView
              isFacilitator={isFacilitator}
              roleInfo={roleInfo || undefined}
              facilitatorPlayers={
                players.map(p => ({
                  id: p.id,
                  fullName: p.full_name,
                  role: p.role || '',
                  country: p.country
                }))
              }
              onOpenScenario={openScenario}
              scenarioIndex={scenarioIndex}
              onCancelSession={cancelSession}
              roomCode={roomCode}
            />
          )}
        </div>
      </main>

      {showMobileDashboard && (screen === 'scenario_display' || screen === 'voting' || screen === 'discussion') && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm animate-fade-in flex justify-end">
          <div className="w-80 h-full bg-white dark:bg-slate-900 p-6 shadow-2xl relative animate-slide-in flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                  City Indicators
                </span>
                <button
                  onClick={() => setShowMobileDashboard(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Close
                </button>
              </div>
              <Dashboard 
                indicators={indicators} 
                previousIndicators={previousIndicators}
              />
            </div>
            <button
              onClick={() => setShowMobileDashboard(false)}
              className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-250 py-3 rounded-2xl text-xs font-bold transition-all"
            >
              Back to Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
