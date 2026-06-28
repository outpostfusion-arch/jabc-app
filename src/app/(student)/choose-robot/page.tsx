"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// ── Types ──────────────────────────────────────────────────────────────────────

interface PartOption {
  key: string   // unique card id — used as DiceBear seed for colour variety
  id: string    // DiceBear param value
  name: string
  bg: string
}

interface BotttsConfig {
  face: string;    faceKey: string
  eyes: string;    eyesKey: string
  top: string;     topKey: string
  sides: string;   sidesKey: string
  texture: string; textureKey: string
  mouth: string;   mouthKey: string
}

// ── Colour palette ─────────────────────────────────────────────────────────────

const P = [
  "#FF6B6B","#FF9F43","#FFD93D","#BADC58","#6BCB77",
  "#45B7D1","#4D96FF","#A29BFE","#E056FD","#FF8FAB",
  "#00CEC9","#4ECDC4","#F368E0","#FF5E57","#00D2FF",
  "#F9CA24","#6AB04C","#7ED321","#FB923C","#C084FC",
]

// ── 20 options per step ────────────────────────────────────────────────────────

const HEAD_OPTS: PartOption[] = [
  { key:"h01", id:"round01",  name:"Round",      bg:P[0]  },
  { key:"h02", id:"round01",  name:"Smooth",     bg:P[1]  },
  { key:"h03", id:"round01",  name:"Glossy",     bg:P[2]  },
  { key:"h04", id:"round01",  name:"Shiny",      bg:P[3]  },
  { key:"h05", id:"round02",  name:"Rounder",    bg:P[4]  },
  { key:"h06", id:"round02",  name:"Bubbly",     bg:P[5]  },
  { key:"h07", id:"round02",  name:"Poofy",      bg:P[6]  },
  { key:"h08", id:"square01", name:"Square",     bg:P[7]  },
  { key:"h09", id:"square01", name:"Classic",    bg:P[8]  },
  { key:"h10", id:"square01", name:"Crisp",      bg:P[9]  },
  { key:"h11", id:"square01", name:"Bold",       bg:P[10] },
  { key:"h12", id:"square02", name:"Wide",       bg:P[11] },
  { key:"h13", id:"square02", name:"Broad",      bg:P[12] },
  { key:"h14", id:"square02", name:"Spacious",   bg:P[13] },
  { key:"h15", id:"square03", name:"Tall",       bg:P[14] },
  { key:"h16", id:"square03", name:"Slim",       bg:P[15] },
  { key:"h17", id:"square03", name:"Towering",   bg:P[16] },
  { key:"h18", id:"square04", name:"Chunky",     bg:P[17] },
  { key:"h19", id:"square04", name:"Heavy",      bg:P[18] },
  { key:"h20", id:"square04", name:"Thick",      bg:P[19] },
]

const EYES_OPTS: PartOption[] = [
  { key:"e01", id:"bulging",      name:"Bulging",    bg:P[0]  },
  { key:"e02", id:"dizzy",        name:"Dizzy",      bg:P[1]  },
  { key:"e03", id:"eva",          name:"EVA",        bg:P[2]  },
  { key:"e04", id:"frame1",       name:"Frame",      bg:P[3]  },
  { key:"e05", id:"frame2",       name:"Visor",      bg:P[4]  },
  { key:"e06", id:"glow",         name:"Glow",       bg:P[5]  },
  { key:"e07", id:"happy",        name:"Happy",      bg:P[6]  },
  { key:"e08", id:"hearts",       name:"Hearts",     bg:P[7]  },
  { key:"e09", id:"robocop",      name:"Robocop",    bg:P[8]  },
  { key:"e10", id:"round",        name:"Round",      bg:P[9]  },
  { key:"e11", id:"roundFrame01", name:"Ring",       bg:P[10] },
  { key:"e12", id:"roundFrame02", name:"Double Ring",bg:P[11] },
  { key:"e13", id:"sensor",       name:"Sensor",     bg:P[12] },
  { key:"e14", id:"shade01",      name:"Shades",     bg:P[13] },
  { key:"e15", id:"glow",         name:"Blue Glow",  bg:P[14] },
  { key:"e16", id:"happy",        name:"Bright",     bg:P[15] },
  { key:"e17", id:"hearts",       name:"Lovey",      bg:P[16] },
  { key:"e18", id:"eva",          name:"Neo",        bg:P[17] },
  { key:"e19", id:"round",        name:"Orbits",     bg:P[18] },
  { key:"e20", id:"sensor",       name:"Scanner",    bg:P[19] },
]

