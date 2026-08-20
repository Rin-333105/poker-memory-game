import { SUIT_COLOR, SUIT_SYMBOL } from '@/game/engine';
import type { Card } from '@/types';
import { cn } from '@/lib/utils';

export type CardSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<
  CardSize,
  { w: string; h: string; rank: string; pip: string; corner: string }
> = {
  sm: { w: 'w-14', h: 'h-20', rank: 'text-xs', pip: 'text-xl', corner: 'text-[9px]' },
  md: { w: 'w-24', h: 'h-36', rank: 'text-lg', pip: 'text-4xl', corner: 'text-xs' },
  lg: { w: 'w-40', h: 'h-56', rank: 'text-2xl', pip: 'text-6xl', corner: 'text-sm' },
  xl: { w: 'w-48', h: 'h-[16rem]', rank: 'text-3xl', pip: 'text-7xl', corner: 'text-base' },
};

interface Props {
  card?: Card | null;
  faceDown?: boolean;
  size?: CardSize;
  blurred?: boolean;
  dimmed?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function PokerCard({
  card,
  faceDown = false,
  size = 'md',
  blurred = false,
  dimmed = false,
  className,
  style,
}: Props) {
  const s = SIZE_MAP[size];

  if (faceDown || !card) {
    return (
      <div
        className={cn(
          s.w,
          s.h,
          'relative rounded-xl overflow-hidden border-2 border-[#d4af37]/70 shadow-[0_8px_22px_rgba(0,0,0,0.55)]',
          blurred && 'opacity-50 blur-[3px]',
          dimmed && 'opacity-25',
          className,
        )}
        style={style}
      >
        <div className="card-back-pattern absolute inset-0" />
        <div className="absolute inset-1 rounded-lg border border-[#d4af37]/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-display text-[#d4af37]/55 text-2xl">◆</div>
        </div>
        <div className="absolute top-1 left-1.5 text-[#d4af37]/45 text-[10px]">✦</div>
        <div className="absolute bottom-1 right-1.5 text-[#d4af37]/45 text-[10px]">✦</div>
      </div>
    );
  }

  const isCrimson = SUIT_COLOR[card.suit] === 'crimson';
  const sym = SUIT_SYMBOL[card.suit];

  return (
    <div
      className={cn(
        s.w,
        s.h,
        'relative rounded-xl bg-gradient-to-br from-[#fbf6e8] to-[#efe6cf] border-2 border-[#d4af37] shadow-[0_10px_26px_rgba(0,0,0,0.55)] overflow-hidden no-select',
        blurred && 'blur-[4px] opacity-60',
        dimmed && 'opacity-30',
        className,
      )}
      style={style}
    >
      <div className="absolute inset-1 rounded-lg border border-[#d4af37]/35 pointer-events-none" />

      <div
        className={cn(
          'absolute top-1.5 left-2 flex flex-col items-center leading-none font-serif2 font-bold',
          s.corner,
          isCrimson ? 'text-[#c8102e]' : 'text-[#15110a]',
        )}
      >
        <span className={s.rank}>{card.rank}</span>
        <span className="-mt-0.5">{sym}</span>
      </div>

      <div
        className={cn(
          'absolute bottom-1.5 right-2 flex flex-col items-center leading-none rotate-180 font-serif2 font-bold',
          s.corner,
          isCrimson ? 'text-[#c8102e]' : 'text-[#15110a]',
        )}
      >
        <span className={s.rank}>{card.rank}</span>
        <span className="-mt-0.5">{sym}</span>
      </div>

      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          s.pip,
          isCrimson ? 'text-[#c8102e]' : 'text-[#15110a]',
        )}
        style={{ textShadow: '0 2px 6px rgba(0,0,0,0.18)' }}
      >
        <span className="anim-flip">{sym}</span>
      </div>

      <div className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-[#d4af37]/60 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-5 h-5 border-r-2 border-t-2 border-[#d4af37]/60 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#d4af37]/60 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#d4af37]/60 rounded-br-lg" />
    </div>
  );
}
