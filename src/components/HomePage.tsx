import { useState, useRef } from 'react'
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react'

const EXAMPLES = [
  'Machine Learning',
  'Climate Change',
  'Building a Startup',
  'Ancient Rome',
  'Quantum Computing',
  'Human Psychology',
]

interface Props {
  onSubmit: (topic: string) => void
  loading: boolean
  error?: string
}

export function HomePage({ onSubmit, loading, error }: Props) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (topic: string) => {
    const t = topic.trim()
    if (!t || loading) return
    setValue(t)
    onSubmit(t)
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#0d0d1a] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-2xl px-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
            <Sparkles size={22} className="text-violet-400" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight">Brainstorm Nodes</h1>
            <p className="text-slate-500 text-sm mt-1">Type any topic — AI maps it as a node graph</p>
          </div>
        </div>

        {/* Input */}
        <div className="w-full">
          <div
            className={`
              flex items-center gap-3 w-full rounded-xl border bg-[#1a1a2e] px-4 py-3.5
              transition-all duration-200
              ${loading ? 'border-violet-500/30' : 'border-[#2d2d4e] hover:border-[#3d3d6e] focus-within:border-violet-500/60'}
            `}
          >
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit(value)}
              placeholder="Enter a topic to brainstorm..."
              disabled={loading}
              className="flex-1 bg-transparent text-white placeholder-slate-600 outline-none text-base"
              autoFocus
            />
            <button
              onClick={() => handleSubmit(value)}
              disabled={!value.trim() || loading}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${value.trim() && !loading
                  ? 'bg-violet-600 hover:bg-violet-500 text-white'
                  : 'bg-[#252540] text-slate-600 cursor-not-allowed'}
              `}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  Generate
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-xs mt-2 px-1">{error}</p>
          )}
        </div>

        {/* Examples */}
        {!loading && (
          <div className="flex flex-col items-center gap-3 w-full">
            <p className="text-slate-600 text-xs">Try an example</p>
            <div className="flex flex-wrap justify-center gap-2">
              {EXAMPLES.map(ex => (
                <button
                  key={ex}
                  onClick={() => handleSubmit(ex)}
                  className="px-3 py-1.5 rounded-lg bg-[#1a1a2e] border border-[#2d2d4e] text-slate-400 text-xs
                    hover:border-violet-500/40 hover:text-violet-300 transition-all duration-200"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1.5">
              {[0, 1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-violet-500"
                  style={{ animation: `bounce 1s ease-in-out ${i * 0.1}s infinite` }}
                />
              ))}
            </div>
            <p className="text-slate-500 text-xs">Building your mind map...</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