const TOP_OPTS: PartOption[] = [
  { key:"t01", id:"antenna",        name:"Antenna",   bg:P[0]  },
  { key:"t02", id:"antennaCrooked", name:"Bent",      bg:P[2]  },
  { key:"t03", id:"bulb01",         name:"Bulb",      bg:P[4]  },
  { key:"t04", id:"glowingBulb01",  name:"Glow",      bg:P[6]  },
  { key:"t05", id:"glowingBulb02",  name:"Twin Glow", bg:P[8]  },
  { key:"t06", id:"horns",          name:"Horns",     bg:P[10] },
  { key:"t07", id:"lights",         name:"Lights",    bg:P[12] },
  { key:"t08", id:"pyramid",        name:"Pyramid",   bg:P[14] },
  { key:"t09", id:"radar",          name:"Radar",     bg:P[16] },
]

const EARS_OPTS: PartOption[] = [
  { key:"s01", id:"antenna01",         name:"Spike",      bg:P[0]  },
  { key:"s02", id:"antenna01",         name:"Antennas",   bg:P[1]  },
  { key:"s03", id:"antenna01",         name:"Feelers",    bg:P[2]  },
  { key:"s04", id:"antenna02",         name:"Twin Spike", bg:P[3]  },
  { key:"s05", id:"antenna02",         name:"Double",     bg:P[4]  },
  { key:"s06", id:"antenna02",         name:"Dual",       bg:P[5]  },
  { key:"s07", id:"cables01",          name:"Cables",     bg:P[6]  },
  { key:"s08", id:"cables01",          name:"Wired",      bg:P[7]  },
  { key:"s09", id:"cables01",          name:"Plugged",    bg:P[8]  },
  { key:"s10", id:"cables02",          name:"Wire Up",    bg:P[9]  },
  { key:"s11", id:"cables02",          name:"Coiled",     bg:P[10] },
  { key:"s12", id:"cables02",          name:"Tangle",     bg:P[11] },
  { key:"s13", id:"round",             name:"Round",      bg:P[12] },
  { key:"s14", id:"round",             name:"Circles",    bg:P[13] },
  { key:"s15", id:"round",             name:"Orbs",       bg:P[14] },
  { key:"s16", id:"square",            name:"Square",     bg:P[15] },
  { key:"s17", id:"square",            name:"Blocks",     bg:P[16] },
  { key:"s18", id:"squareAssymetric",  name:"Wonky",      bg:P[17] },
  { key:"s19", id:"squareAssymetric",  name:"Asymmetric", bg:P[18] },
  { key:"s20", id:"squareAssymetric",  name:"Off-Balance",bg:P[19] },
]

const SKIN_OPTS: PartOption[] = [
  { key:"k01", id:"camo01",   name:"Camo",      bg:P[0]  },
  { key:"k02", id:"camo01",   name:"Jungle",    bg:P[1]  },
  { key:"k03", id:"camo01",   name:"Green Ops", bg:P[2]  },
  { key:"k04", id:"camo02",   name:"Camo II",   bg:P[3]  },
  { key:"k05", id:"camo02",   name:"Desert",    bg:P[4]  },
  { key:"k06", id:"circuits", name:"Circuits",  bg:P[5]  },
  { key:"k07", id:"circuits", name:"Wired",     bg:P[6]  },
  { key:"k08", id:"circuits", name:"Neon Chip", bg:P[7]  },
  { key:"k09", id:"dirty01",  name:"Gritty",    bg:P[8]  },
  { key:"k10", id:"dirty01",  name:"Worn",      bg:P[9]  },
  { key:"k11", id:"dirty02",  name:"Rusty",     bg:P[10] },
  { key:"k12", id:"dirty02",  name:"Battle",    bg:P[11] },
  { key:"k13", id:"dirty02",  name:"Scuffed",   bg:P[12] },
  { key:"k14", id:"dots",     name:"Dots",      bg:P[13] },
  { key:"k15", id:"dots",     name:"Spotted",   bg:P[14] },
  { key:"k16", id:"dots",     name:"Polka",     bg:P[15] },
  { key:"k17", id:"grunge01", name:"Grunge",    bg:P[16] },
  { key:"k18", id:"grunge01", name:"Punk",      bg:P[17] },
  { key:"k19", id:"grunge02", name:"Grunge II", bg:P[18] },
  { key:"k20", id:"grunge02", name:"Rough",     bg:P[19] },
]

