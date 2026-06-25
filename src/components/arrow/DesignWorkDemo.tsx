/**
 * Session 1 · "What Makes Design Work?" teaching visual.
 * A side-by-side of the SAME poster done badly vs well, so students can
 * see contrast, hierarchy, and focus instead of just reading about them.
 * Hand-built SVG — crisp at any size, no external dependency.
 */

function BadPoster() {
  return (
    <svg viewBox="0 0 240 320" className="w-full h-auto rounded-2xl" style={{ display: "block" }}>
      {/* Clashing low-contrast background */}
      <rect width="240" height="320" fill="#E11D48" />
      {/* Too many competing colors */}
      <rect x="0" y="0" width="240" height="60" fill="#7C3AED" />
      {/* Headline — orange on red = low contrast, hard to read */}
      <text x="120" y="38" textAnchor="middle" fontSize="26" fontWeight="900" fill="#F97316" fontFamily="Georgia, serif">SLIME SALE</text>
      {/* Clutter: random clip-art everywhere */}
      <text x="30" y="100" fontSize="28">🤪</text>
      <text x="195" y="95" fontSize="26">💸</text>
      <text x="200" y="240" fontSize="30">🎈</text>
      <text x="20" y="250" fontSize="24">⭐</text>
      {/* Mixed fonts, mixed sizes, no hierarchy */}
      <text x="120" y="140" textAnchor="middle" fontSize="13" fontWeight="700" fill="#FDE047" fontFamily="Comic Sans MS, cursive">the best slime ever!!!</text>
      <text x="120" y="165" textAnchor="middle" fontSize="11" fill="#A7F3D0" fontFamily="Courier, monospace">come and buy some slime today ok</text>
      <text x="120" y="186" textAnchor="middle" fontSize="15" fontWeight="700" fill="#60A5FA" fontFamily="Georgia, serif">SO MUCH FUN WOW</text>
      {/* The important info — tiny and buried */}
      <text x="120" y="290" textAnchor="middle" fontSize="8" fill="#FDA4AF">saturday 10am · room 4 · $3 each</text>
    </svg>
  )
}

function GoodPoster() {
  return (
    <svg viewBox="0 0 240 320" className="w-full h-auto rounded-2xl" style={{ display: "block" }}>
      {/* Clean, calm background */}
      <rect width="240" height="320" fill="#0F172A" />
      {/* One bright focal accent */}
      <rect x="0" y="0" width="240" height="8" fill="#22D3EE" />
      {/* Single big, high-contrast headline */}
      <text x="120" y="78" textAnchor="middle" fontSize="40" fontWeight="900" fill="#FFFFFF" fontFamily="Arial, sans-serif" letterSpacing="1">SLIME</text>
      <text x="120" y="116" textAnchor="middle" fontSize="40" fontWeight="900" fill="#22D3EE" fontFamily="Arial, sans-serif" letterSpacing="1">SALE</text>
      {/* One focal image, centered */}
      <text x="120" y="190" textAnchor="middle" fontSize="64">🫧</text>
      {/* Clear supporting line */}
      <text x="120" y="232" textAnchor="middle" fontSize="13" fontWeight="700" fill="#CBD5E1" fontFamily="Arial, sans-serif">Handmade · Super stretchy</text>
      {/* Clear call to action — big and obvious */}
      <rect x="50" y="258" width="140" height="34" rx="17" fill="#22D3EE" />
      <text x="120" y="280" textAnchor="middle" fontSize="14" fontWeight="900" fill="#0F172A" fontFamily="Arial, sans-serif">SAT 10AM · $3</text>
    </svg>
  )
}

export default function DesignWorkDemo() {
  return (
    <div className="rounded-3xl p-6 sm:p-8" style={{ background: "white", border: "2px solid #E2E8F0", boxShadow: "0 4px 16px -4px rgba(0,0,0,0.06)" }}>
      {/* Pro example hero */}
      <div className="flex flex-col sm:flex-row gap-5 items-center mb-8 pb-8" style={{ borderBottom: "2px solid #F1F5F9" }}>
        <img
          src="/lessons/slime-hero.png"
          alt="Example of a clean, professional slime poster"
          className="rounded-2xl w-40 sm:w-44 shrink-0"
          style={{ boxShadow: "0 8px 24px -6px rgba(15,23,42,0.3)" }}
        />
        <div>
          <span className="px-2.5 py-1 rounded-full text-xs font-black" style={{ background: "#EEF2FF", color: "#4338CA" }}>✨ A pro example</span>
          <h2 className="text-xl font-black mt-2" style={{ color: "#1E293B" }}>What great design looks like</h2>
          <p className="text-sm font-semibold mt-1" style={{ color: "#64748B" }}>
            Notice: you can read <strong style={{ color: "#1E293B" }}>SLIME</strong> instantly, there&apos;s one big picture,
            and the <strong style={{ color: "#1E293B" }}>SHOP NOW</strong> button tells you exactly what to do.
            By Session 6, you&apos;ll make designs like this for your own business.
          </p>
        </div>
      </div>

      <h2 className="text-xl font-black" style={{ color: "#1E293B" }}>👀 Same sale. Which poster works?</h2>
      <p className="text-sm font-semibold mt-1 mb-5" style={{ color: "#64748B" }}>
        Both posters are for the exact same slime sale. One is hard to read. One you can understand in a second.
      </p>

      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {/* Bad */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-black" style={{ background: "#FEE2E2", color: "#B91C1C" }}>❌ Hard to read</span>
          </div>
          <BadPoster />
        </div>
        {/* Good */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-black" style={{ background: "#DCFCE7", color: "#15803D" }}>✅ Easy to read</span>
          </div>
          <GoodPoster />
        </div>
      </div>

      {/* What changed */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: "🔆", term: "Contrast", text: "Light text on a dark background — you can read it from across the room." },
          { icon: "📏", term: "Hierarchy", text: "The biggest thing is the most important thing. Your eye knows where to look." },
          { icon: "🎯", term: "Focus", text: "One picture, not ten. Less clutter means a clearer message." },
        ].map((item) => (
          <div key={item.term} className="rounded-2xl p-4" style={{ background: "#F8FAFC" }}>
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="font-black text-sm" style={{ color: "#1E293B" }}>{item.term}</div>
            <div className="text-xs font-semibold mt-0.5" style={{ color: "#64748B" }}>{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
