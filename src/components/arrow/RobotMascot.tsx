"use client"

export default function RobotMascot({ size = 240 }: { size?: number }) {
  return (
    <>
      <style>{`
        @keyframes bunny-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes ear-left {
          0%, 60%, 100% { transform: rotate(0deg); }
          75%  { transform: rotate(-6deg); }
          85%  { transform: rotate(4deg); }
        }
        @keyframes ear-right {
          0%, 60%, 100% { transform: rotate(0deg); }
          70%  { transform: rotate(5deg); }
          85%  { transform: rotate(-3deg); }
        }
        @keyframes eye-glow {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.55; }
        }
        @keyframes antenna-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes carrot-bob {
          0%, 100% { transform: translateY(0) rotate(-8deg); }
          50%       { transform: translateY(-4px) rotate(-5deg); }
        }
        .bunny-float   { animation: bunny-float 3s ease-in-out infinite; }
        .ear-left-anim {
          transform-origin: 82px 128px;
          transform-box: fill-box;
          animation: ear-left 3s ease-in-out infinite;
        }
        .ear-right-anim {
          transform-origin: 178px 128px;
          transform-box: fill-box;
          animation: ear-right 3s ease-in-out infinite 0.15s;
        }
        .eye-glow-anim { animation: eye-glow 2s ease-in-out infinite; }
        .carrot-anim   { animation: carrot-bob 3s ease-in-out infinite; }
      `}</style>

      <svg
        width={size}
        height={size * 1.5}
        viewBox="-8 -20 276 390"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="bunny-float">

          {/* ── LEFT EAR ── */}
          <g className="ear-left-anim">
            <ellipse cx="82" cy="72" rx="27" ry="66" fill="white" stroke="#1B3A8F" strokeWidth="5"/>
            <ellipse cx="82" cy="75" rx="16" ry="54" fill="#1B3A8F"/>
            <ellipse cx="82" cy="75" rx="10" ry="46" fill="#120E2E"/>
          </g>

          {/* ── RIGHT EAR ── */}
          <g className="ear-right-anim">
            <ellipse cx="178" cy="72" rx="27" ry="66" fill="white" stroke="#1B3A8F" strokeWidth="5"/>
            <ellipse cx="178" cy="75" rx="16" ry="54" fill="#1B3A8F"/>
            <ellipse cx="178" cy="75" rx="10" ry="46" fill="#120E2E"/>
          </g>

          {/* ── HEAD ── */}
          <circle cx="130" cy="152" r="82" fill="white" stroke="#1B3A8F" strokeWidth="5"/>
          {/* head top shine */}
          <ellipse cx="118" cy="88" rx="18" ry="8" fill="rgba(255,255,255,0.5)" transform="rotate(-25,118,88)"/>

          {/* Orange forehead gem */}
          <ellipse cx="130" cy="106" rx="20" ry="15" fill="#F7921E" stroke="#1B3A8F" strokeWidth="3"/>
          <ellipse cx="127" cy="102" rx="7" ry="5" fill="rgba(255,255,255,0.45)"/>

          {/* Dark visor */}
          <ellipse cx="130" cy="164" rx="65" ry="56" fill="#1B3A8F" stroke="#1B3A8F" strokeWidth="2"/>
          <ellipse cx="130" cy="164" rx="59" ry="50" fill="#120E2E"/>
          {/* visor inner glow rim */}
          <ellipse cx="130" cy="164" rx="59" ry="50" fill="none" stroke="#2D1B6E" strokeWidth="4"/>

          {/* Happy eyes — amber crescent arcs */}
          <g className="eye-glow-anim">
            <path d="M95 156 Q108 175 121 156" stroke="#FFB800" strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d="M97 157 Q108 173 119 157" stroke="#FFF0A0" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7"/>
            <path d="M143 156 Q156 175 169 156" stroke="#FFB800" strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d="M145 157 Q156 173 167 157" stroke="#FFF0A0" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7"/>
          </g>

          {/* Cheek blush */}
          <ellipse cx="98"  cy="182" rx="13" ry="9" fill="#F7921E" opacity="0.3"/>
          <ellipse cx="162" cy="182" rx="13" ry="9" fill="#F7921E" opacity="0.3"/>

          {/* ── BODY ── */}
          <ellipse cx="130" cy="268" rx="90" ry="74" fill="white" stroke="#1B3A8F" strokeWidth="5"/>
          {/* Body inner oval panel */}
          <ellipse cx="130" cy="270" rx="64" ry="52" fill="#EEF0FF" stroke="#1B3A8F" strokeWidth="2.5"/>
          {/* Panel shine */}
          <ellipse cx="115" cy="238" rx="20" ry="8" fill="rgba(255,255,255,0.6)" transform="rotate(-10,115,238)"/>

          {/* ── LEFT ARM ── */}
          <ellipse cx="44" cy="256" rx="21" ry="38" fill="white" stroke="#1B3A8F" strokeWidth="4.5"/>
          <circle cx="62" cy="222" r="9" fill="#F7921E" stroke="#1B3A8F" strokeWidth="2.5"/>

          {/* ── RIGHT ARM ── */}
          <ellipse cx="216" cy="256" rx="21" ry="38" fill="white" stroke="#1B3A8F" strokeWidth="4.5"/>
          <circle cx="198" cy="222" r="9" fill="#F7921E" stroke="#1B3A8F" strokeWidth="2.5"/>

          {/* ── CARROT (held in centre) ── */}
          <g className="carrot-anim">
            {/* Green tops */}
            <path d="M116 258 C104 238, 118 228, 124 244" stroke="#22C55E" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <path d="M123 254 C121 234, 131 230, 129 246" stroke="#16A34A" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <path d="M129 252 C133 232, 143 234, 137 248" stroke="#22C55E" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            {/* Carrot body */}
            <ellipse cx="128" cy="284" rx="12" ry="30" fill="#F97316" stroke="#1B3A8F" strokeWidth="2.5" transform="rotate(-8, 128, 284)"/>
            {/* Carrot stripes */}
            <line x1="122" y1="268" x2="120" y2="298" stroke="#EA580C" strokeWidth="1.5" opacity="0.5" transform="rotate(-8, 121, 283)"/>
            <line x1="128" y1="265" x2="126" y2="302" stroke="#EA580C" strokeWidth="1.5" opacity="0.5" transform="rotate(-8, 127, 283)"/>
          </g>

          {/* ── FEET ── */}
          <ellipse cx="92"  cy="328" rx="35" ry="19" fill="white" stroke="#1B3A8F" strokeWidth="4.5"/>
          <ellipse cx="168" cy="328" rx="35" ry="19" fill="white" stroke="#1B3A8F" strokeWidth="4.5"/>
          {/* Foot orange accents */}
          <ellipse cx="72"  cy="334" rx="10" ry="8" fill="#F7921E" stroke="#1B3A8F" strokeWidth="2"/>
          <ellipse cx="148" cy="334" rx="10" ry="8" fill="#F7921E" stroke="#1B3A8F" strokeWidth="2"/>

        </g>
      </svg>
    </>
  )
}
