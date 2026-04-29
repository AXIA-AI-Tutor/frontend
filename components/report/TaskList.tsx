'use client'

import type { Screen } from '@/types'

interface Task {
  icon: string
  title: string
  sub: string
}

interface TaskListProps {
  tasks: Task[]
  onStart: (screen: Screen) => void
}

export function TaskList({ tasks, onStart }: TaskListProps) {
  return (
    <div>
      <h3 className="mb-0 text-[15px] font-black">AI 추천 연습 과제</h3>
      {tasks.map(({ icon, title, sub }) => (
        <div
          key={title}
          className="flex items-center gap-[9px] border-t border-slate-100 py-[9px] first:border-t-0"
        >
          <span className="grid h-[30px] w-[30px] place-items-center rounded-xl bg-blue-50 text-blue-600">
            {icon}
          </span>
          <div className="flex-1">
            <b className="block text-xs">{title}</b>
            <span className="block text-[10.5px] text-slate-400">{sub}</span>
          </div>
          <button
            onClick={() => onStart('live')}
            className="rounded-full border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-black text-blue-600"
          >
            시작하기
          </button>
        </div>
      ))}
    </div>
  )
}
