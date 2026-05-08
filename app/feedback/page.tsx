import { PrototypeScreenPage } from '@/components/layout/PrototypeScreenPage'
import type { FeedbackSource } from '@/types/feedback'

function getTurnNumber(value: string | string[] | undefined) {
  const turn = Number(Array.isArray(value) ? value[0] : value)

  if (!Number.isInteger(turn) || turn < 1) {
    return 1
  }

  return turn
}

function getFeedbackSource(
  value: string | string[] | undefined
): FeedbackSource {
  const source = Array.isArray(value) ? value[0] : value

  return source === 'report' ? 'report' : 'live'
}

function getAnswerId(value: string | string[] | undefined) {
  const id = Number(Array.isArray(value) ? value[0] : value)

  if (!Number.isInteger(id) || id < 1) {
    return undefined
  }

  return id
}

export default async function FeedbackPage(props: PageProps<'/feedback'>) {
  const searchParams = await props.searchParams

  return (
    <PrototypeScreenPage
      current="feedback"
      turnNumber={getTurnNumber(searchParams.turn)}
      answerId={getAnswerId(searchParams.answerId)}
      feedbackSource={getFeedbackSource(searchParams.from)}
    />
  )
}
