import React, { useState } from 'react';
import { ChevronDown, ChevronUp, LogOut, Activity } from 'lucide-react';
import { useI18n } from '../i18n.js';
import type { Scenario } from '../gameConstants.js';
import { Dashboard } from './Dashboard.js';
import type { Indicators } from './Dashboard.js';
import scenario1Img from '../assets/scenario_1_industrial.webp';
import scenario2Img from '../assets/scenario_2_education.webp';
import scenario3Img from '../assets/scenario_3_forest.webp';

interface ScenarioViewProps {
  isFacilitator: boolean;
  scenarioIndex: number;
  scenario: Scenario;
  indicators?: Indicators;
  onStartDiscussion?: (durationSeconds: number) => void;
  onCancelSession?: () => void;
}

export const ScenarioView: React.FC<ScenarioViewProps> = ({
  isFacilitator,
  scenarioIndex,
  scenario,
  indicators,
  onStartDiscussion,
  onCancelSession
}) => {
  const { t } = useI18n();
  const lang = localStorage.getItem('tpa_lang') || 'en';
  const [selectedDuration, setSelectedDuration] = useState(7); // 7 minutes default
  const [showPositions, setShowPositions] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const formatRoleName = (role: string) => {
    const roleMap: Record<string, Record<string, string>> = {
      id: {
        mayor: 'Walikota',
        journalist: 'Jurnalis',
        community_rep: 'Perwakilan Warga',
        business_rep: 'Perwakilan Bisnis',
        social_welfare: 'Kesejahteraan Sosial',
        environmental: 'Pemerhati Lingkungan',
        investor: 'Investor Utama',
        youth_rep: 'Perwakilan Pemuda',
      },
      en: {
        mayor: 'Mayor',
        journalist: 'Journalist',
        community_rep: 'Community Rep',
        business_rep: 'Business Rep',
        social_welfare: 'Social Welfare',
        environmental: 'Environmentalist',
        investor: 'Lead Investor',
        youth_rep: 'Youth Rep',
      },
      th: {
        mayor: 'นายกเทศมนตรี',
        journalist: 'ผู้สื่อข่าว',
        community_rep: 'ตัวแทนชุมชน',
        business_rep: 'ตัวแทนภาคธุรกิจ',
        social_welfare: 'สวัสดิการสังคม',
        environmental: 'นักอนุรักษ์สิ่งแวดล้อม',
        investor: 'นักลงทุนหลัก',
        youth_rep: 'ตัวแทนเยาวชน',
      }
    };
    return roleMap[lang]?.[role] || role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const optionKeys = ['A', 'B', 'C'] as const;

  return (
    <div className="relative min-h-screen w-full bg-white flex justify-center items-center overflow-hidden">
      {/* Main App Container - Outer web bg is white, main container is dark cyan-950/0D2B40 without card wrapper */}
      <div className="relative z-10 w-full max-w-[480px] min-h-screen bg-[#0D2B40] flex flex-col justify-between items-center pb-8 overflow-hidden">
        
        {/* Top Full-Width Header Banner */}
        <div className="w-full h-24 bg-cyan-700 px-6 flex items-center justify-between shrink-0 relative overflow-hidden">
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
              title={t('common.cancel')}
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="w-full max-w-[384px] flex-grow flex flex-col items-center mx-auto px-4 py-6 space-y-6 overflow-y-auto no-scrollbar">

          {/* Scenario Illustration Banner */}
          {(() => {
            const imgs = [scenario1Img, scenario2Img, scenario3Img];
            const img = imgs[scenarioIndex] ?? imgs[0];
            const labels: Record<string, string[]> = {
              en: ['New Industrial Zone', 'Universal Free Education', 'Open Forest for Mining'],
              id: ['Kawasan Industri Baru', 'Pendidikan Gratis Universal', 'Hutan Terbuka untuk Pertambangan'],
              th: ['เขตอุตสาหกรรมใหม่', 'การศึกษาฟรีสากล', 'เปิดป่าเพื่อการทำเหมือง'],
            };
            const caption = labels[lang]?.[scenarioIndex] ?? labels['en']?.[scenarioIndex] ?? '';
            return (
              <div className="w-full shrink-0 rounded-xl overflow-hidden relative">
                <img
                  src={img}
                  alt={caption}
                  className="w-full h-44 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D2B40]/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-white text-xs font-extrabold font-['Nunito'] uppercase tracking-wider opacity-90">
                    {lang === 'id' ? `Skenario ${scenarioIndex + 1}` : lang === 'th' ? `สถานการณ์ ${scenarioIndex + 1}` : `Scenario ${scenarioIndex + 1}`}
                  </span>
                  <p className="text-white text-sm font-extrabold font-['Nunito'] leading-tight mt-0.5">
                    {caption}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Challenge Statement Section */}
          <div className="w-full text-left shrink-0 space-y-2">
            <div className="text-white text-xl font-extrabold font-['Nunito'] leading-9">
              {lang === 'id' ? 'Ringkasan Tantangan' : lang === 'th' ? 'สรุปประเด็นท้าทาย' : 'Challenge Statement'}
            </div>
            <div className="w-full max-w-[384px] bg-[#5CACE2] rounded-xl border-2 border-cyan-800 p-5 flex flex-col justify-center text-left shrink-0 space-y-1">
              <div className="text-white text-base font-semibold font-['Nunito'] leading-6">
                {scenario.challengeSummary}
              </div>
            </div>
          </div>

          {/* Options A, B, C */}
          <div className="w-full space-y-6 shrink-0">
            {optionKeys.map((key) => {
              const opt = scenario.options[key];
              return (
                <div 
                  key={key}
                  className="w-full p-5 bg-gray-800 rounded-xl shadow-[0px_2px_0px_0px_rgba(52,55,64,1.00)] outline outline-2 outline-offset-[-2px] outline-zinc-700 flex flex-col space-y-4 text-left shrink-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-red-500 shadow-[0px_2px_0px_0px_rgba(0,0,0,0.20)] border-2 border-black/20 flex justify-center items-center shrink-0">
                      <span className="text-white text-2xl font-extrabold font-['Nunito']">{key}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-white text-base font-extrabold font-['Nunito'] leading-tight truncate">{opt.label}</div>
                      <div className="text-white text-xs font-semibold font-['Nunito'] leading-relaxed mt-1">{opt.description}</div>
                    </div>
                  </div>
                  
                  <div className="h-0.5 bg-zinc-700 -mx-5" />
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-white text-xs font-bold font-['Nunito'] mb-1">{lang === 'id' ? 'Keuntungan Utama' : lang === 'th' ? 'จุดแข็งหลัก' : 'Advantages'}</div>
                      <div className="text-white text-xs font-semibold font-['Nunito'] leading-relaxed">{opt.advantages}</div>
                    </div>
                    <div>
                      <div className="text-white text-xs font-bold font-['Nunito'] mb-1">{lang === 'id' ? 'Risiko Utama' : lang === 'th' ? 'ความเสี่ยงหลัก' : 'Risks'}</div>
                      <div className="text-white text-xs font-semibold font-['Nunito'] leading-relaxed">{opt.risks}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stakeholder Positions Accordion */}
          <div className="w-full bg-neutral-800 rounded-xl border-2 border-[#2C2F36] overflow-hidden shrink-0">
            <button
              type="button"
              onClick={() => setShowPositions(!showPositions)}
              className="w-full flex items-center justify-between px-6 py-3.5 text-neutral-400 text-sm font-medium font-['Inter'] leading-6 cursor-pointer hover:bg-neutral-750 transition-colors"
            >
              <span>{lang === 'id' ? 'Pengarahan & Posisi Pemangku Kepentingan' : lang === 'th' ? 'การสรุปข้อมูลและท่าทีของผู้มีส่วนได้ส่วนเสีย' : 'Stakeholder Briefings & Positions'}</span>
              {showPositions ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
            </button>
            {showPositions && (
              <div className="px-6 pb-4 bg-neutral-900/60 space-y-4 max-h-[300px] overflow-y-auto pt-3 text-left border-t border-neutral-700">
                {Object.entries(scenario.stakeholderPositions).map(([role, position]) => (
                  <div key={role} className="border-b border-neutral-700/60 last:border-0 pb-2">
                    <span className="font-extrabold text-white text-xs uppercase tracking-wider block mb-1">
                      {formatRoleName(role)}
                    </span>
                    <p className="text-zinc-400 text-xs font-semibold font-['Nunito'] leading-relaxed">
                      {position}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Section (Facilitator Controls vs Player Waiting) */}
          {isFacilitator ? (
            <div className="w-full space-y-5 shrink-0 pt-2 text-left">
              <div className="space-y-2">
                <div className="text-white text-xl font-extrabold font-['Nunito'] leading-9">
                  {lang === 'id' ? 'Pengaturan Sesi Diskusi' : lang === 'th' ? 'การตั้งค่าช่วงเวลาอภิปราย' : 'Discussion Session Setting'}
                </div>
                
                <div className="w-full h-12 bg-neutral-800 rounded-xl border-2 border-[#2C2F36] flex items-center justify-between px-6 relative cursor-pointer hover:bg-neutral-750 transition-colors">
                  <span className="text-neutral-400 text-sm font-medium font-['Inter']">
                    {lang === 'id' ? `Durasi ${selectedDuration} Menit` : lang === 'th' ? `ระยะเวลา ${selectedDuration} นาที` : `Duration ${selectedDuration} Minutes`}
                  </span>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(m => (
                      <option key={m} value={m} className="bg-neutral-900 text-white">{m} {lang === 'id' ? 'Menit' : lang === 'th' ? 'นาที' : (m === 1 ? 'Minute' : 'Minutes')}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 text-zinc-500 pointer-events-none" />
                </div>
              </div>

              {/* Start Timed Discussion Button */}
              <button
                type="button"
                onClick={() => onStartDiscussion?.(selectedDuration * 60)}
                data-button="Primary"
                className="w-full max-w-[384px] h-12 p-2.5 bg-[#5CACE2] rounded-md shadow-[0px_4px_0px_0px_rgba(36,112,162,1.00)] inline-flex justify-center items-center gap-2.5 transition-all hover:opacity-90 cursor-pointer active:translate-y-0.5 focus:outline-none"
              >
                <div className="text-white text-sm font-extrabold font-['Nunito'] uppercase tracking-wide">
                  {lang === 'id' ? 'Mulai waktu diskusi' : lang === 'th' ? 'เริ่มจับเวลาอภิปราย' : 'Start timed discussion'}
                </div>
              </button>
            </div>
          ) : (
            <div className="w-full text-center py-5 px-4 shrink-0 mt-2 space-y-3">
              <div className="flex items-center justify-center gap-1.5 mb-2.5">
                <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
              </div>
              <div className="text-sm font-extrabold font-['Nunito'] text-slate-200 leading-snug max-w-xs mx-auto">
                {lang === 'id' 
                  ? 'Menunggu fasilitator memulai waktu diskusi...' 
                  : lang === 'th'
                  ? 'กำลังรอผู้ดำเนินรายการเริ่มจับเวลาอภิปราย...'
                  : 'Awaiting facilitator to start the discussion timer...'
                }
              </div>
              <p className="text-xs text-zinc-400 font-medium font-['Nunito'] leading-relaxed max-w-xs mx-auto">
                {lang === 'id'
                  ? 'Anda dapat menggunakan waktu ini untuk mempelajari opsi dan memeriksa posisi pemangku kepentingan lainnya.'
                  : lang === 'th'
                  ? 'คุณสามารถใช้เวลานี้เพื่อทบทวนตัวเลือกและตรวจสอบท่าทีของผู้มีส่วนได้ส่วนเสียคนอื่น ๆ'
                  : 'You can take this time to review the options and check other stakeholders\' positions.'
                }
              </p>
            </div>
          )}

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
    </div>
  );
};

