import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import StudentNav from "@/components/shared/StudentNav"
import ViewModeToggle from "@/components/shared/ViewModeToggle"

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const cookieStore = await cookies()
  const isTeacherPreview = session?.user?.role === "TEACHER" && cookieStore.get("jabc-view-mode")?.value === "student"

  if (!session || (session.user.role !== "STUDENT" && !isTeacherPreview)) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { displayName: true, avatarEmoji: true, points: true },
  })

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <StudentNav
        displayName={user?.displayName ?? ""}
        avatarEmoji={user?.avatarEmoji ?? "fox"}
        points={user?.points ?? 0}
      />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      {isTeacherPreview && <ViewModeToggle currentView="student" />}
    </div>
  )
}
