import { useGameStore } from '@/store/useGameStore';
import PokerCard from '@/components/PokerCard';

export default function ResultPage() {
  const score = useGameStore((s) => s.score);
  const difficulty = useGameStore((s) => s.difficulty);
  const lives = useGameStore((s) => s.lives);
  const totalAnswered = useGameStore((s) => s.totalAnswered);
  const correctCount = useGameStore((s) => s.correctCount);
  const bestStreak = useGameStore((s) => s.bestStreak);
  const played = useGameStore((s) => s.played);
  const startedAt = useGameStore((s) => s.startedAt);
  const endedAt = useGameStore((s) => s.endedAt);
  const isNewHighScore = useGameStore((s) => s.isNewHighScore);
  const highScores = useGameStore((s) => s.highScores);
  const triviaCorrectCount = useGameStore((s) => s.triviaCorrectCount);
  const triviaAnsweredTotal = useGameStore((s) => s.triviaAnsweredTotal);
  const restart = useGameStore((s) => s.restart);
  const backToMenu = useGameStore((s) => s.backToMenu);

  const accuracy =
    totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
  const cleared = lives > 0;
  const durationSec = endedAt
    ? Math.max(0, Math.round((endedAt - startedAt) / 1000))
    : 0;
  const mm = String(Math.floor(durationSec / 60)).padStart(2, '0');
  const ss = String(durationSec % 60).padStart(2, '0');

  const titleColor = cleared ? 'text-[#e8c766]' : 'text-[#c8102e]';

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      <div className="deco-sunburst anim-spin-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[120vh] w-[120vh] opacity-40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl flex flex-col items-center anim-fade-up">
        <div className="flex items-center gap-3 font-display text-[11px] tracking-[0.5em] text-[#d4af37]/70 mb-4">
          <span>◆</span>
          <span>对局结束</span>
          <span>◆</span>
        </div>

        <h1 className={`font-display font-extrabold text-5xl md:text-6xl ${titleColor}`}>
          {cleared ? '通 关' : '挑 战 失 败'}
        </h1>
        <p className="font-serif2 italic text-[#d4af37]/80 text-lg mt-2">
          {difficulty.label} 模式 · 发出 {played.length} 张
        </p>

        <div className="gold-divider mt-5 w-64">
          <span className="text-[#d4af37] text-sm">✦</span>
        </div>

        {/* 总分 */}
        <div className="mt-4 flex flex-col items-center">
          <span className="font-body text-xs tracking-widest text-[#d4af37]/60 uppercase">
            总 分
          </span>
          <span className="gold-foil font-display font-extrabold text-7xl md:text-8xl leading-none mt-1">
            {score}
          </span>
          {isNewHighScore && (
            <span className="mt-2 px-3 py-1 rounded-full border border-[#e8c766] bg-[#d4af37]/15 font-display text-xs tracking-widest text-[#e8c766] anim-pop">
              ✦ 新纪录 ✦
            </span>
          )}
        </div>

        {/* 数据网格 */}
        <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
          <DataCell label="正确率" value={`${accuracy}%`} />
          <DataCell label="答对题数" value={`${correctCount}/${totalAnswered}`} />
          <DataCell label="最长连击" value={`×${bestStreak}`} />
          <DataCell label="用时" value={`${mm}:${ss}`} />
        </div>

        <div className="mt-4 font-body text-xs text-[#d4af37]/50">
          {difficulty.label}最高分：
          <span className="text-[#e8c766] ml-1 font-display">
            {highScores[difficulty.key] || 0}
          </span>
        </div>

        {difficulty.hasTrivia && (
          <div className="mt-1 font-body text-xs text-[#d4af37]/55">
            常识题：
            <span className="text-[#f5efe0] ml-1">
              {triviaCorrectCount}/{triviaAnsweredTotal} 答对
            </span>
          </div>
        )}

        {/* 末牌展示 */}
        {played.length > 0 && (
          <div className="mt-6 flex items-center gap-4 opacity-80">
            <div className="flex flex-col items-center gap-1">
              <PokerCard card={played[played.length - 1]} size="sm" />
              <span className="font-body text-[10px] text-[#d4af37]/50">末张</span>
            </div>
            {played.length > 1 && (
              <div className="flex flex-col items-center gap-1">
                <PokerCard card={played[played.length - 2]} size="sm" dimmed />
                <span className="font-body text-[10px] text-[#d4af37]/50">上一张</span>
              </div>
            )}
          </div>
        )}

        {/* 操作 */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <button
            type="button"
            onClick={restart}
            className="flex-1 rounded-xl border border-[#e8c766] bg-[#d4af37]/15 py-3 font-display tracking-widest text-[#f5efe0] transition-all hover:bg-[#d4af37]/30 hover:shadow-[0_0_24px_rgba(212,175,55,0.45)]"
          >
            再 来 一 局
          </button>
          <button
            type="button"
            onClick={backToMenu}
            className="flex-1 rounded-xl border border-[#d4af37]/45 bg-[#0b0e14]/40 py-3 font-display tracking-widest text-[#d4af37]/85 transition-all hover:border-[#e8c766] hover:text-[#f5efe0]"
          >
            返回主菜单
          </button>
        </div>
      </div>
    </div>
  );
}

function DataCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#d4af37]/25 bg-[#0b0e14]/60 px-3 py-3 flex flex-col items-center">
      <span className="font-body text-[10px] tracking-widest text-[#d4af37]/55 uppercase">
        {label}
      </span>
      <span className="font-display text-xl text-[#f5efe0] mt-1">{value}</span>
    </div>
  );
}
