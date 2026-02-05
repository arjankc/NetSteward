import React, { useState, useEffect, useRef } from 'react';
import { GameState, Scenario, ScenarioOption, MetricChange, LogEntry } from './types';
import { SCENARIOS, INITIAL_METRICS, BADGES } from './data/scenarios';
import { MetricDisplay } from './components/MetricDisplay';
import { ScenarioCard } from './components/ScenarioCard';
import { playSound, setGlobalMute } from './utils/sound';
import { 
  Activity, RotateCcw, Award, CheckCircle2, AlertOctagon, ChevronDown, ChevronUp, History,
  ShieldCheck, Cpu, Handshake, Globe2, Scale, Layout, Heart, Zap, UserCheck, Lightbulb, Umbrella, Star, Link, ArrowRight, Volume2, VolumeX
} from 'lucide-react';

const MAX_TURNS = 10;

// Helper to render dynamic icons based on string ID
const BadgeIcon = ({ iconName, className }: { iconName: string; className?: string }) => {
  const icons: Record<string, React.ElementType> = {
    ShieldCheck, Cpu, Handshake, Globe2, Scale, Layout, Heart, Zap, UserCheck, Lightbulb, Umbrella, Star, Link
  };
  const IconComponent = icons[iconName] || Award;
  return <IconComponent className={className} />;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    metrics: { ...INITIAL_METRICS },
    turn: 1,
    maxTurns: MAX_TURNS,
    history: [],
    unlockedBadges: [],
    currentScenarioId: null,
    phase: 'technical',
    isGameOver: false,
  });

  const [feedback, setFeedback] = useState<{ title: string; text: string; impacts: MetricChange[] } | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showMobileLog, setShowMobileLog] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize first scenario
  useEffect(() => {
    if (!gameState.currentScenarioId && !gameState.isGameOver && !showIntro) {
      loadNextScenario();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showIntro, gameState.currentScenarioId]);

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    setGlobalMute(newState);
  };

  const loadNextScenario = () => {
    // Simple logic to progress phases based on turn count
    let nextPhase = gameState.phase;
    if (gameState.turn > 2) nextPhase = 'regional';
    if (gameState.turn > 5) nextPhase = 'policy';
    if (gameState.turn > 8) nextPhase = 'global';

    // Find unused scenarios matching phase
    const usedIds = new Set(gameState.history.map(h => h.title)); // Using title as ID proxy or add ID to log
    const availableScenarios = SCENARIOS.filter(
      s => s.phase === nextPhase && !usedIds.has(s.title) // weak check, but works for linear list
    );
    
    // Fallback if phase exhausted
    const fallbackScenarios = SCENARIOS.filter(s => !usedIds.has(s.title));

    const next = availableScenarios[0] || fallbackScenarios[0];

    if (next) {
      setGameState(prev => ({
        ...prev,
        phase: nextPhase,
        currentScenarioId: next.id
      }));
    } else {
      endGame("Simulation Complete: No more scenarios.");
    }
  };

  const handleOptionSelect = (option: ScenarioOption) => {
    playSound('click');
    
    // 1. Calculate new metrics
    const newMetrics = { ...gameState.metrics };
    let gameOver = false;
    let reason = '';

    option.impacts.forEach(imp => {
      newMetrics[imp.metric] = Math.max(0, Math.min(100, newMetrics[imp.metric] + imp.value));
    });

    // 2. Check Game Over Conditions
    if (newMetrics.stability <= 0) {
      gameOver = true;
      reason = "CRITICAL FAILURE: The internet's core infrastructure has collapsed. Routing has failed globally.";
    } else if (newMetrics.trust <= 0) {
      gameOver = true;
      reason = "LEGITIMACY LOST: Stakeholders have abandoned the governance model. Nations are building separate internets.";
    } else if (newMetrics.openness <= 10) {
      gameOver = true;
      reason = "FRAGMENTATION ERROR: The internet has fractured into closed, censored silos. Global information flow has ceased.";
    } else if (newMetrics.equity <= 10) {
      gameOver = true;
      reason = "DIGITAL DIVIDE COLLAPSE: Extreme inequality has caused developing nations to withdraw from the global network.";
    } else if (gameState.turn >= gameState.maxTurns) {
      gameOver = true;
      reason = "Term limit reached. Reviewing your stewardship legacy.";
    }

    // 3. Check Badges
    const newBadges = [...gameState.unlockedBadges];
    BADGES.forEach(badge => {
      if (!newBadges.includes(badge.id) && badge.condition(newMetrics)) {
        newBadges.push(badge.id);
      }
    });

    if (newBadges.length > gameState.unlockedBadges.length) {
      playSound('badge');
    }

    if (gameOver && gameState.turn < gameState.maxTurns) {
      playSound('failure');
    }

    // 4. Update Log
    const entry: LogEntry = {
      turn: gameState.turn,
      title: SCENARIOS.find(s => s.id === gameState.currentScenarioId)?.title || 'Unknown',
      outcome: option.text,
      impacts: option.impacts
    };

    // 5. Set State & Show Feedback
    setGameState(prev => ({
      ...prev,
      metrics: newMetrics,
      history: [...prev.history, entry],
      unlockedBadges: newBadges,
      isGameOver: gameOver,
      gameOverReason: reason
    }));

    setFeedback({
      title: option.feedbackTitle,
      text: option.feedbackText,
      impacts: option.impacts
    });
  };

  const handleFeedbackDismiss = () => {
    playSound('click');
    setFeedback(null);
    if (!gameState.isGameOver) {
      setGameState(prev => ({
        ...prev,
        turn: prev.turn + 1,
        currentScenarioId: null // Triggers effect to load next
      }));
    } else if (gameState.turn >= gameState.maxTurns) {
      // Delayed success sound for finishing the game
      playSound('success');
    }
  };

  const resetGame = () => {
    playSound('gamestart');
    setGameState({
      metrics: { ...INITIAL_METRICS },
      turn: 1,
      maxTurns: MAX_TURNS,
      history: [],
      unlockedBadges: [],
      currentScenarioId: null,
      phase: 'technical',
      isGameOver: false,
    });
    setFeedback(null);
    setShowIntro(true);
  };

  const startGame = () => {
    playSound('gamestart');
    setShowIntro(false);
  };

  const endGame = (reason: string) => {
    setGameState(prev => ({
      ...prev,
      isGameOver: true,
      gameOverReason: reason
    }));
  };

  const currentScenario = SCENARIOS.find(s => s.id === gameState.currentScenarioId);

  // --- RENDER HELPERS ---

  if (showIntro) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-y-auto font-sans selection:bg-blue-500/30">
        <div className="absolute top-4 right-4 z-50">
           <button onClick={toggleMute} className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-900/50 rounded-full">
             {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
           </button>
        </div>
        
        <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-10 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
          
          <div className="text-center mb-8 md:mb-10 mt-4">
            <div className="inline-flex items-center justify-center p-4 bg-slate-800/50 rounded-2xl mb-6 ring-1 ring-slate-700/50 shadow-lg backdrop-blur-sm">
              <Activity className="text-blue-500 w-10 h-10 md:w-12 md:h-12" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
              Net<span className="text-blue-500">Steward</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto font-medium">
              The year is 2027. The digital world is fracturing.<br className="hidden md:block"/> You are the last line of defense.
            </p>
          </div>

          <div className="space-y-8 mb-10">
            {/* Mission Section */}
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
              <h3 className="text-blue-400 font-bold uppercase tracking-wider text-xs md:text-sm mb-3 flex items-center gap-2">
                <Globe2 size={16} /> Mission Profile
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                As the newly appointed <strong>Global Internet Steward</strong>, you must navigate technical crises, geopolitical tensions, and corporate greed to keep the internet <strong>global, open, and secure</strong>.
              </p>
            </div>

            {/* How to Play Grid */}
            <div>
               <h3 className="text-slate-500 font-bold uppercase tracking-wider text-xs md:text-sm mb-4 text-center">How to Play</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700/50 flex flex-col items-center text-center hover:bg-slate-800 transition-colors">
                    <div className="bg-slate-900 p-3 rounded-lg mb-3 text-emerald-400 shadow-inner">
                      <Scale size={24} />
                    </div>
                    <h4 className="text-white font-bold mb-2">Make Choices</h4>
                    <p className="text-xs text-slate-400 leading-snug">Resolve scenarios involving ICANN, ISPs, and governments.</p>
                  </div>
                  
                  <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700/50 flex flex-col items-center text-center hover:bg-slate-800 transition-colors">
                    <div className="bg-slate-900 p-3 rounded-lg mb-3 text-amber-400 shadow-inner">
                      <Activity size={24} />
                    </div>
                    <h4 className="text-white font-bold mb-2">Watch Metrics</h4>
                    <p className="text-xs text-slate-400 leading-snug">Balance Stability, Openness, Trust, Equity, and Innovation.</p>
                  </div>

                  <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700/50 flex flex-col items-center text-center hover:bg-slate-800 transition-colors">
                    <div className="bg-slate-900 p-3 rounded-lg mb-3 text-red-400 shadow-inner">
                      <AlertOctagon size={24} />
                    </div>
                    <h4 className="text-white font-bold mb-2">Avoid Collapse</h4>
                    <p className="text-xs text-slate-400 leading-snug">If any metric drops to zero, the global internet collapses.</p>
                  </div>
               </div>
            </div>
          </div>

          <button 
            onClick={startGame}
            onMouseEnter={() => playSound('hover')}
            className="group w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-3"
          >
             Initialize Simulation <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3">
            <Activity className="text-blue-500 w-5 h-5 md:w-6 md:h-6" />
            <span className="font-bold text-base md:text-lg tracking-tight">NetSteward</span>
          </div>
          <div className="flex items-center space-x-3 md:space-x-4">
             {/* Mute Button Desktop/Header */}
             <button onClick={toggleMute} className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors rounded-full hover:bg-slate-800">
               {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
             </button>

            <div className="text-[10px] md:text-xs font-mono text-slate-300">
              TURN {gameState.turn}/{gameState.maxTurns}
            </div>
            <div className="h-4 w-px bg-slate-700"></div>
            <div className="flex space-x-1">
              {gameState.unlockedBadges.length > 0 ? (
                gameState.unlockedBadges.map(b => (
                  <Award key={b} className="text-yellow-500 w-4 h-4" />
                ))
              ) : (
                <span className="text-[10px] text-slate-600 italic hidden md:inline">No Badges</span>
              )}
              {gameState.unlockedBadges.length === 0 && (
                 <Award className="text-slate-700 w-4 h-4 md:hidden" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-3 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Left Col: Metrics & Log */}
        <div className="lg:col-span-1 order-1 flex flex-col gap-4 md:gap-6">
          <MetricDisplay metrics={gameState.metrics} />
          
          {/* Mobile Log Toggle */}
          <button 
            onClick={() => {
              playSound('click');
              setShowMobileLog(!showMobileLog);
            }}
            className="lg:hidden flex items-center justify-center space-x-2 w-full py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-slate-200 transition-colors active:bg-slate-700"
          >
            <History size={16} />
            <span>{showMobileLog ? 'Hide History' : 'Show History'}</span>
            {showMobileLog ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* Log Container */}
          <div className={`${showMobileLog ? 'block' : 'hidden'} lg:block bg-slate-800/50 border border-slate-700 rounded-lg p-3 md:p-4 max-h-[250px] md:max-h-[300px] overflow-y-auto scrollbar-hide`}>
             <h3 className="text-[10px] md:text-xs uppercase tracking-widest text-slate-300 mb-2 md:mb-3 font-semibold sticky top-0 bg-slate-800 pb-2 border-b border-slate-700/50">Log</h3>
             <div className="space-y-2 md:space-y-3">
                {gameState.history.slice().reverse().map((entry, i) => (
                  <div key={i} className="text-sm border-l-2 border-slate-600 pl-3 py-1">
                    <div className="font-semibold text-slate-200 text-xs md:text-sm">{entry.title}</div>
                    <div className="text-slate-300 text-[10px] md:text-xs italic">"{entry.outcome}"</div>
                  </div>
                ))}
                {gameState.history.length === 0 && <span className="text-slate-400 text-xs md:text-sm">System initialized...</span>}
             </div>
          </div>
        </div>

        {/* Right Col: Scenario / Game Over */}
        <div className="lg:col-span-2 order-2 pb-8">
          {gameState.isGameOver ? (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 md:p-8 text-center animate-in zoom-in-95 duration-500 shadow-2xl">
              <div className="mb-6 flex justify-center">
                 {gameState.metrics.stability > 0 && 
                  gameState.metrics.trust > 0 && 
                  gameState.metrics.openness > 10 && 
                  gameState.metrics.equity > 10 ? (
                    <CheckCircle2 className="w-16 h-16 md:w-20 md:h-20 text-emerald-500" />
                 ) : (
                    <AlertOctagon className="w-16 h-16 md:w-20 md:h-20 text-red-500" />
                 )}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Simulation Ended</h2>
              <p className="text-slate-200 text-base md:text-lg mb-8 max-w-lg mx-auto leading-relaxed">{gameState.gameOverReason}</p>
              
              <div className="mb-8">
                <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                  <Award className="text-yellow-500" /> Achievements Unlocked
                </h3>
                <div className="grid grid-cols-1 gap-3 md:gap-4 text-left">
                   {gameState.unlockedBadges.map(badgeId => {
                      const b = BADGES.find(x => x.id === badgeId);
                      return (
                        <div key={badgeId} className="bg-slate-700/40 p-3 md:p-4 rounded-xl flex items-start space-x-4 border border-slate-600 hover:bg-slate-700/60 transition-colors">
                          <div className="bg-slate-800 p-2 md:p-3 rounded-full shrink-0 border border-slate-600">
                            <BadgeIcon iconName={b?.icon || 'Award'} className="text-yellow-400 w-5 h-5 md:w-6 md:h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm md:text-md">{b?.name}</h4>
                            <p className="text-slate-200 text-xs md:text-sm mt-1 leading-snug">{b?.description}</p>
                          </div>
                        </div>
                      )
                   })}
                   {gameState.unlockedBadges.length === 0 && (
                     <div className="bg-slate-800/50 p-6 rounded-xl border border-dashed border-slate-600 text-slate-400 italic text-center text-sm">
                       No specific badges earned this term. Try focusing on extreme metrics next time (like 80+ Stability)!
                     </div>
                   )}
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 md:p-5 mb-8 text-left">
                <p className="text-blue-100 text-xs md:text-sm leading-relaxed">
                  <span className="font-bold block mb-1 text-blue-300">💡 Curator's Note:</span> 
                  Internet governance is about balancing trade-offs. A stable internet might be restrictive; an open one might be chaotic. 
                  Play again to explore how different philosophies—like prioritizing <strong>Innovation</strong> over <strong>Security</strong>—reshape the digital world.
                </p>
              </div>

              <button 
                onClick={resetGame}
                onMouseEnter={() => playSound('hover')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 mx-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 md:py-4 rounded-full font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <RotateCcw size={20} />
                <span>Start New Simulation</span>
              </button>
            </div>
          ) : currentScenario ? (
            <ScenarioCard 
              scenario={currentScenario} 
              onOptionSelect={handleOptionSelect} 
            />
          ) : (
             <div className="flex items-center justify-center h-64">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
             </div>
          )}
        </div>
      </main>

      {/* Feedback Overlay */}
      {feedback && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-600 w-full max-w-lg rounded-xl shadow-2xl p-5 md:p-6 transform transition-all animate-in scale-95 overflow-y-auto max-h-[85vh]">
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">{feedback.title}</h3>
            <p className="text-slate-200 mb-6 text-sm md:text-base leading-relaxed">{feedback.text}</p>
            
            <div className="bg-slate-900/50 rounded p-3 md:p-4 mb-6 grid grid-cols-2 gap-3">
              {feedback.impacts.map((imp, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs md:text-sm bg-slate-800/50 p-2 rounded">
                  <span className="capitalize text-slate-300">{imp.metric}</span>
                  <span className={`font-mono font-bold ${imp.value > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {imp.value > 0 ? '+' : ''}{imp.value}
                  </span>
                </div>
              ))}
            </div>

            <button 
              onClick={handleFeedbackDismiss}
              onMouseEnter={() => playSound('hover')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors active:scale-[0.98]"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;