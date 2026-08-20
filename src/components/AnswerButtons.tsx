import { ANSWER_META, ANSWER_ORDER } from '@/game/engine';
import type { AnswerType, FeedbackResult, Phase } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  phase: Phase;
  selectedAnswer: AnswerType | null;
  lastCorrectAnswer: AnswerType | null;
  lastResult: FeedbackResult | null;
  onAnswer: (a: AnswerType) => void;
}

export default function AnswerButtons({
  phase,
  selectedAnswer,
  lastCorrectAnswer,
  lastResult,
  onAnswer,
}: Props) {
  const answering = phase === 'answering';
  const feedback = phase === 'feedback';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl">
      {ANSWER_ORDER.map((key, i) => {
        const meta = ANSWER_META[key];
        const isSelected = selectedAnswer === key;
        const isCorrect = lastCorrectAnswer === key;

        let stateClass =
          'border-[#d4af37]/45 bg-[#0f3d2e]/40 hover:border-[#e8c766] hover:bg-[#0f3d2e]/70 hover:shadow-[0_0_22px_rgba(212,175,55,0.35)]';

        if (feedback) {
          if (isCorrect) {
            stateClass =
              'border-[#e8c766] bg-[#1b4d3a]/80 shadow-[0_0_26px_rgba(212,175,55,0.55)]';
          } else if (isSelected && lastResult === 'wrong') {
            stateClass =
              'border-[#c8102e] bg-[#3a0d14]/70 shadow-[0_0_22px_rgba(200,16,46,0.55)]';
          } else {
            stateClass = 'border-[#d4af37]/20 bg-[#0f3d2e]/25 opacity-50';
          }
        }

        return (
          <button
            key={key}
            type="button"
            disabled={!answering}
            onClick={() => onAnswer(key)}
            className={cn(
              'group relative flex flex-col items-center justify-center gap-1 rounded-xl border-2 px-3 py-4 text-center transition-all duration-200 no-select',
              stateClass,
              answering ? 'cursor-pointer' : 'cursor-default',
              answering && 'hover:-translate-y-0.5',
              !answering && !feedback && 'opacity-40',
            )}
          >
            <span
              className={cn(
                'absolute top-2 left-2.5 flex h-6 w-6 items-center justify-center rounded-full border border-[#d4af37]/60 font-display text-xs',
                answering ? 'text-[#e8c766]' : 'text-[#d4af37]/60',
              )}
            >
              {i + 1}
            </span>
            <span className="font-display text-lg md:text-xl text-[#f5efe0] tracking-wide">
              {meta.label}
            </span>
            <span className="font-body text-[11px] text-[#d4af37]/70 leading-tight">
              {meta.desc}
            </span>
            <span className="pointer-events-none absolute inset-0 rounded-xl ring-0 group-hover:ring-1 group-hover:ring-[#e8c766]/40" />
          </button>
        );
      })}
    </div>
  );
}
