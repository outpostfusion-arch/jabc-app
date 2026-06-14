import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

  const uploadDir = process.env["UPLOAD_DIR"] ?? path.join(process.cwd(), "public", "uploads", "videos")
  await mkdir(uploadDir, { recursive: true })

  const ext = file.name.split(".").pop() ?? "mp4"
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const filePath = path.join(uploadDir, filename)
  const bytes = await file.arrayBuffer()
  await writeFile(filePath, Buffer.from(bytes))

  const publicPath = `/uploads/videos/${filename}`
  return NextResponse.json({ filePath: publicPath, mimeType: file.type || "video/mp4", sizeBytes: file.size })
}
