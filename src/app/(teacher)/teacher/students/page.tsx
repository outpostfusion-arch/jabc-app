import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function StudentsPage() {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { displayName: "asc" },
    include: { userBadges: true },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black" style={{ color: "#1E293B" }}>Students 👥</h1>
          <p className="mt-1 font-semibold" style={{ color: "#64748B" }}>{students.length} students enrolled</p>
        </div>
        <Link
          href="/teacher/students/new"
          className="px-5 py-3 rounded-2xl text-white font-bold text-sm transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
        >
          + Add Students
        </Link>
      </div>

      <div className="rounded-3xl border overflow-hidden" style={{ background: "white", borderColor: "#E2E8F0" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              <th className="text-left px-6 py-4 font-bold" style={{ color: "#64748B" }}>Student</th>
              <th className="text-left px-4 py-4 font-bold" style={{ color: "#64748B" }}>Username</th>
              <th className="text-left px-4 py-4 font-bold" style={{ color: "#64748B" }}>Class Code</th>
              <th className="text-center px-4 py-4 font-bold" style={{ color: "#64748B" }}>Points</th>
              <th className="text-center px-4 py-4 font-bold" style={{ color: "#64748B" }}>Badges</th>
              <th className="text-center px-4 py-4 font-bold" style={{ color: "#64748B" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr key={student.id} style={{ borderTop: idx > 0 ? "1px solid #F1F5F9" : undefined }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{student.avatarEmoji}</span>
                    <span className="font-bold" style={{ color: "#1E293B" }}>{student.displayName}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <code className="px-2 py-1 rounded-lg text-xs font-bold" style={{ background: "#F1F5F9", color: "#475569" }}>
                    {student.username}
                  </code>
                </td>
                <td className="px-4 py-4 font-medium" style={{ color: "#64748B" }}>{student.classCode ?? "—"}</td>
                <td className="text-center px-4 py-4">
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "#FEF3C7", color: "#D97706" }}>
                    ⭐ {student.points}
                  </span>
                </td>
                <td className="text-center px-4 py-4">
                  <span className="font-bold" style={{ color: "#6366F1" }}>{student.userBadges.length}</span>
                </td>
                <td className="text-center px-4 py-4">
                  <Link
                    href={`/teacher/students/${student.id}`}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl mr-2"
                    style={{ background: "#EEF2FF", color: "#6366F1" }}
                  >
                    View Work
                  </Link>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-16" style={{ color: "#94A3B8" }}>
                  <div className="text-5xl mb-3">👥</div>
                  <div className="font-bold text-lg">No students yet</div>
                  <div className="mt-2">
                    <Link href="/teacher/students/new" style={{ color: "#6366F1" }} className="font-bold">
                      Create student accounts →
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
