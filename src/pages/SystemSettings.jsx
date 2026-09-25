import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useHotel } from '../context/HotelContext';
import {
  Building2,
  Receipt,
  Sliders,
  ShieldCheck,
  Database,
  Save,
  RefreshCw,
  CheckCircle2,
  Clock,
  Lock,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Server
} from 'lucide-react';

const SystemSettings = () => {
  const { settings, updateSettings, rooms, guests, bookings } = useHotel();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({ ...settings });

  // Sync form state when settings context changes
  useEffect(() => {
    if (settings) {
      setFormData({ ...settings });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const tabs = [
    { id: 'profile', label: 'Hotel Profile & Brand', icon: Building2 },
    { id: 'financial', label: 'GST & Financial Config', icon: Receipt },
    { id: 'automation', label: 'Automated Operations', icon: Sliders },
    { id: 'security', label: 'Security & Privileges', icon: ShieldCheck },
    { id: 'maintenance', label: 'Maintenance & System Health', icon: Database }
  ];

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                Enterprise Config
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <CheckCircle2 className="w-3 h-3" /> System Operational
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">System Settings</h1>
            <p className="text-slate-500 text-xs mt-0.5">
              Manage enterprise hotel details, GST invoicing rules, automation parameters, and system health.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...settings })}
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Discard Changes
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" /> Save Configuration
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TAB 1: HOTEL PROFILE & BRAND */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-700" />
                  Hotel Profile & Brand Identity
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  General hotel information displayed on guest invoices, check-in vouchers, and receipts.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Hotel Property Name</label>
                  <input
                    type="text"
                    name="hotelName"
                    value={formData.hotelName || ''}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold text-slate-900"
                    placeholder="e.g. Celestia Grand Luxury Hotel"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Brand Tagline / Slogan</label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline || 'Excellence in Hospitality & Luxury Stays'}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
                    placeholder="e.g. Premier Hospitality Suite"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Primary Contact Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Front Desk Phone Line
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Physical Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Standard Check-In Time
                  </label>
                  <input
                    type="text"
                    name="standardCheckInTime"
                    value={formData.standardCheckInTime || '12:00 PM'}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Standard Check-Out Time
                  </label>
                  <input
                    type="text"
                    name="standardCheckOutTime"
                    value={formData.standardCheckOutTime || '11:00 AM'}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GST & FINANCIAL CONFIG */}
          {activeTab === 'financial' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-slate-700" />
                  GST Taxation & Financial Configuration
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Tax registration numbers, HSN code classification, and tax percentages applied to invoices.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">GSTIN Registration Number</label>
                  <input
                    type="text"
                    name="gstin"
                    value={formData.gstin || ''}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl font-mono text-slate-900 uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-slate-900 font-bold"
                    placeholder="36AAACC1234H1Z5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">HSN / SAC Code (Accommodation)</label>
                  <input
                    type="text"
                    name="hsnSacCode"
                    value={formData.hsnSacCode || '996311'}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold"
                    placeholder="996311"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">CGST Rate (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="taxRateCGST"
                      value={formData.taxRateCGST ?? 6}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-bold"
                      min="0"
                      max="28"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Central Goods and Services Tax</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">SGST Rate (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="taxRateSGST"
                      value={formData.taxRateSGST ?? 6}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-bold"
                      min="0"
                      max="28"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">State Goods and Services Tax</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Active Currency</label>
                  <select
                    name="currencySymbol"
                    value={formData.currencySymbol || '₹ (INR)'}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-800 font-semibold"
                  >
                    <option value="₹ (INR)">₹ (INR) - Indian Rupee</option>
                    <option value="$ (USD)">$ (USD) - US Dollar</option>
                    <option value="€ (EUR)">€ (EUR) - Euro</option>
                    <option value="£ (GBP)">£ (GBP) - British Pound</option>
                  </select>
                </div>
              </div>

              {/* Tax Summary Preview Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">Total Effective Tax Rate</span>
                  <p className="text-[11px] text-slate-500">CGST ({formData.taxRateCGST || 6}%) + SGST ({formData.taxRateSGST || 6}%)</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-slate-900">
                    {(Number(formData.taxRateCGST || 6) + Number(formData.taxRateSGST || 6)).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUTOMATED OPERATIONS */}
          {activeTab === 'automation' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-slate-700" />
                  Automated Operations & Workflow Rules
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Configure automated triggers for key card generation, housekeeping alerts, and notifications.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                      Auto Key-Card Number Generation
                    </span>
                    <p className="text-xs text-slate-500">
                      Automatically generate digital key card access codes (e.g. KEY-9012) upon Express Check-In.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="autoKeyCardIssuance"
                    checked={formData.autoKeyCardIssuance ?? true}
                    onChange={handleChange}
                    className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900 cursor-pointer mt-1"
                  />
                </div>

                <div className="flex items-start justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 text-slate-700" />
                      Auto Housekeeping Status Update
                    </span>
                    <p className="text-xs text-slate-500">
                      Automatically mark room status as "Needs Cleaning" immediately when guest checks out.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="autoRoomCleaningStatus"
                    checked={formData.autoRoomCleaningStatus ?? true}
                    onChange={handleChange}
                    className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900 cursor-pointer mt-1"
                  />
                </div>

                <div className="flex items-start justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-700" />
                      Automated Email Invoices & Confirmation
                    </span>
                    <p className="text-xs text-slate-500">
                      Send automated tax invoices and check-in confirmation receipts to guest email.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={formData.emailNotifications ?? true}
                    onChange={handleChange}
                    className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900 cursor-pointer mt-1"
                  />
                </div>

                <div className="flex items-start justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-700" />
                      SMS Alerts & Mobile Reminders
                    </span>
                    <p className="text-xs text-slate-500">
                      Send instant SMS booking updates and check-out reminders to guest mobile number.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={formData.smsNotifications ?? true}
                    onChange={handleChange}
                    className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900 cursor-pointer mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & PRIVILEGES */}
          {activeTab === 'security' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-700" />
                  Security Roles & System Privileges
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Active session status, multi-factor authentication, and security audit settings.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Admin User Role</span>
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                    <Lock className="w-4 h-4 text-slate-700" />
                    General Manager / Front Desk SuperAdmin
                  </div>
                  <p className="text-[11px] text-slate-500">Full read/write permissions for all operational modules.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Two-Factor Authentication</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Enforced (Active)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">OTP required for managerial overrides & reset actions.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Session Idle Timeout</span>
                  <div className="text-sm font-bold text-slate-900">30 Minutes</div>
                  <p className="text-[11px] text-slate-500">Automatic logout after inactivity to prevent unauthorized access.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Security Audit Log</span>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-emerald-600" /> Enabled & Monitored
                  </div>
                  <p className="text-[11px] text-slate-500">All room edits, check-ins, and payments are logged.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MAINTENANCE & HEALTH */}
          {activeTab === 'maintenance' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-700" />
                  System Maintenance & Data Persistence
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Inspect active local data storage statistics and memory indicators.
                </p>
              </div>

              {/* Data Persistence Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <span className="text-2xl font-black text-slate-900">{rooms?.length || 0}</span>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">Rooms Configured</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <span className="text-2xl font-black text-slate-900">{guests?.length || 0}</span>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">Guests Registered</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <span className="text-2xl font-black text-slate-900">{bookings?.length || 0}</span>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">Active Bookings</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Bar at Bottom */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-medium">
              Changes apply instantly across all active modules.
            </span>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" /> Save System Settings
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default SystemSettings;
