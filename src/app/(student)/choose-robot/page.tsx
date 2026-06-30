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

interface CustomSkin {
  key: string       // unique id, also used as DiceBear seed for robot color
  name: string
  bg: string        // card accent color
  patternId: string // SVG pattern element id
  patternDefs: string // SVG <pattern> XML to inject into <defs>
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

const CUSTOM_TOP_SVGS: Record<string, string> = {
  ctop_star:      `<line x1="91" y1="44" x2="91" y2="28" stroke="#9CA3AF" stroke-width="3"/><polygon points="91,4 94,12 103,12 96,18 98,26 91,21 84,26 86,18 79,12 88,12" fill="#FCD34D" stroke="#D97706" stroke-width="1"/>`,
  ctop_crown:     `<path d="M66,44 L66,28 L78,36 L91,8 L104,36 L116,28 L116,44 Z" fill="#FCD34D" stroke="#D97706" stroke-width="1.5"/><rect x="66" y="41" width="50" height="4" rx="1" fill="#E5A012"/>`,
  ctop_lightning: `<path d="M88,6 L78,22 L89,22 L82,44 L104,18 L93,18 L100,6 Z" fill="#FBBF24" stroke="#F59E0B" stroke-width="1"/>`,
  ctop_satellite: `<line x1="91" y1="44" x2="91" y2="30" stroke="#6B7280" stroke-width="3"/><path d="M67,26 Q81,8 107,16 Q99,34 67,26 Z" fill="#D1D5DB" stroke="#6B7280" stroke-width="1.5"/><circle cx="75" cy="12" r="4" fill="#60A5FA"/><circle cx="91" cy="30" r="2" fill="#374151"/>`,
  ctop_wifi:      `<circle cx="91" cy="44" r="5" fill="#2563EB"/><path d="M79,39 Q91,27 103,39" fill="none" stroke="#60A5FA" stroke-width="3.5" stroke-linecap="round"/><path d="M69,32 Q91,14 113,32" fill="none" stroke="#93C5FD" stroke-width="3" stroke-linecap="round" opacity="0.8"/><path d="M59,25 Q91,1 123,25" fill="none" stroke="#BFDBFE" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>`,
  ctop_propeller: `<line x1="91" y1="44" x2="91" y2="30" stroke="#6B7280" stroke-width="3"/><ellipse cx="91" cy="8" rx="5" ry="10" fill="#60A5FA" opacity="0.9"/><ellipse cx="101" cy="18" rx="10" ry="5" fill="#34D399" opacity="0.9"/><ellipse cx="91" cy="28" rx="5" ry="10" fill="#60A5FA" opacity="0.9"/><ellipse cx="81" cy="18" rx="10" ry="5" fill="#34D399" opacity="0.9"/><circle cx="91" cy="18" r="5" fill="#4B5563" stroke="#9CA3AF" stroke-width="2"/>`,
  ctop_eyestalk:  `<line x1="91" y1="44" x2="91" y2="30" stroke="#6B7280" stroke-width="3"/><ellipse cx="91" cy="18" rx="14" ry="11" fill="white" stroke="#374151" stroke-width="2"/><circle cx="91" cy="18" r="8" fill="#4338CA"/><circle cx="91" cy="18" r="4" fill="#1E1B4B"/><circle cx="95" cy="14" r="2.5" fill="white"/>`,
  ctop_halo:      `<line x1="91" y1="44" x2="91" y2="28" stroke="#D1D5DB" stroke-width="2.5" opacity="0.8"/><ellipse cx="91" cy="16" rx="24" ry="8" fill="rgba(252,211,77,0.1)"/><ellipse cx="91" cy="16" rx="24" ry="8" fill="none" stroke="#FCD34D" stroke-width="5" opacity="0.95"/><ellipse cx="91" cy="16" rx="24" ry="8" fill="none" stroke="white" stroke-width="2" opacity="0.6"/>`,
}

const TOP_OPTS: PartOption[] = [
  { key:"t01", id:"antenna",        name:"Antenna",    bg:P[0]  },
  { key:"t02", id:"antennaCrooked", name:"Bent",       bg:P[2]  },
  { key:"t03", id:"bulb01",         name:"Bulb",       bg:P[4]  },
  { key:"t04", id:"glowingBulb01",  name:"Glow",       bg:P[6]  },
  { key:"t05", id:"glowingBulb02",  name:"Twin Glow",  bg:P[8]  },
  { key:"t06", id:"horns",          name:"Horns",      bg:P[10] },
  { key:"t07", id:"lights",         name:"Lights",     bg:P[12] },
  { key:"t08", id:"pyramid",        name:"Pyramid",    bg:P[14] },
  { key:"t09", id:"radar",          name:"Radar",      bg:P[16] },
  { key:"t10", id:"none",           name:"None",       bg:P[18] },
  { key:"t11", id:"ctop_star",      name:"Star",       bg:P[15] },
  { key:"t12", id:"ctop_crown",     name:"Crown",      bg:P[2]  },
  { key:"t13", id:"ctop_lightning", name:"Lightning",  bg:P[1]  },
  { key:"t14", id:"ctop_satellite", name:"Satellite",  bg:P[5]  },
  { key:"t15", id:"ctop_wifi",      name:"WiFi",       bg:P[6]  },
  { key:"t16", id:"ctop_propeller", name:"Propeller",  bg:P[4]  },
  { key:"t17", id:"ctop_eyestalk",  name:"Eye Stalk",  bg:P[7]  },
  { key:"t18", id:"ctop_halo",      name:"Halo",       bg:P[19] },
]

const EARS_OPTS: PartOption[] = [
  { key:"s01", id:"antenna01",        name:"Spike",       bg:P[0]  },
  { key:"s02", id:"antenna01",        name:"Feelers",     bg:P[10] },
  { key:"s03", id:"antenna02",        name:"Twin Spike",  bg:P[1]  },
  { key:"s04", id:"antenna02",        name:"Dual",        bg:P[11] },
  { key:"s05", id:"cables01",         name:"Cables",      bg:P[2]  },
  { key:"s06", id:"cables01",         name:"Plugged",     bg:P[12] },
  { key:"s07", id:"cables02",         name:"Coiled",      bg:P[3]  },
  { key:"s08", id:"cables02",         name:"Wire Up",     bg:P[13] },
  { key:"s09", id:"round",            name:"Round",       bg:P[4]  },
  { key:"s10", id:"round",            name:"Orbs",        bg:P[14] },
  { key:"s11", id:"square",           name:"Square",      bg:P[5]  },
  { key:"s12", id:"square",           name:"Blocks",      bg:P[15] },
  { key:"s13", id:"squareAssymetric", name:"Wonky",       bg:P[6]  },
  { key:"s14", id:"squareAssymetric", name:"Off-Balance", bg:P[16] },
]

// ── Custom skin patterns (SVG post-processing) ────────────────────────────────

const CUSTOM_SKINS: CustomSkin[] = [
  {
    key:"cs01", name:"Carbon Fiber", bg:"#1f2937", patternId:"cs01p",
    patternDefs:`<pattern id="cs01p" patternUnits="userSpaceOnUse" width="8" height="8"><rect width="8" height="8" fill="#111827"/><rect width="4" height="4" fill="#1f2937"/><rect x="4" y="4" width="4" height="4" fill="#1f2937"/><rect x="1" y="0" width="2" height="4" fill="#374151" opacity="0.9"/><rect x="5" y="4" width="2" height="4" fill="#374151" opacity="0.9"/><rect x="0" y="1" width="4" height="2" fill="#4b5563" opacity="0.5"/><rect x="4" y="5" width="4" height="2" fill="#4b5563" opacity="0.5"/></pattern>`,
  },
  {
    key:"cs02", name:"Brushed Steel", bg:"#9ca3af", patternId:"cs02p",
    patternDefs:`<pattern id="cs02p" patternUnits="userSpaceOnUse" width="2" height="6"><rect width="2" height="1" fill="#6b7280"/><rect y="1" width="2" height="2" fill="#f3f4f6"/><rect y="3" width="2" height="2" fill="#d1d5db"/><rect y="5" width="2" height="1" fill="#9ca3af"/></pattern>`,
  },
  {
    key:"cs03", name:"Chrome", bg:"#d1d5db", patternId:"cs03p",
    patternDefs:`<pattern id="cs03p" patternUnits="userSpaceOnUse" width="6" height="6"><rect width="6" height="6" fill="#c0c0c0"/><rect width="3" height="3" fill="#f5f5f5"/><rect x="3" y="3" width="3" height="3" fill="#e8e8e8"/><rect x="1" y="0" width="1" height="3" fill="#a8a8a8"/><rect x="4" y="3" width="1" height="3" fill="#a8a8a8"/></pattern>`,
  },
  {
    key:"cs04", name:"Gold Foil", bg:"#d97706", patternId:"cs04p",
    patternDefs:`<pattern id="cs04p" patternUnits="userSpaceOnUse" width="6" height="6"><rect width="6" height="6" fill="#92400e"/><rect width="3" height="3" fill="#fcd34d"/><rect x="3" y="3" width="3" height="3" fill="#fbbf24"/><rect x="1" y="0" width="1" height="3" fill="#f59e0b"/><rect x="4" y="3" width="1" height="3" fill="#f59e0b"/><rect x="0" y="1" width="3" height="1" fill="#fde68a" opacity="0.6"/></pattern>`,
  },
  {
    key:"cs05", name:"Hazard", bg:"#fbbf24", patternId:"cs05p",
    patternDefs:`<pattern id="cs05p" patternUnits="userSpaceOnUse" width="24" height="24" patternTransform="rotate(45)"><rect width="12" height="24" fill="#fcd34d"/><rect x="12" width="12" height="24" fill="#1c1917"/></pattern>`,
  },
  {
    key:"cs06", name:"Tiger Stripe", bg:"#ea580c", patternId:"cs06p",
    patternDefs:`<pattern id="cs06p" patternUnits="userSpaceOnUse" width="16" height="32" patternTransform="rotate(20)"><rect width="16" height="32" fill="#c2410c"/><rect x="2" width="5" height="32" fill="#1c1917" opacity="0.85"/><rect x="10" width="3" height="32" fill="#1c1917" opacity="0.85"/><rect x="6" width="2" height="32" fill="#ea580c" opacity="0.6"/></pattern>`,
  },
  {
    key:"cs07", name:"Camo", bg:"#4d7c0f", patternId:"cs07p",
    patternDefs:`<pattern id="cs07p" patternUnits="userSpaceOnUse" width="24" height="24"><rect width="24" height="24" fill="#365314"/><rect x="0" y="0" width="10" height="8" fill="#4d7c0f"/><rect x="8" y="6" width="12" height="8" fill="#65a30d" opacity="0.8"/><rect x="0" y="14" width="8" height="10" fill="#166534" opacity="0.9"/><rect x="14" y="0" width="10" height="10" fill="#78350f" opacity="0.5"/><rect x="16" y="14" width="8" height="10" fill="#3f6212"/></pattern>`,
  },
  {
    key:"cs08", name:"Blueprint", bg:"#1d4ed8", patternId:"cs08p",
    patternDefs:`<pattern id="cs08p" patternUnits="userSpaceOnUse" width="16" height="16"><rect width="16" height="16" fill="#1e3a8a"/><line x1="0" y1="0" x2="16" y2="0" stroke="#3b82f6" stroke-width="0.6" opacity="0.9"/><line x1="0" y1="8" x2="16" y2="8" stroke="#93c5fd" stroke-width="0.3" opacity="0.5"/><line x1="0" y1="0" x2="0" y2="16" stroke="#3b82f6" stroke-width="0.6" opacity="0.9"/><line x1="8" y1="0" x2="8" y2="16" stroke="#93c5fd" stroke-width="0.3" opacity="0.5"/></pattern>`,
  },
  {
    key:"cs09", name:"Flames", bg:"#dc2626", patternId:"cs09p",
    patternDefs:`<pattern id="cs09p" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(-35)"><rect width="20" height="20" fill="#7f1d1d"/><rect width="6" height="20" fill="#dc2626"/><rect x="6" width="4" height="20" fill="#f97316"/><rect x="10" width="3" height="20" fill="#fbbf24" opacity="0.7"/><rect x="13" width="7" height="20" fill="#b91c1c"/></pattern>`,
  },
  {
    key:"cs10", name:"Plasma", bg:"#7e22ce", patternId:"cs10p",
    patternDefs:`<pattern id="cs10p" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(60)"><rect width="20" height="20" fill="#3b0764"/><rect width="6" height="20" fill="#7c3aed"/><rect x="6" width="4" height="20" fill="#ec4899"/><rect x="10" width="4" height="20" fill="#a855f7"/><rect x="14" width="3" height="20" fill="#db2777" opacity="0.8"/><rect x="17" width="3" height="20" fill="#6d28d9" opacity="0.9"/></pattern>`,
  },
  {
    key:"cs11", name:"Lava", bg:"#991b1b", patternId:"cs11p",
    patternDefs:`<pattern id="cs11p" patternUnits="userSpaceOnUse" width="20" height="20"><rect width="20" height="20" fill="#7f1d1d"/><ellipse cx="5" cy="5" rx="5" ry="4" fill="#ef4444"/><ellipse cx="15" cy="3" rx="4" ry="3" fill="#f97316"/><ellipse cx="10" cy="14" rx="6" ry="5" fill="#dc2626"/><ellipse cx="2" cy="17" rx="3" ry="3" fill="#fca5a5" opacity="0.5"/><ellipse cx="18" cy="15" rx="4" ry="3" fill="#f97316" opacity="0.7"/></pattern>`,
  },
  {
    key:"cs12", name:"Electric", bg:"#0284c7", patternId:"cs12p",
    patternDefs:`<pattern id="cs12p" patternUnits="userSpaceOnUse" width="12" height="40" patternTransform="rotate(12)"><rect width="12" height="40" fill="#0c4a6e"/><rect x="5" width="2" height="40" fill="#38bdf8" opacity="0.9"/><rect x="3" y="8" width="1" height="6" fill="#7dd3fc" opacity="0.6"/><rect x="8" y="22" width="1" height="8" fill="#7dd3fc" opacity="0.5"/><rect x="2" y="30" width="1" height="5" fill="#bae6fd" opacity="0.4"/></pattern>`,
  },
  {
    key:"cs13", name:"Circuit", bg:"#064e3b", patternId:"cs13p",
    patternDefs:`<pattern id="cs13p" patternUnits="userSpaceOnUse" width="20" height="20"><rect width="20" height="20" fill="#022c22"/><line x1="4" y1="0" x2="4" y2="8" stroke="#10b981" stroke-width="1"/><line x1="4" y1="8" x2="16" y2="8" stroke="#10b981" stroke-width="1"/><line x1="16" y1="8" x2="16" y2="20" stroke="#10b981" stroke-width="1"/><line x1="0" y1="14" x2="8" y2="14" stroke="#6ee7b7" stroke-width="0.5"/><circle cx="4" cy="8" r="1.5" fill="#34d399"/><circle cx="16" cy="8" r="1.5" fill="#34d399"/><circle cx="8" cy="14" r="1" fill="#6ee7b7"/></pattern>`,
  },
  {
    key:"cs14", name:"Matrix", bg:"#14532d", patternId:"cs14p",
    patternDefs:`<pattern id="cs14p" patternUnits="userSpaceOnUse" width="10" height="10"><rect width="10" height="10" fill="#052e16"/><rect x="0" y="0" width="4" height="6" fill="#16a34a" opacity="0.6"/><rect x="1" y="1" width="2" height="4" fill="#4ade80" opacity="0.4"/><rect x="5" y="3" width="4" height="5" fill="#15803d" opacity="0.7"/><rect x="6" y="4" width="2" height="3" fill="#86efac" opacity="0.3"/></pattern>`,
  },
  {
    key:"cs15", name:"Space", bg:"#1e1b4b", patternId:"cs15p",
    patternDefs:`<pattern id="cs15p" patternUnits="userSpaceOnUse" width="30" height="30"><rect width="30" height="30" fill="#0f0a1e"/><circle cx="3" cy="5" r="0.7" fill="white" opacity="0.9"/><circle cx="15" cy="2" r="1" fill="white" opacity="0.8"/><circle cx="24" cy="8" r="0.5" fill="white" opacity="0.7"/><circle cx="7" cy="18" r="0.8" fill="white" opacity="0.9"/><circle cx="20" cy="20" r="1.2" fill="white" opacity="0.6"/><circle cx="28" cy="25" r="0.6" fill="white" opacity="0.8"/><circle cx="12" cy="27" r="0.5" fill="#a5b4fc" opacity="0.7"/><circle cx="22" cy="13" r="0.4" fill="#fbcfe8" opacity="0.8"/><circle cx="5" cy="28" r="0.9" fill="white" opacity="0.6"/></pattern>`,
  },
  {
    key:"cs16", name:"Neon Grid", bg:"#be185d", patternId:"cs16p",
    patternDefs:`<pattern id="cs16p" patternUnits="userSpaceOnUse" width="16" height="16"><rect width="16" height="16" fill="#1a0a16"/><line x1="0" y1="0" x2="16" y2="0" stroke="#f0abfc" stroke-width="0.6"/><line x1="0" y1="8" x2="16" y2="8" stroke="#e879f9" stroke-width="0.3" opacity="0.5"/><line x1="0" y1="0" x2="0" y2="16" stroke="#f0abfc" stroke-width="0.6"/><line x1="8" y1="0" x2="8" y2="16" stroke="#e879f9" stroke-width="0.3" opacity="0.5"/><circle cx="0" cy="0" r="1" fill="#f0abfc"/><circle cx="16" cy="0" r="1" fill="#f0abfc"/><circle cx="0" cy="16" r="1" fill="#f0abfc"/><circle cx="16" cy="16" r="1" fill="#f0abfc"/></pattern>`,
  },
  {
    key:"cs17", name:"Ice Crystal", bg:"#0369a1", patternId:"cs17p",
    patternDefs:`<pattern id="cs17p" patternUnits="userSpaceOnUse" width="16" height="16" patternTransform="rotate(45)"><rect width="16" height="16" fill="#0c4a6e"/><rect width="8" height="8" fill="#0ea5e9" opacity="0.5"/><rect x="8" y="8" width="8" height="8" fill="#7dd3fc" opacity="0.4"/><rect y="0" width="8" height="4" fill="#bae6fd" opacity="0.3"/><rect x="8" y="12" width="8" height="4" fill="#e0f2fe" opacity="0.3"/></pattern>`,
  },
  {
    key:"cs18", name:"Rust", bg:"#92400e", patternId:"cs18p",
    patternDefs:`<pattern id="cs18p" patternUnits="userSpaceOnUse" width="16" height="16"><rect width="16" height="16" fill="#7c2d12"/><rect width="5" height="5" fill="#9a3412" opacity="0.7"/><rect x="7" y="2" width="4" height="4" fill="#c2410c" opacity="0.6"/><rect x="3" y="9" width="6" height="4" fill="#ea580c" opacity="0.5"/><rect x="11" y="7" width="5" height="5" fill="#78350f" opacity="0.8"/><rect x="1" y="13" width="4" height="3" fill="#dc2626" opacity="0.4"/><rect x="9" y="11" width="3" height="5" fill="#9a3412" opacity="0.7"/></pattern>`,
  },
  {
    key:"cs19", name:"Rainbow", bg:"#6366f1", patternId:"cs19p",
    patternDefs:`<pattern id="cs19p" patternUnits="userSpaceOnUse" width="42" height="7"><rect width="6" height="7" fill="#ef4444"/><rect x="6" width="6" height="7" fill="#f97316"/><rect x="12" width="6" height="7" fill="#eab308"/><rect x="18" width="6" height="7" fill="#22c55e"/><rect x="24" width="6" height="7" fill="#3b82f6"/><rect x="30" width="6" height="7" fill="#8b5cf6"/><rect x="36" width="6" height="7" fill="#ec4899"/></pattern>`,
  },
  {
    key:"cs20", name:"Pixel Art", bg:"#7c3aed", patternId:"cs20p",
    patternDefs:`<pattern id="cs20p" patternUnits="userSpaceOnUse" width="8" height="8"><rect width="2" height="2" fill="#ef4444"/><rect x="2" y="0" width="2" height="2" fill="#3b82f6"/><rect x="4" y="0" width="2" height="2" fill="#22c55e"/><rect x="6" y="0" width="2" height="2" fill="#f59e0b"/><rect x="0" y="2" width="2" height="2" fill="#8b5cf6"/><rect x="2" y="2" width="2" height="2" fill="#ec4899"/><rect x="4" y="2" width="2" height="2" fill="#14b8a6"/><rect x="6" y="2" width="2" height="2" fill="#ef4444"/><rect x="0" y="4" width="2" height="2" fill="#f97316"/><rect x="2" y="4" width="2" height="2" fill="#22c55e"/><rect x="4" y="4" width="2" height="2" fill="#3b82f6"/><rect x="6" y="4" width="2" height="2" fill="#a855f7"/><rect x="0" y="6" width="2" height="2" fill="#10b981"/><rect x="2" y="6" width="2" height="2" fill="#f59e0b"/><rect x="4" y="6" width="2" height="2" fill="#ec4899"/><rect x="6" y="6" width="2" height="2" fill="#06b6d4"/></pattern>`,
  },
]

// ── SVG post-processing helpers ───────────────────────────────────────────────

const svgCache = new Map<string, string>()

async function fetchSvgText(url: string): Promise<string> {
  if (svgCache.has(url)) return svgCache.get(url)!
  const res = await fetch(url)
  const text = await res.text()
  svgCache.set(url, text)
  return text
}

function patchSvg(svgText: string, skin: CustomSkin): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgText, "image/svg+xml")
  const svg = doc.documentElement

  let defs = svg.querySelector("defs")
  if (!defs) {
    defs = doc.createElementNS("http://www.w3.org/2000/svg", "defs")
    svg.prepend(defs)
  }

  const range = doc.createRange()
  range.selectNode(defs)
  defs.appendChild(range.createContextualFragment(skin.patternDefs))

  // The body background fill path always has d starting with "M-" (oversized rect behind the face mask)
  svg.querySelectorAll("path").forEach(p => {
    if ((p.getAttribute("d") ?? "").trimStart().startsWith("M-")) {
      p.setAttribute("fill", `url(#${skin.patternId})`)
    }
  })

  return new XMLSerializer().serializeToString(doc)
}

