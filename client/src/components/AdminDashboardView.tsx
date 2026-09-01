import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  Lock, 
  RefreshCw, 
  LogOut, 
  FileSpreadsheet, 
  Trash2, 
  Eye, 
  Search, 
  Users, 
  Award, 
  Activity, 
  ArrowLeft,
  AlertTriangle,
  LayoutDashboard,
  Gamepad2,
  Settings,
  ChevronRight,
  TrendingUp,
  Landmark,
  Heart,
  Globe2,
  TreePine,
  MoreVertical,
  Calendar,
  X
} from 'lucide-react';
import { formatRoleTitle } from '../gameConstants.js';

// Official Shadcn UI Kit Primitives
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

// Official Shadcn UI Chart Primitive (Interactive Bar Chart)
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

const timeframes = [
  { id: "3m", label: "Last 3 months", subtitle: "Total active players for the last 3 months", days: 90 },
  { id: "30d", label: "Last 30 days", subtitle: "Total active players for the last 30 days", days: 30 },
  { id: "7d", label: "Last 7 days", subtitle: "Total active players for the last 7 days", days: 7 },
] as const;

const chartConfig = {
  players: {
    label: "Total Players",
    color: "#2563eb",
  },
  sessions: {
    label: "Total Sessions",
    color: "#64748b",
  },
} satisfies ChartConfig;



const formatPhaseLabel = (phase: string) => {
  const phaseMap: Record<string, string> = {
    lobby: 'Player Lobby',
    role_reveal: 'Role Card',
    scenario_display: 'Policy Scenario',
    discussion: 'Public Discussion',
    voting: 'Voting Assembly',
    mayor_decision: 'Mayor Decision',
    outcome_reveal: 'Indicator Impacts',
    final_reflection: 'Final Reflection',
    score_export: 'Score Export',
  };
  return phaseMap[phase] || phase.replace('_', ' ');
};

interface AdminDashboardViewProps {
  onBackToApp: () => void;
}

interface SystemStats {
  total_sessions: number;
  active_sessions: number;
  completed_sessions: number;
  total_players: number;
  avg_fps: number;
}

interface SessionSummary {
  id: string;
  room_code: string;
  status: 'waiting' | 'active' | 'completed';
  phase: string;
  scenario_index: number;
  player_count: number;
  created_at: string;
  started_at?: string;
  ended_at?: string;
  fps: number | null;
  archetypes: string | null;
  choices: string[];
}

interface PlayerDetail {
  id: string;
  full_name: string;
  display_name: string;
  country: string;
  role: string | null;
  is_connected: boolean;
  joined_at: string;
  votes: Record<number, string>;
  is_beneficiary: boolean;
}

