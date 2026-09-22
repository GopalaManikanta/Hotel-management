import { IndianRupee, ArrowUpRight, Percent, Building2 } from 'lucide-react';

const RevenueSummary = ({ revenue }) => {
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const targetPercentage = revenue.monthlyTarget > 0 ? Math.round((revenue.totalRevenue / revenue.monthlyTarget) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-indigo-600 shadow-xs">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Revenue Summary</h3>
              <p className="text-xs text-slate-500">Monthly Performance & Occupancy Meter</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-white border border-slate-200 px-2.5 py-1 rounded-full shadow-xs">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            0 Baseline
          </span>
        </div>

        {/* Main Revenue Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <div className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">
              {formatINR(revenue.totalRevenue)}
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                <span>Monthly Target</span>
                <span className="font-semibold text-slate-800">{targetPercentage}% ({formatINR(revenue.monthlyTarget)})</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(targetPercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Occupancy Rate</span>
              <Percent className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
              {revenue.occupancyRate}%
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                <span>Avg Daily Rate (ADR)</span>
                <span className="font-semibold text-slate-800">{formatINR(revenue.averageDailyRate)}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${revenue.occupancyRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown by Room Type */}
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            Revenue Breakdown by Category
          </h4>
          <div className="space-y-2.5">
            {revenue.breakdownByRoomType.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="font-semibold text-slate-700">{item.type}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 font-bold">{item.percentage}%</span>
                  <span className="font-extrabold text-slate-900">{formatINR(item.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueSummary;