const MOUTH_OPTS: PartOption[] = [
  { key:"m01", id:"bite",    name:"Bite",     bg:P[0]  },
  { key:"m02", id:"bite",    name:"Sharp",    bg:P[1]  },
  { key:"m03", id:"bite",    name:"Chomp",    bg:P[2]  },
  { key:"m04", id:"diagram", name:"Diagram",  bg:P[3]  },
  { key:"m05", id:"diagram", name:"Grid",     bg:P[4]  },
  { key:"m06", id:"grill01", name:"Grill",    bg:P[5]  },
  { key:"m07", id:"grill01", name:"Metal",    bg:P[6]  },
  { key:"m08", id:"grill02", name:"Heavy",    bg:P[7]  },
  { key:"m09", id:"grill02", name:"Chrome",   bg:P[8]  },
  { key:"m10", id:"grill03", name:"Triple",   bg:P[9]  },
  { key:"m11", id:"grill03", name:"Grillz",   bg:P[10] },
  { key:"m12", id:"smile01", name:"Smile",    bg:P[11] },
  { key:"m13", id:"smile01", name:"Happy",    bg:P[12] },
  { key:"m14", id:"smile01", name:"Grin",     bg:P[13] },
  { key:"m15", id:"smile02", name:"Big Grin", bg:P[14] },
  { key:"m16", id:"smile02", name:"Cheeky",   bg:P[15] },
  { key:"m17", id:"square01",name:"Square",   bg:P[16] },
  { key:"m18", id:"square01",name:"Flat",     bg:P[17] },
  { key:"m19", id:"square02",name:"Wide",     bg:P[18] },
  { key:"m20", id:"square02",name:"Box",      bg:P[19] },
]

// ── Steps ─────────────────────────────────────────────────────────────────────

type ValKey  = "face"|"eyes"|"top"|"sides"|"texture"|"mouth"
type CardKey = "faceKey"|"eyesKey"|"topKey"|"sidesKey"|"textureKey"|"mouthKey"

// scale: CSS transform scale applied to the 150px image inside the 150px crop window
// ty:    translateY offset in px (positive = down, negative = up)
const STEPS = [
  { val:"face"    as ValKey, card:"faceKey"    as CardKey, label:"Head",    emoji:"🤖", hint:"Pick your robot's head shape",          scale:1.35, ty:10,  options:HEAD_OPTS  },
  { val:"texture" as ValKey, card:"textureKey" as CardKey, label:"Skin",    emoji:"🎨", hint:"Choose your robot's skin texture",      scale:1.45, ty:8,   options:SKIN_OPTS  },
  { val:"eyes"    as ValKey, card:"eyesKey"    as CardKey, label:"Eyes",    emoji:"👀", hint:"Choose your robot's eye style",         scale:1.9,  ty:20,  options:EYES_OPTS  },
  { val:"top"     as ValKey, card:"topKey"     as CardKey, label:"Antenna", emoji:"📡", hint:"What sits on top of your robot's head?",scale:1.55, ty:-18, options:TOP_OPTS   },
  { val:"sides"   as ValKey, card:"sidesKey"   as CardKey, label:"Ears",    emoji:"👂", hint:"Pick the ear attachments on each side", scale:1.35, ty:12,  options:EARS_OPTS  },
  { val:"mouth"   as ValKey, card:"mouthKey"   as CardKey, label:"Mouth",   emoji:"😄", hint:"Pick your robot's mouth style",         scale:1.95, ty:30,  options:MOUTH_OPTS },
]

// ── URL helpers ───────────────────────────────────────────────────────────────

const DEFAULT: BotttsConfig = {
  face:"square01",  faceKey:"h08",
  eyes:"glow",      eyesKey:"e06",
  top:"antenna",    topKey:"t01",
  sides:"round",    sidesKey:"s13",
  texture:"circuits",textureKey:"k06",
  mouth:"smile01",  mouthKey:"m12",
}

function buildUrl(cfg: BotttsConfig, seed: string) {
  return (
    `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}&colorful=true` +
    `&face[]=${cfg.face}&eyes[]=${cfg.eyes}&top[]=${cfg.top}` +
    `&sides[]=${cfg.sides}&texture[]=${cfg.texture}&mouth[]=${cfg.mouth}`
  )
}

function previewUrl(cfg: BotttsConfig) {
  // Seed is fixed after head + skin are chosen — prevents color shifts on later steps
  const seed = `${cfg.faceKey}${cfg.textureKey}`
  return buildUrl(cfg, seed)
}

