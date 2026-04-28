interface TimerPillProps {
  time: string
  turn: number
  total: number
}

export function TimerPill({ time, turn, total }: TimerPillProps) {
  return (
    <div className="mx-auto mb-2 w-max rounded-2xl bg-gradient-to-r from-blue-400 to-purple-700 px-[17px] py-[9px] text-center font-black text-white shadow-lg">
      ◷ {time}
      <br />
      <small className="text-[10px]">
        {turn} / {total} 턴
      </small>
    </div>
  )
}