import Layout from '../components/Layout';
import { Settings } from 'lucide-react';

const SystemSettings = () => {
  return (
    <Layout>
      <div className="bg-white min-h-[70vh] flex flex-col items-center justify-center text-center p-8 border border-slate-200 rounded-3xl shadow-xs">
        <div className="p-4 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 mb-3">
          <Settings className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-slate-500 text-xs mt-1.5 max-w-sm">
          This page is empty. No system settings or configuration actions are active.
        </p>
      </div>
    </Layout>
  );
};

export default SystemSettings;
