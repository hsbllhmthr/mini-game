import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShieldCheck, 
  Leaf, 
  Eye 
} from 'lucide-react';

export interface Indicators {
  economic_growth: number;
  government_budget: number;
  people_welfare: number;
  public_trust: number;
  environmental_quality: number;
  transparency: number;
}

interface DashboardProps {
  indicators: Indicators;
  previousIndicators?: Indicators; // for animating changes
  compact?: boolean;
  flat?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  indicators, 
  previousIndicators,
  compact = false,
  flat = false
}) => {
  const getIndicatorColor = (value: number) => {
    if (value >= 70) return 'bg-emerald-500';
    if (value >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getIndicatorBgColor = (value: number) => {
    if (value >= 70) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    if (value >= 40) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400';
  };

  const list = [
    {
      key: 'economic_growth' as const,
      label: 'Economic Growth',
      icon: TrendingUp,
      value: indicators.economic_growth,
      prev: previousIndicators?.economic_growth
    },
    {
      key: 'government_budget' as const,
      label: 'Government Budget',
      icon: DollarSign,
      value: indicators.government_budget,
      prev: previousIndicators?.government_budget
    },
    {
      key: 'people_welfare' as const,
      label: 'People Welfare',
      icon: Users,
      value: indicators.people_welfare,
      prev: previousIndicators?.people_welfare
    },
    {
      key: 'public_trust' as const,
      label: 'Public Trust',
      icon: ShieldCheck,
      value: indicators.public_trust,
      prev: previousIndicators?.public_trust
    },
    {
      key: 'environmental_quality' as const,
      label: 'Environmental Quality',
      icon: Leaf,
      value: indicators.environmental_quality,
      prev: previousIndicators?.environmental_quality
    },
    {
      key: 'transparency' as const,
      label: 'Transparency',
      icon: Eye,
      value: indicators.transparency,
      prev: previousIndicators?.transparency
    }
  ];

  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        {list.map((item) => {
          const Icon = item.icon;
          const diff = item.prev !== undefined ? item.value - item.prev : 0;
          return (
            <div key={item.key} className="flex flex-col p-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className={`p-1.5 rounded-lg ${getIndicatorBgColor(item.value)}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-400 truncate">{item.label}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{item.value}</span>
                {diff !== 0 && (
                  <span className={`text-xs font-bold ${diff > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {diff > 0 ? `+${diff}` : diff}
                  </span>
                )}
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${getIndicatorColor(item.value)}`} 
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={flat ? "w-full" : "w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl p-6"}>
      {!flat && (
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
          <span className="w-2 h-5 bg-indigo-600 rounded-full" />
          City Dashboard Indicators
        </h3>
      )}
      <div className="space-y-4">
        {list.map((item) => {
          const diff = item.prev !== undefined ? item.value - item.prev : 0;
          return (
            <div key={item.key} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 text-sm font-extrabold font-['Nunito'] leading-none">
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 text-sm font-semibold font-['Nunito']">
                    {item.value}
                  </span>
                  {diff !== 0 && (
                    <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded-md ${diff > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                      {diff > 0 ? `+${diff}` : diff}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full h-4 bg-neutral-200 rounded-lg overflow-hidden relative">
                <div 
                  className="h-full rounded-lg transition-all duration-1000 bg-yellow-400"
                  style={{ width: `${item.value}%` }}
                />
                {item.value > 0 && (
                  <div className="absolute left-2 top-[4px] h-[5px] w-6 bg-white/20 rounded-lg" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
