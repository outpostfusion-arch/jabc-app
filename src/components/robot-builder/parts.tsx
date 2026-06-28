import type { RobotColors } from "./types"

export interface PartOption {
  id: string
  name: string
  render: (c: RobotColors) => React.ReactNode
}

// ─── HEADS (viewBox 0 0 200 400, head occupies y=38–140) ─────────────────────

export const HEADS: PartOption[] = [
  {
    id: "orb", name: "Orb",
    render: ({ primary, accent }) => (
      <g>
        <circle cx="100" cy="89" r="51" fill={primary} />
        <circle cx="100" cy="89" r="51" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="3" />
        <circle cx="80" cy="70" r="8" fill="rgba(255,255,255,0.18)" />
      </g>
    ),
  },
  {
    id: "box", name: "Box",
    render: ({ primary }) => (
      <g>
        <rect x="49" y="38" width="102" height="102" rx="14" fill={primary} />
        <rect x="49" y="38" width="102" height="102" rx="14" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="3" />
        <rect x="57" y="46" width="14" height="9" rx="3" fill="rgba(255,255,255,0.18)" />
      </g>
    ),
  },
  {
    id: "hex", name: "Hex",
    render: ({ primary }) => (
      <g>
        <polygon points="100,38 151,66 151,114 100,140 49,114 49,66" fill={primary} />
        <polygon points="100,38 151,66 151,114 100,140 49,114 49,66" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="3" />
      </g>
    ),
  },
  {
    id: "wide", name: "Wide",
    render: ({ primary }) => (
      <g>
        <rect x="28" y="55" width="144" height="82" rx="24" fill={primary} />
        <rect x="28" y="55" width="144" height="82" rx="24" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="3" />
        <circle cx="70" cy="68" r="5" fill="rgba(255,255,255,0.18)" />
      </g>
    ),
  },
  {
    id: "dome", name: "Dome",
    render: ({ primary }) => (
      <g>
        <path d="M49,112 A51,74 0 0,1 151,112 L155,140 L45,140 Z" fill={primary} />
        <ellipse cx="100" cy="140" rx="55" ry="7" fill={primary} />
        <path d="M49,112 A51,74 0 0,1 151,112" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="3" />
      </g>
    ),
  },
]

// ─── FACES (rendered inside head, y≈70–110) ──────────────────────────────────

export const FACES: PartOption[] = [
  {
    id: "pixel", name: "Pixel Eyes",
    render: ({ accent }) => (
      <g>
        <rect x="71" y="76" width="16" height="12" rx="3" fill={accent} />
        <rect x="113" y="76" width="16" height="12" rx="3" fill={accent} />
        <rect x="82" y="100" width="36" height="5" rx="2.5" fill="rgba(255,255,255,0.35)" />
      </g>
    ),
  },
  {
    id: "visor", name: "Visor",
    render: ({ accent }) => (
      <g>
        <rect x="60" y="73" width="80" height="18" rx="9" fill={accent} />
        <rect x="63" y="76" width="72" height="9" rx="4" fill="rgba(255,255,255,0.22)" />
      </g>
    ),
  },
  {
    id: "hearts", name: "Heart Eyes",
    render: ({ accent }) => (
      <g>
        <path d="M79,73 C79,69 73,69 73,75 C73,81 79,85 79,85 C79,85 85,81 85,75 C85,69 79,69 79,73Z" fill={accent} />
        <path d="M121,73 C121,69 115,69 115,75 C115,81 121,85 121,85 C121,85 127,81 127,75 C127,69 121,69 121,73Z" fill={accent} />
      </g>
    ),
  },
  {
    id: "cyclops", name: "Cyclops",
    render: ({ accent }) => (
      <g>
        <circle cx="100" cy="82" r="18" fill={accent} />
        <circle cx="100" cy="82" r="11" fill="rgba(0,0,0,0.55)" />
        <circle cx="105" cy="77" r="4" fill="rgba(255,255,255,0.7)" />
      </g>
    ),
  },
  {
    id: "sleepy", name: "Sleepy",
    render: ({ accent }) => (
      <g>
        <path d="M71,80 Q79,72 87,80" fill="none" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M113,80 Q121,72 129,80" fill="none" stroke={accent} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M84,100 Q100,108 116,100" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    ),
  },
]