async function buildSkinDataUri(url: string, skin: CustomSkin): Promise<string> {
  const svgText = await fetchSvgText(url)
  const patched = patchSvg(svgText, skin)
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(patched)}`
}

function patchTopSvg(svgText: string, topElements: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgText, "image/svg+xml")
  const svg = doc.documentElement
  const range = doc.createRange()
  range.selectNode(svg)
  svg.appendChild(range.createContextualFragment(topElements))
  return new XMLSerializer().serializeToString(doc)
}

const MOUTH_OPTS: PartOption[] = [
  { key:"m01", id:"bite",     name:"Fangs",        bg:P[0]  },
  { key:"m02", id:"diagram",  name:"HUD",          bg:P[2]  },
  { key:"m03", id:"grill01",  name:"Grill",        bg:P[4]  },
  { key:"m04", id:"grill02",  name:"Steel Grill",  bg:P[6]  },
  { key:"m05", id:"grill03",  name:"Triple Grill", bg:P[8]  },
  { key:"m06", id:"smile01",  name:"Smile",        bg:P[11] },
  { key:"m07", id:"smile02",  name:"Big Grin",     bg:P[14] },
  { key:"m08", id:"square01", name:"Square",       bg:P[16] },
  { key:"m09", id:"square02", name:"Wide Block",   bg:P[18] },
]

// ── Steps ─────────────────────────────────────────────────────────────────────

type ValKey  = "face"|"eyes"|"top"|"sides"|"texture"|"mouth"
type CardKey = "faceKey"|"eyesKey"|"topKey"|"sidesKey"|"textureKey"|"mouthKey"

// scale: CSS transform scale applied to the 150px image inside the 150px crop window
// ty:    translateY offset in px (positive = down, negative = up)
const STEPS = [
  { val:"face"    as ValKey, card:"faceKey"    as CardKey, label:"Head",    emoji:"🤖", hint:"Pick your robot's head shape",           scale:1.35, ty:10,  options:HEAD_OPTS  },
  { val:"texture" as ValKey, card:"textureKey" as CardKey, label:"Skin",    emoji:"🎨", hint:"Choose your robot's skin pattern",       scale:1.45, ty:8,   options:[] as PartOption[] },
  { val:"eyes"    as ValKey, card:"eyesKey"    as CardKey, label:"Eyes",    emoji:"👀", hint:"Choose your robot's eye style",          scale:1.9,  ty:20,  options:EYES_OPTS  },
  { val:"top"     as ValKey, card:"topKey"     as CardKey, label:"Antenna", emoji:"📡", hint:"What sits on top of your robot's head?", scale:1.55, ty:-18, options:TOP_OPTS   },
  { val:"sides"   as ValKey, card:"sidesKey"   as CardKey, label:"Ears",    emoji:"👂", hint:"Pick the ear attachments on each side",  scale:1.35, ty:12,  options:EARS_OPTS  },
  { val:"mouth"   as ValKey, card:"mouthKey"   as CardKey, label:"Mouth",   emoji:"😄", hint:"Pick your robot's mouth style",          scale:1.95, ty:30,  options:MOUTH_OPTS },
]

// ── URL helpers ───────────────────────────────────────────────────────────────

const DEFAULT: BotttsConfig = {
  face:"square01", faceKey:"h08",
  eyes:"glow",     eyesKey:"e06",
  top:"antenna",   topKey:"t01",
  sides:"round",   sidesKey:"s13",
  texture:"cs13",  textureKey:"cs13",
  mouth:"smile01", mouthKey:"m06",
}

// Builds a base DiceBear URL with no texture — patterns are injected via SVG post-processing
function buildRobotUrl(cfg: BotttsConfig) {
  const noTop = cfg.top === "none" || cfg.top.startsWith("ctop_")
  const topParam = noTop ? "&topProbability=0" : `&top[]=${cfg.top}`
  return (
    `https://api.dicebear.com/9.x/bottts/svg?seed=${cfg.textureKey}&colorful=true` +
    `&face[]=${cfg.face}&eyes[]=${cfg.eyes}${topParam}` +
    `&sides[]=${cfg.sides}&mouth[]=${cfg.mouth}&textureProbability=0`
  )
}

