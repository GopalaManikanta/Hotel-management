import Layout from '../components/Layout';
import { Utensils } from 'lucide-react';

const DiningServices = () => {
  return (
    <Layout>
      <div className="bg-white min-h-[70vh] flex flex-col items-center justify-center text-center p-8 border border-slate-200 rounded-3xl shadow-xs">
        <div className="p-4 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 mb-3">
          <Utensils className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dining & Services</h1>
        <p className="text-slate-500 text-xs mt-1.5 max-w-sm">
          This page is empty. No room service or dining order functions are active.
        </p>
      </div>
    </Layout>
  );
};

export default DiningServices;
