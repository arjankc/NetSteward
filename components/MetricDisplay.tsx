import React from 'react';
import { Metrics, MetricType } from '../types';
import { Shield, Globe, Users, Scale, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface MetricDisplayProps {
  metrics: Metrics;
}

const METRIC_CONFIG: Record<MetricType, { label: string; icon: React.ReactNode; color: string }> = {
  stability: { label: 'Stability', icon: <Shield size={18} />, color: '#10b981' }, // Emerald
  openness: { label: 'Openness', icon: <Globe size={18} />, color: '#3b82f6' }, // Blue
  trust: { label: 'Trust', icon: <Users size={18} />, color: '#f59e0b' }, // Amber
  equity: { label: 'Equity', icon: <Scale size={18} />, color: '#8b5cf6' }, // Violet
  innovation: { label: 'Innovation', icon: <Zap size={18} />, color: '#ec4899' }, // Pink
};

export const MetricDisplay: React.FC<MetricDisplayProps> = ({ metrics }) => {
  const data = Object.entries(metrics).map(([key, value]) => ({
    name: key,
    value: value,
    config: METRIC_CONFIG[key as MetricType],
  }));

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 shadow-xl">
      <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-3 font-semibold">Global Health Indices</h3>
      
      {/* Mobile/Compact View: 2-Column Grid */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {data.map((item) => (
          <div key={item.name} className="flex items-center space-x-2 bg-slate-900/40 p-2 rounded border border-slate-700/50">
            <div className={`p-1.5 rounded-full bg-slate-800 text-slate-200 shrink-0`}>
              {item.config.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 truncate mr-1">{item.config.label}</span>
                <span className="font-mono">{item.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-700 ease-out"
                  style={{ width: `${item.value}%`, backgroundColor: item.config.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Chart */}
      <div className="hidden md:block h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis 
              type="category" 
              dataKey="name" 
              tickFormatter={(val) => METRIC_CONFIG[val as MetricType].label}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
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