function headCardUrl(opt: PartOption) {
  return (
    `https://api.dicebear.com/9.x/bottts/svg?seed=${opt.key}&colorful=true` +
    `&face[]=${opt.id}&eyes[]=round` +
    `&topProbability=0&sidesProbability=0&mouthProbability=0&textureProbability=0`
  )
}

function skinBaseUrl(skin: CustomSkin, face: string) {
  return (
    `https://api.dicebear.com/9.x/bottts/svg?seed=${skin.key}&colorful=true` +
    `&face[]=${face}&eyes[]=round` +
    `&topProbability=0&sidesProbability=0&mouthProbability=0&textureProbability=0`
  )
}

function earCardUrl(opt: PartOption, face: string) {
  return (
    `https://api.dicebear.com/9.x/bottts/svg?seed=${opt.key}&colorful=true` +
    `&sides[]=${opt.id}&face[]=${face}&eyes[]=round` +
    `&topProbability=0&textureProbability=0&mouthProbability=0`
  )
}

function antennaCardUrl(opt: PartOption, face: string) {
  const topParam = opt.id === "none" ? "&topProbability=0" : `&top[]=${opt.id}`
  return (
    `https://api.dicebear.com/9.x/bottts/svg?seed=${opt.key}&colorful=true` +
    `${topParam}&face[]=${face}&eyes[]=round` +
    `&sidesProbability=0&textureProbability=0&mouthProbability=0`
  )
}

