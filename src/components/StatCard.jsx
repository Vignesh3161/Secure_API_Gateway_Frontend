import React from 'react';
import { cn } from '../lib/utils';

export default function StatCard({ title, value, icon: Icon, trend, trendValue, color }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    red: "text-red-600 bg-red-100",
    purple: "text-purple-600 bg-purple-100",
    yellow: "text-orange-600 bg-orange-100",
  };

  return (
    <div className="bg-white rounded-[2rem] p-7 shadow-soft border border-slate-100/50">
      <div className="flex items-center justify-between mb-8">
        <div className={cn("p-3 rounded-2xl", colorMap[color] || colorMap.blue)}>
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <div className="flex flex-col items-end">
            <span className={cn(
              "text-xs font-bold px-3 py-1 rounded-full",
              trend === 'up' ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
            )}>
              {trend === 'up' ? '▲' : '▼'} {trendValue}%
            </span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-slate-400 text-sm font-semibold mb-2 tracking-tight">{title}</h3>
        <p className="text-slate-900 text-3xl font-extrabold flex items-center">
          {value}
          {trend && (
            <span className="text-[10px] text-slate-400 font-medium ml-2 uppercase">
              vs last month
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
