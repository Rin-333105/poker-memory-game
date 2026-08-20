import { useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { ANSWER_ORDER, streakBonus } from '@/game/engine';
import type { AnswerType } from '@/types';
import PokerCard from '@/components/PokerCard';
import TimerRing from '@/components/TimerRing';
import AnswerButtons from '@/components/AnswerButtons';
import HistoryTrack, { ComparisonArc } from '@/components/HistoryTrack';
import TriviaPanel from '@/components/TriviaPanel';
import { cn } from '@/lib/utils';

const CARD_W = 192;
const CARD_H = 256;

export default function GamePage() {
  const screen = useGameStore((s) => s.screen);
  const difficulty = useGameStore((s) => s.difficulty);
  const played = useGameStore((s) => s.played);
  const deck = useGameStore((s) => s.deck);
  const score = useGameStore((s) => s.score);
  const streak = useGameStore((s) => s.streak);
  const bestStreak = useGameStore((s) => s.bestStreak);
  const lives = useGameStore((s) => s.lives);
  const phase = useGameStore((s) => s.phase);
  const timeLeftMs = useGameStore((s) => s.timeLeftMs);
  const totalAnswered = useGameStore((s) => s.totalAnswered);
  const lastResult = useGameStore((s) => s.lastResult);
  const selectedAnswer = useGameStore((s) => s.selectedAnswer);
  const lastCorrectAnswer = useGameStore((s) => s.lastCorrectAnswer);
  const triviaQ = useGameStore((s) => s.triviaQ);
  const triviaSelected = useGameStore((s) => s.triviaSelected);
  const triviaResult = useGameStore((s) => s.triviaResult);
  const triviaAnsweredTotal = useGameStore((s) => s.triviaAnsweredTotal);
  const backToMenu = useGameStore((s) => s.backToMenu);

  const playedLen = played.length;
  const current = playedLen > 0 ? played[playedLen - 1] : undefined;
  const hasPrev2 = playedLen >= 3;
  const totalMs = difficulty.answerTime * 1000;
  const progress =
    phase === 'dealing' || phase === 'answering' || phase === 'trivia'
      ? timeLeftMs / totalMs
      : 1;
  const secsLeft = Math.max(0, Math.ceil(timeLeftMs / 1000));

  // 统一游戏循环
  useEffect(() => {
    if (phase === 'dealing' || phase === 'answering' || phase === 'trivia') {
      const id = setInterval(() => useGameStore.getState().tick(100), 100);
      return () => clearInterval(id);
    }
    if (phase === 'feedback') {
      const id = setTimeout(() => useGameStore.getState().advanceAfterFeedback(), 950);
      return () => clearTimeout(id);
    }
    if (phase === 'triviaFeedback') {
      const id = setTimeout(() => useGameStore.getState().advanceAfterTrivia(), 1200);
      return () => clearTimeout(id);
    }
  }, [phase, playedLen]);

  // 键盘 1-4：牌题作答 / 常识题作答
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const st = useGameStore.getState();
      const idx = ['1', '2', '3', '4'].indexOf(e.key);
      if (idx < 0) return;
      e.preventDefault();
      if (st.phase === 'answering') {
        st.submitAnswer(ANSWER_ORDER[idx] as AnswerType);
      } else if (st.phase === 'trivia') {
        st.submitTrivia(idx);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (screen !== 'game') return null;

  const multNow = difficulty.streakMultiplier + streakBonus(streak);
  const livesArr = Array.from({ length: difficulty.lives });
  const showRing = phase === 'dealing' || phase === 'answering';
  const stageFeedbackClass =
    phase === 'feedback'
      ? lastResult === 'correct'
        ? 'anim-gold-pulse'
        : 'anim-wrong'
      : '';

  const inTrivia = phase === 'trivia' || phase === 'triviaFeedback';

  return (
    <div className="relative min-h-screen flex flex-col px-4 py-5 felt-texture">
      {/* 顶栏 */}
      <header className="flex items-center justify-between gap-3 z-10">
        <button
          type="button"
          onClick={backToMenu}
          className="font-body text-xs text-[#d4af37]/70 hover:text-[#e8c766] transition-colors"
        >
          ← 退出
        </button>
        <div className="flex items-center gap-2 font-display text-xs tracking-widest text-[#d4af37]/80">
          <span className="text-[#e8c766]">{difficulty.label}</span>
          <span className="text-[#d4af37]/40">·</span>
          <span>
            题目 {Math.min(totalAnswered, difficulty.questionCount)}/
            {difficulty.questionCount}
          </span>
          <span className="text-[#d4af37]/40">·</span>
          <span>剩 {deck.length} 张</span>
        </div>
        <div className="font-body text-xs text-[#d4af37]/70">
          最佳连击 <span className="text-[#e8c766]">{bestStreak}</span>
        </div>
      </header>

      {/* 状态栏 */}
      <div className="mt-3 flex items-center justify-center gap-4 md:gap-7 z-10">
        <StatChip label="分数" value={score.toString()} accent />
        <StatChip
          label="连击"
          value={streak > 0 ? `×${streak}` : '—'}
          sub={streak >= 3 ? `倍率 ${multNow.toFixed(1)}` : undefined}
          pulse={streak >= 3}
        />
        <div className="flex items-center gap-1.5">
          {livesArr.map((_, i) => (
            <span
              key={i}
              className={cn(
                'text-xl transition-all',
                i < lives
                  ? 'text-[#c8102e] drop-shadow-[0_0_6px_rgba(200,16,46,0.6)]'
                  : 'text-[#3a0d14]',
              )}
            >
              ♥
            </span>
          ))}
        </div>
      </div>

      {/* 牌台 / 常识题 */}
      <main className="relative flex-1 flex flex-col items-center justify-center gap-7 mt-2">
        {inTrivia && triviaQ ? (
          <div className="flex flex-col items-center gap-5">
            <TriviaPanel
              trivia={triviaQ}
              selected={triviaSelected}
              result={triviaResult}
              phase={phase === 'trivia' ? 'trivia' : 'triviaFeedback'}
              progress={progress}
              secsLeft={secsLeft}
              onAnswer={(idx) => useGameStore.getState().submitTrivia(idx)}
            />
            <p className="font-body text-[10px] text-[#d4af37]/40 tracking-wider">
              答对 +25 分 · 答错不扣命 · 已答常识 {triviaAnsweredTotal} 题
            </p>
          </div>
        ) : (
          current && (
            <>
              <div className="relative flex items-center justify-center">
                {showRing && <TimerRing progress={progress} w={CARD_W} h={CARD_H} />}

                <button
                  type="button"
                  disabled={phase !== 'dealing'}
                  onClick={() => phase === 'dealing' && useGameStore.getState().dealNext()}
                  className={cn(
                    'relative block',
                    stageFeedbackClass,
                    phase === 'dealing'
                      ? 'cursor-pointer hover:scale-[1.02] transition-transform'
                      : 'cursor-default',
                  )}
                  aria-label={phase === 'dealing' ? '显示下一张牌' : undefined}
                >
                  <div key={current.id} className="anim-deal">
                    <PokerCard card={current} size="xl" />
                  </div>
                </button>

                {showRing && (
                  <div
                    className={cn(
                      'absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full border font-display text-sm tracking-widest whitespace-nowrap',
                      progress < 0.25
                        ? 'border-[#c8102e] text-[#c8102e] bg-[#1a0608]/80 anim-breathe'
                        : 'border-[#d4af37]/60 text-[#e8c766] bg-[#0b0e14]/80',
                    )}
                  >
                    {secsLeft}s
                  </div>
                )}

                {phase === 'dealing' && (
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-serif2 italic text-xs text-[#d4af37]/75 whitespace-nowrap anim-breathe">
                    点击或等待 · 进入下一张
                  </div>
                )}

                {hasPrev2 && phase === 'answering' && (
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-serif2 italic text-xs text-[#d4af37]/70 whitespace-nowrap">
                    与「上上张」比较
                  </div>
                )}
              </div>

              {/* 历史轨道 */}
              <div className="flex items-end justify-center gap-3">
                <HistoryTrack played={played} difficulty={difficulty} />
                {hasPrev2 && (
                  <>
                    <ComparisonArc />
                    <div className="flex flex-col items-center gap-2 opacity-90">
                      <div className="font-display text-[11px] tracking-widest text-[#e8c766]">
                        当前张
                      </div>
                      <div className="font-body text-[10px] text-[#d4af37]/40">
                        判定基准
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )
        )}
      </main>

      {/* 作答按钮（常识题阶段隐藏） */}
      {!inTrivia && (
        <footer className="z-10 flex flex-col items-center gap-3 pb-2">
          <AnswerButtons
            phase={phase}
            selectedAnswer={selectedAnswer}
            lastCorrectAnswer={lastCorrectAnswer}
            lastResult={lastResult}
            onAnswer={(a) => useGameStore.getState().submitAnswer(a)}
          />
          <p className="font-body text-[10px] text-[#d4af37]/40 tracking-wider">
            键盘 1-4 快速作答
          </p>
        </footer>
      )}
    </div>
  );
}

function StatChip({
  label,
  value,
  sub,
  accent,
  pulse,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  pulse?: boolean;
}) {
  return (
    <div className="flex flex-col items-center min-w-[72px]">
      <span className="font-body text-[10px] tracking-widest text-[#d4af37]/55 uppercase">
        {label}
      </span>
      <span
        className={cn(
          'font-display text-2xl leading-none mt-0.5',
          accent ? 'gold-foil' : 'text-[#f5efe0]',
          pulse && 'anim-pop',
        )}
      >
        {value}
      </span>
      {sub && (
        <span className="font-body text-[9px] text-[#d4af37]/60 mt-0.5">{sub}</span>
      )}
    </div>
  );
}
