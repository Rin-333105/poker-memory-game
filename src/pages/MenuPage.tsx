import { useState } from 'react';
import { DIFFICULTY_LIST, SUIT_SYMBOL, RANKS } from '@/game/engine';
import type { Card, DifficultyConfig } from '@/types';
import { useGameStore } from '@/store/useGameStore';
import PokerCard from '@/components/PokerCard';
import { cn } from '@/lib/utils';

export default function MenuPage() {
  const startGame = useGameStore((s) => s.startGame);
  const highScores = useGameStore((s) => s.highScores);
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col items-center px-4 py-10 overflow-hidden">
      {/* 太阳放射装饰 */}
      <div className="deco-sunburst anim-spin-slow absolute -top-[40%] left-1/2 -translate-x-1/2 h-[120vh] w-[120vh] opacity-60 pointer-events-none" />

      {/* 浮动卡牌剪影 */}
      <FloatingCards />

      <header className="relative z-10 flex flex-col items-center text-center anim-fade-up">
        <div className="flex items-center gap-3 text-[#d4af37]/70 font-display text-[11px] tracking-[0.5em] mb-4">
          <span>◆</span>
          <span>ART DECO CARD SALON</span>
          <span>◆</span>
        </div>
        <h1 className="gold-foil font-display font-extrabold text-6xl md:text-8xl leading-none drop-shadow-[0_4px_30px_rgba(212,175,55,0.25)]">
          花影记忆
        </h1>
        <p className="mt-5 font-serif2 text-xl md:text-2xl italic text-[#f5efe0]/85">
          凝眸牌阵 · 跨越一张 · 辨其同异
        </p>
        <div className="gold-divider mt-7 w-72 md:w-96">
          <span className="text-[#d4af37] text-sm">✦</span>
        </div>
      </header>

      {/* 难度选择 */}
      <section className="relative z-10 mt-10 w-full max-w-5xl anim-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DIFFICULTY_LIST.map((d, i) => (
            <DifficultyCard
              key={d.key}
              d={d}
              highScore={highScores[d.key] || 0}
              index={i}
              onStart={() => startGame(d)}
            />
          ))}
        </div>
      </section>

      {/* 玩法说明 */}
      <section className="relative z-10 mt-9 w-full max-w-3xl anim-fade-up" style={{ animationDelay: '0.2s' }}>
        <button
          type="button"
          onClick={() => setShowRules((v) => !v)}
          className="mx-auto flex items-center gap-3 font-display text-sm tracking-widest text-[#d4af37]/80 hover:text-[#e8c766] transition-colors"
        >
          <span>{showRules ? '收起' : '展开'}玩法说明</span>
          <span className={cn('transition-transform', showRules && 'rotate-180')}>▾</span>
        </button>
        {showRules && <RulesPanel />}
      </section>

      <footer className="relative z-10 mt-auto pt-10 font-body text-[11px] text-[#d4af37]/40 tracking-wider">
        © 花影记忆 · 桌面端可用数字键 1-4 作答
      </footer>
    </div>
  );
}

