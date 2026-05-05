import { PrototypeScreenPage } from '@/components/layout/PrototypeScreenPage'

function getTurnNumber(value: string | string[] | undefined) {
  const turn = Number(Array.isArray(value) ? value[0] : value)

  if (!Number.isInteger(turn) || turn < 1) {
    return 1
  }

  return turn
}

export default async function FeedbackPage(props: PageProps<'/feedback'>) {
  const searchParams = await props.searchParams

  return (
    <PrototypeScreenPage
      current="feedback"
      turnNumber={getTurnNumber(searchParams.turn)}
    />
  )
}
