import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import BackButton from "@/components/shared/BackButton"

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") redirect("/login")

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <BackButton />
      {children}
    </div>
  )
}
