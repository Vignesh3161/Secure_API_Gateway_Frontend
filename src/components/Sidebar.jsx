import React from 'react';
import { 
  LayoutDashboard, 
  Key, 
  History, 
  AlertTriangle, 
  ShieldCheck,
  PlusCircle,
  Settings,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'API Keys', icon: Key, path: '/keys', roles: ['ADMIN'] },
  { name: 'Audit Logs', icon: History, path: '/logs' },
  { name: 'Alerts', icon: AlertTriangle, path: '/alerts' },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen w-64 flex-col bg-[#111111] text-white">
      {/* Brand logo */}
      <div className="flex h-20 items-center px-8">
        <div className="bg-[#f15a24] p-1.5 rounded-full mr-3">
          <ShieldCheck className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">Promage</span>
      </div>
      
      {/* Action Button - Only for Admin */}
      {user?.role === 'ADMIN' && (
        <div className="px-5 mb-8">
          <Link 
            to="/keys"
            className="flex items-center justify-center w-full bg-white/10 hover:bg-white/20 text-white rounded-full py-3.5 px-4 transition-all group"
          >
            <div className="bg-[#f15a24] rounded-full p-1 mr-3 group-hover:scale-110 transition-transform">
              <PlusCircle className="h-4 w-4" />
            </div>
            <span className="font-semibold text-sm">Generate Key</span>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          if (item.roles && !item.roles.includes(user?.role)) return null;
          
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center rounded-2xl px-5 py-3.5 text-sm font-medium transition-all group",
                isActive 
                  ? "bg-white text-black shadow-lg" 
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("mr-4 h-5 w-5", isActive ? "text-[#f15a24]" : "text-slate-500")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-white/5">
        <div className="bg-white/5 rounded-2xl p-4 mb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-[#f15a24]/20 flex items-center justify-center text-[#f15a24]">
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate leading-none">{user?.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-[10px] font-black uppercase tracking-widest w-full px-1"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout Session
          </button>
        </div>
        
        <Link 
          to="/settings"
          className="flex items-center text-slate-500 hover:text-white transition-colors text-xs font-medium px-4 py-2"
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Link>
      </div>
    </div>
  );
}
