export interface UnlockDef {
  id: string
  name: string
  emoji: string
  session: 1 | 2 | 3 | 4 | 5 | 6
  category: "colour" | "accessory" | "power" | "dance" | "item" | "superform"
  rarity: "common" | "rare" | "legendary"
}

export const UNLOCKS: UnlockDef[] = [
  // ── SESSION 1 · COLOUR PACKS ──────────────────────────────────────────────
  { id: "color-galaxy",   name: "Galaxy Purple",   emoji: "🌌", session: 1, category: "colour",    rarity: "rare" },
  { id: "color-neon",     name: "Neon Green",      emoji: "💚", session: 1, category: "colour",    rarity: "common" },
  { id: "color-fire",     name: "Fire Red",        emoji: "🔴", session: 1, category: "colour",    rarity: "common" },
  { id: "color-ocean",    name: "Ocean Blue",      emoji: "🌊", session: 1, category: "colour",    rarity: "common" },
  { id: "color-rosegold", name: "Rose Gold",       emoji: "🌸", session: 1, category: "colour",    rarity: "rare" },
  { id: "color-arctic",   name: "Arctic White",    emoji: "🤍", session: 1, category: "colour",    rarity: "common" },
  { id: "color-midnight", name: "Midnight Black",  emoji: "🖤", session: 1, category: "colour",    rarity: "rare" },
  { id: "color-toxic",    name: "Toxic Yellow",    emoji: "☢️",  session: 1, category: "colour",    rarity: "legendary" },

  // ── SESSION 2 · ACCESSORIES ───────────────────────────────────────────────
  { id: "acc-crown",      name: "Royal Crown",     emoji: "👑", session: 2, category: "accessory", rarity: "legendary" },
  { id: "acc-wizard-hat", name: "Wizard Hat",      emoji: "🧙", session: 2, category: "accessory", rarity: "rare" },
  { id: "acc-sunglasses", name: "Cool Shades",     emoji: "😎", session: 2, category: "accessory", rarity: "common" },
  { id: "acc-cowboy",     name: "Cowboy Hat",      emoji: "🤠", session: 2, category: "accessory", rarity: "common" },
  { id: "acc-party",      name: "Party Hat",       emoji: "🎉", session: 2, category: "accessory", rarity: "common" },
  { id: "acc-flower",     name: "Flower Crown",    emoji: "🌸", session: 2, category: "accessory", rarity: "rare" },
  { id: "acc-tophat",     name: "Top Hat",         emoji: "🎩", session: 2, category: "accessory", rarity: "rare" },
  { id: "acc-halo",       name: "Angel Halo",      emoji: "😇", session: 2, category: "accessory", rarity: "legendary" },

  // ── SESSION 3 · POWER AURAS ───────────────────────────────────────────────
  { id: "power-electric", name: "Electric Surge",  emoji: "⚡", session: 3, category: "power",     rarity: "rare" },
  { id: "power-fire",     name: "Fire Aura",       emoji: "🔥", session: 3, category: "power",     rarity: "rare" },
  { id: "power-leaf",     name: "Leaf Storm",      emoji: "🍃", session: 3, category: "power",     rarity: "common" },
  { id: "power-ice",      name: "Ice Crystal",     emoji: "🧊", session: 3, category: "power",     rarity: "rare" },
  { id: "power-star",     name: "Star Power",      emoji: "⭐", session: 3, category: "power",     rarity: "legendary" },
  { id: "power-rainbow",  name: "Rainbow Glow",    emoji: "🌈", session: 3, category: "power",     rarity: "legendary" },
  { id: "power-dark",     name: "Dark Matter",     emoji: "🌑", session: 3, category: "power",     rarity: "rare" },
  { id: "power-water",    name: "Water Splash",    emoji: "💧", session: 3, category: "power",     rarity: "common" },

  // ── SESSION 4 · DANCE MOVES ───────────────────────────────────────────────
  { id: "dance-spin",     name: "The Spin",        emoji: "🌀", session: 4, category: "dance",     rarity: "common" },
  { id: "dance-bounce",   name: "The Bounce",      emoji: "🏀", session: 4, category: "dance",     rarity: "common" },
  { id: "dance-floss",    name: "The Floss",       emoji: "🦷", session: 4, category: "dance",     rarity: "rare" },
  { id: "dance-moon",     name: "Moonwalk",        emoji: "🌙", session: 4, category: "dance",     rarity: "legendary" },
  { id: "dance-robot",    name: "Robot Lock",      emoji: "🤖", session: 4, category: "dance",     rarity: "rare" },
  { id: "dance-wiggle",   name: "The Wiggle",      emoji: "🐛", session: 4, category: "dance",     rarity: "common" },
  { id: "dance-disco",    name: "Disco Fever",     emoji: "🪩", session: 4, category: "dance",     rarity: "rare" },
  { id: "dance-slide",    name: "Power Slide",     emoji: "💨", session: 4, category: "dance",     rarity: "legendary" },

  // ── SESSION 5 · HAND ITEMS ────────────────────────────────────────────────
  { id: "item-saber",     name: "Lightsaber",      emoji: "⚔️",  session: 5, category: "item",     rarity: "legendary" },
  { id: "item-wand",      name: "Magic Wand",      emoji: "🪄", session: 5, category: "item",     rarity: "rare" },
  { id: "item-brush",     name: "Paintbrush",      emoji: "🖌️",  session: 5, category: "item",     rarity: "common" },
  { id: "item-wrench",    name: "Power Wrench",    emoji: "🔧", session: 5, category: "item",     rarity: "common" },
  { id: "item-guitar",    name: "Electric Guitar", emoji: "🎸", session: 5, category: "item",     rarity: "rare" },
  { id: "item-trident",   name: "Trident",         emoji: "🔱", session: 5, category: "item",     rarity: "legendary" },
  { id: "item-pizza",     name: "Pizza Slice",     emoji: "🍕", session: 5, category: "item",     rarity: "common" },
  { id: "item-star-wand", name: "Star Wand",       emoji: "🌟", session: 5, category: "item",     rarity: "rare" },

  // ── SESSION 6 · SUPER FORMS ───────────────────────────────────────────────
  { id: "super-wings",    name: "Angel Wings",     emoji: "🪽", session: 6, category: "superform", rarity: "legendary" },
  { id: "super-dragon",   name: "Dragon Wings",    emoji: "🐉", session: 6, category: "superform", rarity: "legendary" },
  { id: "super-rockets",  name: "Rocket Boots",    emoji: "🚀", session: 6, category: "superform", rarity: "rare" },
  { id: "super-mech",     name: "Mech Suit",       emoji: "🦾", session: 6, category: "superform", rarity: "legendary" },
  { id: "super-cape",     name: "Hero Cape",       emoji: "🦸", session: 6, category: "superform", rarity: "rare" },
  { id: "super-tail",     name: "Dragon Tail",     emoji: "🦎", session: 6, category: "superform", rarity: "rare" },
  { id: "super-forcefield", name: "Force Field",   emoji: "🛡️",  session: 6, category: "superform", rarity: "rare" },
  { id: "super-blackhole", name: "Black Hole Core", emoji: "🕳️", session: 6, category: "superform", rarity: "legendary" },
]

