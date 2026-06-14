import { prisma } from "@/lib/prisma"
import VideoPlayer from "@/components/shared/VideoPlayer"
import { auth } from "@/lib/auth"

export default async function TutorialsPage() {
  const session = await auth()
  const videos = await prisma.video.findMany({
    where: { sessionId: 4 },
    orderBy: { sortOrder: "asc" },
    include: { prompts: { orderBy: { sortOrder: "asc" } } },
  })

  const reflections = await prisma.videoReflection.findMany({
    where: { userId: session!.user.id },
  })
  const reflectionMap = Object.fromEntries(reflections.map((r) => [r.promptId, r.answer]))

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm font-bold mb-2" style={{ color: "#A855F7" }}>
          <span>⚙️</span> Session 4
        </div>
        <h1 className="text-3xl font-black" style={{ color: "#1E293B" }}>Product Creation Tutorials</h1>
        <p className="mt-1 font-semibold" style={{ color: "#64748B" }}>
          Watch the tutorials below to get ideas for your product. You can base your business on either or both!
        </p>
      </div>

      {videos.length === 0 ? (
        <div className="rounded-3xl border-2 p-10 text-center" style={{ borderColor: "#E2E8F0", background: "white" }}>
          <div className="text-5xl mb-3">🎬</div>
          <div className="text-xl font-black mb-2" style={{ color: "#1E293B" }}>Videos coming soon!</div>
          <p className="font-semibold" style={{ color: "#64748B" }}>Your teacher will upload the tutorial videos here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {videos.map((video) => (
            <VideoPlayer
              key={video.id}
              videoId={video.id}
              title={video.title}
              description={video.description}
              prompts={video.prompts.map((p) => ({ id: p.id, timestampSeconds: p.timestampSeconds, promptText: p.promptText }))}
              savedReflections={reflectionMap}
            />
          ))}
        </div>
      )}
    </div>
  )
}
