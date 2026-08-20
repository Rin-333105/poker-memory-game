import type {
  AnswerType,
  Card,
  DifficultyConfig,
  DifficultyKey,
  Rank,
  Suit,
} from '@/types';

export const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
export const RANKS: Rank[] = [
  'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K',
];

export const SUIT_SYMBOL: Record<Suit, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};

export type SuitColor = 'ink' | 'crimson';
export const SUIT_COLOR: Record<Suit, SuitColor> = {
  spades: 'ink',
  hearts: 'crimson',
  diamonds: 'crimson',
  clubs: 'ink',
};

export const SUIT_NAME: Record<Suit, string> = {
  spades: '黑桃',
  hearts: '红桃',
  diamonds: '方块',
  clubs: '梅花',
};

export const TRIVIA_BONUS = 25;

export const DIFFICULTIES: Record<DifficultyKey, DifficultyConfig> = {
  easy: {
    key: 'easy',
    label: '简单',
    tagline: '悠闲入门 · 十题二十秒',
    answerTime: 20,
    lives: 3,
    baseScore: 10,
    streakMultiplier: 1,
    showHistory: 'blur',
    questionCount: 10,
    hasTrivia: false,
  },
  hard: {
    key: 'hard',
    label: '困难',
    tagline: '凝神专注 · 十五题十五秒',
    answerTime: 15,
    lives: 2,
    baseScore: 20,
    streakMultiplier: 1.5,
    showHistory: 'none',
    questionCount: 15,
    hasTrivia: false,
  },
  hell: {
    key: 'hell',
    label: '地狱',
    tagline: '炼狱速判 · 二十题夹常识',
    answerTime: 12,
    lives: 1,
    baseScore: 35,
    streakMultiplier: 2,
    showHistory: 'none',
    questionCount: 20,
    hasTrivia: true,
  },
};

export const DIFFICULTY_LIST: DifficultyConfig[] = [
  DIFFICULTIES.easy,
  DIFFICULTIES.hard,
  DIFFICULTIES.hell,
];

export const ANSWER_META: Record<AnswerType, { label: string; desc: string }> = {
  suit: { label: '花色相同', desc: '仅花色一致，点数不同' },
  rank: { label: '点数相同', desc: '仅点数一致，花色不同' },
  both: { label: '全都相同', desc: '花色与点数皆同' },
  none: { label: '全都不同', desc: '花色点数皆异' },
};

export const ANSWER_ORDER: AnswerType[] = ['suit', 'rank', 'both', 'none'];

export function shuffleDeck(): Card[] {
  const deck: Card[] = [];
  for (const s of SUITS) {
    for (const r of RANKS) {
      deck.push({ id: `${s}-${r}`, suit: s, rank: r });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function judge(current: Card, prev2: Card): AnswerType {
  const suitSame = current.suit === prev2.suit;
  const rankSame = current.rank === prev2.rank;
  if (suitSame && rankSame) return 'both';
  if (suitSame) return 'suit';
  if (rankSame) return 'rank';
  return 'none';
}

export function streakBonus(streak: number): number {
  return Math.floor(streak / 3) * 0.5;
}

export function calcScore(base: number, streak: number, mult: number): number {
  return Math.floor(base * (mult + streakBonus(streak)));
}

export function describeCard(card: Card): string {
  return `${SUIT_NAME[card.suit]} ${card.rank}`;
}