interface SessionDetail {
  id: string;
  room_code: string;
  status: string;
  phase: string;
  scenario_index: number;
  created_at: string;
  started_at?: string;
  ended_at?: string;
  game_state: any;
  players: PlayerDetail[];
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onBackToApp }) => {
  const [token, setToken] = useState<string | null>(sessionStorage.getItem('tpa_admin_token'));
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // satnaing/shadcn-admin Sidebar Navigation State ('overview' | 'sessions' | 'players' | 'reports' | 'settings')
  const [currentNav, setCurrentNav] = useState<'overview' | 'sessions' | 'players' | 'reports' | 'settings'>('overview');

  // Timeframe Filter State ('3m' | '30d' | '7d')
  const [timeframe, setTimeframe] = useState<'3m' | '30d' | '7d'>('3m');

  // Dashboard States
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const filteredChartData = useMemo(() => {
    // Map actual sessions player counts & session counts per date
    const sessionPlayersPerDate: Record<string, number> = {};
    const sessionCountPerDate: Record<string, number> = {};
    sessions.forEach((s) => {
      if (s.created_at) {
        const dStr = s.created_at.split('T')[0];
        sessionPlayersPerDate[dStr] = (sessionPlayersPerDate[dStr] || 0) + (s.player_count || 0);
        sessionCountPerDate[dStr] = (sessionCountPerDate[dStr] || 0) + 1;
      }
    });

    // End date is strictly TODAY (no future dates)
    const today = new Date();
    const activeOption = timeframes.find((t) => t.id === timeframe);
    const daysCount = activeOption ? activeOption.days : 90;

    const data = [];
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      data.push({
        date: dateStr,
        players: sessionPlayersPerDate[dateStr] || 0,
        sessions: sessionCountPerDate[dateStr] || 0,
      });
    }
    return data;
  }, [timeframe, sessions]);

  // Inspector Modal State
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'summary' | 'players'>('summary');

  const lang = localStorage.getItem('tpa_lang') || 'en';
  const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : '');

  // Automated background polling for real-time live sync
  useEffect(() => {
    if (!token) return;

    fetchDashboardData(false);

    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [token, statusFilter]);

  // Automated background polling for active inspector modal
  useEffect(() => {
    if (!token || !selectedSessionId) return;

    const modalInterval = setInterval(() => {
      fetchSessionDetail(selectedSessionId, true);
    }, 3000);

    return () => clearInterval(modalInterval);
  }, [token, selectedSessionId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (res.ok && data.token) {
        sessionStorage.setItem('tpa_admin_token', data.token);
        setToken(data.token);
        setPassword('');
      } else {
        setAuthError(data.error || 'Invalid admin password');
      }
    } catch (err) {
      setAuthError('Unable to connect to administration server.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('tpa_admin_token');
    setToken(null);
    setStats(null);
    setSessions([]);
  };

  const fetchDashboardData = async (isSilent = false) => {
    if (!token) return;
    if (!isSilent) setIsLoading(true);

    try {
      const headers = { 'x-admin-token': token };

      const [statsRes, sessionsRes] = await Promise.all([
        fetch(`${API_BASE}/api/v1/admin/stats`, { headers }),
        fetch(`${API_BASE}/api/v1/admin/sessions?status=${statusFilter}`, { headers })
      ]);

      if (statsRes.status === 401 || sessionsRes.status === 401) {
        handleLogout();
        return;
      }

      const statsData = await statsRes.json();
      const sessionsData = await sessionsRes.json();

      setStats(statsData);
      setSessions(sessionsData.sessions || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  };

  const fetchSessionDetail = async (id: string, isSilent = false) => {
    if (!token) return;
    setSelectedSessionId(id);
    if (!isSilent) {
      setIsLoadingDetail(true);
      setSessionDetail(null);
    }

    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/sessions/${id}`, {
        headers: { 'x-admin-token': token }
      });
      const data = await res.json();
      if (res.ok) {
        setSessionDetail(data.session);
      }
    } catch (err) {
      console.error('Failed to fetch session detail:', err);
    } finally {
      if (!isSilent) setIsLoadingDetail(false);
    }
  };

  const handleDeleteSession = async (id: string, roomCode: string) => {
    if (!token) return;
    if (!window.confirm(`Delete session ${roomCode}? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/sessions/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token }
      });

      if (res.ok) {
        fetchDashboardData();
        if (selectedSessionId === id) setSelectedSessionId(null);
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  const handleResetAllData = async () => {
    if (!token) return;
    if (!window.confirm('CRITICAL ACTION: Reset all database sessions and player records?')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/reset`, {
        method: 'POST',
        headers: { 'x-admin-token': token }
      });

      if (res.ok) {
        alert('All session and player records cleared.');
        fetchDashboardData();
        setSelectedSessionId(null);
      }
    } catch (err) {
      console.error('Failed to reset database:', err);
    }
  };

  const handleExportExcel = async (roomCode: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/sessions/${roomCode}/export?token=${token}`, {
        headers: { 'x-admin-token': token }
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Failed to download report');
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TPA_Admin_Export_${roomCode.toUpperCase()}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export Excel:', err);
      alert('Failed to download Excel report');
    }
  };

  const filteredSessions = sessions.filter(s => {
    const matchesSearch = s.room_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDate || (s.created_at && s.created_at.startsWith(selectedDate));
    return matchesSearch && matchesDate;
  });

  // --- AUTHENTICATION CARD ---
  if (!token) {
    return (
      <TooltipProvider>
        <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col justify-center items-center px-4 font-outfit antialiased">
          <Card className="w-full max-w-sm shadow-xl">
            <CardHeader className="flex flex-col items-center space-y-2 text-center pb-2">
              <Avatar className="h-10 w-10 border border-slate-200 bg-slate-900 shadow-xs mb-1">
                <AvatarFallback className="bg-slate-900 text-slate-50">
                  <Shield className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl font-bold">TPA Admin Console</CardTitle>
              <CardDescription>The People's Assembly — Facilitator Console</CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Admin Password</label>
                  <div className="relative">
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="pl-9"
                    />
                    <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {authError && (
                  <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <Button type="submit" disabled={isLoggingIn} className="w-full">
                  {isLoggingIn ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Log In to Console'}
                </Button>
              </form>

              <Separator className="my-6" />

              <div className="text-center">
                <button
                  type="button"
                  onClick={onBackToApp}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Main Application
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    );
  }

  // --- satnaing/shadcn-admin DASHBOARD LAYOUT (Sidebar + Top Navbar + Main Canvas) ---
  return (
    <TooltipProvider>
      <div className="min-h-screen w-full bg-slate-50 text-slate-900 font-outfit antialiased flex selection:bg-slate-200">
        
        {/* --- LEFT SIDEBAR (Shadcn UI Sidebar Pattern) --- */}
        <aside className="w-60 border-r border-slate-200 bg-[#f9fafb] flex flex-col justify-between shrink-0 hidden md:flex sticky top-0 h-screen z-40">
          <div>
            {/* Sidebar Brand Header */}
            <div className="h-14 px-5 border-b border-slate-200 flex items-center shrink-0">
              <span className="text-sm font-bold text-slate-900 tracking-tight">The People's Assembly</span>
            </div>

            {/* Sidebar Nav Links */}
            <nav className="py-2 space-y-4">
              
              {/* Home Group */}
              <div>
                <p className="px-5 py-1.5 text-xs font-semibold text-slate-500">Home</p>
                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => setCurrentNav('overview')}
                    className={`w-full flex items-center gap-3 px-5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                      currentNav === 'overview' 
                        ? 'bg-slate-200/70 text-slate-900 font-semibold' 
                        : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4 text-slate-800 shrink-0" />
                    <span>Dashboard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentNav('sessions')}
                    className={`w-full flex items-center justify-between px-5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                      currentNav === 'sessions' 
                        ? 'bg-slate-200/70 text-slate-900 font-semibold' 
                        : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Gamepad2 className="h-4 w-4 text-slate-800 shrink-0" />
                      <span>Sessions</span>
                    </div>
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px] bg-slate-200 text-slate-700 font-medium">{stats?.total_sessions ?? 0}</Badge>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentNav('players')}
                    className={`w-full flex items-center justify-between px-5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                      currentNav === 'players' 
                        ? 'bg-slate-200/70 text-slate-900 font-semibold' 
                        : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-slate-800 shrink-0" />
                      <span>Team & Players</span>
                    </div>
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px] bg-slate-200 text-slate-700 font-medium">{stats?.total_players ?? 0}</Badge>
                  </button>
                </div>
              </div>

              {/* Management Group */}
              <div>
                <p className="px-5 py-1.5 text-xs font-semibold text-slate-500">Management</p>
                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => setCurrentNav('reports')}
                    className={`w-full flex items-center gap-3 px-5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                      currentNav === 'reports' 
                        ? 'bg-slate-200/70 text-slate-900 font-semibold' 
                        : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                    }`}
                  >
                    <FileSpreadsheet className="h-4 w-4 text-slate-800 shrink-0" />
                    <span>Reports & Excel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentNav('settings')}
                    className={`w-full flex items-center gap-3 px-5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                      currentNav === 'settings' 
                        ? 'bg-slate-200/70 text-slate-900 font-semibold' 
                        : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                    }`}
                  >
                    <Settings className="h-4 w-4 text-slate-800 shrink-0" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>

            </nav>
          </div>

          {/* Sidebar Footer User Info */}
          <div className="p-3 border-t border-slate-200/60">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100/60 border border-slate-200/60">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7 border border-slate-200 bg-white">
                  <AvatarFallback className="text-[10px] font-bold text-slate-800">AD</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-slate-900 leading-none">Facilitator Admin</p>
                  <p className="text-[9px] text-slate-500">admin@tpa.org</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleLogout}
                className="text-slate-400 hover:text-slate-900 p-1 cursor-pointer"
                title="Log Out Admin"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* --- MAIN RIGHT CONTENT CANVAS --- */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Navbar */}
          <header className="sticky top-0 z-30 w-full h-14 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-400">Admin Console</span>
              <span>/</span>
              <span className="font-semibold text-slate-900 capitalize">{currentNav === 'overview' ? 'Overview' : currentNav === 'sessions' ? 'Game Sessions' : currentNav === 'players' ? 'Player Roster' : currentNav === 'reports' ? 'Reports & Excel' : 'Settings'}</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 ml-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Auto-Sync
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => fetchDashboardData(false)} disabled={isLoading}>
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>

              <Button variant="outline" size="sm" onClick={onBackToApp}>
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                Game App
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-7 w-7 border border-slate-200">
                      <AvatarFallback className="text-xs font-bold text-slate-700 bg-slate-100">AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Administrator Controls</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCurrentNav('overview')}>
                    <LayoutDashboard className="h-3.5 w-3.5 mr-2" /> Main Overview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentNav('settings')}>
                    <Settings className="h-3.5 w-3.5 mr-2" /> DB Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-3.5 w-3.5 mr-2" /> Log Out Admin
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Workspace Body */}
          <main className="p-6 space-y-6 flex-grow max-w-7xl w-full mx-auto">
            
            {/* VIEW 1: OVERVIEW */}
            {currentNav === 'overview' && (
              <div className="space-y-6">
                
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Card 1: Total Sessions */}
                  <Card>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-500">Total Assembly Sessions</span>
                      </div>

                      <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                        {stats?.total_sessions ?? 0}
                      </div>

                      <div className="space-y-0.5 pt-1">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                          Created Rooms <TrendingUp className="h-3.5 w-3.5 text-slate-900" />
                        </div>
                        <p className="text-sm text-slate-400">Total accumulated simulation rooms created</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 2: Active Rooms */}
                  <Card>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-500">Active Live Sessions</span>
                      </div>

                      <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                        {stats?.active_sessions ?? 0}
                      </div>

                      <div className="space-y-0.5 pt-1">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                          Discussion / Voting <Activity className="h-3.5 w-3.5 text-emerald-600" />
                        </div>
                        <p className="text-sm text-slate-400">Rooms currently running live</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 3: Total Players */}
                  <Card>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-500">Total Registered Players</span>
                      </div>

                      <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                        {stats?.total_players ?? 0}
                      </div>

                      <div className="space-y-0.5 pt-1">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                          Assembly Participation <TrendingUp className="h-3.5 w-3.5 text-slate-900" />
                        </div>
                        <p className="text-sm text-slate-400">Total participants across all simulation rooms</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 4: Avg Prosperity (FPS) */}
                  <Card>
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-500">Average Prosperity (FPS)</span>
                      </div>

                      <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                        {stats?.avg_fps ?? 0}
                      </div>

                      <div className="space-y-0.5 pt-1">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                          Final Prosperity Score <TrendingUp className="h-3.5 w-3.5 text-amber-600" />
                        </div>
                        <p className="text-sm text-slate-400">Average performance score of completed cities</p>
                      </div>
                    </CardContent>
                  </Card>

                </div>

                {/* --- Total Active Players Interactive Chart --- */}
                <Card className="py-0 overflow-hidden">
                  <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-slate-200 gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-bold text-slate-900 tracking-tight">Total Active Players</CardTitle>
                      <CardDescription className="text-sm text-slate-500 font-medium">
                        {timeframes.find((t) => t.id === timeframe)?.subtitle}
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 self-start sm:self-auto">
                      {timeframes.map((tf) => (
                        <button
                          key={tf.id}
                          type="button"
                          onClick={() => setTimeframe(tf.id)}
                          className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                            timeframe === tf.id
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                          }`}
                        >
                          {tf.label}
                        </button>
                      ))}
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <ChartContainer
                      config={chartConfig}
                      className="aspect-auto h-[250px] w-full"
                    >
                      <BarChart
                        accessibilityLayer
                        data={filteredChartData}
                        margin={{
                          left: 12,
                          right: 12,
                        }}
                      >
                        <CartesianGrid vertical={false} stroke="#f1f5f9" />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          minTickGap={timeframe === '7d' ? 8 : 32}
                          tickFormatter={(value: any) => {
                            const date = new Date(value);
                            return date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            });
                          }}
                        />
                        <ChartTooltip
                          content={({ active, payload }: any) => {
                            if (!active || !payload || !payload.length) return null;
                            const data = payload[0].payload;
                            const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            });

                            return (
                              <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-md text-xs space-y-1.5 min-w-[160px]">
                                <p className="font-semibold text-slate-900">{formattedDate}</p>
                                <div className="space-y-1 text-slate-600">
                                  <div className="flex items-center justify-between gap-4">
                                    <span className="flex items-center gap-1.5">
                                      <span className="h-2 w-2 rounded-full bg-[#2563eb]" />
                                      Total Players
                                    </span>
                                    <span className="font-mono font-bold text-slate-900">{data.players}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-4">
                                    <span className="flex items-center gap-1.5">
                                      <span className="h-2 w-2 rounded-full bg-slate-400" />
                                      Total Sessions
                                    </span>
                                    <span className="font-mono font-bold text-slate-900">{data.sessions}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          }}
                        />
                        <Bar dataKey="players" fill="#2563eb" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Quick Sessions Preview */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-sm font-semibold">Recent Assembly Sessions</CardTitle>
                      <CardDescription>Active and recently completed simulation rooms</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setCurrentNav('sessions')}>
                      View All Sessions <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Room Code</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Phase</TableHead>
                          <TableHead>Players</TableHead>
                          <TableHead>Final FPS</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sessions.slice(0, 5).map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-mono font-bold text-slate-900">{s.room_code}</TableCell>
                            <TableCell>
                              {s.status === 'active' ? (
                                <Badge variant="success">Active</Badge>
                              ) : s.status === 'completed' ? (
                                <Badge variant="info">Completed</Badge>
                              ) : (
                                <Badge variant="secondary">Waiting</Badge>
                              )}
                            </TableCell>
                            <TableCell className="capitalize text-slate-600 font-medium">{formatPhaseLabel(s.phase)}</TableCell>
                            <TableCell className="font-medium">{s.player_count}</TableCell>
                            <TableCell className="font-mono font-bold text-amber-700">{s.fps !== null ? s.fps.toFixed(1) : '—'}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" onClick={() => fetchSessionDetail(s.id)}>
                                <Eye className="h-3 w-3 mr-1" /> Inspect
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

              </div>
            )}

            {/* VIEW 2: SESSIONS TABLE */}
            {currentNav === 'sessions' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                    <TabsList>
                      <TabsTrigger value="all">All Sessions</TabsTrigger>
                      <TabsTrigger value="active">Active Sessions</TabsTrigger>
                      <TabsTrigger value="completed">Completed Sessions</TabsTrigger>
                      <TabsTrigger value="waiting">Waiting Lobby</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* Date Picker Filter */}
                    <div className="relative w-full sm:w-44">
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="pl-8 text-xs font-mono"
                      />
                      <Calendar className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      {selectedDate && (
                        <button
                          type="button"
                          onClick={() => setSelectedDate('')}
                          className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-700"
                          title="Clear date filter"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Room Code Search */}
                    <div className="relative w-full sm:w-52">
                      <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Room Code..."
                        className="pl-8"
                      />
                      <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Room Code</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Simulation Phase</TableHead>
                      <TableHead>Players</TableHead>
                      <TableHead>FPS Score</TableHead>
                      <TableHead>City Archetype</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center text-slate-400">
                          <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-1 text-slate-500" />
                          Loading session data...
                        </TableCell>
                      </TableRow>
                    ) : filteredSessions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center text-slate-400">
                          No simulation sessions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSessions.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-mono font-bold text-slate-900">{s.room_code}</TableCell>
                          <TableCell>
                            {s.status === 'active' ? (
                              <Badge variant="success">Active</Badge>
                            ) : s.status === 'completed' ? (
                              <Badge variant="info">Completed</Badge>
                            ) : (
                              <Badge variant="secondary">Waiting</Badge>
                            )}
                          </TableCell>
                          <TableCell className="capitalize text-slate-600 font-medium">{formatPhaseLabel(s.phase)}</TableCell>
                          <TableCell className="font-medium text-slate-900">{s.player_count}</TableCell>
                          <TableCell className="font-semibold text-amber-700 font-mono">{s.fps !== null ? s.fps.toFixed(1) : '—'}</TableCell>
                          <TableCell className="text-slate-600 max-w-xs truncate">{s.archetypes || '—'}</TableCell>
                          <TableCell className="text-slate-400 font-mono text-[11px]">{new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                          <TableCell className="text-right shrink-0">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="outline" size="sm" onClick={() => fetchSessionDetail(s.id)}>
                                <Eye className="h-3 w-3 mr-1" /> Inspect
                              </Button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Session Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => fetchSessionDetail(s.id)}>
                                    <Eye className="h-3.5 w-3.5 mr-2" /> View Session Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleExportExcel(s.room_code)}>
                                    <FileSpreadsheet className="h-3.5 w-3.5 mr-2 text-emerald-600" /> Export Excel Report
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleDeleteSession(s.id, s.room_code)} className="text-red-600">
                                    <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete Session
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* VIEW 3: PLAYERS ROSTER */}
            {currentNav === 'players' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Assembly Player Roster</CardTitle>
                  <CardDescription>Select a session from the Game Sessions tab to inspect player voting choices for Scenarios 1–5.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-8 text-center text-slate-500 space-y-3">
                    <Users className="h-8 w-8 mx-auto text-slate-400" />
                    <p className="text-xs">Click the <strong>"Inspect"</strong> button on any session in the Game Sessions tab to view voting records and role objective achievements.</p>
                    <Button variant="outline" size="sm" onClick={() => setCurrentNav('sessions')}>
                      Open Game Sessions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* VIEW 3.5: REPORTS & EXCEL EXPORTS */}
            {currentNav === 'reports' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                    <TabsList>
                      <TabsTrigger value="all">All Categories</TabsTrigger>
                      <TabsTrigger value="completed">Completed Sessions (.xlsx)</TabsTrigger>
                      <TabsTrigger value="active">Active Live Sessions</TabsTrigger>
                      <TabsTrigger value="waiting">Waiting Lobby</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* Date Picker Filter */}
                    <div className="relative w-full sm:w-44">
                      <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="pl-8 text-xs font-mono"
                      />
                      <Calendar className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      {selectedDate && (
                        <button
                          type="button"
                          onClick={() => setSelectedDate('')}
                          className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-700"
                          title="Clear date filter"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Room Code Search */}
                    <div className="relative w-full sm:w-52">
                      <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Room Code..."
                        className="pl-8"
                      />
                      <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                      Reports & Excel Exports
                    </CardTitle>
                    <CardDescription>Download detailed .xlsx session reports for data analysis and facilitator auditing.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Room Code</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Players</TableHead>
                          <TableHead>FPS Score</TableHead>
                          <TableHead>Archetypes</TableHead>
                          <TableHead className="text-right">Excel Download</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-slate-400">
                              <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-1 text-slate-500" />
                              Loading reports data...
                            </TableCell>
                          </TableRow>
                        ) : filteredSessions.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-slate-400">
                              No session reports found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredSessions.map((s) => (
                            <TableRow key={s.id}>
                              <TableCell className="font-mono font-bold text-slate-900">{s.room_code}</TableCell>
                              <TableCell>
                                {s.status === 'active' ? (
                                  <Badge variant="success">Active</Badge>
                                ) : s.status === 'completed' ? (
                                  <Badge variant="info">Completed</Badge>
                                ) : (
                                  <Badge variant="secondary">Waiting</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-slate-500 font-mono text-xs">
                                {new Date(s.created_at).toLocaleDateString()} {new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </TableCell>
                              <TableCell className="font-medium text-slate-900">{s.player_count}</TableCell>
                              <TableCell className="font-semibold text-amber-700 font-mono">{s.fps !== null ? s.fps.toFixed(1) : '—'}</TableCell>
                              <TableCell className="text-slate-600 max-w-xs truncate">{s.archetypes || '—'}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm" onClick={() => handleExportExcel(s.room_code)} className="border-emerald-200 hover:bg-emerald-50 text-emerald-700">
                                  <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
                                  Download .XLSX
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* VIEW 4: SETTINGS & RESET */}
            {currentNav === 'settings' && (
              <div className="space-y-4 max-w-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold text-red-600">Database Maintenance</CardTitle>
                    <CardDescription>Purge all game session data, player vote records, and statistical history.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg text-xs text-red-700 flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold block mb-1">Permanent Data Purge</strong>
                        The reset action will permanently delete all session rooms, player registrations, and voting records from the database.
                      </div>
                    </div>

                    <Button variant="destructive" onClick={handleResetAllData}>
                      <Trash2 className="h-4 w-4 mr-2" /> Reset All Database Data
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

          </main>
        </div>

        {/* --- SHADCN DIALOG INSPECTOR --- */}
        <Dialog open={Boolean(selectedSessionId)} onOpenChange={(open) => !open && setSelectedSessionId(null)}>
          <DialogContent>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle>Assembly Session Inspector</DialogTitle>
                <Badge variant="outline" className="font-mono text-xs">{sessionDetail?.room_code || 'Loading'}</Badge>
              </div>
              <DialogDescription>
                Status: <span className="capitalize font-medium text-slate-800">{sessionDetail?.status === 'active' ? 'Active' : sessionDetail?.status === 'completed' ? 'Completed' : 'Waiting'}</span> ({sessionDetail ? formatPhaseLabel(sessionDetail.phase) : ''})
              </DialogDescription>
            </DialogHeader>

            <Tabs value={activeModalTab} onValueChange={(val) => setActiveModalTab(val as 'summary' | 'players')} className="my-2">
              <TabsList>
                <TabsTrigger value="summary">Summary & Veto Log</TabsTrigger>
                <TabsTrigger value="players">Player Voting Records ({sessionDetail?.players.length ?? 0})</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex-grow overflow-y-auto space-y-4 pr-1">
              {isLoadingDetail || !sessionDetail ? (
                <div className="py-12 text-center text-slate-400">
                  <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-slate-500" />
                  Fetching detailed session data...
                </div>
              ) : activeModalTab === 'summary' ? (
                <div className="space-y-4">
                  {/* Scores Cards */}
                  {sessionDetail.game_state ? (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <Card>
                          <CardContent className="p-3">
                            <p className="text-[11px] font-medium text-slate-500">FPS Score</p>
                            <p className="text-xl font-bold font-mono text-amber-600">
                              {sessionDetail.game_state.fps !== null ? sessionDetail.game_state.fps.toFixed(1) : '—'}
                            </p>
                            <Progress value={sessionDetail.game_state.fps || 0} className="h-1.5 mt-2" />
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-3">
                            <p className="text-[11px] font-medium text-slate-500">Prosperity (PS)</p>
                            <p className="text-xl font-bold font-mono text-emerald-600">
                              {sessionDetail.game_state.ps !== null ? sessionDetail.game_state.ps.toFixed(1) : '—'}
                            </p>
                            <Progress value={sessionDetail.game_state.ps || 0} className="h-1.5 mt-2" />
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-3">
                            <p className="text-[11px] font-medium text-slate-500">Governance (GQS)</p>
                            <p className="text-xl font-bold font-mono text-blue-600">
                              {sessionDetail.game_state.gqs !== null ? sessionDetail.game_state.gqs.toFixed(1) : '—'}
                            </p>
                            <Progress value={sessionDetail.game_state.gqs || 0} className="h-1.5 mt-2" />
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-3">
                            <p className="text-[11px] font-medium text-slate-500">Sustainability (SS)</p>
                            <p className="text-xl font-bold font-mono text-purple-600">
                              {sessionDetail.game_state.ss !== null ? sessionDetail.game_state.ss.toFixed(1) : '—'}
                            </p>
                            <Progress value={sessionDetail.game_state.ss || 0} className="h-1.5 mt-2" />
                          </CardContent>
                        </Card>
                      </div>

                      {/* City Indicators */}
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-xs font-semibold text-slate-900">6 City Policy Indicators Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                            <div className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
                              <span className="text-slate-500 flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5 text-blue-600" /> Economy:</span>
                              <span className="font-mono font-semibold text-slate-900">{sessionDetail.game_state.economicGrowth}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
                              <span className="text-slate-500 flex items-center gap-1.5"><Landmark className="h-3.5 w-3.5 text-amber-600" /> Govt Budget:</span>
                              <span className="font-mono font-semibold text-slate-900">{sessionDetail.game_state.governmentBudget}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
                              <span className="text-slate-500 flex items-center gap-1.5"><Heart className="h-3.5 w-3.5 text-rose-600" /> Welfare:</span>
                              <span className="font-mono font-semibold text-slate-900">{sessionDetail.game_state.peopleWelfare}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
                              <span className="text-slate-500 flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5 text-cyan-600" /> Public Trust:</span>
                              <span className="font-mono font-semibold text-slate-900">{sessionDetail.game_state.publicTrust}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
                              <span className="text-slate-500 flex items-center gap-1.5"><TreePine className="h-3.5 w-3.5 text-emerald-600" /> Environment:</span>
                              <span className="font-mono font-semibold text-slate-900">{sessionDetail.game_state.environmentalQuality}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
                              <span className="text-slate-500 flex items-center gap-1.5"><Eye className="h-3.5 w-3.5 text-purple-600" /> Transparency:</span>
                              <span className="font-mono font-semibold text-slate-900">{sessionDetail.game_state.transparency}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Scenario Veto Log */}
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-xs font-semibold text-slate-900">Scenario Choices & Mayor Veto Log (1–5)</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="space-y-2 text-xs">
                            {[0, 1, 2, 3, 4].map(idx => {
                              const choice = sessionDetail.game_state[`scenario${idx}Choice`];
                              const veto = sessionDetail.game_state[`scenario${idx}Veto`];
                              const reason = sessionDetail.game_state[`scenario${idx}VetoReason`];
                              return (
                                <div key={idx} className="p-3 rounded-md bg-slate-50 border border-slate-150 flex flex-col gap-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-slate-700">Scenario {idx + 1}</span>
                                    <span className="text-slate-500">Choice Option: <Badge variant="outline" className="font-mono font-bold">{choice || '—'}</Badge></span>
                                  </div>
                                  {veto && (
                                    <div className="mt-1 text-red-600 font-medium bg-red-50 p-2 rounded border border-red-200 text-[11px]">
                                      ⚠️ <strong>Mayor Veto Exercised:</strong> {reason || 'No written justification provided.'}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <div className="text-center py-6 text-slate-400">
                      No indicator statistics recorded yet.
                    </div>
                  )}
                </div>
              ) : (
                /* Player breakdown tab */
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Player</TableHead>
                      <TableHead>Secret Role</TableHead>
                      <TableHead className="text-center">S1</TableHead>
                      <TableHead className="text-center">S2</TableHead>
                      <TableHead className="text-center">S3</TableHead>
                      <TableHead className="text-center">S4</TableHead>
                      <TableHead className="text-center">S5</TableHead>
                      <TableHead className="text-center">Role Objective</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessionDetail.players.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium text-slate-900">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 border border-slate-200">
                              <AvatarFallback className="text-[10px] bg-slate-100 text-slate-700 font-bold">
                                {p.full_name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span>{p.full_name}</span>
                              <span className="block text-[10px] text-slate-400 font-normal">{p.country}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-amber-700">
                          {p.role ? formatRoleTitle(p.role, lang) : '—'}
                        </TableCell>
                        <TableCell className="text-center font-mono font-semibold text-slate-900">
                          {p.votes[0] || '—'}
                        </TableCell>
                        <TableCell className="text-center font-mono font-semibold text-slate-900">
                          {p.votes[1] || '—'}
                        </TableCell>
                        <TableCell className="text-center font-mono font-semibold text-slate-900">
                          {p.votes[2] || '—'}
                        </TableCell>
                        <TableCell className="text-center font-mono font-semibold text-slate-900">
                          {p.votes[3] || '—'}
                        </TableCell>
                        <TableCell className="text-center font-mono font-semibold text-slate-900">
                          {p.votes[4] || '—'}
                        </TableCell>
                        <TableCell className="text-center">
                          {p.is_beneficiary ? (
                            <Badge variant="success">Achieved</Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            <Separator className="my-3" />

            <div className="flex items-center justify-between shrink-0">
              <Button variant="outline" size="sm" onClick={() => sessionDetail && handleExportExcel(sessionDetail.room_code)}>
                <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5 text-emerald-600" /> Export Excel Report
              </Button>

              <Button variant="outline" size="sm" onClick={() => setSelectedSessionId(null)}>
                Close
              </Button>
            </div>

          </DialogContent>
        </Dialog>

      </div>
    </TooltipProvider>
  );
};
