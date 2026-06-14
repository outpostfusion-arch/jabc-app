import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import TeamWorkspace from "@/components/team/TeamWorkspace"
import AvatarImage from "@/components/shared/AvatarImage"

export default async function TeamWorkspacePage() {
  const session = await auth()

  const membership = await prisma.teamMember.findFirst({
    where: { userId: session!.user.id },
    include: {
      team: {
        include: {
          members: { include: { user: { select: { id: true, displayName: true, avatarEmoji: true } } } },
          marketingDoc: true,
        },
      },
    },
  })

  if (!membership) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">👥</div>
        <h2 className="text-2xl font-black" style={{ color: "#1E293B" }}>No Team Yet</h2>
        <p className="mt-2 font-semibold" style={{ color: "#64748B" }}>
          Your teacher will assign you to a team. Check back soon!
        </p>
      </div>
    )
  }

  const team = membership.team

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm font-bold mb-2" style={{ color: "#22C55E" }}>
          <span>🤝</span> Session 3
        </div>
        <h1 className="text-3xl font-black" style={{ color: "#1E293B" }}>Team Marketing Workshop</h1>
        <p className="mt-1 font-semibold" style={{ color: "#64748B" }}>
          Collaborate with your team to create a marketing plan!
        </p>
      </div>

      <div className="mb-4 flex items-center gap-2 flex-wrap">
        {team.members.map((m) => (
          <span key={m.user.id} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold" style={{ background: "#F1F5F9", color: "#475569" }}>
            <AvatarImage avatarId={m.user.avatarEmoji ?? "fox"} size={24} />
            {m.user.displayName}
          </span>
        ))}
      </div>

      <TeamWorkspace
        teamId={team.id}
        teamName={team.name}
        userId={session!.user.id}
        initialDoc={team.marketingDoc ? {
          slogan: team.marketingDoc.slogan,
          keyMessages: team.marketingDoc.keyMessages as string[],
          toneOfVoice: team.marketingDoc.toneOfVoice,
          version: team.marketingDoc.version,
        } : undefined}
      />
    </div>
  )
}