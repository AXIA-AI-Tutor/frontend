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
        'mb-2 rounded-[14px] border border-slate-200 p-[10px_11px]',
        example ? 'bg-blue-50' : 'bg-slate-50'
      )}
    >
      <h4 className="mb-1.5 text-[13px] font-black text-indigo-700">{title}</h4>
      <div className="text-[11.6px] leading-snug text-slate-700">
        {children}
      </div>
    </div>
  )
}
