import type { FeedbackResult, Trivia } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  trivia: Trivia;
  selected: number | null;
  result: FeedbackResult | null;
  phase: 'trivia' | 'triviaFeedback';
  progress: number; // 0..1 剩余
  secsLeft: number;
  onAnswer: (idx: number) => void;
}

const LETTERS = ['A', 'B', 'C', 'D'];

export default function TriviaPanel({
  trivia,
  selected,
  result,
  phase,
  progress,
  secsLeft,
  onAnswer,
}: Props) {
  const answering = phase === 'trivia';
  const danger = progress < 0.25;

  return (
    <div className="relative w-full max-w-xl rounded-2xl border-2 border-[#d4af37]/55 bg-gradient-to-b from-[#11201a]/90 to-[#0b0e14]/95 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.55)] anim-pop">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 font-display text-[11px] tracking-[0.4em] text-[#e8c766]">
          <span>◆</span>
          <span>常识干扰</span>
          <span>◆</span>
        </div>
        <div
          className={cn(
            'font-display text-sm px-2.5 py-0.5 rounded-full border',
            danger
              ? 'border-[#c8102e] text-[#c8102e] anim-breathe'
              : 'border-[#d4af37]/60 text-[#e8c766]',
          )}
        >
          {secsLeft}s
        </div>
      </div>

      {/* 进度条 */}
      <div className="h-1.5 w-full rounded-full bg-[#d4af37]/15 overflow-hidden mb-4">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-100 ease-linear',
            danger ? 'bg-[#c8102e]' : 'bg-[#d4af37]',
          )}
          style={{ width: `${Math.max(0, progress) * 100}%` }}
        />
      </div>

      <p className="font-serif2 text-xl md:text-2xl text-[#f5efe0] text-center leading-snug mb-5">
        {trivia.q}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {trivia.options.map((opt, i) => {
          const isCorrect = i === trivia.correct;
          const isSelected = selected === i;
          let cls =
            'border-[#d4af37]/45 bg-[#0f3d2e]/40 hover:border-[#e8c766] hover:bg-[#0f3d2e]/70';
          if (!answering) {
            if (isCorrect)
              cls =
                'border-[#e8c766] bg-[#1b4d3a]/80 shadow-[0_0_22px_rgba(212,175,55,0.5)]';
            else if (isSelected && result === 'wrong')
              cls = 'border-[#c8102e] bg-[#3a0d14]/70';
            else cls = 'border-[#d4af37]/20 opacity-50';
          }
          return (
            <button
              key={i}
              type="button"
              disabled={!answering}
              onClick={() => onAnswer(i)}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-200',
                cls,
                answering && 'cursor-pointer hover:-translate-y-0.5',
              )}
            >
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-display text-xs',
                  answering
                    ? 'border-[#d4af37]/60 text-[#e8c766]'
                    : 'border-[#d4af37]/40 text-[#d4af37]/70',
                )}
              >
                {LETTERS[i]}
              </span>
              <span className="font-body text-[#f5efe0] text-base">{opt}</span>
            </button>
          );
        })}
      </div>

      {!answering && (
        <p className="mt-4 text-center font-serif2 italic text-sm text-[#d4af37]/70">
          {result === 'correct'
            ? '✦ 答对，常识加分 ✦'
            : result === 'wrong'
              ? `正确答案：${LETTERS[trivia.correct]} · ${trivia.options[trivia.correct]}`
              : ''}
        </p>
      )}
    </div>
  );
}