function headCardUrl(opt: PartOption) {
  return (
    `https://api.dicebear.com/9.x/bottts/svg?seed=${opt.key}&colorful=true` +
    `&face[]=${opt.id}` +
    `&topProbability=0&sidesProbability=0&mouthProbability=0&textureProbability=0&eyesProbability=0`
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ChooseRobotPage() {
  const router = useRouter()
  const [cfg, setCfg] = useState<BotttsConfig>(DEFAULT)
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [visibleUrl, setVisibleUrl] = useState(() => previewUrl(DEFAULT))

  useEffect(() => {
    const url = previewUrl(cfg)
    let cancelled = false
    const img = new Image()
    img.onload = () => { if (!cancelled) setVisibleUrl(url) }
    img.src = url
    return () => { cancelled = true }
  }, [cfg])

  useEffect(() => {
    fetch("/api/robot")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.robotConfig) setCfg({ ...DEFAULT, ...d.robotConfig }) })
      .catch(() => {})
  }, [])

  function pick(s: typeof STEPS[number], opt: PartOption) {
    setCfg(prev => ({ ...prev, [s.val]: opt.id, [s.card]: opt.key }))
  }

  async function save() {
    if (saving) return
    setSaving(true)
    try {
      const res = await fetch("/api/robot", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ robotConfig: cfg }),
      })
      if (!res.ok) throw new Error()
      router.push("/dashboard")
      router.refresh()
    } catch { setSaving(false) }
  }

  const currentStep = STEPS[step]
  const isLast = step === STEPS.length - 1
  const progressPct = ((step + 1) / STEPS.length) * 100

  return (
    <div style={{
      minHeight:"100vh", background:"#0F172A",
      fontFamily:"'Nunito', system-ui, sans-serif",
      display:"flex", flexDirection:"column",
    }}>

      {/* ── Header: preview + pills ─────────────────────────────────── */}
      <div style={{ padding:"24px 24px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:12, flexShrink:0 }}>

        {/* Live preview */}
        <div style={{ position:"relative" }}>
          <div style={{
            position:"absolute", inset:-24, borderRadius:"50%",
            background:"radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)",
            pointerEvents:"none",
          }}/>
          <img
            src={visibleUrl}
            alt="Your robot"
            width={150} height={150}
            style={{ filter:"drop-shadow(0 8px 22px rgba(99,102,241,0.5))", position:"relative", display:"block" }}
          />
        </div>

        {/* Step label */}
        <div style={{
          background:"rgba(255,255,255,0.06)", borderRadius:12,
          padding:"6px 18px", textAlign:"center",
          border:"1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ color:"rgba(255,255,255,0.38)", fontSize:10, fontWeight:800, letterSpacing:1.5 }}>NOW CHOOSING</div>
          <div style={{ color:"white", fontSize:15, fontWeight:900 }}>{currentStep.emoji} {currentStep.label}</div>
        </div>

        {/* Step pills */}
        <div style={{ display:"flex", gap:5, flexWrap:"wrap", justifyContent:"center" }}>
          {STEPS.map((s, i) => {
            const done = i < step, active = i === step
            return (
              <button key={s.val} onClick={() => setStep(i)} style={{
                padding:"4px 12px", borderRadius:20, border:"none", cursor:"pointer",
                fontSize:11, fontWeight:800, transition:"all 0.15s",
                background: active ? "#6366F1" : done ? "rgba(99,102,241,0.22)" : "rgba(255,255,255,0.06)",
                color: active ? "white" : done ? "#818CF8" : "rgba(255,255,255,0.3)",
                boxShadow: active ? "0 4px 14px rgba(99,102,241,0.5)" : "none",
              }}>
                {done ? "✓ " : ""}{s.emoji} {s.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Option grid ─────────────────────────────────────────────── */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 20px 100px" }}>
        <p style={{ color:"rgba(255,255,255,0.38)", fontSize:13, fontWeight:700, margin:"0 0 14px", textAlign:"center" }}>
          {currentStep.hint}
        </p>

        {step === 0 ? (
          <div style={{
            maxWidth:860, margin:"0 auto",
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))",
            gap:12,
          }}>
            {currentStep.options.map(opt => {
              const selected = cfg[currentStep.card] === opt.key
              return (
                <button key={opt.key} onClick={() => pick(currentStep, opt)} style={{
                  border:"none", borderRadius:20, cursor:"pointer", padding:"0 0 10px",
                  overflow:"hidden",
                  background: selected ? opt.bg : "rgba(255,255,255,0.07)",
                  outline: selected ? "3px solid white" : "none", outlineOffset:3,
                  boxShadow: selected
                    ? `0 0 0 5px ${opt.bg}55, 0 14px 30px ${opt.bg}66`
                    : "0 4px 14px rgba(0,0,0,0.25)",
                  transform: selected ? "scale(1.06)" : "scale(1)",
                  transition:"all 0.15s ease",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                  fontFamily:"inherit",
                }}>
                  <img
                    src={headCardUrl(opt)}
                    alt={opt.name}
                    width={150} height={150}
                    loading="lazy"
                    style={{
                      display:"block",
                      filter: selected
                        ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
                        : "grayscale(1) opacity(0.55)",
                    }}
                  />
                  <span style={{ fontWeight:900, fontSize:12, color: selected ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.45)" }}>
                    {opt.name}
                  </span>
                  {selected && (
                    <span style={{ background:"rgba(0,0,0,0.2)", color:"white", fontWeight:900, fontSize:10, padding:"2px 10px", borderRadius:20 }}>
                      ✓ Selected
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}>
            <div style={{
              background:"rgba(99,102,241,0.1)", borderRadius:24, padding:16,
              border:"2px solid rgba(99,102,241,0.25)",
            }}>
              <img
                src={visibleUrl}
                alt="Your robot"
                width={220} height={220}
                style={{ display:"block", filter:"drop-shadow(0 8px 24px rgba(99,102,241,0.45))" }}
              />
            </div>

            <div style={{
              width:"100%", maxWidth:480,
              display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:8,
            }}>
              {currentStep.options.map(opt => {
                const selected = cfg[currentStep.card] === opt.key
                return (
                  <button key={opt.key} onClick={() => pick(currentStep, opt)} style={{
                    border:"none", borderRadius:12, cursor:"pointer",
                    padding:"12px 6px",
                    background: selected ? opt.bg : "rgba(255,255,255,0.07)",
                    outline: selected ? "3px solid white" : "none", outlineOffset:2,
                    boxShadow: selected ? `0 4px 12px ${opt.bg}66` : "none",
                    transform: selected ? "scale(1.05)" : "scale(1)",
                    transition:"all 0.12s ease",
                    color: selected ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.6)",
                    fontWeight:900, fontSize:11, textAlign:"center", lineHeight:1.2,
                    fontFamily:"inherit",
                  }}>
                    {opt.name}
                    {selected && <div style={{ fontSize:9, marginTop:2 }}>✓</div>}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────── */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0,
        padding:"12px 24px",
        background:"rgba(15,23,42,0.97)", backdropFilter:"blur(16px)",
        borderTop:"1px solid rgba(255,255,255,0.07)",
        display:"flex", alignItems:"center", gap:12, zIndex:50,
      }}>
        {step > 0 ? (
          <button onClick={() => setStep(s => s - 1)} style={{
            padding:"11px 22px", borderRadius:12,
            border:"2px solid rgba(255,255,255,0.12)",
            background:"transparent", color:"white",
            fontWeight:800, fontSize:13, cursor:"pointer", fontFamily:"inherit",
          }}>← Back</button>
        ) : <div />}

        <div style={{ flex:1, height:5, background:"rgba(255,255,255,0.08)", borderRadius:5 }}>
          <div style={{
            height:"100%", borderRadius:5,
            background:"linear-gradient(90deg, #6366F1, #8B5CF6)",
            width:`${progressPct}%`, transition:"width 0.35s ease",
          }}/>
        </div>

        <span style={{ color:"rgba(255,255,255,0.3)", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
          {step + 1} / {STEPS.length}
        </span>

        {isLast ? (
          <button onClick={save} disabled={saving} style={{
            padding:"12px 28px", borderRadius:12, border:"none",
            background:"linear-gradient(135deg, #6366F1, #8B5CF6)",
            color:"white", fontWeight:900, fontSize:15, cursor:"pointer",
            fontFamily:"inherit", boxShadow:"0 4px 20px rgba(99,102,241,0.55)",
            opacity:saving ? 0.7 : 1,
          }}>
            {saving ? "Saving…" : "Build My Robot! 🚀"}
          </button>
        ) : (
          <button onClick={() => setStep(s => s + 1)} style={{
            padding:"12px 28px", borderRadius:12, border:"none",
            background:"linear-gradient(135deg, #6366F1, #8B5CF6)",
            color:"white", fontWeight:900, fontSize:15, cursor:"pointer",
            fontFamily:"inherit", boxShadow:"0 4px 20px rgba(99,102,241,0.55)",
          }}>
            Next: {STEPS[step + 1]?.label} {STEPS[step + 1]?.emoji} →
          </button>
        )}
      </div>
    </div>
  )
}