// ─── ANTENNAS (above head, y=0–38) ───────────────────────────────────────────

export const ANTENNAS: PartOption[] = [
  {
    id: "none", name: "None",
    render: () => null,
  },
  {
    id: "ball", name: "Ball",
    render: ({ accent }) => (
      <g>
        <line x1="100" y1="38" x2="100" y2="18" stroke={accent} strokeWidth="5" strokeLinecap="round" />
        <circle cx="100" cy="11" r="9" fill={accent} />
      </g>
    ),
  },
  {
    id: "spike", name: "Spike",
    render: ({ accent }) => (
      <g>
        <polygon points="100,3 108,36 92,36" fill={accent} />
      </g>
    ),
  },
  {
    id: "star", name: "Star",
    render: ({ accent }) => (
      <g>
        <line x1="100" y1="38" x2="100" y2="22" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        <polygon points="100,6 103,16 113,16 105,22 108,32 100,26 92,32 95,22 87,16 97,16" fill={accent} />
      </g>
    ),
  },
  {
    id: "double", name: "Double",
    render: ({ primary, accent }) => (
      <g>
        <line x1="87" y1="38" x2="80" y2="16" stroke={primary} strokeWidth="4" strokeLinecap="round" />
        <circle cx="78" cy="10" r="7" fill={accent} />
        <line x1="113" y1="38" x2="120" y2="16" stroke={primary} strokeWidth="4" strokeLinecap="round" />
        <circle cx="122" cy="10" r="7" fill={accent} />
      </g>
    ),
  },
]

// ─── BODIES (y=150–268, cx=100) ──────────────────────────────────────────────

export const BODIES: PartOption[] = [
  {
    id: "classic", name: "Classic",
    render: ({ primary, accent }) => (
      <g>
        <rect x="65" y="150" width="70" height="118" rx="13" fill={primary} />
        <rect x="65" y="150" width="70" height="118" rx="13" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
        <rect x="79" y="165" width="42" height="30" rx="7" fill={accent} opacity="0.55" />
        <circle cx="92" cy="215" r="7" fill={accent} opacity="0.7" />
        <circle cx="108" cy="215" r="7" fill={accent} opacity="0.7" />
      </g>
    ),
  },
  {
    id: "chunky", name: "Chunky",
    render: ({ primary, accent }) => (
      <g>
        <rect x="50" y="150" width="100" height="118" rx="18" fill={primary} />
        <rect x="50" y="150" width="100" height="118" rx="18" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
        <rect x="67" y="167" width="66" height="38" rx="9" fill={accent} opacity="0.45" />
        <rect x="78" y="224" width="44" height="9" rx="4.5" fill="rgba(0,0,0,0.13)" />
      </g>
    ),
  },
  {
    id: "slim", name: "Slim",
    render: ({ primary, accent }) => (
      <g>
        <rect x="77" y="150" width="46" height="118" rx="11" fill={primary} />
        <rect x="77" y="150" width="46" height="118" rx="11" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
        <rect x="85" y="163" width="30" height="22" rx="6" fill={accent} opacity="0.5" />
        <line x1="100" y1="202" x2="100" y2="256" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
      </g>
    ),
  },
  {
    id: "armored", name: "Armored",
    render: ({ primary, accent }) => (
      <g>
        <ellipse cx="60" cy="158" rx="17" ry="11" fill={accent} />
        <ellipse cx="140" cy="158" rx="17" ry="11" fill={accent} />
        <rect x="58" y="150" width="84" height="118" rx="12" fill={primary} />
        <rect x="58" y="150" width="84" height="118" rx="12" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
        <path d="M76,167 L124,167 L120,198 L80,198 Z" fill={accent} opacity="0.45" />
      </g>
    ),
  },
  {
    id: "barrel", name: "Barrel",
    render: ({ primary, accent }) => (
      <g>
        <ellipse cx="100" cy="209" rx="50" ry="62" fill={primary} />
        <ellipse cx="100" cy="209" rx="50" ry="62" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
        <ellipse cx="100" cy="172" rx="40" ry="11" fill={accent} opacity="0.35" />
        <ellipse cx="100" cy="209" rx="42" ry="11" fill={accent} opacity="0.22" />
        <ellipse cx="100" cy="246" rx="40" ry="11" fill={accent} opacity="0.35" />
      </g>
    ),
  },
]

