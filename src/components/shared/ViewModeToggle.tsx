"use client"

interface Props {
  currentView: "teacher" | "student"
}

export default function ViewModeToggle({ currentView }: Props) {
  function switchTo(view: "teacher" | "student") {
    document.cookie = `jabc-view-mode=${view}; path=/; max-age=86400`
    window.location.href = view === "teacher" ? "/teacher/dashboard" : "/dashboard"
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center p-1 rounded-2xl shadow-lg border" style={{ background: "white", borderColor: "#E2E8F0" }}>
        <button
          onClick={() => currentView !== "teacher" && switchTo("teacher")}
          className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
          style={{
            background: currentView === "teacher" ? "#6366F1" : "transparent",
            color: currentView === "teacher" ? "white" : "#94A3B8",
            cursor: currentView === "teacher" ? "default" : "pointer",
          }}
        >
          Teacher
        </button>
        <button
          onClick={() => currentView !== "student" && switchTo("student")}
          className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
          style={{
            background: currentView === "student" ? "#6366F1" : "transparent",
            color: currentView === "student" ? "white" : "#94A3B8",
            cursor: currentView === "student" ? "default" : "pointer",
          }}
        >
          Student
        </button>
      </div>
    </div>
  )
}
