import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Zap, AlertCircle, Search, Calendar, MoreHorizontal, CheckCircle2, Clock } from 'lucide-react';
import StatCard from '../components/StatCard';
import { ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from 'recharts';
import io from 'socket.io-client';
import { cn } from '../lib/utils';

const mockAuditLogs = [
  { name: 'Index web dev', manager: 'Om prakash', date: 'May 20, 2023', status: 'Completed', progress: 100 },
  { name: 'Datascale AI app', manager: 'Nelson mande', date: 'Jun 15, 2023', status: 'In progress', progress: 65 },
  { name: 'Media channel', manager: 'Tnuasly priya', date: 'July 13, 2023', status: 'In list', progress: 30 },
  { name: 'Corsec iOS app', manager: 'Mathu hannary', date: 'Dec 20, 2023', status: 'Completed', progress: 100 },
];

import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const workloadData = [
  { day: 'Mon', count: 2 },
  { day: 'Tues', count: 3 },
  { day: 'Wed', count: 1 },
  { day: 'Thurs', count: 5 },
  { day: 'Fri', count: 4 },
  { day: 'Sat', count: 2 },
  { day: 'Sun', count: 1 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRequests: '0',
    projects: '0',
    failures: '0',
    uptime: '100%'
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, logsRes] = await Promise.all([
          axios.get('http://localhost:4000/admin/stats'),
          axios.get('http://localhost:4000/admin/logs')
        ]);
        setStats(statsRes.data);
        setLogs(logsRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
    const socket = io('http://localhost:4000');
    
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-10 max-w-[1600px] mx-auto bg-[#f5ece5] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-[#1e293b]">Dashboard</h1>
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search for anything..."
              className="bg-white rounded-full pl-12 pr-6 py-3 w-80 text-sm focus:outline-none shadow-sm border border-slate-100"
            />
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-50">
            <div className="h-8 w-8 rounded-full bg-[#f15a24]/10 flex items-center justify-center text-[#f15a24]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 leading-none">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{user?.role || 'Guest'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-end">
        <h2 className="text-2xl font-bold text-slate-800">Overview</h2>
        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-xs font-bold shadow-sm text-slate-600">
          Last 30 days <Calendar className="h-4 w-4" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        <StatCard title="Total Traffic" value={stats.totalRequests} icon={Activity} trend="up" trendValue="15" color="blue" />
        <StatCard title="Owned Keys" value={stats.projects} icon={Key} trend="up" trendValue="05" color="orange" />
        <StatCard title="Blocked Attacks" value={stats.failures} icon={ShieldCheck} trend="down" trendValue="02" color="red" />
        <StatCard title="System Uptime" value={stats.uptime} icon={Zap} trend="up" trendValue="0.1" color="green" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Project Summary */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-soft">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-800">Project summary</h3>
              <div className="flex gap-2">
                <button className="text-xs font-bold text-slate-400 px-3 py-1 border border-slate-100 rounded-lg">Project</button>
                <button className="text-xs font-bold text-slate-400 px-3 py-1 border border-slate-100 rounded-lg">Project manager</button>
                <button className="text-xs font-bold text-slate-400 px-3 py-1 border border-slate-100 rounded-lg">Status</button>
              </div>
            </div>
            
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-slate-400 border-b border-slate-50">
                  <th className="pb-4">Endpoint</th>
                  <th className="pb-4">Method</th>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Outcome</th>
                  <th className="pb-4 text-center">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.map((log, i) => (
                  <tr key={log._id || i} className="text-sm font-semibold text-slate-700">
                    <td className="py-5 font-mono text-[10px]">{log.url}</td>
                    <td className="py-5">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] uppercase font-black",
                        log.method === 'GET' ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                      )}>
                        {log.method}
                      </span>
                    </td>
                    <td className="py-5 text-slate-400 text-[11px] font-bold">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                        log.status < 400 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      )}>
                        {log.status < 400 ? 'Verified' : 'Blocked'}
                      </span>
                    </td>
                    <td className="py-5">
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex-1 max-w-[60px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full", log.status < 400 ? "bg-green-500" : "bg-red-500")}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold">{log.duration}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-slate-400 text-xs italic">
                      No traffic data available. Send a request through the gateway to see logs.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Today Tasks */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-soft">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-800">Today task</h3>
              <div className="flex gap-4 text-xs font-bold text-slate-400">
                <span className="text-[#f15a24] border-b-2 border-[#f15a24] pb-1">All</span>
                <span>Important</span>
                <span>Notes</span>
                <span>Links</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { title: 'Create a user flow of social application design', status: 'Approved', color: 'bg-green-100 text-green-600' },
                { title: 'Create a user flow of social application design', status: 'In review', color: 'bg-red-100 text-red-600' },
                { title: 'Landing page design for Fintech project of singapore', status: 'In review', color: 'bg-red-100 text-red-600' },
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between p-1">
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-[#f15a24]" />
                    <span className="text-sm font-semibold text-slate-600">{task.title}</span>
                  </div>
                  <span className={cn("px-3 py-1 rounded-lg text-[10px] font-bold", task.color)}>{task.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Overall Progress */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-soft flex flex-col items-center">
             <div className="w-full flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Overall Progress</h3>
                <button className="text-xs font-bold text-slate-400 border border-slate-100 px-3 py-1 rounded-lg">All</button>
             </div>
             
             <div className="relative h-64 w-full flex items-center justify-center">
                <div className="text-center absolute z-10">
                  <p className="text-5xl font-black text-slate-900">72%</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Completed</p>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: 72 }, { value: 28 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      startAngle={180}
                      endAngle={0}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      <Cell fill="#f15a24" stroke="none" />
                      <Cell fill="#f5f5f5" stroke="none" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
             </div>

             <div className="grid grid-cols-4 w-full gap-4 mt-4">
                {[
                  { label: "Total projects", value: 95, color: "text-slate-900" },
                  { label: "Completed", value: 26, color: "text-green-500" },
                  { label: "Delayed", value: 35, color: "text-orange-500" },
                  { label: "On going", value: 35, color: "text-red-500" }
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <p className={cn("text-lg font-black", item.color)}>{item.value}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase leading-tight mt-1">{item.label}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* Workload */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-soft">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-slate-800">Projects Workload</h3>
              <button className="text-xs font-bold text-slate-400 border border-slate-100 px-3 py-1 rounded-lg">Last 3 months</button>
            </div>
            
            <div className="h-64 mt-4">
               <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                    <XAxis dataKey="day" name="Day" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis dataKey="count" name="Workload" hide />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Workload" data={workloadData} fill="#f15a24">
                       {workloadData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.count >= 4 ? '#f15a24' : '#1e293b'} />
                       ))}
                    </Scatter>
                  </ScatterChart>
               </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