function eyeCardUrl(opt: PartOption, face: string) {
  return (
    `https://api.dicebear.com/9.x/bottts/svg?seed=${opt.key}&colorful=true` +
    `&eyes[]=${opt.id}&face[]=${face}` +
    `&topProbability=0&sidesProbability=0&mouthProbability=0&textureProbability=0`
  )
}

function mouthCardUrl(opt: PartOption, face: string) {
  return (
    `https://api.dicebear.com/9.x/bottts/svg?seed=${opt.key}&colorful=true` +
    `&mouth[]=${opt.id}&face[]=${face}&eyes[]=round` +
    `&topProbability=0&sidesProbability=0&textureProbability=0`
  )
}

// ── TopCard component ─────────────────────────────────────────────────────────

function TopCard({
  opt, faceId, selected, onSelect,
}: {
  opt: PartOption
  faceId: string
  selected: boolean
  onSelect: () => void
}) {
  const isCustom = opt.id.startsWith("ctop_")
  const [dataUri, setDataUri] = useState("")

  useEffect(() => {
    if (!isCustom) return
    const topSvg = CUSTOM_TOP_SVGS[opt.id]
    if (!topSvg) return
    let cancelled = false
    const baseUrl = (
      `https://api.dicebear.com/9.x/bottts/svg?seed=${opt.key}&colorful=true` +
      `&face[]=${faceId}&eyes[]=round` +
      `&topProbability=0&sidesProbability=0&mouthProbability=0&textureProbability=0`
    )
    fetchSvgText(baseUrl)
      .then(svgText => {
        if (cancelled) return
        const patched = patchTopSvg(svgText, topSvg)
        setDataUri(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(patched)}`)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [opt.key, opt.id, faceId, isCustom])

  return (
    <button onClick={onSelect} style={{
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
      {isCustom ? (
        dataUri ? (
          <img src={dataUri} alt={opt.name} width={130} height={130} style={{
            display:"block",
            opacity: selected ? 1 : 0.6,
            filter: selected ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" : "none",
          }}/>
        ) : (
          <div style={{ width:130, height:130, background:opt.bg, opacity:0.2 }} />
        )
      ) : (
        <img
          src={antennaCardUrl(opt, faceId)}
          alt={opt.name}
          width={130} height={130}
          loading="lazy"
          style={{
            display:"block",
            opacity: selected ? 1 : 0.6,
            filter: selected ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" : "none",
          }}
        />
      )}
      <span style={{ fontWeight:900, fontSize:11, color: selected ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.45)" }}>
        {opt.name}
      </span>
      {selected && (
        <span style={{ background:"rgba(0,0,0,0.2)", color:"white", fontWeight:900, fontSize:10, padding:"2px 10px", borderRadius:20 }}>
          ✓ Selected
        </span>
      )}
    </button>
  )
}

// ── SkinCard component ────────────────────────────────────────────────────────

function SkinCard({
  skin, faceId, selected, onSelect,
}: {
  skin: CustomSkin
  faceId: string
  selected: boolean
  onSelect: () => void
}) {
  const [dataUri, setDataUri] = useState("")

  useEffect(() => {
    let cancelled = false
    buildSkinDataUri(skinBaseUrl(skin, faceId), skin)
      .then(uri => { if (!cancelled) setDataUri(uri) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [skin, faceId])

  return (
    <button onClick={onSelect} style={{
      border:"none", borderRadius:20, cursor:"pointer", padding:"0 0 10px",
      overflow:"hidden",
      background: selected ? skin.bg : "rgba(255,255,255,0.07)",
      outline: selected ? "3px solid white" : "none", outlineOffset:3,
      boxShadow: selected
        ? `0 0 0 5px ${skin.bg}55, 0 14px 30px ${skin.bg}66`
        : "0 4px 14px rgba(0,0,0,0.25)",
      transform: selected ? "scale(1.06)" : "scale(1)",
      transition:"all 0.15s ease",
      display:"flex", flexDirection:"column", alignItems:"center", gap:6,
      fontFamily:"inherit",
    }}>
      {dataUri ? (
        <img
          src={dataUri}
          alt={skin.name}
          width={130} height={130}
          style={{
            display:"block",
            opacity: selected ? 1 : 0.7,
            filter: selected ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" : "none",
          }}
        />
      ) : (
        <div style={{ width:130, height:130, background:skin.bg, opacity:0.2 }} />
      )}
      <span style={{ fontWeight:900, fontSize:11, color: selected ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.45)" }}>
        {skin.name}
      </span>
      {selected && (
        <span style={{ background:"rgba(0,0,0,0.2)", color:"white", fontWeight:900, fontSize:10, padding:"2px 10px", borderRadius:20 }}>
          ✓ Selected
        </span>
      )}
    </button>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ChooseRobotPage() {
  const router = useRouter()
  const [cfg, setCfg] = useState<BotttsConfig>(DEFAULT)
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [visibleUrl, setVisibleUrl] = useState("")

  useEffect(() => {
    const skin = CUSTOM_SKINS.find(s => s.key === cfg.textureKey)
    if (!skin) return
    const topSvg = cfg.top.startsWith("ctop_") ? CUSTOM_TOP_SVGS[cfg.top] : undefined
    let cancelled = false
    fetchSvgText(buildRobotUrl(cfg))
      .then(svgText => {
        if (cancelled) return
        let patched = patchSvg(svgText, skin)
        if (topSvg) patched = patchTopSvg(patched, topSvg)
        setVisibleUrl(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(patched)}`)
      })
      .catch(() => {})
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
        ) : step === 1 ? (
          <div style={{
            maxWidth:860, margin:"0 auto",
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(130px, 1fr))",
            gap:12,
          }}>
            {CUSTOM_SKINS.map(skin => (
              <SkinCard
                key={skin.key}
                skin={skin}
                faceId={cfg.face}
                selected={cfg.textureKey === skin.key}
                onSelect={() => setCfg(prev => ({ ...prev, texture: skin.key, textureKey: skin.key }))}
              />
            ))}
          </div>
        ) : step === 3 ? (
          <div style={{
            maxWidth:860, margin:"0 auto",
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(130px, 1fr))",
            gap:12,
          }}>
            {currentStep.options.map(opt => (
              <TopCard
                key={opt.key}
                opt={opt}
                faceId={cfg.face}
                selected={cfg[currentStep.card] === opt.key}
                onSelect={() => pick(currentStep, opt)}
              />
            ))}
          </div>
        ) : step === 4 ? (
          <div style={{
            maxWidth:860, margin:"0 auto",
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(130px, 1fr))",
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
                    src={earCardUrl(opt, cfg.face)}
                    alt={opt.name}
                    width={130} height={130}
                    loading="lazy"
                    style={{
                      display:"block",
                      opacity: selected ? 1 : 0.6,
                      filter: selected ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" : "none",
                    }}
                  />
                  <span style={{ fontWeight:900, fontSize:11, color: selected ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.45)" }}>
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
        ) : step === 2 ? (
          <div style={{
            maxWidth:860, margin:"0 auto",
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(130px, 1fr))",
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
                    src={eyeCardUrl(opt, cfg.face)}
                    alt={opt.name}
                    width={130} height={130}
                    loading="lazy"
                    style={{
                      display:"block",
                      opacity: selected ? 1 : 0.6,
                      filter: selected ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" : "none",
                    }}
                  />
                  <span style={{ fontWeight:900, fontSize:11, color: selected ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.45)" }}>
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
          <div style={{
            maxWidth:860, margin:"0 auto",
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill, minmax(130px, 1fr))",
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
                    src={mouthCardUrl(opt, cfg.face)}
                    alt={opt.name}
                    width={130} height={130}
                    loading="lazy"
                    style={{
                      display:"block",
                      opacity: selected ? 1 : 0.6,
                      filter: selected ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" : "none",
                    }}
                  />
                  <span style={{ fontWeight:900, fontSize:11, color: selected ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.45)" }}>
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
