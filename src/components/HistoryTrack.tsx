import type { Card, DifficultyConfig } from '@/types';
import PokerCard from './PokerCard';

interface Props {
  played: Card[];
  difficulty: DifficultyConfig;
}

export default function HistoryTrack({ played, difficulty }: Props) {
  const n = played.length;
  const prev1 = n >= 2 ? played[n - 2] : undefined;
  const prev2 = n >= 3 ? played[n - 3] : undefined;
  const vis = difficulty.showHistory;

  const slots: { label: string; sub: string; card?: Card }[] = [
    { label: '上上张', sub: '比较对象', card: prev2 },
    { label: '上一张', sub: '缓冲记忆', card: prev1 },
  ];

  return (
    <div className="flex items-end justify-center gap-6 md:gap-12">
      {slots.map((slot, i) => {
        const hasCard = slot.card !== undefined;
        let cardNode: React.ReactNode;
        if (!hasCard) {
          cardNode = (
            <div className="w-14 h-20 rounded-xl border-2 border-dashed border-[#d4af37]/25 bg-[#0f3d2e]/10 flex items-center justify-center">
              <span className="font-display text-[#d4af37]/30 text-[10px]">待</span>
            </div>
          );
        } else if (vis === 'none') {
          cardNode = <PokerCard faceDown size="sm" dimmed />;
        } else {
          cardNode = <PokerCard card={slot.card} size="sm" blurred />;
        }

        return (
          <div key={i} className="flex flex-col items-center gap-2 opacity-80">
            {cardNode}
            <div className="text-center">
              <div className="font-display text-[11px] tracking-widest text-[#d4af37]/70">
                {slot.label}
              </div>
              <div className="font-body text-[10px] text-[#d4af37]/35">{slot.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ComparisonArc() {
  return (
    <div className="hidden md:flex items-center justify-center px-2">
      <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
        <path
          d="M2 36 C 10 4, 50 4, 58 36"
          stroke="#d4af37"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.55"
          fill="none"
        />
        <path
          d="M2 36 L6 32 M2 36 L6 40"
          stroke="#d4af37"
          strokeWidth="1.5"
          opacity="0.55"
        />
        <text
          x="30"
          y="14"
          textAnchor="middle"
          className="font-display"
          fill="#d4af37"
          opacity="0.8"
          fontSize="9"
        >
          跨越
        </text>
      </svg>
    </div>
  );
}
