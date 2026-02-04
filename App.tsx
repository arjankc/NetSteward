import React, { useState, useEffect, useRef } from 'react';
import { GameState, Scenario, ScenarioOption, MetricChange, LogEntry } from './types';
import { SCENARIOS, INITIAL_METRICS, BADGES } from './data/scenarios';
import { MetricDisplay } from './components/MetricDisplay';
import { ScenarioCard } from './components/ScenarioCard';
import { 
  Activity, RotateCcw, Award, CheckCircle2, AlertOctagon, ChevronDown, ChevronUp, History,
  ShieldCheck, Cpu, Handshake, Globe2, Scale, Layout, Heart, Zap, UserCheck, Lightbulb, Umbrella, Star, Link
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

  // Initialize first scenario
  useEffect(() => {
    if (!gameState.currentScenarioId && !gameState.isGameOver && !showIntro) {
      loadNextScenario();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showIntro, gameState.currentScenarioId]);

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
    setFeedback(null);
    if (!gameState.isGameOver) {
      setGameState(prev => ({
        ...prev,
        turn: prev.turn + 1,
        currentScenarioId: null // Triggers effect to load next
      }));
    }
  };

  const resetGame = () => {
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 overflow-y-auto">
        <div className="max-w-2xl bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 text-center my-8">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-500/20 p-4 rounded-full">
              <Activity className="text-blue-400 w-16 h-16" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">NetSteward</h1>
          <p className="text-xl text-slate-300 mb-8">
            The year is 2027. You have been appointed as the Global Internet Steward.
            Your job is to coordinate the technical, regional, and political layers of the internet.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left">
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="font-bold text-white mb-2">Maintain Stability</h3>
              <p className="text-sm text-slate-400">Keep the DNS and routing infrastructure functional.</p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="font-bold text-white mb-2">Ensure Equity</h3>
              <p className="text-sm text-slate-400">Ensure developing nations aren't left behind.</p>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-lg">
              <h3 className="font-bold text-white mb-2">Navigate Politics</h3>
              <p className="text-sm text-slate-400">Balance government demands with a free internet.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowIntro(false)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
          >
            Start Simulation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="text-blue-500" />
            <span className="font-bold text-lg tracking-tight">NetSteward</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-xs font-mono text-slate-400">
              TURN {gameState.turn}/{gameState.maxTurns}
            </div>
            <div className="h-4 w-px bg-slate-700"></div>
            <div className="flex space-x-1">
              {gameState.unlockedBadges.map(b => (
                <Award key={b} className="text-yellow-500 w-4 h-4" />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Metrics & Log */}
        {/* Order 1 ensures Metrics are seen first on mobile */}
        <div className="lg:col-span-1 order-1 flex flex-col gap-6">
          <MetricDisplay metrics={gameState.metrics} />
          
          {/* Mobile Log Toggle */}
          <button 
            onClick={() => setShowMobileLog(!showMobileLog)}
            className="lg:hidden flex items-center justify-center space-x-2 w-full py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          >
            <History size={16} />
            <span>{showMobileLog ? 'Hide History' : 'Show History'}</span>
            {showMobileLog ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* Log Container */}
          <div className={`${showMobileLog ? 'block' : 'hidden'} lg:block bg-slate-800/50 border border-slate-700 rounded-lg p-4 max-h-[300px] overflow-y-auto scrollbar-hide`}>
             <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-3 font-semibold sticky top-0 bg-slate-800 pb-2 border-b border-slate-700/50">Log</h3>
             <div className="space-y-3">
                {gameState.history.slice().reverse().map((entry, i) => (
                  <div key={i} className="text-sm border-l-2 border-slate-600 pl-3 py-1">
                    <div className="font-semibold text-slate-200">{entry.title}</div>
                    <div className="text-slate-400 text-xs italic">"{entry.outcome}"</div>
                  </div>
                ))}
                {gameState.history.length === 0 && <span className="text-slate-500 text-sm">System initialized...</span>}
             </div>
          </div>
        </div>

        {/* Right Col: Scenario / Game Over */}
        {/* Order 2 ensures Scenario is below metrics on mobile */}
        <div className="lg:col-span-2 order-2 pb-8">
          {gameState.isGameOver ? (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 md:p-8 text-center animate-in zoom-in-95 duration-500 shadow-2xl">
              <div className="mb-6 flex justify-center">
                 {gameState.metrics.stability > 0 && 
                  gameState.metrics.trust > 0 && 
                  gameState.metrics.openness > 10 && 
                  gameState.metrics.equity > 10 ? (
                    <CheckCircle2 className="w-20 h-20 text-emerald-500" />
                 ) : (
                    <AlertOctagon className="w-20 h-20 text-red-500" />
                 )}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Simulation Ended</h2>
              <p className="text-slate-300 text-lg mb-8 max-w-lg mx-auto leading-relaxed">{gameState.gameOverReason}</p>
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                  <Award className="text-yellow-500" /> Achievements Unlocked
                </h3>
                <div className="grid grid-cols-1 gap-4 text-left">
                   {gameState.unlockedBadges.map(badgeId => {
                      const b = BADGES.find(x => x.id === badgeId);
                      return (
                        <div key={badgeId} className="bg-slate-700/40 p-4 rounded-xl flex items-start space-x-4 border border-slate-600 hover:bg-slate-700/60 transition-colors">
                          <div className="bg-slate-800 p-3 rounded-full shrink-0 border border-slate-600">
                            <BadgeIcon iconName={b?.icon || 'Award'} className="text-yellow-400 w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-md">{b?.name}</h4>
                            <p className="text-slate-300 text-sm mt-1 leading-snug">{b?.description}</p>
                          </div>
                        </div>
                      )
                   })}
                   {gameState.unlockedBadges.length === 0 && (
                     <div className="bg-slate-800/50 p-6 rounded-xl border border-dashed border-slate-600 text-slate-400 italic text-center">
                       No specific badges earned this term. Try focusing on extreme metrics next time (like 80+ Stability)!
                     </div>
                   )}
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-5 mb-8 text-left">
                <p className="text-blue-100 text-sm leading-relaxed">
                  <span className="font-bold block mb-1 text-blue-300">💡 Curator's Note:</span> 
                  Internet governance is about balancing trade-offs. A stable internet might be restrictive; an open one might be chaotic. 
                  Play again to explore how different philosophies—like prioritizing <strong>Innovation</strong> over <strong>Security</strong>—reshape the digital world.
                </p>
              </div>

              <button 
                onClick={resetGame}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 mx-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
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
          <div className="bg-slate-800 border border-slate-600 w-full max-w-lg rounded-xl shadow-2xl p-6 transform transition-all animate-in scale-95 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold text-white mb-2">{feedback.title}</h3>
            <p className="text-slate-300 mb-6 leading-relaxed">{feedback.text}</p>
            
            <div className="bg-slate-900/50 rounded p-4 mb-6 grid grid-cols-2 gap-3">
              {feedback.impacts.map((imp, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm bg-slate-800/50 p-2 rounded">
                  <span className="capitalize text-slate-400">{imp.metric}</span>
                  <span className={`font-mono font-bold ${imp.value > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {imp.value > 0 ? '+' : ''}{imp.value}
                  </span>
                </div>
              ))}
            </div>

            <button 
              onClick={handleFeedbackDismiss}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors"
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