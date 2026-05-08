'use client'

import { useEffect } from 'react'
import { RotateCcw } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f9fc] px-5 text-slate-950">
      <section className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 text-center shadow-sm">
        <h1 className="text-lg font-black">오류가 발생했습니다</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition-colors hover:bg-blue-700"
        >
          <RotateCcw size={16} />
          다시 시도
        </button>
      </section>
    </main>
  )
}
