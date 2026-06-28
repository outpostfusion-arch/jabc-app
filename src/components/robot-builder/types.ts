export interface RobotColors {
  primary: string
  accent: string
}

export interface RobotConfig {
  head: string
  face: string
  antenna: string
  body: string
  arms: string
  hands: string
  legs: string
  feet: string
  colorScheme: string
}

export const DEFAULT_CONFIG: RobotConfig = {
  head: "orb",
  face: "pixel",
  antenna: "ball",
  body: "classic",
  arms: "standard",
  hands: "fist",
  legs: "standard",
  feet: "boots",
  colorScheme: "indigo",
}

export function serializeConfig(c: RobotConfig): string {
  return JSON.stringify(c)
}

export function parseConfig(s: string | null | undefined): RobotConfig | null {
  if (!s) return null
  try {
    const parsed = JSON.parse(s)
    if (parsed && typeof parsed === "object" && "head" in parsed) return parsed as RobotConfig
    return null
  } catch {
    return null
  }
}
