import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend = 'up', trendValue, color = 'indigo', description }) => {
  const colorMap = {
    indigo: {
      iconBg: 'bg-indigo-50 border-indigo-100 text-indigo-600',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      barBg: 'bg-indigo-600'
    },
    emerald: {
      iconBg: 'bg-emerald-50 border-emerald-100 text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      barBg: 'bg-emerald-600'
    },
    amber: {
      iconBg: 'bg-amber-50 border-amber-100 text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      barBg: 'bg-amber-500'
    },
    purple: {
      iconBg: 'bg-purple-50 border-purple-100 text-purple-600',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      barBg: 'bg-purple-600'
    },
    rose: {
      iconBg: 'bg-rose-50 border-rose-100 text-rose-600',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      barBg: 'bg-rose-500'
    },
    sky: {
      iconBg: 'bg-sky-50 border-sky-100 text-sky-600',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      barBg: 'bg-sky-500'
    }
  };

  const currentTheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden transition-all duration-300 hover:border-slate-300 hover:-translate-y-1 hover:shadow-md group flex flex-col justify-between">
      {/* Top Accent Indicator */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${currentTheme.barBg} opacity-80 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5 tracking-tight group-hover:text-indigo-950 transition-colors">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className={`p-3 rounded-2xl border ${currentTheme.iconBg} group-hover:scale-110 transition-transform duration-300 shadow-xs`}>
            <Icon className="w-5 h-5 stroke-[2.5]" />
          </div>
        )}
      </div>

      {(trendValue || description) && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
          {description && (
            <span className="text-slate-500 text-[11px] font-medium truncate">{description}</span>
          )}

          {trendValue && (
            <span className={`inline-flex items-center gap-1 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] border shadow-2xs ${currentTheme.badgeBg}`}>
              {trend === 'up' ? (
                <TrendingUp className="w-3 h-3 text-emerald-600" />
              ) : (
                <TrendingDown className="w-3 h-3 text-rose-600" />
              )}
              {trendValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
