import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5ece5] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-soft border border-white/50">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-[#111111] p-4 rounded-[1.5rem] mb-6">
            <ShieldCheck className="h-10 w-10 text-[#f15a24]" />
          </div>
          <h1 className="text-3xl font-black text-[#1e293b]">Gateway Admin</h1>
          <p className="text-slate-400 font-bold text-sm tracking-tight mt-2">Sign in to your security dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-2xl flex items-center gap-3 text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-xs font-black uppercase tracking-wider">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="email" 
                required
                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-semibold focus:ring-2 focus:ring-[#f15a24]/20 transition-all"
                placeholder="admin@gateway.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="password" 
                required
                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-6 py-4 text-sm font-semibold focus:ring-2 focus:ring-[#f15a24]/20 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#111111] text-white rounded-2xl py-4 font-black uppercase tracking-widest text-xs hover:bg-[#222222] transition-all shadow-lg hover:shadow-xl active:scale-[0.98] mt-4"
          >
            Enter Dashboard
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-slate-50 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Protected by SHA-256 Multi-Layer Security
          </p>
        </div>
      </div>
    </div>
  );
}
