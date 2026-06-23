export interface RobotDef {
  id: string
  name: string
  tagline: string
  primary: string
  accent: string
  seed: string
}

export function robotAvatarUrl(seed: string, size = 200) {
  return `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}&size=${size}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
}

export const ROBOTS: RobotDef[] = [
  { id: "bunny",   name: "Bunny Bot",    tagline: "Cute but mighty",          primary: "#FFFFFF", accent: "#F7921E", seed: "BunnyBot"   },
  { id: "dino",    name: "Dino Bot",     tagline: "Wild & fierce",            primary: "#22C55E", accent: "#F97316", seed: "DinoBot"    },
  { id: "ninja",   name: "Ninja Bot",    tagline: "Cool & stealthy",          primary: "#334155", accent: "#EF4444", seed: "NinjaBot"   },
  { id: "wizard",  name: "Wizard Bot",   tagline: "Mysterious & clever",      primary: "#7C3AED", accent: "#F59E0B", seed: "WizardBot"  },
  { id: "astro",   name: "Astro Bot",    tagline: "Built for adventure",      primary: "#CBD5E1", accent: "#06B6D4", seed: "AstroBot"   },
  { id: "pixel",   name: "Pixel Bot",    tagline: "Retro game energy",        primary: "#FBBF24", accent: "#EF4444", seed: "PixelBot"   },
  { id: "dragon",  name: "Dragon Bot",   tagline: "Bold & powerful",          primary: "#EF4444", accent: "#F59E0B", seed: "DragonBot"  },
  { id: "shark",   name: "Shark Bot",    tagline: "Fast & unstoppable",       primary: "#60A5FA", accent: "#DBEAFE", seed: "SharkBot"   },
  { id: "glitch",  name: "Glitch Bot",   tagline: "Chaotic & one-of-a-kind",  primary: "#7C3AED", accent: "#EC4899", seed: "GlitchBot"  },
  { id: "cheetah", name: "Cheetah Bot",  tagline: "Speedy & energetic",       primary: "#F97316", accent: "#FEF3C7", seed: "CheetahBot" },
]
