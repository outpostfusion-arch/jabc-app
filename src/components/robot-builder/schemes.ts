export interface ColorScheme {
  id: string
  name: string
  primary: string
  accent: string
}

export const COLOR_SCHEMES: ColorScheme[] = [
  { id: "indigo",  name: "Cosmic",     primary: "#6366F1", accent: "#8B5CF6" },
  { id: "cyan",    name: "Ocean",      primary: "#0EA5E9", accent: "#06B6D4" },
  { id: "emerald", name: "Forest",     primary: "#10B981", accent: "#22C55E" },
  { id: "orange",  name: "Blaze",      primary: "#F97316", accent: "#EF4444" },
  { id: "pink",    name: "Bubblegum",  primary: "#EC4899", accent: "#F43F5E" },
  { id: "amber",   name: "Sunshine",   primary: "#F59E0B", accent: "#EAB308" },
  { id: "slate",   name: "Stealth",    primary: "#475569", accent: "#334155" },
  { id: "violet",  name: "Galaxy",     primary: "#7C3AED", accent: "#A855F7" },
]

export function getScheme(id: string): ColorScheme {
  return COLOR_SCHEMES.find(s => s.id === id) ?? COLOR_SCHEMES[0]
}
