"use client"

export const AVATAR_IDS = [
  "fox", "panda", "lion", "frog", "bear",
  "cat", "dog", "bunny", "tiger", "monkey",
  "elephant", "penguin", "owl", "koala", "wolf",
  "deer", "raccoon", "hedgehog", "duck", "hamster",
  "narwhal", "axolotl", "capybara",
] as const

export type AvatarId = typeof AVATAR_IDS[number]

export const AVATAR_NAMES: Record<AvatarId, string> = {
  fox: "Fox", panda: "Panda", lion: "Lion", frog: "Frog", bear: "Bear",
  cat: "Cat", dog: "Dog", bunny: "Bunny", tiger: "Tiger", monkey: "Monkey",
  elephant: "Elephant", penguin: "Penguin", owl: "Owl", koala: "Koala", wolf: "Wolf",
  deer: "Deer", raccoon: "Raccoon", hedgehog: "Hedgehog", duck: "Duck", hamster: "Hamster",
  narwhal: "Narwhal", axolotl: "Axolotl", capybara: "Capybara",
}

type SvgFn = (size: number) => React.ReactElement

const svgs: Record<AvatarId, SvgFn> = {
  fox: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#FF6B35"/>
      <polygon points="12,44 22,8 37,38" fill="#FF6B35"/>
      <polygon points="68,44 58,8 43,38" fill="#FF6B35"/>
      <polygon points="16,41 23,14 34,36" fill="#FFCBA4"/>
      <polygon points="64,41 57,14 46,36" fill="#FFCBA4"/>
      <circle cx="40" cy="46" r="24" fill="#FFCBA4"/>
      <ellipse cx="40" cy="56" rx="12" ry="8" fill="#FFF5EE"/>
      <circle cx="30" cy="43" r="6" fill="white"/><circle cx="50" cy="43" r="6" fill="white"/>
      <circle cx="31" cy="44" r="3.5" fill="#1a1a2e"/><circle cx="51" cy="44" r="3.5" fill="#1a1a2e"/>
      <circle cx="29" cy="42" r="1.3" fill="white"/><circle cx="49" cy="42" r="1.3" fill="white"/>
      <ellipse cx="40" cy="52" rx="3.5" ry="2.5" fill="#CC2200"/>
      <ellipse cx="22" cy="52" rx="5" ry="3" fill="#FF6B35" opacity="0.4"/>
      <ellipse cx="58" cy="52" rx="5" ry="3" fill="#FF6B35" opacity="0.4"/>
    </svg>
  ),
  panda: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#F0F4F8"/>
      <circle cx="17" cy="20" r="13" fill="#1E293B"/><circle cx="63" cy="20" r="13" fill="#1E293B"/>
      <circle cx="17" cy="20" r="8" fill="#334155"/><circle cx="63" cy="20" r="8" fill="#334155"/>
      <circle cx="40" cy="44" r="25" fill="white"/>
      <ellipse cx="28" cy="41" rx="9" ry="8" fill="#1E293B" transform="rotate(-12,28,41)"/>
      <ellipse cx="52" cy="41" rx="9" ry="8" fill="#1E293B" transform="rotate(12,52,41)"/>
      <circle cx="28" cy="41" r="5" fill="white"/><circle cx="52" cy="41" r="5" fill="white"/>
      <circle cx="29" cy="42" r="3" fill="#1a1a2e"/><circle cx="53" cy="42" r="3" fill="#1a1a2e"/>
      <circle cx="28" cy="40" r="1" fill="white"/><circle cx="52" cy="40" r="1" fill="white"/>
      <ellipse cx="40" cy="55" rx="10" ry="7" fill="#F1F5F9"/>
      <ellipse cx="40" cy="51" rx="3" ry="2.2" fill="#1E293B"/>
      <path d="M36,55 Q40,59 44,55" stroke="#94A3B8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  lion: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#F59E0B"/>
      <circle cx="40" cy="42" r="30" fill="#D97706" opacity="0.6"/>
      <circle cx="40" cy="42" r="24" fill="#FDE68A"/>
      <circle cx="24" cy="24" r="8" fill="#F59E0B"/>
      <circle cx="56" cy="24" r="8" fill="#F59E0B"/>
      <circle cx="24" cy="24" r="5" fill="#FDE68A"/>
      <circle cx="56" cy="24" r="5" fill="#FDE68A"/>
      <circle cx="30" cy="42" r="6" fill="white"/><circle cx="50" cy="42" r="6" fill="white"/>
      <circle cx="31" cy="43" r="3.5" fill="#92400E"/><circle cx="51" cy="43" r="3.5" fill="#92400E"/>
      <circle cx="29" cy="41" r="1.3" fill="white"/><circle cx="49" cy="41" r="1.3" fill="white"/>
      <ellipse cx="40" cy="56" rx="13" ry="9" fill="#FEF3C7"/>
      <ellipse cx="40" cy="52" rx="4" ry="3" fill="#D97706"/>
      <path d="M35,57 Q40,62 45,57" stroke="#D97706" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="24" cy="54" rx="5" ry="3" fill="#F59E0B" opacity="0.5"/>
      <ellipse cx="56" cy="54" rx="5" ry="3" fill="#F59E0B" opacity="0.5"/>
    </svg>
  ),
  frog: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#22C55E"/>
      <circle cx="22" cy="22" r="10" fill="#4ADE80"/>
      <circle cx="58" cy="22" r="10" fill="#4ADE80"/>
      <circle cx="22" cy="22" r="7" fill="white"/><circle cx="58" cy="22" r="7" fill="white"/>
      <circle cx="23" cy="23" r="4" fill="#14532D"/><circle cx="59" cy="23" r="4" fill="#14532D"/>
      <circle cx="22" cy="21" r="1.5" fill="white"/><circle cx="58" cy="21" r="1.5" fill="white"/>
      <circle cx="40" cy="48" r="24" fill="#4ADE80"/>
      <ellipse cx="40" cy="60" rx="16" ry="10" fill="#86EFAC"/>
      <path d="M30,56 Q40,68 50,56" stroke="#16A34A" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="28" cy="54" rx="5" ry="3" fill="#16A34A" opacity="0.4"/>
      <ellipse cx="52" cy="54" rx="5" ry="3" fill="#16A34A" opacity="0.4"/>
      <ellipse cx="40" cy="55" rx="4" ry="2.5" fill="#16A34A"/>
    </svg>
  ),
  bear: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#C2855B"/>
      <circle cx="18" cy="22" r="12" fill="#A0612C"/><circle cx="62" cy="22" r="12" fill="#A0612C"/>
      <circle cx="18" cy="22" r="8" fill="#C2855B"/><circle cx="62" cy="22" r="8" fill="#C2855B"/>
      <circle cx="40" cy="46" r="25" fill="#D4956E"/>
      <ellipse cx="40" cy="57" rx="13" ry="9" fill="#F0CBA4"/>
      <circle cx="30" cy="43" r="6" fill="white"/><circle cx="50" cy="43" r="6" fill="white"/>
      <circle cx="31" cy="44" r="3.5" fill="#3B1F0A"/><circle cx="51" cy="44" r="3.5" fill="#3B1F0A"/>
      <circle cx="29" cy="42" r="1.2" fill="white"/><circle cx="49" cy="42" r="1.2" fill="white"/>
      <ellipse cx="40" cy="53" rx="4" ry="3" fill="#7C3A0A"/>
      <path d="M35,58 Q40,62 45,58" stroke="#7C3A0A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  cat: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#A78BFA"/>
      <polygon points="13,40 22,8 36,36" fill="#A78BFA"/>
      <polygon points="67,40 58,8 44,36" fill="#A78BFA"/>
      <polygon points="17,38 23,14 34,34" fill="#DDD6FE"/>
      <polygon points="63,38 57,14 46,34" fill="#DDD6FE"/>
      <circle cx="40" cy="46" r="25" fill="#C4B5FD"/>
      <circle cx="30" cy="42" r="6" fill="white"/><circle cx="50" cy="42" r="6" fill="white"/>
      <ellipse cx="31" cy="43" rx="2.5" ry="4" fill="#1a1a2e"/><ellipse cx="51" cy="43" rx="2.5" ry="4" fill="#1a1a2e"/>
      <circle cx="30" cy="41" r="1.2" fill="white"/><circle cx="50" cy="41" r="1.2" fill="white"/>
      <ellipse cx="40" cy="54" rx="10" ry="7" fill="#EDE9FE"/>
      <ellipse cx="40" cy="51" rx="3" ry="2" fill="#EC4899"/>
      <path d="M36,55 Q40,59 44,55" stroke="#7C3AED" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <line x1="18" y1="48" x2="30" y2="51" stroke="#7C3AED" strokeWidth="1" opacity="0.6"/>
      <line x1="18" y1="52" x2="30" y2="52" stroke="#7C3AED" strokeWidth="1" opacity="0.6"/>
      <line x1="62" y1="48" x2="50" y2="51" stroke="#7C3AED" strokeWidth="1" opacity="0.6"/>
      <line x1="62" y1="52" x2="50" y2="52" stroke="#7C3AED" strokeWidth="1" opacity="0.6"/>
    </svg>
  ),
  dog: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#F59E0B"/>
      <ellipse cx="17" cy="36" rx="10" ry="14" fill="#D97706"/>
      <ellipse cx="63" cy="36" rx="10" ry="14" fill="#D97706"/>
      <circle cx="40" cy="44" r="25" fill="#FDE68A"/>
      <ellipse cx="40" cy="57" rx="13" ry="9" fill="#FEF3C7"/>
      <circle cx="30" cy="41" r="6" fill="white"/><circle cx="50" cy="41" r="6" fill="white"/>
      <circle cx="31" cy="42" r="3.5" fill="#3B1F0A"/><circle cx="51" cy="42" r="3.5" fill="#3B1F0A"/>
      <circle cx="29" cy="40" r="1.3" fill="white"/><circle cx="49" cy="40" r="1.3" fill="white"/>
      <ellipse cx="36" cy="41" rx="3" ry="4" fill="#D97706" opacity="0.4"/>
      <ellipse cx="40" cy="53" rx="4" ry="3" fill="#D97706"/>
      <path d="M35,58 Q40,63 45,58" stroke="#D97706" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  bunny: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#F9A8D4"/>
      <ellipse cx="25" cy="18" rx="7" ry="18" fill="#FBCFE8"/>
      <ellipse cx="55" cy="18" rx="7" ry="18" fill="#FBCFE8"/>
      <ellipse cx="25" cy="18" rx="4" ry="14" fill="#FCA5A5"/>
      <ellipse cx="55" cy="18" rx="4" ry="14" fill="#FCA5A5"/>
      <circle cx="40" cy="46" r="25" fill="white"/>
      <ellipse cx="40" cy="57" rx="12" ry="8" fill="#FEE2E2"/>
      <circle cx="30" cy="42" r="6" fill="white"/><circle cx="50" cy="42" r="6" fill="white"/>
      <circle cx="31" cy="43" r="3.5" fill="#831843"/><circle cx="51" cy="43" r="3.5" fill="#831843"/>
      <circle cx="29" cy="41" r="1.3" fill="white"/><circle cx="49" cy="41" r="1.3" fill="white"/>
      <ellipse cx="40" cy="52" rx="3" ry="2" fill="#EC4899"/>
      <path d="M36,56 Q40,60 44,56" stroke="#EC4899" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="24" cy="52" rx="6" ry="4" fill="#FCA5A5" opacity="0.5"/>
      <ellipse cx="56" cy="52" rx="6" ry="4" fill="#FCA5A5" opacity="0.5"/>
    </svg>
  ),
  tiger: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#F97316"/>
      <circle cx="20" cy="22" r="10" fill="#EA580C"/><circle cx="60" cy="22" r="10" fill="#EA580C"/>
      <circle cx="20" cy="22" r="6" fill="#F97316"/><circle cx="60" cy="22" r="6" fill="#F97316"/>
      <circle cx="40" cy="46" r="25" fill="#FED7AA"/>
      <ellipse cx="40" cy="57" rx="13" ry="9" fill="#FEF3C7"/>
      <path d="M28,28 Q32,36 28,40" stroke="#7C2D12" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M52,28 Q48,36 52,40" stroke="#7C2D12" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M36,30 Q40,38 44,30" stroke="#7C2D12" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <circle cx="30" cy="43" r="6" fill="white"/><circle cx="50" cy="43" r="6" fill="white"/>
      <circle cx="31" cy="44" r="3.5" fill="#1C0A00"/><circle cx="51" cy="44" r="3.5" fill="#1C0A00"/>
      <circle cx="29" cy="42" r="1.3" fill="white"/><circle cx="49" cy="42" r="1.3" fill="white"/>
      <ellipse cx="40" cy="53" rx="4" ry="3" fill="#C2410C"/>
      <path d="M35,58 Q40,62 45,58" stroke="#C2410C" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  monkey: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#92400E"/>
      <circle cx="16" cy="36" r="10" fill="#78350F"/><circle cx="64" cy="36" r="10" fill="#78350F"/>
      <circle cx="16" cy="36" r="7" fill="#A16207"/><circle cx="64" cy="36" r="7" fill="#A16207"/>
      <circle cx="40" cy="44" r="25" fill="#B45309"/>
      <ellipse cx="40" cy="57" rx="16" ry="11" fill="#FDE68A"/>
      <circle cx="30" cy="41" r="6" fill="white"/><circle cx="50" cy="41" r="6" fill="white"/>
      <circle cx="31" cy="42" r="3.5" fill="#1C0A00"/><circle cx="51" cy="42" r="3.5" fill="#1C0A00"/>
      <circle cx="29" cy="40" r="1.3" fill="white"/><circle cx="49" cy="40" r="1.3" fill="white"/>
      <ellipse cx="40" cy="53" rx="4" ry="3" fill="#78350F"/>
      <path d="M33,58 Q40,64 47,58" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <ellipse cx="22" cy="50" rx="6" ry="4" fill="#D97706" opacity="0.5"/>
      <ellipse cx="58" cy="50" rx="6" ry="4" fill="#D97706" opacity="0.5"/>
    </svg>
  ),
  elephant: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#60A5FA"/>
      <ellipse cx="10" cy="44" rx="12" ry="16" fill="#3B82F6"/>
      <ellipse cx="70" cy="44" rx="12" ry="16" fill="#3B82F6"/>
      <circle cx="40" cy="42" r="26" fill="#93C5FD"/>
      <ellipse cx="40" cy="62" rx="8" ry="12" fill="#BFDBFE"/>
      <circle cx="30" cy="40" r="6" fill="white"/><circle cx="50" cy="40" r="6" fill="white"/>
      <circle cx="31" cy="41" r="3.5" fill="#1E3A5F"/><circle cx="51" cy="41" r="3.5" fill="#1E3A5F"/>
      <circle cx="29" cy="39" r="1.3" fill="white"/><circle cx="49" cy="39" r="1.3" fill="white"/>
      <ellipse cx="36" cy="52" rx="3" ry="2" fill="#2563EB"/>
      <ellipse cx="44" cy="52" rx="3" ry="2" fill="#2563EB"/>
      <ellipse cx="24" cy="52" rx="6" ry="4" fill="#60A5FA" opacity="0.5"/>
      <ellipse cx="56" cy="52" rx="6" ry="4" fill="#60A5FA" opacity="0.5"/>
    </svg>
  ),
  penguin: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#1E293B"/>
      <ellipse cx="40" cy="48" rx="18" ry="22" fill="white"/>
      <circle cx="40" cy="36" r="20" fill="#1E293B"/>
      <circle cx="30" cy="36" r="7" fill="white"/><circle cx="50" cy="36" r="7" fill="white"/>
      <circle cx="31" cy="37" r="4" fill="#1a1a2e"/><circle cx="51" cy="37" r="4" fill="#1a1a2e"/>
      <circle cx="29" cy="35" r="1.5" fill="white"/><circle cx="49" cy="35" r="1.5" fill="white"/>
      <polygon points="36,46 44,46 40,54" fill="#F97316"/>
      <ellipse cx="26" cy="52" rx="7" ry="4" fill="#1E293B" opacity="0.4"/>
      <ellipse cx="54" cy="52" rx="7" ry="4" fill="#1E293B" opacity="0.4"/>
    </svg>
  ),
  owl: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#92400E"/>
      <polygon points="24,28 30,8 36,28" fill="#78350F"/>
      <polygon points="44,28 50,8 56,28" fill="#78350F"/>
      <circle cx="40" cy="46" r="24" fill="#A16207"/>
      <circle cx="28" cy="42" r="10" fill="white"/><circle cx="52" cy="42" r="10" fill="white"/>
      <circle cx="28" cy="42" r="7" fill="#FEF08A"/><circle cx="52" cy="42" r="7" fill="#FEF08A"/>
      <circle cx="29" cy="43" r="4.5" fill="#1C0A00"/><circle cx="53" cy="43" r="4.5" fill="#1C0A00"/>
      <circle cx="27" cy="41" r="1.5" fill="white"/><circle cx="51" cy="41" r="1.5" fill="white"/>
      <polygon points="37,51 43,51 40,57" fill="#D97706"/>
      <ellipse cx="40" cy="60" rx="12" ry="6" fill="#78350F" opacity="0.5"/>
    </svg>
  ),
  koala: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#94A3B8"/>
      <circle cx="14" cy="30" r="16" fill="#CBD5E1"/><circle cx="66" cy="30" r="16" fill="#CBD5E1"/>
      <circle cx="14" cy="30" r="11" fill="#94A3B8"/><circle cx="66" cy="30" r="11" fill="#94A3B8"/>
      <circle cx="40" cy="46" r="25" fill="#B0BFCC"/>
      <ellipse cx="40" cy="55" rx="14" ry="9" fill="#CBD5E1"/>
      <circle cx="30" cy="42" r="6" fill="white"/><circle cx="50" cy="42" r="6" fill="white"/>
      <circle cx="31" cy="43" r="3.5" fill="#1E293B"/><circle cx="51" cy="43" r="3.5" fill="#1E293B"/>
      <circle cx="29" cy="41" r="1.3" fill="white"/><circle cx="49" cy="41" r="1.3" fill="white"/>
      <ellipse cx="40" cy="51" rx="6" ry="5" fill="#334155"/>
      <path d="M35,56 Q40,60 45,56" stroke="#475569" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  wolf: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#64748B"/>
      <polygon points="10,42 20,6 36,37" fill="#64748B"/>
      <polygon points="70,42 60,6 44,37" fill="#64748B"/>
      <polygon points="14,40 21,12 34,35" fill="#94A3B8"/>
      <polygon points="66,40 59,12 46,35" fill="#94A3B8"/>
      <circle cx="40" cy="46" r="25" fill="#78909C"/>
      <ellipse cx="40" cy="57" rx="14" ry="9" fill="#CBD5E1"/>
      <circle cx="30" cy="42" r="6" fill="white"/><circle cx="50" cy="42" r="6" fill="white"/>
      <ellipse cx="31" cy="43" rx="3" ry="4" fill="#1E293B"/><ellipse cx="51" cy="43" rx="3" ry="4" fill="#1E293B"/>
      <circle cx="29" cy="41" r="1.3" fill="white"/><circle cx="49" cy="41" r="1.3" fill="white"/>
      <ellipse cx="40" cy="53" rx="4" ry="3" fill="#334155"/>
      <path d="M34,58 Q40,63 46,58" stroke="#334155" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  deer: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#D97706"/>
      <path d="M22,32 Q16,18 10,8 Q18,12 22,22" fill="#92400E"/>
      <path d="M22,32 Q14,24 20,10" fill="#92400E"/>
      <path d="M58,32 Q64,18 70,8 Q62,12 58,22" fill="#92400E"/>
      <path d="M58,32 Q66,24 60,10" fill="#92400E"/>
      <circle cx="40" cy="46" r="25" fill="#F59E0B"/>
      <ellipse cx="40" cy="57" rx="13" ry="8" fill="#FEF3C7"/>
      <circle cx="30" cy="42" r="6" fill="white"/><circle cx="50" cy="42" r="6" fill="white"/>
      <circle cx="31" cy="43" r="3.5" fill="#1C0A00"/><circle cx="51" cy="43" r="3.5" fill="#1C0A00"/>
      <circle cx="29" cy="41" r="1.3" fill="white"/><circle cx="49" cy="41" r="1.3" fill="white"/>
      <ellipse cx="40" cy="53" rx="3.5" ry="2.5" fill="#92400E"/>
      <circle cx="26" cy="38" r="3" fill="white" opacity="0.7"/>
      <circle cx="54" cy="38" r="3" fill="white" opacity="0.7"/>
      <circle cx="22" cy="47" r="2" fill="white" opacity="0.7"/>
      <circle cx="58" cy="47" r="2" fill="white" opacity="0.7"/>
    </svg>
  ),
  raccoon: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#6B7280"/>
      <circle cx="20" cy="22" r="10" fill="#4B5563"/><circle cx="60" cy="22" r="10" fill="#4B5563"/>
      <circle cx="20" cy="22" r="6" fill="#6B7280"/><circle cx="60" cy="22" r="6" fill="#6B7280"/>
      <circle cx="40" cy="44" r="25" fill="#9CA3AF"/>
      <ellipse cx="40" cy="57" rx="13" ry="8" fill="#D1D5DB"/>
      <ellipse cx="28" cy="42" rx="10" ry="8" fill="#1F2937" opacity="0.7" transform="rotate(-10,28,42)"/>
      <ellipse cx="52" cy="42" rx="10" ry="8" fill="#1F2937" opacity="0.7" transform="rotate(10,52,42)"/>
      <circle cx="29" cy="42" r="6" fill="white"/><circle cx="51" cy="42" r="6" fill="white"/>
      <circle cx="30" cy="43" r="3.5" fill="#1F2937"/><circle cx="52" cy="43" r="3.5" fill="#1F2937"/>
      <circle cx="28" cy="41" r="1.3" fill="white"/><circle cx="50" cy="41" r="1.3" fill="white"/>
      <ellipse cx="40" cy="52" rx="5" ry="4" fill="#374151"/>
      <path d="M35,57 Q40,61 45,57" stroke="#374151" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  hedgehog: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#84CC16"/>
      <ellipse cx="40" cy="28" rx="22" ry="18" fill="#4D7C0F"/>
      <line x1="28" y1="12" x2="26" y2="4" stroke="#365314" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="34" y1="10" x2="33" y2="2" stroke="#365314" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="40" y1="10" x2="40" y2="2" stroke="#365314" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="46" y1="10" x2="47" y2="2" stroke="#365314" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="52" y1="12" x2="54" y2="4" stroke="#365314" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="22" y1="22" x2="16" y2="16" stroke="#365314" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="58" y1="22" x2="64" y2="16" stroke="#365314" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="40" cy="52" r="20" fill="#FEF9C3"/>
      <circle cx="32" cy="50" r="6" fill="white"/><circle cx="48" cy="50" r="6" fill="white"/>
      <circle cx="33" cy="51" r="3.5" fill="#1a1a2e"/><circle cx="49" cy="51" r="3.5" fill="#1a1a2e"/>
      <circle cx="31" cy="49" r="1.3" fill="white"/><circle cx="47" cy="49" r="1.3" fill="white"/>
      <ellipse cx="40" cy="59" rx="4" ry="3" fill="#65A30D"/>
    </svg>
  ),
  duck: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#EAB308"/>
      <circle cx="40" cy="44" r="26" fill="#FDE047"/>
      <ellipse cx="40" cy="58" rx="14" ry="8" fill="#FEF9C3"/>
      <circle cx="30" cy="40" r="6" fill="white"/><circle cx="50" cy="40" r="6" fill="white"/>
      <circle cx="31" cy="41" r="3.5" fill="#1a1a2e"/><circle cx="51" cy="41" r="3.5" fill="#1a1a2e"/>
      <circle cx="29" cy="39" r="1.3" fill="white"/><circle cx="49" cy="39" r="1.3" fill="white"/>
      <ellipse cx="40" cy="52" rx="8" ry="5" fill="#F97316"/>
      <ellipse cx="40" cy="54" rx="7" ry="3.5" fill="#EA580C"/>
      <ellipse cx="24" cy="50" rx="6" ry="4" fill="#EAB308" opacity="0.5"/>
      <ellipse cx="56" cy="50" rx="6" ry="4" fill="#EAB308" opacity="0.5"/>
      <path d="M24,22 Q28,14 36,18" stroke="#CA8A04" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  hamster: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#EC4899"/>
      <circle cx="16" cy="36" r="10" fill="#DB2777"/><circle cx="64" cy="36" r="10" fill="#DB2777"/>
      <circle cx="16" cy="36" r="7" fill="#F9A8D4"/><circle cx="64" cy="36" r="7" fill="#F9A8D4"/>
      <circle cx="40" cy="42" r="22" fill="#FBCFE8"/>
      <ellipse cx="22" cy="52" rx="16" ry="12" fill="#FCA5A5"/>
      <ellipse cx="58" cy="52" rx="16" ry="12" fill="#FCA5A5"/>
      <circle cx="40" cy="42" r="18" fill="#FBCFE8"/>
      <circle cx="32" cy="40" r="5.5" fill="white"/><circle cx="48" cy="40" r="5.5" fill="white"/>
      <circle cx="33" cy="41" r="3.2" fill="#1a1a2e"/><circle cx="49" cy="41" r="3.2" fill="#1a1a2e"/>
      <circle cx="31" cy="39" r="1.2" fill="white"/><circle cx="47" cy="39" r="1.2" fill="white"/>
      <ellipse cx="40" cy="50" rx="3" ry="2" fill="#BE185D"/>
      <path d="M36,53 Q40,57 44,53" stroke="#BE185D" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  narwhal: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#38BDF8"/>
      <path d="M40,36 Q38,20 36,4" stroke="#F0ABFC" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="40" cy="46" r="24" fill="#7DD3FC"/>
      <ellipse cx="40" cy="58" rx="14" ry="8" fill="#BAE6FD"/>
      <circle cx="31" cy="42" r="6" fill="white"/><circle cx="49" cy="42" r="6" fill="white"/>
      <circle cx="32" cy="43" r="3.5" fill="#0C4A6E"/><circle cx="50" cy="43" r="3.5" fill="#0C4A6E"/>
      <circle cx="30" cy="41" r="1.3" fill="white"/><circle cx="48" cy="41" r="1.3" fill="white"/>
      <ellipse cx="40" cy="54" rx="4" ry="2.5" fill="#0369A1"/>
      <path d="M35,57 Q40,61 45,57" stroke="#0369A1" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="24" cy="52" rx="6" ry="4" fill="#7DD3FC" opacity="0.5"/>
      <ellipse cx="56" cy="52" rx="6" ry="4" fill="#7DD3FC" opacity="0.5"/>
    </svg>
  ),
  axolotl: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#F472B6"/>
      <ellipse cx="22" cy="24" rx="6" ry="12" fill="#FB7185" transform="rotate(-20,22,24)"/>
      <ellipse cx="40" cy="16" rx="6" ry="12" fill="#FB7185"/>
      <ellipse cx="58" cy="24" rx="6" ry="12" fill="#FB7185" transform="rotate(20,58,24)"/>
      <ellipse cx="22" cy="24" rx="3" ry="7" fill="#FCA5A5" transform="rotate(-20,22,24)"/>
      <ellipse cx="40" cy="16" rx="3" ry="7" fill="#FCA5A5"/>
      <ellipse cx="58" cy="24" rx="3" ry="7" fill="#FCA5A5" transform="rotate(20,58,24)"/>
      <circle cx="40" cy="48" r="24" fill="#FECDD3"/>
      <circle cx="30" cy="44" r="6" fill="white"/><circle cx="50" cy="44" r="6" fill="white"/>
      <circle cx="31" cy="45" r="3.5" fill="#881337"/><circle cx="51" cy="45" r="3.5" fill="#881337"/>
      <circle cx="29" cy="43" r="1.3" fill="white"/><circle cx="49" cy="43" r="1.3" fill="white"/>
      <ellipse cx="40" cy="55" rx="12" ry="7" fill="#FBCFE8"/>
      <path d="M34,55 Q40,61 46,55" stroke="#E11D48" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <ellipse cx="25" cy="54" rx="5" ry="3" fill="#F9A8D4" opacity="0.6"/>
      <ellipse cx="55" cy="54" rx="5" ry="3" fill="#F9A8D4" opacity="0.6"/>
    </svg>
  ),
  capybara: (s) => (
    <svg viewBox="0 0 80 80" width={s} height={s}>
      <circle cx="40" cy="40" r="38" fill="#A16207"/>
      <circle cx="20" cy="26" r="9" fill="#78350F"/><circle cx="60" cy="26" r="9" fill="#78350F"/>
      <circle cx="20" cy="26" r="6" fill="#A16207"/><circle cx="60" cy="26" r="6" fill="#A16207"/>
      <circle cx="40" cy="46" r="26" fill="#CA8A04"/>
      <ellipse cx="40" cy="60" rx="18" ry="10" fill="#FEF3C7"/>
      <circle cx="30" cy="42" r="6" fill="white"/><circle cx="50" cy="42" r="6" fill="white"/>
      <circle cx="31" cy="43" r="3.5" fill="#1C0A00"/><circle cx="51" cy="43" r="3.5" fill="#1C0A00"/>
      <circle cx="29" cy="41" r="1.3" fill="white"/><circle cx="49" cy="41" r="1.3" fill="white"/>
      <ellipse cx="40" cy="55" rx="6" ry="4" fill="#92400E"/>
      <path d="M32,60 Q40,67 48,60" stroke="#92400E" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <ellipse cx="24" cy="56" rx="7" ry="4" fill="#B45309" opacity="0.4"/>
      <ellipse cx="56" cy="56" rx="7" ry="4" fill="#B45309" opacity="0.4"/>
    </svg>
  ),
}

interface Props {
  avatarId: string
  size?: number
  className?: string
}

export default function AvatarImage({ avatarId, size = 40, className }: Props) {
  const fn = svgs[avatarId as AvatarId]
  if (!fn) {
    return (
      <span
        className={className}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, borderRadius: "50%", background: "#E2E8F0", fontSize: size * 0.5 }}
      >
        {avatarId}
      </span>
    )
  }
  return <span className={className} style={{ display: "inline-flex", borderRadius: "50%", overflow: "hidden" }}>{fn(size)}</span>
}