// ─── ARMS (alongside body, y=155–250) ────────────────────────────────────────

export const ARMS: PartOption[] = [
  {
    id: "standard", name: "Standard",
    render: ({ primary }) => (
      <g>
        <rect x="27" y="158" width="37" height="90" rx="11" fill={primary} />
        <rect x="136" y="158" width="37" height="90" rx="11" fill={primary} />
        <rect x="27" y="158" width="37" height="90" rx="11" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
        <rect x="136" y="158" width="37" height="90" rx="11" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
      </g>
    ),
  },
  {
    id: "thin", name: "Thin",
    render: ({ primary }) => (
      <g>
        <rect x="37" y="158" width="22" height="90" rx="7" fill={primary} />
        <rect x="141" y="158" width="22" height="90" rx="7" fill={primary} />
        <rect x="37" y="158" width="22" height="90" rx="7" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
        <rect x="141" y="158" width="22" height="90" rx="7" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
      </g>
    ),
  },
  {
    id: "spring", name: "Spring",
    render: ({ primary }) => (
      <g>
        <path d="M46,158 C34,173 58,188 46,203 C34,218 58,233 46,248" fill="none" stroke={primary} strokeWidth="7" strokeLinecap="round" />
        <path d="M154,158 C166,173 142,188 154,203 C166,218 142,233 154,248" fill="none" stroke={primary} strokeWidth="7" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "muscular", name: "Muscular",
    render: ({ primary, accent }) => (
      <g>
        <rect x="22" y="158" width="42" height="52" rx="14" fill={primary} />
        <rect x="27" y="207" width="32" height="44" rx="9" fill={accent} />
        <rect x="136" y="158" width="42" height="52" rx="14" fill={primary} />
        <rect x="141" y="207" width="32" height="44" rx="9" fill={accent} />
        <rect x="22" y="158" width="42" height="52" rx="14" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
        <rect x="136" y="158" width="42" height="52" rx="14" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
      </g>
    ),
  },
  {
    id: "claw", name: "Claw Arm",
    render: ({ primary, accent }) => (
      <g>
        <rect x="30" y="158" width="30" height="82" rx="9" fill={primary} />
        <path d="M30,240 L18,268 M45,240 L39,268 M60,240 L52,268" stroke={accent} strokeWidth="6" strokeLinecap="round" />
        <rect x="140" y="158" width="30" height="82" rx="9" fill={primary} />
        <path d="M140,240 L148,268 M155,240 L161,268 M170,240 L182,268" stroke={accent} strokeWidth="6" strokeLinecap="round" />
      </g>
    ),
  },
]

// ─── HANDS (y=248–280) ───────────────────────────────────────────────────────

export const HANDS: PartOption[] = [
  {
    id: "fist", name: "Fist",
    render: ({ accent }) => (
      <g>
        <rect x="25" y="248" width="40" height="30" rx="9" fill={accent} />
        <rect x="135" y="248" width="40" height="30" rx="9" fill={accent} />
        {[38, 47, 56].map(x => <line key={x} x1={x} y1="248" x2={x} y2="278" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />)}
        {[148, 157, 166].map(x => <line key={x} x1={x} y1="248" x2={x} y2="278" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />)}
      </g>
    ),
  },
  {
    id: "open", name: "Open Palm",
    render: ({ accent }) => (
      <g>
        <rect x="27" y="252" width="36" height="20" rx="5" fill={accent} />
        {[29,37,45,53].map((x,i) => <rect key={i} x={x} y={i===1?236:238} width="6" height={i===1?18:16} rx="3" fill={accent} />)}
        <rect x="135" y="252" width="36" height="20" rx="5" fill={accent} />
        {[137,145,153,161].map((x,i) => <rect key={i} x={x} y={i===1?236:238} width="6" height={i===1?18:16} rx="3" fill={accent} />)}
      </g>
    ),
  },
  {
    id: "claw", name: "Claw",
    render: ({ accent }) => (
      <g>
        <path d="M34,248 L22,274 M46,248 L40,274 M56,248 L50,274" stroke={accent} strokeWidth="6" strokeLinecap="round" />
        <path d="M144,248 L150,274 M154,248 L160,274 M166,248 L178,274" stroke={accent} strokeWidth="6" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "pincer", name: "Pincer",
    render: ({ accent }) => (
      <g>
        <path d="M45,248 Q28,258 24,268 Q20,278 32,280" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" />
        <path d="M45,248 Q28,258 24,268 Q22,274 38,274" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" />
        <path d="M155,248 Q172,258 176,268 Q180,278 168,280" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" />
        <path d="M155,248 Q172,258 176,268 Q178,274 162,274" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "mitten", name: "Mitten",
    render: ({ accent }) => (
      <g>
        <ellipse cx="45" cy="264" rx="21" ry="17" fill={accent} />
        <rect x="51" y="248" width="9" height="20" rx="4.5" fill={accent} />
        <ellipse cx="155" cy="264" rx="21" ry="17" fill={accent} />
        <rect x="140" y="248" width="9" height="20" rx="4.5" fill={accent} />
      </g>
    ),
  },
]

// ─── LEGS (y=268–360) ────────────────────────────────────────────────────────

export const LEGS: PartOption[] = [
  {
    id: "standard", name: "Standard",
    render: ({ primary }) => (
      <g>
        <rect x="67" y="268" width="30" height="90" rx="11" fill={primary} />
        <rect x="103" y="268" width="30" height="90" rx="11" fill={primary} />
        <rect x="67" y="268" width="30" height="90" rx="11" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
        <rect x="103" y="268" width="30" height="90" rx="11" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
      </g>
    ),
  },
  {
    id: "stilts", name: "Stilts",
    render: ({ primary }) => (
      <g>
        <rect x="77" y="268" width="14" height="110" rx="5" fill={primary} />
        <rect x="109" y="268" width="14" height="110" rx="5" fill={primary} />
      </g>
    ),
  },
  {
    id: "short", name: "Short & Wide",
    render: ({ primary }) => (
      <g>
        <rect x="58" y="268" width="38" height="56" rx="11" fill={primary} />
        <rect x="104" y="268" width="38" height="56" rx="11" fill={primary} />
        <rect x="58" y="268" width="38" height="56" rx="11" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
        <rect x="104" y="268" width="38" height="56" rx="11" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="2" />
      </g>
    ),
  },
  {
    id: "spring", name: "Spring",
    render: ({ primary }) => (
      <g>
        <path d="M82,268 C68,286 96,303 82,320 C68,337 96,354 82,360" fill="none" stroke={primary} strokeWidth="8" strokeLinecap="round" />
        <path d="M118,268 C132,286 104,303 118,320 C132,337 104,354 118,360" fill="none" stroke={primary} strokeWidth="8" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: "hover", name: "Hover Pad",
    render: ({ primary, accent }) => (
      <g>
        <path d="M72,268 L58,342 L98,342 L84,268 Z" fill={primary} />
        <path d="M116,268 L102,342 L142,342 L128,268 Z" fill={primary} />
        <ellipse cx="78" cy="342" rx="22" ry="6" fill={accent} opacity="0.65" />
        <ellipse cx="122" cy="342" rx="22" ry="6" fill={accent} opacity="0.65" />
      </g>
    ),
  },
]

// ─── FEET (y=354–398) ────────────────────────────────────────────────────────

export const FEET: PartOption[] = [
  {
    id: "boots", name: "Boots",
    render: ({ accent }) => (
      <g>
        <rect x="56" y="354" width="50" height="26" rx="11" fill={accent} />
        <rect x="60" y="348" width="26" height="16" rx="7" fill={accent} />
        <rect x="94" y="354" width="50" height="26" rx="11" fill={accent} />
        <rect x="114" y="348" width="26" height="16" rx="7" fill={accent} />
      </g>
    ),
  },
  {
    id: "wheels", name: "Wheels",
    render: ({ primary, accent }) => (
      <g>
        <circle cx="82" cy="368" r="21" fill={accent} />
        <circle cx="82" cy="368" r="13" fill={primary} />
        <circle cx="82" cy="368" r="5" fill={accent} />
        <circle cx="118" cy="368" r="21" fill={accent} />
        <circle cx="118" cy="368" r="13" fill={primary} />
        <circle cx="118" cy="368" r="5" fill={accent} />
      </g>
    ),
  },
  {
    id: "rockets", name: "Rockets",
    render: ({ primary, accent }) => (
      <g>
        <rect x="67" y="354" width="30" height="24" rx="7" fill={accent} />
        <polygon points="67,354 82,340 97,354" fill={primary} />
        <path d="M70,378 L62,396 M82,378 L82,396 M94,378 L90,396" stroke="#FF6B35" strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
        <rect x="103" y="354" width="30" height="24" rx="7" fill={accent} />
        <polygon points="103,354 118,340 133,354" fill={primary} />
        <path d="M106,378 L98,396 M118,378 L118,396 M130,378 L126,396" stroke="#FF6B35" strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
      </g>
    ),
  },
  {
    id: "duck", name: "Duck Feet",
    render: ({ accent }) => (
      <g>
        <path d="M54,357 Q68,350 82,357 Q96,364 108,357 L104,374 Q90,382 68,382 Q50,378 48,368 Z" fill={accent} />
        <path d="M92,357 Q106,350 120,357 Q134,364 148,357 L146,374 Q132,382 110,382 Q92,378 90,368 Z" fill={accent} />
      </g>
    ),
  },
  {
    id: "blocks", name: "Blocks",
    render: ({ accent }) => (
      <g>
        <rect x="58" y="354" width="46" height="30" rx="7" fill={accent} />
        <rect x="96" y="354" width="46" height="30" rx="7" fill={accent} />
        <line x1="58" y1="369" x2="104" y2="369" stroke="rgba(0,0,0,0.14)" strokeWidth="2" />
        <line x1="81" y1="354" x2="81" y2="384" stroke="rgba(0,0,0,0.14)" strokeWidth="2" />
        <line x1="96" y1="369" x2="142" y2="369" stroke="rgba(0,0,0,0.14)" strokeWidth="2" />
        <line x1="119" y1="354" x2="119" y2="384" stroke="rgba(0,0,0,0.14)" strokeWidth="2" />
      </g>
    ),
  },
]

// ─── Lookup maps ─────────────────────────────────────────────────────────────

export const PART_MAP = {
  head:     Object.fromEntries(HEADS.map(p => [p.id, p])),
  face:     Object.fromEntries(FACES.map(p => [p.id, p])),
  antenna:  Object.fromEntries(ANTENNAS.map(p => [p.id, p])),
  body:     Object.fromEntries(BODIES.map(p => [p.id, p])),
  arms:     Object.fromEntries(ARMS.map(p => [p.id, p])),
  hands:    Object.fromEntries(HANDS.map(p => [p.id, p])),
  legs:     Object.fromEntries(LEGS.map(p => [p.id, p])),
  feet:     Object.fromEntries(FEET.map(p => [p.id, p])),
}

export const STEPS = [
  { key: "head"     as const, label: "Head",    emoji: "🔵", parts: HEADS     },
  { key: "face"     as const, label: "Face",    emoji: "👀", parts: FACES     },
  { key: "antenna"  as const, label: "Antenna", emoji: "📡", parts: ANTENNAS  },
  { key: "body"     as const, label: "Body",    emoji: "🫀", parts: BODIES    },
  { key: "arms"     as const, label: "Arms",    emoji: "💪", parts: ARMS      },
  { key: "hands"    as const, label: "Hands",   emoji: "✋", parts: HANDS     },
  { key: "legs"     as const, label: "Legs",    emoji: "🦵", parts: LEGS      },
  { key: "feet"     as const, label: "Feet",    emoji: "👟", parts: FEET      },
]