function DifficultyCard({
  d,
  highScore,
  index,
  onStart,
}: {
  d: DifficultyConfig;
  highScore: number;
  index: number;
  onStart: () => void;
}) {
  const accent =
    d.key === 'easy'
      ? 'from-[#0f3d2e]/60'
      : d.key === 'hard'
        ? 'from-[#3a2a10]/70'
        : 'from-[#3a0d14]/70';
  const tag =
    d.key === 'easy' ? '入门' : d.key === 'hard' ? '进阶' : '极限';

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border-2 border-[#d4af37]/45 bg-gradient-to-b to-[#0b0e14] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#e8c766] hover:shadow-[0_18px_50px_rgba(212,175,55,0.28)]',
        accent,
      )}
      style={{ animationDelay: `${0.15 + index * 0.08}s` }}
    >
      <div className="absolute top-3 right-3 font-display text-[10px] tracking-widest text-[#d4af37]/50">
        {tag}
      </div>
      <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-[#d4af37]/10 blur-2xl group-hover:bg-[#d4af37]/20 transition-colors" />

      <h3 className="font-display text-3xl text-[#f5efe0]">{d.label}</h3>
      <p className="font-serif2 italic text-sm text-[#d4af37]/80 mt-1">{d.tagline}</p>

      <ul className="mt-5 space-y-2 font-body text-[13px] text-[#f5efe0]/75">
        <Stat label="题目数量" value={`${d.questionCount} 题`} />
        <Stat label="作答时限" value={`${d.answerTime} 秒`} />
        <Stat label="初始生命" value={'♥'.repeat(d.lives)} />
        <Stat label="基础分" value={`${d.baseScore} / 题`} />
        <Stat label="连击倍率" value={`×${d.streakMultiplier.toFixed(1)}`} />
        <Stat
          label="历史牌"
          value={d.showHistory === 'blur' ? '模糊' : '不可见'}
        />
        <Stat label="干扰题" value={d.hasTrivia ? '常识题' : '无'} />
      </ul>

      <div className="mt-4 flex items-center justify-between font-body text-[11px] text-[#d4af37]/55">
        <span>最高分</span>
        <span className="font-display text-[#e8c766] text-base">{highScore}</span>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-5 w-full rounded-xl border border-[#d4af37]/60 bg-[#d4af37]/10 py-3 font-display tracking-widest text-[#f5efe0] transition-all hover:bg-[#d4af37]/25 hover:shadow-[0_0_22px_rgba(212,175,55,0.45)]"
      >
        入 局
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between border-b border-[#d4af37]/10 pb-1.5">
      <span className="text-[#d4af37]/55">{label}</span>
      <span className="text-[#f5efe0]">{value}</span>
    </li>
  );
}

function RulesPanel() {
  const example: [Card, Card, Card] = [
    { id: 'e1', suit: 'hearts', rank: '7' },
    { id: 'e2', suit: 'spades', rank: 'Q' },
    { id: 'e3', suit: 'hearts', rank: 'K' },
  ];

  return (
    <div className="mt-4 rounded-2xl border border-[#d4af37]/30 bg-[#0b0e14]/70 p-6 anim-fade-up">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3 font-body text-sm text-[#f5efe0]/80 leading-relaxed">
          <p>
            系统持续发出<b className="text-[#e8c766]">不重复</b>的扑克牌。第
            <b className="text-[#e8c766]"> 一、二张</b>仅作展示、无需作答；每张会停留
            <b className="text-[#e8c766]"> 一个作答时限</b>，也可<b className="text-[#e8c766]"> 点击</b>立即换下一张。
          </p>
          <p>
            从第 <b className="text-[#e8c766]">三张</b> 起，比较
            <b className="text-[#e8c766]"> 当前牌</b> 与
            <b className="text-[#e8c766]"> 上上张</b>（往前数第二张）：
          </p>
          <ul className="space-y-1.5 pl-1">
            <li>· <span className="text-[#f5efe0]">花色相同</span>：仅花色一致</li>
            <li>· <span className="text-[#f5efe0]">点数相同</span>：仅点数一致</li>
            <li>· <span className="text-[#f5efe0]">全都不同</span>：花色点数皆异</li>
            <li className="text-[#d4af37]/50">· 全都相同：因不重复发牌不会触发，误点判错</li>
          </ul>
          <p className="text-[#d4af37]/65">
            答对加分、连击累加；答错或超时扣 1 命。各难度答完指定题数（简单 10 / 困难 15
            / 地狱 20）或生命归零即结算。
          </p>
          <p className="text-[#d4af37]/65">
            <b className="text-[#e8c766]">地狱</b>额外：每答完 2 道牌题插入 1 道
            <b className="text-[#e8c766]"> 常识题</b>，答对 +25 分、答错不扣命，仅作干扰。
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <p className="font-serif2 italic text-[#d4af37]/80 text-sm">示例：第 3 张 K♥ 与第 1 张 7♥</p>
          <div className="flex items-end gap-3">
            <PokerCard card={example[0]} size="sm" />
            <PokerCard card={example[1]} size="sm" dimmed />
            <span className="font-display text-[#d4af37]/60 pb-6">⟶</span>
            <PokerCard card={example[2]} size="md" />
          </div>
          <p className="font-body text-sm">
            花色 <span className="text-[#c8102e]">♥</span> 相同、点数 7≠K →
            <b className="text-[#e8c766] ml-1">花色相同</b>
          </p>
        </div>
      </div>
    </div>
  );
}

function FloatingCards() {
  const suits: Card[] = RANKS.slice(0, 6).map((r, i) => ({
    id: `f${i}`,
    suit: (['spades', 'hearts', 'clubs', 'diamonds'] as const)[i % 4],
    rank: r,
  }));
  return (
    <>
      {suits.map((c, i) => (
        <div
          key={c.id}
          className="absolute opacity-[0.07] pointer-events-none anim-floaty"
          style={{
            left: `${8 + i * 16}%`,
            top: `${20 + (i % 3) * 22}%`,
            transform: `rotate(${(i % 2 ? -1 : 1) * 12}deg)`,
            animationDelay: `${i * 0.6}s`,
          }}
        >
          <span className="text-[#d4af37] text-7xl">{SUIT_SYMBOL[c.suit]}</span>
        </div>
      ))}
    </>
  );
}
