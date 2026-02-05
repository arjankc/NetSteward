import React from 'react';
import { Metrics, MetricType } from '../types';
import { Shield, Globe, Users, Scale, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface MetricDisplayProps {
  metrics: Metrics;
}

const METRIC_CONFIG: Record<MetricType, { label: string; icon: React.ReactNode; color: string }> = {
  stability: { label: 'Stability', icon: <Shield size={16} />, color: '#10b981' }, // Emerald
  openness: { label: 'Openness', icon: <Globe size={16} />, color: '#3b82f6' }, // Blue
  trust: { label: 'Trust', icon: <Users size={16} />, color: '#f59e0b' }, // Amber
  equity: { label: 'Equity', icon: <Scale size={16} />, color: '#8b5cf6' }, // Violet
  innovation: { label: 'Innovation', icon: <Zap size={16} />, color: '#ec4899' }, // Pink
};

export const MetricDisplay: React.FC<MetricDisplayProps> = ({ metrics }) => {
  const data = Object.entries(metrics).map(([key, value]) => ({
    name: key,
    value: value,
    config: METRIC_CONFIG[key as MetricType],
  }));

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-3 md:p-4 shadow-xl">
      <h3 className="text-[10px] md:text-xs uppercase tracking-widest text-slate-300 mb-2 md:mb-3 font-semibold">Global Health Indices</h3>
      
      {/* Mobile: Horizontal Scroll Strip */}
      <div className="flex md:hidden overflow-x-auto space-x-3 pb-2 -mx-3 px-3 scrollbar-hide snap-x">
        {data.map((item) => (
          <div key={item.name} className="snap-center shrink-0 w-[130px] flex flex-col justify-center bg-slate-900/60 p-2.5 rounded border border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5 overflow-hidden">
                <div className={`p-1 rounded-full bg-slate-800 text-slate-200 shrink-0`}>
                  {item.config.icon}
                </div>
                <span className="text-slate-200 text-xs truncate">{item.config.label}</span>
              </div>
              <span className="font-mono text-xs font-bold text-slate-100">{item.value}</span>
            </div>
            
            <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-700 ease-out"
                style={{ width: `${item.value}%`, backgroundColor: item.config.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Chart */}
      <div className="hidden md:block h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis 
              type="category" 
              dataKey="name" 
              tickFormatter={(val) => METRIC_CONFIG[val as MetricType].label}
              tick={{ fill: '#cbd5e1', fontSize: 12 }} 
              width={80}
            />
            <Bar dataKey="value" barSize={12} radius={[0, 4, 4, 0]} background={{ fill: '#1e293b' }}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.config.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};