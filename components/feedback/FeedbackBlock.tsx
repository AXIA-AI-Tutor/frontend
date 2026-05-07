import { cn } from '@/lib/utils'

interface FeedbackBlockProps {
  title: string
  children: React.ReactNode
  example?: boolean
}

export function FeedbackBlock({
  title,
  children,
  example = false,
}: FeedbackBlockProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-slate-200 p-3.5',
        example ? 'bg-blue-50' : 'bg-slate-50'
      )}
    >
      <h4 className="mb-1.5 text-[13px] font-black text-indigo-700">{title}</h4>
      <div className="text-sm leading-6 text-slate-700">{children}</div>
    </div>
  )
}
