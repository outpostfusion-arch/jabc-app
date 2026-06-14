import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createReadStream, statSync } from "fs"
import path from "path"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const video = await prisma.video.findUnique({ where: { id } })
  if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const filePath = video.filePath.startsWith("/")
    ? path.join(process.cwd(), "public", video.filePath)
    : video.filePath

  let stat
  try {
    stat = statSync(filePath)
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 })
  }

  const rangeHeader = req.headers.get("range")
  const fileSize = stat.size

  if (rangeHeader) {
    const parts = rangeHeader.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    const chunkSize = end - start + 1

    const stream = createReadStream(filePath, { start, end })
    const chunks: Buffer[] = []
    for await (const chunk of stream) chunks.push(Buffer.from(chunk))

    return new NextResponse(Buffer.concat(chunks), {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize.toString(),
        "Content-Type": "video/mp4",
      },
    })
  }

  const stream = createReadStream(filePath)
  const chunks: Buffer[] = []
  for await (const chunk of stream) chunks.push(Buffer.from(chunk))

  return new NextResponse(Buffer.concat(chunks), {
    status: 200,
    headers: {
      "Content-Length": fileSize.toString(),
      "Content-Type": "video/mp4",
      "Accept-Ranges": "bytes",
    },
  })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  const { id } = await params
  const { title, description, sortOrder } = await req.json()
  const video = await prisma.video.update({
    where: { id },
    data: { title, description, sortOrder },
  })
  return NextResponse.json(video)
}
