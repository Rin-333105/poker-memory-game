export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
}

export type DifficultyKey = 'easy' | 'hard' | 'hell';

// 历史牌可见性：blur=模糊可见 / none=不可见(牌背)
export type HistoryVisibility = 'blur' | 'none';

export interface DifficultyConfig {
  key: DifficultyKey;
  label: string;
  tagline: string;
  answerTime: number; // 秒，每题作答时限，兼作前两张预览牌的停留时长
  lives: number;
  baseScore: number;
  streakMultiplier: number;
  showHistory: HistoryVisibility;
  questionCount: number; // 本局需要作答的牌题数量
  hasTrivia: boolean; // 是否在牌题间穿插常识题
}

export type AnswerType = 'suit' | 'rank' | 'both' | 'none';

export type Screen = 'menu' | 'game' | 'result';
export type Phase =
  | 'dealing'
  | 'answering'
  | 'feedback'
  | 'trivia'
  | 'triviaFeedback'
  | 'ended';
export type FeedbackResult = 'correct' | 'wrong';

export interface Trivia {
  q: string;
  options: string[];
  correct: number;
}
