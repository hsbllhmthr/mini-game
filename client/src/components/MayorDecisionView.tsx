import React, { useState } from 'react';
import { LogOut, Activity } from 'lucide-react';
import type { Scenario } from '../gameConstants.js';
import { Dashboard } from './Dashboard.js';
import type { Indicators } from './Dashboard.js';
import bgImage from '../assets/image4.webp';

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
      <div className="relative min-h-screen w-full bg-white flex justify-center items-center overflow-hidden">
        {/* Outer Web Background: White. Main Content Container: Dark #0D2B40 without card wrapper */}
        <div className="relative z-10 w-full max-w-[480px] min-h-screen bg-[#0D2B40] flex flex-col justify-between items-center pb-6 sm:pb-8 overflow-hidden">
          {bgImage && (
            <img className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" src={bgImage} alt="" />
          )}
          
          {/* Top Full-Width Header Banner (Transparent background) */}
          <div className="w-full h-24 bg-transparent px-6 flex items-center justify-between shrink-0 relative overflow-hidden z-20">
            <div className="flex flex-col text-left justify-center min-w-0 pr-4">
              <h1 className="text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] leading-tight truncate">
                {scenario.title}
              </h1>
              <span className="text-white text-sm font-semibold font-['Nunito'] leading-6">
                {lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 3` : `Scenario ${scenarioIndex + 1} of 3`}
              </span>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button 
                type="button"
                onClick={() => setShowStatsModal(true)}
                className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
                title="Stats"
              >
                <Activity className="w-5 h-5 text-white" />
              </button>

              <button 
                type="button"
                onClick={onCancelSession}
                className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
                title="Cancel"
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Loading Content at Bottom */}
          <div className="w-full flex-grow flex flex-col items-center justify-end pb-16 sm:pb-20 text-center z-20 mt-auto">
            <div className="flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce" />
              <span className="text-white text-base font-semibold font-['Nunito'] leading-6">
                {lang === 'id' ? 'Mengambil data perhitungan suara...' : 'Retrieving vote tallies...'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Modal Overlay */}
        {showStatsModal && (
          <div className="absolute inset-0 z-50 bg-slate-950/70 backdrop-blur-sm animate-fade-in flex justify-center items-center p-4">
            <div className="w-[410px] max-h-[90%] bg-neutral-900 rounded-3xl p-6 shadow-2xl overflow-y-auto border-2 border-neutral-700 flex flex-col justify-between text-white">
              <div>
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                  <span className="text-lg font-extrabold font-['Nunito'] text-white uppercase tracking-wider">
                    City Indicators
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowStatsModal(false)}
                    className="text-sm font-bold text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                {indicators ? (
                  <Dashboard indicators={indicators} flat />
                ) : (
                  <div className="text-center py-6 text-zinc-400 font-semibold font-['Nunito']">No data available</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowStatsModal(false)}
                className="w-full mt-6 bg-[#5CACE2] hover:opacity-90 text-white py-3 rounded-2xl text-sm font-extrabold font-['Nunito'] uppercase tracking-wide transition-all shadow-md cursor-pointer"
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
      <div className="relative min-h-screen w-full bg-white flex justify-center items-center overflow-hidden">
        {/* Outer Web Background: White. Main Content Container: Dark #0D2B40 without card wrapper */}
        <div className="relative z-10 w-full max-w-[480px] min-h-screen bg-[#0D2B40] flex flex-col justify-between items-center pb-6 sm:pb-8 overflow-hidden">
          
          {/* Top Full-Width Header Banner */}
          <div className="w-full h-24 bg-cyan-700 px-6 flex items-center justify-between shrink-0 relative overflow-hidden z-20">
            <div className="flex flex-col text-left justify-center min-w-0 pr-4">
              <h1 className="text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] leading-tight truncate">
                {scenario.title}
              </h1>
              <span className="text-white text-sm font-semibold font-['Nunito'] leading-6">
                {lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 3` : `Scenario ${scenarioIndex + 1} of 3`}
              </span>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button 
                type="button"
                onClick={() => setShowStatsModal(true)}
                className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
                title="View Stats"
              >
                <Activity className="w-5 h-5 text-white" />
              </button>

              <button 
                type="button"
                onClick={onCancelSession}
                className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
                title="Cancel"
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="w-full max-w-[384px] flex-grow flex flex-col items-center justify-start mx-auto px-4 py-6 space-y-6 overflow-y-auto no-scrollbar z-20">
            
            {/* Facilitator Title section */}
            <div className="w-full flex flex-col items-center space-y-1 text-center shrink-0">
              <h2 className="text-white text-xl font-extrabold font-['Nunito'] leading-9">
                {lang === 'id' ? 'Musyawarah Walikota' : lang === 'th' ? 'การพิจารณาของนายกเทศมนตรี' : 'Mayor Deliberation'}
              </h2>
              <p className="text-white text-base font-semibold font-['Nunito'] leading-6 max-w-xs mx-auto">
                {lang === 'id' ? (
                  <>Walikota sedang meninjau suara dan membuat keputusan akhir</>
                ) : lang === 'th' ? (
                  <>นายกเทศมนตรีกำลังตรวจสอบผลการลงมติและตัดสินใจขั้นสุดท้าย</>
                ) : (
                  <>The Mayor is currently reviewing the votes and making the final choice</>
                )}
              </p>
            </div>

            {/* Voting Card */}
            <div className="w-full bg-gray-800 rounded-xl border-2 border-zinc-700 p-5 space-y-4 text-left shrink-0">
              {optionKeys.map((key) => {
                const votes = key === 'A' ? A : key === 'B' ? B : C;
                const percent = getVotePercent(votes);
                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-white text-base font-extrabold font-['Nunito'] leading-snug flex-1 min-w-0 pr-2">
                        {lang === 'id' ? `Opsi ${key}` : lang === 'th' ? `ตัวเลือก ${key}` : `Option ${key}`}: {scenario.options[key].label}
                      </span>
                      <span className="text-zinc-400 text-sm sm:text-base font-semibold font-['Nunito'] whitespace-nowrap shrink-0 text-right">
                        {votes} {lang === 'id' ? 'Suara' : lang === 'th' ? 'เสียง' : votes === 1 ? 'Vote' : 'Votes'} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-4 bg-neutral-200 rounded-lg overflow-hidden relative">
                      <div 
                        className={`h-full rounded-lg transition-all duration-500 ${percent > 0 ? 'bg-[#5CACE2]' : ''}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-2 py-4 shrink-0 mt-auto">
              <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce" />
              <span className="text-white text-base font-semibold font-['Nunito']">
                {lang === 'id' ? 'Walikota sedang menentukan...' : lang === 'th' ? 'นายกเทศมนตรีกำลังตัดสินใจ...' : 'Mayor is deciding...'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Modal Overlay */}
        {showStatsModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm animate-fade-in flex justify-center items-start sm:items-center p-4 pt-6 sm:pt-4 overflow-y-auto">
            <div className="w-[410px] max-h-[90%] bg-neutral-900 rounded-3xl p-6 shadow-2xl overflow-y-auto border-2 border-neutral-700 flex flex-col justify-between text-white">
              <div>
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                  <span className="text-lg font-extrabold font-['Nunito'] text-white uppercase tracking-wider">
                    {lang === 'id' ? 'Indikator Kota' : lang === 'th' ? 'ตัวชี้วัดของเมือง' : 'City Indicators'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowStatsModal(false)}
                    className="text-sm font-bold text-zinc-400 hover:text-white cursor-pointer"
                  >
                    {lang === 'id' ? 'Tutup' : lang === 'th' ? 'ปิด' : 'Close'}
                  </button>
                </div>
                {indicators ? (
                  <Dashboard indicators={indicators} flat />
                ) : (
                  <div className="text-center py-6 text-zinc-400 font-semibold font-['Nunito']">
                    {lang === 'id' ? 'Tidak ada data tersedia' : lang === 'th' ? 'ไม่มีข้อมูล' : 'No data available'}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowStatsModal(false)}
                className="w-full mt-6 bg-[#5CACE2] hover:opacity-90 text-white py-3 rounded-2xl text-sm font-extrabold font-['Nunito'] uppercase tracking-wide transition-all shadow-md cursor-pointer"
              >
                {lang === 'id' ? 'Tutup' : lang === 'th' ? 'ปิด' : 'Close'}
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
      <div className="relative min-h-screen w-full bg-white flex justify-center items-center overflow-hidden">
        {/* Outer Web Background: White. Main Content Container: Dark #0D2B40 without card wrapper */}
        <div className="relative z-10 w-full max-w-[480px] min-h-screen bg-[#0D2B40] flex flex-col justify-between items-center pb-6 sm:pb-8 overflow-hidden">

          {/* Top Full-Width Header Banner */}
          <div className="w-full h-24 bg-cyan-700 px-6 flex items-center justify-between shrink-0 relative overflow-hidden z-20">
            <div className="flex flex-col text-left justify-center min-w-0 pr-4">
              <h1 className="text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] leading-tight truncate">
                {scenario.title}
              </h1>
              <span className="text-white text-sm font-semibold font-['Nunito'] leading-6">
                {lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 3` : lang === 'th' ? `สถานการณ์ ${scenarioIndex + 1} จาก 3` : `Scenario ${scenarioIndex + 1} of 3`}
              </span>
            </div>
            
            <div className="flex items-center gap-2.5 shrink-0">
              <button 
                type="button"
                onClick={() => setShowStatsModal(true)}
                className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
                title="View Stats"
              >
                <Activity className="w-5 h-5 text-white" />
              </button>

              <button 
                type="button"
                onClick={onCancelSession}
                className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
                title="Cancel"
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="w-full max-w-[384px] flex-grow flex flex-col items-center justify-start mx-auto px-4 py-6 space-y-6 overflow-y-auto no-scrollbar z-20">

            {/* Title & Description */}
            <div className="flex flex-col items-center space-y-1 text-center shrink-0 w-full">
              <h2 className="text-white text-xl font-extrabold font-['Nunito'] leading-9">
                {lang === 'id' ? 'Keputusan Ada di Tangan Anda' : lang === 'th' ? 'การตัดสินใจเป็นของคุณ' : 'The Decision is Yours'}
              </h2>
              <p className="text-white text-base font-semibold font-['Nunito'] leading-6 w-full max-w-[384px] mx-auto text-center">
                {lang === 'id'
                  ? 'Tinjau distribusi suara dewan. Anda dapat menerima suara mayoritas, memilih penentu seri, atau menggunakan hak veto walikota.'
                  : lang === 'th'
                  ? 'ทบทวนการกระจายเสียงของสภา คุณสามารถยอมรับมติเสียงส่วนใหญ่ตามระบอบประชาธิปไตย เลือกข้อยุติในกรณีเสียงเท่ากัน หรือใช้วีโต้ของนายกเทศมนตรีเพื่อผลักดันตัวเลือกอื่นพร้อมเหตุผลประกอบ'
                  : "Review the council's vote distribution. You can accept the democratic majority, choose a tie-breaker, or invoke your Mayor's Veto to push a different option with justification."}
              </p>
            </div>

            {/* Tally Card Box */}
            <div className="w-full bg-gray-800 rounded-xl border-2 border-zinc-700 p-5 space-y-4 shadow-lg text-left shrink-0">
              {optionKeys.map((key) => {
                const votes = key === 'A' ? A : key === 'B' ? B : C;
                const percent = getVotePercent(votes);
                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-white text-base font-extrabold font-['Nunito'] leading-snug flex-1 min-w-0 pr-2">
                        {lang === 'id' ? `Opsi ${key}` : lang === 'th' ? `ตัวเลือก ${key}` : `Option ${key}`}
                      </span>
                      <span className="text-zinc-400 text-sm sm:text-base font-semibold font-['Nunito'] whitespace-nowrap shrink-0 text-right">
                        {votes} {lang === 'id' ? 'Suara' : lang === 'th' ? 'เสียง' : votes === 1 ? 'Vote' : 'Votes'} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-4 bg-neutral-200 rounded-lg overflow-hidden relative">
                      <div
                        className={`h-full rounded-lg transition-all duration-500 ${percent > 0 ? 'bg-[#5CACE2]' : ''}`}
                        style={{ width: `${Math.max(percent, 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* Majority / Tie Notice */}
              {is_tie ? (
                <div className="text-center text-zinc-400 text-base font-semibold font-['Nunito'] leading-6 pt-3 border-t border-zinc-700/60">
                  {lang === 'id'
                    ? `Seri! Opsi ${tied_options.join(' & ')} mendapat suara yang sama.`
                    : lang === 'th'
                    ? `ผลการลงมติเสมอกัน! ตัวเลือก ${tied_options.join(' & ')} ได้รับเสียงเท่ากัน`
                    : `It's a tie! Options ${tied_options.join(' & ')} are equal.`}
                </div>
              ) : (
                <div className="text-center text-zinc-400 text-base font-semibold font-['Nunito'] leading-6 pt-3 border-t border-zinc-700/60">
                  {lang === 'id'
                    ? `Mayoritas jelas! Opsi ${majorityOption} memegang suara mayoritas dewan`
                    : lang === 'th'
                    ? `มติเสียงส่วนใหญ่ชัดเจน! ตัวเลือก ${majorityOption} ได้รับเสียงส่วนใหญ่จากสภา`
                    : `Clear Majority! Option ${majorityOption} holds the majority vote of the council`}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {!showVetoForm && (
              <div className="w-full space-y-4 shrink-0">
                {is_tie ? (
                  tied_options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onMayorAccept(opt)}
                      data-button="Primary"
                      className="w-full h-12 p-2.5 bg-[#5CACE2] rounded-md shadow-[0px_4px_0px_0px_rgba(36,112,162,1.00)] text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide hover:opacity-90 active:translate-y-0.5 transition-all cursor-pointer flex justify-center items-center"
                    >
                      {lang === 'id' ? `Selesaikan Seri & Pilih Opsi ${opt}` : lang === 'th' ? `แก้ไขผลเสมอกัน & เลือกตัวเลือก ${opt}` : `Resolve Tie & Choose Option ${opt}`}
                    </button>
                  ))
                ) : (
                  <button
                    type="button"
                    onClick={handleAcceptMajority}
                    data-button="Primary"
                    className="w-full h-12 p-2.5 bg-[#5CACE2] rounded-md shadow-[0px_4px_0px_0px_rgba(36,112,162,1.00)] text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide hover:opacity-90 active:translate-y-0.5 transition-all cursor-pointer flex justify-center items-center"
                  >
                    {lang === 'id' ? `TERIMA OPSI MAYORITAS ${majorityOption}` : lang === 'th' ? `ยอมรับมติเสียงส่วนใหญ่ ตัวเลือก ${majorityOption}` : `ACCEPT MAJORITY OPTION ${majorityOption}`}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => { setShowVetoForm(true); setVetoChoice(null); }}
                  data-button="Outline-Secondary"
                  className="w-full h-12 p-2.5 bg-cyan-700 rounded-md shadow-[0px_2px_0px_0px_rgba(29,90,130,1.00)] outline outline-2 outline-offset-[-2px] outline-cyan-800 text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide hover:opacity-90 active:translate-y-0.5 transition-all cursor-pointer flex justify-center items-center"
                >
                  {lang === 'id' ? 'GUNAKAN HAK VETO EKSEKUTIF' : lang === 'th' ? 'ใช้อำนาจวีโต้ของผู้บริหาร' : 'INVOKE EXECUTIVE VETO POWER'}
                </button>

                {/* Red Executive Override Callout Box */}
                <div className="w-full p-5 bg-red-500 rounded-xl text-left space-y-1.5 shadow-md mt-2">
                  <div className="text-white text-xl font-extrabold font-['Nunito'] leading-tight">
                    {lang === 'id' ? 'Hak Override Eksekutif' : lang === 'th' ? 'การใช้อำนาจเด็ดขาดของผู้บริหาร' : 'Executive Override'}
                  </div>
                  <p className="text-white text-sm font-medium font-['Inter'] leading-6">
                    {lang === 'id'
                      ? 'Pilih Gunakan Hak Veto Eksekutif jika Anda ingin melewati suara dewan dan merumuskan jalur Anda sendiri.'
                      : lang === 'th'
                      ? 'เลือก ใช้อำนาจวีโต้ของผู้บริหาร หากคุณต้องการข้ามผลการลงมติของสภาและกำหนดแนวทางของคุณเอง'
                      : 'Select Invoke Executive Veto Power if you want to bypass the council votes and formulate your own path.'}
                  </p>
                </div>
              </div>
            )}

            {/* Veto Form */}
            {showVetoForm && (
              <form onSubmit={handleVetoSubmit} className="w-full space-y-4 shrink-0 bg-gray-800 p-5 rounded-xl border-2 border-zinc-700">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-700">
                  <span className="text-sm font-extrabold text-white font-['Nunito'] uppercase tracking-wider">
                    {lang === 'id' ? 'Formulasi Veto' : lang === 'th' ? 'การกำหนดรูปแบบวีโต้' : 'Veto Formulation'}
                  </span>
                  <button type="button" onClick={() => setShowVetoForm(false)} className="text-xs font-bold text-zinc-400 hover:text-white cursor-pointer">
                    {lang === 'id' ? 'Batal' : lang === 'th' ? 'ยกเลิก' : 'Cancel'}
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
                          ? 'bg-[#5CACE2] text-white border-[#5CACE2]'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                      }`}
                    >
                      {lang === 'id' ? `Opsi ${key}` : lang === 'th' ? `ตัวเลือก ${key}` : `Option ${key}`}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    <span>{lang === 'id' ? 'Justifikasi Veto' : lang === 'th' ? 'เหตุผลการใช้วีโต้' : 'Justification (Veto Reason)'}</span>
                    <span className={justification.length > 300 ? 'text-red-500' : ''}>{justification.length}/300</span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder={lang === 'id' ? 'Jelaskan alasan veto Anda...' : lang === 'th' ? 'อธิบายให้สภาทราบถึงเหตุผลที่คุณใช้อำนาจวีโต้ข้ามผลการลงมติของพวกเขา...' : 'Provide 1-2 sentences justifying your override...'}
                    value={justification}
                    onChange={(e) => setJustification(e.target.value.slice(0, 300))}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-zinc-700 bg-zinc-900 focus:border-[#5CACE2] focus:outline-none text-sm font-medium text-white font-['Nunito'] leading-relaxed resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!vetoChoice || justification.trim().length === 0}
                  className="w-full h-12 bg-[#5CACE2] disabled:opacity-50 rounded-xl shadow-[0px_4px_0px_0px_rgba(36,112,162,1.00)] text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide hover:opacity-90 transition-all cursor-pointer"
                >
                  {lang === 'id' ? 'KONFIRMASI VETO & EKSEKUSI KEPUTUSAN' : lang === 'th' ? 'ยืนยันการใช้วีโต้ & ดำเนินการตัดสินใจ' : 'CONFIRM VETO & EXECUTE DECISION'}
                </button>
              </form>
            )}

          </div>
        </div>

        {/* Stats Modal Overlay */}
        {showStatsModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm animate-fade-in flex justify-center items-start sm:items-center p-4 pt-6 sm:pt-4 overflow-y-auto">
            <div className="w-[410px] max-h-[90%] bg-neutral-900 rounded-3xl p-6 shadow-2xl overflow-y-auto border-2 border-neutral-700 flex flex-col justify-between text-white">
              <div>
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                  <span className="text-lg font-extrabold font-['Nunito'] text-white uppercase tracking-wider">
                    {lang === 'id' ? 'Indikator Kota' : lang === 'th' ? 'ตัวชี้วัดของเมือง' : 'City Indicators'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowStatsModal(false)}
                    className="text-sm font-bold text-zinc-400 hover:text-white cursor-pointer"
                  >
                    {lang === 'id' ? 'Tutup' : lang === 'th' ? 'ปิด' : 'Close'}
                  </button>
                </div>
                {indicators ? (
                  <Dashboard indicators={indicators} flat />
                ) : (
                  <div className="text-center py-6 text-zinc-400 font-semibold font-['Nunito']">
                    {lang === 'id' ? 'Tidak ada data tersedia' : lang === 'th' ? 'ไม่มีข้อมูล' : 'No data available'}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowStatsModal(false)}
                className="w-full mt-6 bg-[#5CACE2] hover:opacity-90 text-white py-3 rounded-2xl text-sm font-extrabold font-['Nunito'] uppercase tracking-wide transition-all shadow-md cursor-pointer"
              >
                {lang === 'id' ? 'Tutup' : lang === 'th' ? 'ปิด' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. OTHER PLAYERS VIEW (WAITING)
  const lang = localStorage.getItem('tpa_lang') || 'en';
  return (
    <div className="relative min-h-screen w-full bg-white flex justify-center items-center overflow-hidden">
      {/* Outer Web Background: White. Main Content Container: Dark #0D2B40 without card wrapper */}
      <div className="relative z-10 w-full max-w-[480px] min-h-screen bg-[#0D2B40] flex flex-col justify-between items-center pb-6 sm:pb-8 overflow-hidden">
        {bgImage && (
          <img className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" src={bgImage} alt="" />
        )}
        
        {/* Top Full-Width Header Banner (Transparent background) */}
        <div className="w-full h-24 bg-transparent px-6 flex items-center justify-between shrink-0 relative overflow-hidden z-20">
          <div className="flex flex-col text-left justify-center min-w-0 pr-4">
            <h1 className="text-white text-xl sm:text-2xl font-extrabold font-['Nunito'] leading-tight truncate">
              {scenario.title}
            </h1>
            <span className="text-white text-sm font-semibold font-['Nunito'] leading-6">
              {lang === 'id' ? `Skenario ${scenarioIndex + 1} dari 3` : lang === 'th' ? `สถานการณ์ ${scenarioIndex + 1} จาก 3` : `Scenario ${scenarioIndex + 1} of 3`}
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button 
              type="button"
              onClick={() => setShowStatsModal(true)}
              className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
              title="Stats"
            >
              <Activity className="w-5 h-5 text-white" />
            </button>

            <button 
              type="button"
              onClick={onCancelSession}
              className="w-12 h-12 bg-cyan-700 rounded-2xl shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex items-center justify-center text-white cursor-pointer hover:opacity-90 active:scale-95 transition-all shrink-0"
              title={lang === 'id' ? 'Batal' : lang === 'th' ? 'ยกเลิก' : 'Cancel'}
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Loading Content at Bottom */}
        <div className="w-full flex-grow flex flex-col items-center justify-end pb-16 sm:pb-20 text-center z-20 mt-auto">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="inline-block w-2 h-2 bg-white rounded-full animate-bounce" />
            <span className="text-white text-base font-semibold font-['Nunito'] leading-6">
              {lang === 'id' ? 'Walikota sedang menentukan...' : lang === 'th' ? 'นายกเทศมนตรีกำลังตัดสินใจ...' : 'Mayor is deciding...'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Modal Overlay */}
      {showStatsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm animate-fade-in flex justify-center items-start sm:items-center p-4 pt-6 sm:pt-4 overflow-y-auto">
          <div className="w-[410px] max-h-[90%] bg-neutral-900 rounded-3xl p-6 shadow-2xl overflow-y-auto border-2 border-neutral-700 flex flex-col justify-between text-white">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
                <span className="text-lg font-extrabold font-['Nunito'] text-white uppercase tracking-wider">
                  {lang === 'id' ? 'Indikator Kota' : lang === 'th' ? 'ตัวชี้วัดของเมือง' : 'City Indicators'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowStatsModal(false)}
                  className="text-sm font-bold text-zinc-400 hover:text-white cursor-pointer"
                >
                  {lang === 'id' ? 'Tutup' : lang === 'th' ? 'ปิด' : 'Close'}
                </button>
              </div>
              {indicators ? (
                <Dashboard indicators={indicators} flat />
              ) : (
                <div className="text-center py-6 text-zinc-400 font-semibold font-['Nunito']">
                  {lang === 'id' ? 'Tidak ada data tersedia' : lang === 'th' ? 'ไม่มีข้อมูล' : 'No data available'}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowStatsModal(false)}
              className="w-full mt-6 bg-[#5CACE2] hover:opacity-90 text-white py-3 rounded-2xl text-sm font-extrabold font-['Nunito'] uppercase tracking-wide transition-all shadow-md cursor-pointer"
            >
              {lang === 'id' ? 'Tutup' : lang === 'th' ? 'ปิด' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

