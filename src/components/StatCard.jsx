import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'indigo', description }) => {
  const colorMap = {
    indigo: {
      iconText: 'text-indigo-600',
      badgeBg: 'bg-white text-indigo-700 border-indigo-200'
    },
    emerald: {
      iconText: 'text-emerald-600',
      badgeBg: 'bg-white text-emerald-700 border-emerald-200'
    },
    amber: {
      iconText: 'text-amber-600',
      badgeBg: 'bg-white text-amber-700 border-amber-200'
    },
    purple: {
      iconText: 'text-purple-600',
      badgeBg: 'bg-white text-purple-700 border-purple-200'
    },
    rose: {
      iconText: 'text-rose-600',
      badgeBg: 'bg-white text-rose-700 border-rose-200'
    },
    sky: {
      iconText: 'text-sky-600',
      badgeBg: 'bg-white text-sky-700 border-sky-200'
    }
  };

  const currentTheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden transition-all hover:border-indigo-400 hover:shadow-md group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className={`p-3 rounded-2xl bg-white border border-slate-200 ${currentTheme.iconText} group-hover:scale-105 transition-transform shadow-xs`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(trendValue || description) && (
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
          {description && (
            <span className="text-slate-500 text-[11px] truncate">{description}</span>
          )}

          {trendValue && (
            <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full text-[10px] border ${currentTheme.badgeBg}`}>
              {trend === 'up' ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
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