export const SESSION_LABELS: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: "Session 1", color: "#92400E", bg: "#FEF3C7" },
  2: { label: "Session 2", color: "#166534", bg: "#DCFCE7" },
  3: { label: "Session 3", color: "#1E40AF", bg: "#DBEAFE" },
  4: { label: "Session 4", color: "#6B21A8", bg: "#F3E8FF" },
  5: { label: "Session 5", color: "#9A3412", bg: "#FFF7ED" },
  6: { label: "Session 6", color: "#881337", bg: "#FFE4E6" },
}

export const RARITY_CONFIG = {
  common:    { label: "Common",    color: "#64748B", bg: "#F1F5F9", star: "⭐", cost: 20 },
  rare:      { label: "Rare",      color: "#1D4ED8", bg: "#DBEAFE", star: "💎", cost: 50 },
  legendary: { label: "Legendary", color: "#92400E", bg: "#FEF3C7", star: "🏆", cost: 120 },
}

/** Coin cost to unlock an item, based on its rarity. */
export function unlockCost(rarity: UnlockDef["rarity"]): number {
  return RARITY_CONFIG[rarity].cost
}

export const CATEGORY_CONFIG = {
  colour:    { label: "Colour Pack",  emoji: "🎨" },
  accessory: { label: "Accessory",    emoji: "👒" },
  power:     { label: "Power Aura",   emoji: "✨" },
  dance:     { label: "Dance Move",   emoji: "💃" },
  item:      { label: "Hand Item",    emoji: "🗡️" },
  superform: { label: "Super Form",   emoji: "⚡" },
}
