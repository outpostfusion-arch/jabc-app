"use client"

import { useEffect, useRef, useState, useCallback } from "react"

const EMOJIS = ["⭐", "🚀", "🌟", "💎", "🔥", "🌈", "🦋", "🌺", "⚡", "🎯", "🏆", "💡", "🎨", "🌙", "🦄", "🍀"]
const COLORS = ["#6366F1", "#F43F5E", "#FBBF24", "#22C55E", "#06B6D4", "#8B5CF6", "#EC4899", "#F97316", "#14B8A6", "#64748B", "#1E293B", "#FFFFFF"]

interface CanvasJson {
  version?: string
  objects?: unknown[]
  background?: string
}

interface Props {
  initialFabricJson?: CanvasJson | null
  readOnly?: boolean
  onExport?: (pngDataUrl: string) => void
}

export default function LogoBuilder({ initialFabricJson, readOnly = false, onExport }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<unknown>(null)
  const historyRef = useRef<string[]>([])
  const historyIndexRef = useRef(-1)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [bgColor, setBgColor] = useState("#FFFFFF")
  const [fillColor, setFillColor] = useState("#6366F1")
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)

  const saveSnapshot = useCallback(() => {
    const canvas = fabricRef.current as { toJSON: () => CanvasJson } | null
    if (!canvas) return
    const json = JSON.stringify(canvas.toJSON())
    const history = historyRef.current
    historyIndexRef.current++
    history.splice(historyIndexRef.current)
    history.push(json)
    if (history.length > 20) history.shift()
  }, [])

  const autoSave = useCallback(() => {
    const canvas = fabricRef.current as { toJSON: () => CanvasJson; toDataURL: (opts: { format: string }) => string } | null
    if (!canvas) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaving(true)
      const fabricJson = canvas.toJSON()
      const pngDataUrl = canvas.toDataURL({ format: "png" })
      await fetch("/api/logo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fabricJson, pngDataUrl }),
      })
      setSaving(false)
    }, 800)
  }, [])

  useEffect(() => {
    let isMounted = true
    import("fabric").then(({ Canvas, FabricText, Circle, Rect, FabricImage }) => {
      if (!isMounted || !canvasRef.current) return

      const canvas = new Canvas(canvasRef.current, {
        width: 400,
        height: 400,
        backgroundColor: bgColor,
        selection: !readOnly,
      })
      fabricRef.current = canvas

      if (initialFabricJson?.objects?.length) {
        canvas.loadFromJSON(initialFabricJson, () => {
          canvas.renderAll()
          setLoaded(true)
        })
      } else {
        setLoaded(true)
      }

      if (!readOnly) {
        canvas.on("object:modified", () => { saveSnapshot(); autoSave() })
        canvas.on("object:added", () => { saveSnapshot(); autoSave() })
      }

      void FabricText
      void Circle
      void Rect
      void FabricImage
    })

    return () => {
      isMounted = false
      const canvas = fabricRef.current as { dispose?: () => void } | null
      canvas?.dispose?.()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function addText() {
    import("fabric").then(({ FabricText }) => {
      const canvas = fabricRef.current as { add: (obj: unknown) => void; setActiveObject: (obj: unknown) => void; renderAll: () => void } | null
      if (!canvas) return
      const text = new FabricText("Your Brand", { left: 100, top: 180, fontSize: 36, fontFamily: "Nunito", fill: fillColor, fontWeight: "bold" })
      canvas.add(text)
      canvas.setActiveObject(text)
      canvas.renderAll()
    })
  }

  function addCircle() {
    import("fabric").then(({ Circle }) => {
      const canvas = fabricRef.current as { add: (obj: unknown) => void; renderAll: () => void } | null
      if (!canvas) return
      const circle = new Circle({ left: 150, top: 150, radius: 60, fill: fillColor })
      canvas.add(circle)
      canvas.renderAll()
    })
  }

  function addRect() {
    import("fabric").then(({ Rect }) => {
      const canvas = fabricRef.current as { add: (obj: unknown) => void; renderAll: () => void } | null
      if (!canvas) return
      const rect = new Rect({ left: 100, top: 150, width: 200, height: 100, fill: fillColor, rx: 12, ry: 12 })
      canvas.add(rect)
      canvas.renderAll()
    })
  }

  function addEmoji(emoji: string) {
    import("fabric").then(({ FabricText }) => {
      const canvas = fabricRef.current as { add: (obj: unknown) => void; renderAll: () => void } | null
      if (!canvas) return
      const text = new FabricText(emoji, { left: 160, top: 160, fontSize: 64, fontFamily: "Arial" })
      canvas.add(text)
      canvas.renderAll()
    })
  }

  function deleteSelected() {
    const canvas = fabricRef.current as { getActiveObject: () => unknown; remove: (obj: unknown) => void; renderAll: () => void } | null
    if (!canvas) return
    const obj = canvas.getActiveObject()
    if (obj) { canvas.remove(obj); canvas.renderAll() }
  }

  function setBackground(color: string) {
    setBgColor(color)
    const canvas = fabricRef.current as { set: (key: string, value: string) => void; renderAll: () => void } | null
    if (!canvas) return
    canvas.set("backgroundColor", color)
    canvas.renderAll()
    autoSave()
  }

  function undo() {
    if (historyIndexRef.current <= 0) return
    historyIndexRef.current--
    const json = historyRef.current[historyIndexRef.current]
    const canvas = fabricRef.current as { loadFromJSON: (json: CanvasJson, cb: () => void) => void; renderAll: () => void } | null
    if (!canvas || !json) return
    canvas.loadFromJSON(JSON.parse(json), () => canvas.renderAll())
  }

  function redo() {
    if (historyIndexRef.current >= historyRef.current.length - 1) return
    historyIndexRef.current++
    const json = historyRef.current[historyIndexRef.current]
    const canvas = fabricRef.current as { loadFromJSON: (json: CanvasJson, cb: () => void) => void; renderAll: () => void } | null
    if (!canvas || !json) return
    canvas.loadFromJSON(JSON.parse(json), () => canvas.renderAll())
  }

  function exportPng() {
    const canvas = fabricRef.current as { toDataURL: (opts: { format: string }) => string } | null
    if (!canvas) return
    const url = canvas.toDataURL({ format: "png" })
    onExport?.(url)
    const a = document.createElement("a")
    a.href = url
    a.download = "logo.png"
    a.click()
  }

  if (!loaded) return <div className="w-[400px] h-[400px] rounded-2xl animate-pulse" style={{ background: "#F1F5F9" }} />

  return (
    <div>
      {!readOnly && (
        <div className="mb-3 space-y-2">
          {/* Tools */}
          <div className="flex flex-wrap gap-2">
            <button onClick={addText} className="px-3 py-1.5 rounded-xl text-sm font-bold text-white" style={{ background: "#6366F1" }}>+ Text</button>
            <button onClick={addCircle} className="px-3 py-1.5 rounded-xl text-sm font-bold text-white" style={{ background: "#06B6D4" }}>● Circle</button>
            <button onClick={addRect} className="px-3 py-1.5 rounded-xl text-sm font-bold text-white" style={{ background: "#8B5CF6" }}>▬ Box</button>
            <button onClick={deleteSelected} className="px-3 py-1.5 rounded-xl text-sm font-bold text-white" style={{ background: "#F43F5E" }}>✕ Delete</button>
            <button onClick={undo} className="px-3 py-1.5 rounded-xl text-sm font-bold" style={{ background: "#F1F5F9", color: "#475569" }}>↩ Undo</button>
            <button onClick={redo} className="px-3 py-1.5 rounded-xl text-sm font-bold" style={{ background: "#F1F5F9", color: "#475569" }}>↪ Redo</button>
            <button onClick={exportPng} className="px-3 py-1.5 rounded-xl text-sm font-bold text-white" style={{ background: "#22C55E" }}>⬇ Export PNG</button>
          </div>

          {/* Emojis */}
          <div className="flex flex-wrap gap-1">
            {EMOJIS.map((e) => (
              <button key={e} onClick={() => addEmoji(e)} className="w-8 h-8 text-lg rounded-lg hover:bg-indigo-50 flex items-center justify-center">{e}</button>
            ))}
          </div>

          {/* Colors */}
          <div>
            <div className="text-xs font-bold mb-1" style={{ color: "#94A3B8" }}>Fill Color</div>
            <div className="flex flex-wrap gap-1">
              {COLORS.map((c) => (
                <button key={c} onClick={() => setFillColor(c)} className="w-7 h-7 rounded-full border-2 transition-all" style={{ background: c, borderColor: fillColor === c ? "#6366F1" : "transparent" }} />
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold mb-1" style={{ color: "#94A3B8" }}>Background</div>
            <div className="flex flex-wrap gap-1">
              {COLORS.map((c) => (
                <button key={c} onClick={() => setBackground(c)} className="w-7 h-7 rounded-full border-2 transition-all" style={{ background: c, borderColor: bgColor === c ? "#6366F1" : "transparent" }} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: "#E2E8F0", width: 400, height: 400 }}>
        <canvas ref={canvasRef} />
        {saving && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(0,0,0,0.5)", color: "white" }}>Saving...</div>
        )}
      </div>
    </div>
  )
}
