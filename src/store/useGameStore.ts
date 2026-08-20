import { create } from 'zustand';
import type {
  AnswerType,
  Card,
  DifficultyConfig,
  DifficultyKey,
  FeedbackResult,
  Phase,
  Screen,
  Trivia,
} from '@/types';
import {
  calcScore,
  DIFFICULTIES,
  judge,
  shuffleDeck,
  TRIVIA_BONUS,
} from '@/game/engine';
import { TRIVIA_BANK } from '@/game/trivia';

const HS_KEY = 'poker-memory-highscores-v2';

function loadHighScores(): Record<DifficultyKey, number> {
  try {
    const raw = localStorage.getItem(HS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        easy: Number(p.easy) || 0,
        hard: Number(p.hard) || 0,
        hell: Number(p.hell) || 0,
      };
    }
  } catch {
    /* ignore */
  }
  return { easy: 0, hard: 0, hell: 0 };
}

function saveHighScores(hs: Record<DifficultyKey, number>) {
  try {
    localStorage.setItem(HS_KEY, JSON.stringify(hs));
  } catch {
    /* ignore */
  }
}

export interface GameStore {
  screen: Screen;
  difficulty: DifficultyConfig;
  deck: Card[];
  played: Card[];
  score: number;
  streak: number;
  bestStreak: number;
  lives: number;
  phase: Phase;
  timeLeftMs: number; // 预览/答题/常识题共用倒计时
  totalAnswered: number; // 已作答的牌题数
  correctCount: number; // 牌题答对数
  lastResult: FeedbackResult | null;
  lastCorrectAnswer: AnswerType | null;
  selectedAnswer: AnswerType | null;

  // 常识题
  triviaQ: Trivia | null;
  triviaSelected: number | null;
  triviaResult: FeedbackResult | null;
  triviaCorrectCount: number;
  triviaAnsweredTotal: number;
  lastTriviaIndex: number;

  isNewHighScore: boolean;
  highScores: Record<DifficultyKey, number>;
  startedAt: number;
  endedAt: number | null;

  startGame: (d: DifficultyConfig) => void;
  dealNext: () => void;
  submitAnswer: (a: AnswerType) => void;
  startTrivia: () => void;
  submitTrivia: (idx: number | null) => void;
  advanceAfterFeedback: () => void;
  advanceAfterTrivia: () => void;
  tick: (dtMs: number) => void;
  backToMenu: () => void;
  restart: () => void;
}

