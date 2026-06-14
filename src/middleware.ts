import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
  const { nextUrl } = req
  const session = req.auth

  const isLoggedIn = !!session
  const isTeacher = session?.user?.role === "TEACHER"

  const isLoginPage = nextUrl.pathname === "/login"
  const isTeacherRoute = nextUrl.pathname.startsWith("/teacher")
  const isStudentRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/session") ||
    nextUrl.pathname.startsWith("/progress")
  const isApiRoute = nextUrl.pathname.startsWith("/api")

  if (isApiRoute) return NextResponse.next()

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL(isTeacher ? "/teacher/dashboard" : "/dashboard", nextUrl))
  }

  if (isTeacherRoute && !isTeacher) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  const viewMode = req.cookies.get("jabc-view-mode")?.value
  const isStudentViewMode = viewMode === "student"

  if (isStudentRoute && isTeacher && !isStudentViewMode) {
    return NextResponse.redirect(new URL("/teacher/dashboard", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
