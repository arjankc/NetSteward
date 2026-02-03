export type MetricType = 'stability' | 'openness' | 'trust' | 'equity' | 'innovation';

export interface Metrics {
  stability: number;
  openness: number;
  trust: number;
  equity: number;
  innovation: number;
}

export interface MetricChange {
  metric: MetricType;
  value: number; // positive or negative
}

export interface ScenarioOption {
  id: string;
  text: string;
  description: string;
  impacts: MetricChange[];
  feedbackTitle: string;
  feedbackText: string;
  requiredBadge?: string; // Unlockable choices
}

export interface Scenario {
  id: string;
  phase: 'technical' | 'regional' | 'policy' | 'global' | 'crisis';
  orgContext: 'ICANN' | 'APNIC' | 'IGF' | 'GLOBAL' | 'SECURITY';
  title: string;
  description: string;
  options: ScenarioOption[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (metrics: Metrics) => boolean;
}

export interface LogEntry {
  turn: number;
  title: string;
  outcome: string;
  impacts: MetricChange[];
}

export interface GameState {
  metrics: Metrics;
  turn: number;
  maxTurns: number;
  history: LogEntry[];
  unlockedBadges: string[];
  currentScenarioId: string | null;
  phase: Scenario['phase'];
  isGameOver: boolean;
  gameOverReason?: string;
}