import React from 'react';
import { Scenario, ScenarioOption } from '../types';
import { AlertTriangle, Server, Globe2, Network, ShieldAlert } from 'lucide-react';
import { playSound } from '../utils/sound';

interface ScenarioCardProps {
  scenario: Scenario;
  onOptionSelect: (option: ScenarioOption) => void;
}

const OrgIcon = ({ org, className }: { org: string; className?: string }) => {
  const size = 24; // Base size prop isn't fully controlling responsiveness in all icons, so we use className
  switch (org) {
    case 'ICANN': return <Server className={`text-blue-400 ${className}`} />;
    case 'APNIC': return <Network className={`text-emerald-400 ${className}`} />;
    case 'IGF': return <Globe2 className={`text-purple-400 ${className}`} />;
    case 'SECURITY': return <ShieldAlert className={`text-red-400 ${className}`} />;
    default: return <AlertTriangle className={`text-amber-400 ${className}`} />;
  }
};

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onOptionSelect }) => {
  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Context Header */}
      <div className="bg-slate-800 border-l-4 border-l-blue-500 border border-slate-700 rounded-r-lg p-4 md:p-6 mb-4 md:mb-6 shadow-lg">
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <div className="pr-2">
            <span className="text-[10px] md:text-xs font-bold text-blue-400 tracking-wider uppercase mb-1 block">
              Incoming Report: {scenario.orgContext}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">{scenario.title}</h2>
          </div>
          <div className="bg-slate-900 p-2 md:p-3 rounded-lg border border-slate-700 shrink-0">
            <OrgIcon org={scenario.orgContext} className="w-6 h-6 md:w-8 md:h-8" />
          </div>
        </div>
        <p className="text-base md:text-lg text-slate-200 leading-relaxed">
          {scenario.description}
        </p>
      </div>

      {/* Decision Matrix */}
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {scenario.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onOptionSelect(option)}
            onMouseEnter={() => playSound('hover')}
            className="group relative flex items-center bg-slate-800 hover:bg-slate-750 border border-slate-600 hover:border-blue-400 rounded-lg p-4 md:p-5 text-left transition-all duration-200 active:scale-[0.98]"
          >
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                {option.text}
              </h3>
              <p className="text-sm text-slate-300 mt-1 leading-snug">
                {option.description}
              </p>
            </div>
            
            {/* Projected Impact Hints (Subtle) - Hidden on very small screens, visible on md */}
            <div className="hidden sm:flex flex-col gap-1 ml-4 opacity-70 group-hover:opacity-100 transition-opacity">
               {option.impacts.map((imp, idx) => (
                 <span key={idx} className={`text-[10px] px-2 py-0.5 rounded uppercase font-mono ${imp.value > 0 ? 'bg-green-900/60 text-green-300' : 'bg-red-900/60 text-red-300'}`}>
                   {imp.metric.slice(0,4)} {imp.value > 0 ? '++' : '--'}
                 </span>
               ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};