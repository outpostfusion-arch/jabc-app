import Anthropic from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"

const client = new Anthropic()

export async function POST(req: Request) {
  const { type, idea } = await req.json() as { type: "name" | "tagline"; idea: string }

  if (!idea?.trim()) {
    return NextResponse.json({ error: "Idea is required" }, { status: 400 })
  }

  const prompt =
    type === "name"
      ? `You are a creative business naming expert helping junior high students brainstorm business names for the Junior Achievement Business Challenge. Generate exactly 5 short, catchy, memorable business names for a business with this idea: "${idea}". Return ONLY a JSON array of 5 strings, nothing else. Example format: ["Name One","Name Two","Name Three","Name Four","Name Five"]`
      : `You are a creative copywriter helping junior high students create taglines for the Junior Achievement Business Challenge. Generate exactly 5 short, punchy taglines (under 10 words each) for a business with this idea: "${idea}". Return ONLY a JSON array of 5 strings, nothing else. Example format: ["Tagline one","Tagline two","Tagline three","Tagline four","Tagline five"]`

  const message = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 300,
    thinking: { type: "adaptive" },
    messages: [{ role: "user", content: prompt }],
  })

  const textBlock = message.content.find((b) => b.type === "text")
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "No response from AI" }, { status: 500 })
  }

  const jsonMatch = textBlock.text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    return NextResponse.json({ error: "Could not parse suggestions" }, { status: 500 })
  }

  const suggestions: string[] = JSON.parse(jsonMatch[0])
  return NextResponse.json({ suggestions })
}
