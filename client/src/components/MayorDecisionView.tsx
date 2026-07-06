import React, { useState } from 'react';
import { Gavel, LogOut, Activity } from 'lucide-react';
import type { Scenario } from '../gameConstants.js';
import { Dashboard } from './Dashboard.js';
import type { Indicators } from './Dashboard.js';

interface VoteSummary {
  A: number;
  B: number;
  C: number;
  total: number;
  is_tie: boolean;
  tied_options: string[];
}

interface MayorDecisionViewProps {
  isFacilitator: boolean;
  isMayor: boolean;
  scenario: Scenario;
  voteSummary: VoteSummary | null;
  onMayorAccept: (choice: string) => void;
  onMayorVeto: (choice: string, justification: string) => void;
  scenarioIndex?: number;
  onCancelSession?: () => void;
  indicators?: Indicators;
}

export const MayorDecisionView: React.FC<MayorDecisionViewProps> = ({
  isFacilitator,
  isMayor,
  scenario,
  voteSummary,
  onMayorAccept,
  onMayorVeto,
  scenarioIndex = 0,
  onCancelSession,
  indicators
}) => {
  const [showVetoForm, setShowVetoForm] = useState(false);
  const [vetoChoice, setVetoChoice] = useState<string | null>(null);
  const [justification, setJustification] = useState('');
  const [showStatsModal, setShowStatsModal] = useState(false);

  if (!voteSummary) {
    const lang = localStorage.getItem('tpa_lang') || 'en';
    return (
      <div className="min-h-screen w-full flex justify-center items-start">
        <div className="relative w-full sm:max-w-[480px] min-h-screen overflow-hidden bg-white flex flex-col">
          {/* Top Header */}
          <div className="w-full h-24 bg-lime-600 px-8 flex items-center justify-between shrink-0 relative">
            <div className="flex flex-col text-left justify-center min-w-0 pr-4">
              <div className="text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] truncate leading-tight">
                {scenario.title}
              </div>
              <div className="text-lime-100 text-xs sm:text-sm font-semibold font-['Nunito'] leading-normal mt-0.5">
                {lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 3` : `Scenario ${scenarioIndex + 1} of 3`}
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => setShowStatsModal(true)}
                className="w-12 h-12 rounded-2xl bg-lime-600 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 hover:bg-lime-700 transition-all flex justify-center items-center cursor-pointer"
                title="Stats"
              >
                <Activity className="w-5 h-5 text-white" />
              </button>

              <button 
                type="button"
                onClick={onCancelSession}
                className="w-12 h-12 rounded-2xl bg-lime-600 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 hover:bg-lime-700 transition-all flex justify-center items-center cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          {/* Loading Content */}
          <div className="flex-grow flex flex-col items-center justify-center">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="inline-block w-2 h-2 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="inline-block w-2 h-2 bg-zinc-300 rounded-full animate-bounce" />
              <span className="text-base font-semibold text-zinc-400 font-['Nunito']">
                {lang === 'id' ? 'Mengambil data perhitungan suara...' : 'Retrieving vote tallies...'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Modal Overlay */}
        {showStatsModal && (
          <div className="absolute inset-0 z-50 bg-slate-950/40 backdrop-blur-sm animate-fade-in flex justify-center items-center p-4">
            <div className="w-[410px] max-h-[90%] bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto border-2 border-neutral-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <span className="text-lg font-black text-slate-800 uppercase tracking-wider">
                    City Indicators
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowStatsModal(false)}
                    className="text-sm font-bold text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                {indicators ? (
                  <Dashboard indicators={indicators} flat />
                ) : (
                  <div className="text-center py-6 text-neutral-500 font-semibold">No data available</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowStatsModal(false)}
                className="w-full mt-6 bg-lime-600 hover:bg-lime-700 text-white py-3 rounded-2xl text-sm font-bold transition-all shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const { A, B, C, total, is_tie, tied_options } = voteSummary;

  // Determine majority option
  let majorityOption: string | null = null;
  if (!is_tie) {
    const max = Math.max(A, B, C);
    if (A === max) majorityOption = 'A';
    else if (B === max) majorityOption = 'B';
    else if (C === max) majorityOption = 'C';
  }

  const optionKeys = ['A', 'B', 'C'] as const;

  const getVotePercent = (votes: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  // 1. FACILITATOR VIEW
  if (isFacilitator) {
    const lang = localStorage.getItem('tpa_lang') || 'en';
    return (
      <div className="min-h-screen w-full flex justify-center items-start">
        <div className="relative w-full sm:max-w-[480px] min-h-screen overflow-hidden bg-white flex flex-col">
          
          {/* Top Header */}
          <div className="w-full h-24 bg-lime-600 px-8 flex items-center justify-between shrink-0 relative">
            <div className="flex flex-col text-left justify-center min-w-0 pr-4">
              <div className="text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] truncate leading-tight">
                {scenario.title}
              </div>
              <div className="text-lime-100 text-xs sm:text-sm font-semibold font-['Nunito'] leading-normal mt-0.5">
                {lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 3` : `Scenario ${scenarioIndex + 1} of 3`}
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => setShowStatsModal(true)}
                className="w-12 h-12 rounded-2xl bg-lime-600 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 hover:bg-lime-700 transition-all flex justify-center items-center cursor-pointer"
                title="Stats"
              >
                <Activity className="w-5 h-5 text-white" />
              </button>

              <button 
                type="button"
                onClick={onCancelSession}
                className="w-12 h-12 rounded-2xl bg-lime-600 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 hover:bg-lime-700 transition-all flex justify-center items-center cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-grow overflow-y-auto px-8 py-8 flex flex-col items-center justify-start gap-8">
            
            {/* Facilitator Title section */}
            <div className="w-full flex flex-col items-center gap-3 shrink-0">
              <div className="px-4 py-1 bg-neutral-200 rounded-[59px] text-zinc-400 text-[10px] font-extrabold font-['Nunito'] tracking-wider uppercase">
                FACILITATOR OVERVIEW
              </div>
              <div className="text-neutral-600 text-2xl font-extrabold font-['Nunito'] text-center">
                Mayor Deliberation
              </div>
              <div className="text-zinc-400 text-sm font-semibold font-['Nunito'] text-center leading-relaxed max-w-sm">
                {lang === 'id' ? (
                  <>Walikota sedang meninjau suara <br/>dan membuat keputusan akhir</>
                ) : (
                  <>The Mayor is currently reviewing the votes <br/>and making the final choice</>
                )}
              </div>
            </div>

            {/* Voting Card */}
            <div className="w-full bg-white rounded-xl border-2 border-neutral-200 p-6 flex flex-col gap-6 max-w-md shrink-0">
              {/* Option A */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start gap-4">
                  <div className="text-neutral-600 text-xs font-extrabold font-['Nunito'] leading-snug flex-1">
                    Option A: {scenario.options.A.label}
                  </div>
                  <div className="text-zinc-400 text-xs font-bold font-['Nunito'] shrink-0 text-right">
                    {A} {lang === 'id' ? 'Suara' : A === 1 ? 'Vote' : 'Votes'} ({getVotePercent(A)}%)
                  </div>
                </div>
                <div className="w-full h-4 bg-neutral-200 rounded-lg overflow-hidden relative">
                  <div 
                    className={`h-full rounded-lg transition-all duration-500 ${A > 0 ? 'bg-yellow-400' : ''}`}
                    style={{ width: `${getVotePercent(A)}%` }}
                  />
                  {A > 0 && (
                    <div className="absolute left-2 top-[4px] h-[5px] w-6 bg-white/20 rounded-lg" />
                  )}
                </div>
              </div>

              {/* Option B */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start gap-4">
                  <div className="text-neutral-600 text-xs font-extrabold font-['Nunito'] leading-snug flex-1">
                    Option B: {scenario.options.B.label}
                  </div>
                  <div className="text-zinc-400 text-xs font-bold font-['Nunito'] shrink-0 text-right">
                    {B} {lang === 'id' ? 'Suara' : B === 1 ? 'Vote' : 'Votes'} ({getVotePercent(B)}%)
                  </div>
                </div>
                <div className="w-full h-4 bg-neutral-200 rounded-lg overflow-hidden relative">
                  <div 
                    className={`h-full rounded-lg transition-all duration-500 ${B > 0 ? 'bg-yellow-400' : ''}`}
                    style={{ width: `${getVotePercent(B)}%` }}
                  />
                  {B > 0 && (
                    <div className="absolute left-2 top-[4px] h-[5px] w-6 bg-white/20 rounded-lg" />
                  )}
                </div>
              </div>

              {/* Option C */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start gap-4">
                  <div className="text-neutral-600 text-xs font-extrabold font-['Nunito'] leading-snug flex-1">
                    Option C: {scenario.options.C.label}
                  </div>
                  <div className="text-zinc-400 text-xs font-bold font-['Nunito'] shrink-0 text-right">
                    {C} {lang === 'id' ? 'Suara' : C === 1 ? 'Vote' : 'Votes'} ({getVotePercent(C)}%)
                  </div>
                </div>
                <div className="w-full h-4 bg-neutral-200 rounded-lg overflow-hidden relative">
                  <div 
                    className={`h-full rounded-lg transition-all duration-500 ${C > 0 ? 'bg-yellow-400' : ''}`}
                    style={{ width: `${getVotePercent(C)}%` }}
                  />
                  {C > 0 && (
                    <div className="absolute left-2 top-[4px] h-[5px] w-6 bg-white/20 rounded-lg" />
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-2 py-2 shrink-0">
              <span className="inline-block w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="inline-block w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="inline-block w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" />
              <span className="text-zinc-400 text-base font-semibold font-['Nunito']">
                {lang === 'id' ? 'Walikota sedang menentukan...' : 'Mayor is deciding...'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Modal Overlay */}
        {showStatsModal && (
          <div className="absolute inset-0 z-50 bg-slate-950/40 backdrop-blur-sm animate-fade-in flex justify-center items-center p-4">
            <div className="w-[410px] max-h-[90%] bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto border-2 border-neutral-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <span className="text-lg font-black text-slate-800 uppercase tracking-wider">
                    City Indicators
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowStatsModal(false)}
                    className="text-sm font-bold text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                {indicators ? (
                  <Dashboard indicators={indicators} flat />
                ) : (
                  <div className="text-center py-6 text-neutral-500 font-semibold">No data available</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowStatsModal(false)}
                className="w-full mt-6 bg-lime-600 hover:bg-lime-700 text-white py-3 rounded-2xl text-sm font-bold transition-all shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. MAYOR VIEW (THE WALIKOTA)
  if (isMayor) {
    const lang = localStorage.getItem('tpa_lang') || 'en';

    const handleAcceptMajority = () => {
      if (majorityOption) onMayorAccept(majorityOption);
    };

    const handleVetoSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (vetoChoice && justification.trim().length > 0) {
        onMayorVeto(vetoChoice, justification.trim());
      }
    };

    return (
      <div className="min-h-screen w-full flex justify-center items-start">
        <div className="relative w-full sm:max-w-[480px] min-h-screen overflow-hidden bg-white flex flex-col">

          {/* Top Header */}
          <div className="w-full h-24 bg-lime-600 px-8 flex items-center justify-between shrink-0 relative">
            <div className="flex flex-col text-left justify-center min-w-0 pr-4">
              <div className="text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] truncate leading-tight">
                {scenario.title}
              </div>
              <div className="text-lime-100 text-xs sm:text-sm font-semibold font-['Nunito'] leading-normal mt-0.5">
                {lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 3` : `Scenario ${scenarioIndex + 1} of 3`}
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => setShowStatsModal(true)}
                className="w-12 h-12 rounded-2xl bg-lime-600 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 hover:bg-lime-700 transition-all flex justify-center items-center cursor-pointer"
                title="Stats"
              >
                <Activity className="w-5 h-5 text-white" />
              </button>

              <button 
                type="button"
                onClick={onCancelSession}
                className="w-12 h-12 rounded-2xl bg-lime-600 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 hover:bg-lime-700 transition-all flex justify-center items-center cursor-pointer"
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-grow overflow-y-auto px-[35px] py-8 space-y-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

            {/* Badge + Title */}
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="bg-neutral-200 rounded-full h-8 px-5 flex items-center justify-center text-zinc-500 text-[10px] font-extrabold font-['Nunito'] tracking-wider uppercase">
                {lang === 'id' ? 'RUANG EKSEKUTIF WALIKOTA' : 'MAYOR EXECUTIVE CHAMBER'}
              </div>
              <h2 className="text-neutral-600 text-xl font-extrabold font-['Nunito'] leading-snug">
                {lang === 'id' ? 'Keputusan Ada di Tangan Anda' : 'The Decision is Yours'}
              </h2>
              <p className="text-zinc-400 text-sm font-semibold font-['Nunito'] leading-6 w-full">
                {lang === 'id'
                  ? 'Tinjau distribusi suara dewan. Anda dapat menerima suara mayoritas, memilih penentu seri, atau menggunakan hak veto walikota.'
                  : "Review the council's vote distribution. You can accept the democratic majority, choose a tie-breaker, or invoke your Mayor's Veto to push a different option with justification."}
              </p>
            </div>

            {/* Tally Card */}
            <div className="w-full bg-white rounded-xl border-2 border-neutral-200 p-5 space-y-4">
              {optionKeys.map((key) => {
                const votes = key === 'A' ? A : key === 'B' ? B : C;
                const percent = getVotePercent(votes);
                const isMajority = !is_tie && key === majorityOption;
                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600 text-base font-extrabold font-['Nunito'] leading-none">
                        {lang === 'id' ? `Opsi ${key}` : `Option ${key}`}
                      </span>
                      <span className="text-zinc-400 text-sm font-semibold font-['Nunito']">
                        {votes} {votes === 1 ? 'Vote' : 'Votes'} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-4 bg-neutral-200 rounded-lg overflow-hidden relative">
                      <div
                        className={`h-full rounded-lg transition-all ${isMajority ? 'bg-lime-500' : percent > 0 ? 'bg-yellow-400' : ''}`}
                        style={{ width: `${Math.max(percent, 0)}%` }}
                      />
                      {percent > 0 && (
                        <div className="absolute left-2 top-[4px] h-[5px] w-6 bg-white/20 rounded-lg" />
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Majority / Tie Notice */}
              {is_tie ? (
                <div className="text-center text-zinc-400 text-sm font-semibold font-['Nunito'] leading-6 pt-2">
                  {lang === 'id'
                    ? `Seri! Opsi ${tied_options.join(' & ')} mendapat suara yang sama.`
                    : `It's a tie! Options ${tied_options.join(' & ')} are equal.`}
                </div>
              ) : (
                <div className="text-center text-zinc-400 text-sm font-semibold font-['Nunito'] leading-6 pt-2">
                  {lang === 'id'
                    ? `Mayoritas jelas! Opsi ${majorityOption} memegang suara mayoritas dewan.`
                    : `Clear Majority! Option ${majorityOption} holds the majority vote of the council`}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!showVetoForm && (
              <div className="space-y-3">
                {is_tie ? (
                  tied_options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onMayorAccept(opt)}
                      className="w-full h-12 bg-lime-600 rounded-xl shadow-[0px_4px_0px_0px_#46A302] text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide hover:bg-lime-700 transition-all cursor-pointer"
                    >
                      {lang === 'id' ? `Selesaikan Seri & Pilih Opsi ${opt}` : `Resolve Tie & Choose Option ${opt}`}
                    </button>
                  ))
                ) : (
                  <button
                    type="button"
                    onClick={handleAcceptMajority}
                    className="w-full h-12 bg-lime-600 rounded-xl shadow-[0px_4px_0px_0px_#46A302] text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide hover:bg-lime-700 transition-all cursor-pointer"
                  >
                    {lang === 'id' ? `TERIMA OPSI MAYORITAS ${majorityOption}` : `ACCEPT MAJORITY OPTION ${majorityOption}`}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => { setShowVetoForm(true); setVetoChoice(null); }}
                  className="w-full h-12 bg-white rounded-xl shadow-[0px_2px_0px_0px_rgba(229,229,229,1.00)] outline outline-2 outline-offset-[-2px] outline-neutral-200 text-sky-500 text-sm font-extrabold font-['Nunito'] uppercase tracking-wide hover:bg-neutral-50 transition-all cursor-pointer"
                >
                  {lang === 'id' ? 'GUNAKAN HAK VETO EKSEKUTIF' : 'INVOKE EXECUTIVE VETO POWER'}
                </button>

                {/* Amber Override Notice */}
                <div className="w-full bg-orange-100 rounded-xl border-2 border-amber-500 p-5 space-y-1">
                  <div className="text-amber-500 text-base font-extrabold font-['Nunito'] leading-5">
                    {lang === 'id' ? 'Hak Override Eksekutif' : 'Executive Override'}
                  </div>
                  <p className="text-amber-500 text-sm font-medium font-['Inter'] leading-6">
                    {lang === 'id'
                      ? 'Pilih Gunakan Hak Veto Eksekutif jika Anda ingin melewati suara dewan dan merumuskan jalur Anda sendiri.'
                      : 'Select Invoke Executive Veto Power if you want to bypass the council votes and formulate your own path.'}
                  </p>
                </div>
              </div>
            )}

            {/* Veto Form */}
            {showVetoForm && (
              <form onSubmit={handleVetoSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <span className="text-sm font-extrabold text-neutral-600 font-['Nunito'] uppercase tracking-wider">
                    {lang === 'id' ? 'Formulasi Veto' : 'Veto Formulation'}
                  </span>
                  <button type="button" onClick={() => setShowVetoForm(false)} className="text-xs font-bold text-zinc-400 hover:text-zinc-600">
                    {lang === 'id' ? 'Batal' : 'Cancel'}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {optionKeys.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setVetoChoice(key)}
                      className={`py-3 rounded-xl border-2 text-sm font-extrabold font-['Nunito'] transition-all cursor-pointer ${
                        vetoChoice === key
                          ? 'bg-sky-500 text-white border-sky-500'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      {lang === 'id' ? `Opsi ${key}` : `Option ${key}`}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    <span>{lang === 'id' ? 'Justifikasi Veto' : 'Justification (Veto Reason)'}</span>
                    <span className={justification.length > 300 ? 'text-red-500' : ''}>{justification.length}/300</span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder={lang === 'id' ? 'Jelaskan alasan veto Anda...' : 'Provide 1-2 sentences justifying your override...'}
                    value={justification}
                    onChange={(e) => setJustification(e.target.value.slice(0, 300))}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 bg-neutral-50 focus:border-sky-500 focus:outline-none text-sm font-medium text-neutral-600 font-['Nunito'] leading-relaxed resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!vetoChoice || justification.trim().length === 0}
                  className="w-full h-12 bg-sky-500 disabled:opacity-50 rounded-xl shadow-[0px_4px_0px_0px_rgba(14,165,233,0.4)] text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide hover:bg-sky-600 transition-all cursor-pointer"
                >
                  {lang === 'id' ? 'KONFIRMASI VETO & EKSEKUSI KEPUTUSAN' : 'CONFIRM VETO & EXECUTE DECISION'}
                </button>
              </form>
            )}

            <div className="h-4 shrink-0" />
          </div>
        </div>

        {/* Stats Modal Overlay */}
        {showStatsModal && (
          <div className="absolute inset-0 z-50 bg-slate-950/40 backdrop-blur-sm animate-fade-in flex justify-center items-center p-4">
            <div className="w-[410px] max-h-[90%] bg-white rounded-3xl p-6 shadow-2xl overflow-y-auto border-2 border-neutral-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <span className="text-lg font-black text-slate-800 uppercase tracking-wider">
                    City Indicators
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowStatsModal(false)}
                    className="text-sm font-bold text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                {indicators ? (
                  <Dashboard indicators={indicators} flat />
                ) : (
                  <div className="text-center py-6 text-neutral-500 font-semibold">No data available</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowStatsModal(false)}
                className="w-full mt-6 bg-lime-600 hover:bg-lime-700 text-white py-3 rounded-2xl text-sm font-bold transition-all shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. OTHER PLAYERS VIEW (WAITING)
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <Gavel className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Mayor is Deliberating
          </h3>
          <p className="text-xs font-semibold text-slate-400 leading-relaxed max-w-xs mx-auto">
            The council votes are in! The Mayor is currently reviewing the tallies and formulating the final executive decision. Please wait...
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping" />
          Awaiting Mayor Signature
        </div>
      </div>
    </div>
  );
};