export const useGameStore = create<GameStore>((set, get) => {
  const endGame = () => {
    const { score, difficulty, highScores } = get();
    const prevHigh = highScores[difficulty.key] || 0;
    const isNew = score > prevHigh && score > 0;
    const hs = { ...highScores, [difficulty.key]: Math.max(prevHigh, score) };
    saveHighScores(hs);
    set({
      phase: 'ended',
      screen: 'result',
      endedAt: Date.now(),
      isNewHighScore: isNew,
      highScores: hs,
    });
  };

  const resolveAnswer = (answer: AnswerType | null) => {
    const { phase, played, difficulty, streak } = get();
    if (phase !== 'answering') return;
    const current = played[played.length - 1];
    const prev2 = played[played.length - 3];
    const correct = judge(current, prev2);
    const isCorrect = answer !== null && answer === correct;
    const gained = isCorrect
      ? calcScore(difficulty.baseScore, streak, difficulty.streakMultiplier)
      : 0;
    const newStreak = isCorrect ? streak + 1 : 0;
    set((s) => ({
      phase: 'feedback',
      timeLeftMs: 0,
      lastResult: (isCorrect ? 'correct' : 'wrong') as FeedbackResult,
      lastCorrectAnswer: correct,
      selectedAnswer: answer,
      score: s.score + gained,
      streak: newStreak,
      bestStreak: Math.max(s.bestStreak, newStreak),
      totalAnswered: s.totalAnswered + 1,
      correctCount: s.correctCount + (isCorrect ? 1 : 0),
      lives: isCorrect ? s.lives : Math.max(0, s.lives - 1),
    }));
  };

  const resolveTrivia = (idx: number | null) => {
    const { phase, triviaQ } = get();
    if (phase !== 'trivia' || !triviaQ) return;
    const isCorrect = idx !== null && idx === triviaQ.correct;
    set((s) => ({
      phase: 'triviaFeedback',
      timeLeftMs: 0,
      triviaSelected: idx,
      triviaResult: (isCorrect ? 'correct' : 'wrong') as FeedbackResult,
      triviaAnsweredTotal: s.triviaAnsweredTotal + 1,
      triviaCorrectCount: s.triviaCorrectCount + (isCorrect ? 1 : 0),
      score: s.score + (isCorrect ? TRIVIA_BONUS : 0),
    }));
  };

  return {
    screen: 'menu',
    difficulty: DIFFICULTIES.easy,
    deck: [],
    played: [],
    score: 0,
    streak: 0,
    bestStreak: 0,
    lives: 3,
    phase: 'dealing',
    timeLeftMs: 0,
    totalAnswered: 0,
    correctCount: 0,
    lastResult: null,
    lastCorrectAnswer: null,
    selectedAnswer: null,

    triviaQ: null,
    triviaSelected: null,
    triviaResult: null,
    triviaCorrectCount: 0,
    triviaAnsweredTotal: 0,
    lastTriviaIndex: -1,

    isNewHighScore: false,
    highScores: loadHighScores(),
    startedAt: 0,
    endedAt: null,

    startGame: (d) => {
      const deck = shuffleDeck();
      const first = deck.pop()!;
      set({
        screen: 'game',
        difficulty: d,
        deck,
        played: [first],
        score: 0,
        streak: 0,
        bestStreak: 0,
        lives: d.lives,
        phase: 'dealing',
        timeLeftMs: d.answerTime * 1000,
        totalAnswered: 0,
        correctCount: 0,
        lastResult: null,
        lastCorrectAnswer: null,
        selectedAnswer: null,
        triviaQ: null,
        triviaSelected: null,
        triviaResult: null,
        triviaCorrectCount: 0,
        triviaAnsweredTotal: 0,
        lastTriviaIndex: -1,
        isNewHighScore: false,
        startedAt: Date.now(),
        endedAt: null,
      });
    },

    dealNext: () => {
      const { deck, played, lives, difficulty } = get();
      if (lives <= 0 || deck.length === 0) {
        endGame();
        return;
      }
      const next = deck.pop()!;
      const newPlayed = [...played, next];
      const needsAnswer = newPlayed.length >= 3;
      set({
        deck,
        played: newPlayed,
        phase: needsAnswer ? 'answering' : 'dealing',
        timeLeftMs: difficulty.answerTime * 1000,
        lastResult: null,
        lastCorrectAnswer: null,
        selectedAnswer: null,
      });
    },

    submitAnswer: (a) => resolveAnswer(a),

    startTrivia: () => {
      const { lastTriviaIndex } = get();
      let idx = Math.floor(Math.random() * TRIVIA_BANK.length);
      if (TRIVIA_BANK.length > 1) {
        let guard = 0;
        while (idx === lastTriviaIndex && guard < 20) {
          idx = Math.floor(Math.random() * TRIVIA_BANK.length);
          guard++;
        }
      }
      const t = TRIVIA_BANK[idx];
      const { difficulty } = get();
      set({
        phase: 'trivia',
        timeLeftMs: difficulty.answerTime * 1000,
        triviaQ: t,
        triviaSelected: null,
        triviaResult: null,
        lastTriviaIndex: idx,
      });
    },

    submitTrivia: (idx) => resolveTrivia(idx),

    advanceAfterFeedback: () => {
      const { lives, totalAnswered, difficulty } = get();
      if (lives <= 0 || totalAnswered >= difficulty.questionCount) {
        endGame();
        return;
      }
      if (
        difficulty.hasTrivia &&
        totalAnswered > 0 &&
        totalAnswered % 2 === 0 &&
        totalAnswered < difficulty.questionCount
      ) {
        get().startTrivia();
        return;
      }
      get().dealNext();
    },

    advanceAfterTrivia: () => {
      const { lives, totalAnswered, difficulty } = get();
      if (lives <= 0 || totalAnswered >= difficulty.questionCount) {
        endGame();
        return;
      }
      get().dealNext();
    },

    tick: (dtMs) => {
      const { phase, timeLeftMs } = get();
      if (phase === 'dealing') {
        const next = timeLeftMs - dtMs;
        if (next <= 0) {
          get().dealNext();
          return;
        }
        set({ timeLeftMs: next });
        return;
      }
      if (phase === 'answering') {
        const next = timeLeftMs - dtMs;
        if (next <= 0) {
          resolveAnswer(null);
          return;
        }
        set({ timeLeftMs: next });
        return;
      }
      if (phase === 'trivia') {
        const next = timeLeftMs - dtMs;
        if (next <= 0) {
          resolveTrivia(null);
          return;
        }
        set({ timeLeftMs: next });
        return;
      }
    },

    backToMenu: () => set({ screen: 'menu' }),

    restart: () => {
      const { difficulty } = get();
      get().startGame(difficulty);
    },
  };
});
