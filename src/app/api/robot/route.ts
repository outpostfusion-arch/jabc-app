import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const VALID = {
  face:    new Set(["round01","round02","square01","square02","square03","square04"]),
  eyes:    new Set(["bulging","dizzy","eva","frame1","frame2","glow","happy","hearts","robocop","round","roundFrame01","roundFrame02","sensor","shade01"]),
  top:     new Set(["antenna","antennaCrooked","bulb01","glowingBulb01","glowingBulb02","horns","lights","pyramid","radar","none","ctop_star","ctop_crown","ctop_lightning","ctop_satellite","ctop_wifi","ctop_propeller","ctop_eyestalk","ctop_halo"]),
  sides:   new Set(["antenna01","antenna02","cables01","cables02","round","square","squareAssymetric"]),
  texture: new Set(["camo01","camo02","circuits","dirty01","dirty02","dots","grunge01","grunge02","cs01","cs02","cs03","cs04","cs05","cs06","cs07","cs08","cs09","cs10","cs11","cs12","cs13","cs14","cs15","cs16","cs17","cs18","cs19","cs20"]),
  mouth:   new Set(["bite","diagram","grill01","grill02","grill03","smile01","smile02","square01","square02"]),
}

function isValidConfig(c: unknown): c is { face: string; eyes: string; top: string; sides: string; texture: string; mouth: string } {
  if (!c || typeof c !== "object") return false
  const o = c as Record<string, unknown>
  return (
    typeof o.face === "string"    && VALID.face.has(o.face)       &&
    typeof o.eyes === "string"    && VALID.eyes.has(o.eyes)       &&
    typeof o.top === "string"     && VALID.top.has(o.top)         &&
    typeof o.sides === "string"   && VALID.sides.has(o.sides)     &&
    typeof o.texture === "string" && VALID.texture.has(o.texture) &&
    (o.mouth === undefined || (typeof o.mouth === "string" && VALID.mouth.has(o.mouth)))
  )
}

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { robotId: true },
  })

  let robotConfig = null
  if (user?.robotId) {
    try { robotConfig = JSON.parse(user.robotId) } catch {}
  }

  return NextResponse.json({ robotConfig })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => ({}))

  if (!isValidConfig(body?.robotConfig)) {
    return NextResponse.json({ error: "Invalid robot config" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { robotId: JSON.stringify(body.robotConfig) },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { robotId: null },
  })

  return NextResponse.json({ ok: true })
}
