import { notFound } from 'next/navigation'

import { PrototypeScreenPage } from '@/components/layout/PrototypeScreenPage'
import { SessionAnswerListScreen } from '@/components/report/SessionAnswerListScreen'
import { MOCK_ANSWERS_BY_SESSION } from '@/lib/mock/answers.mock'
import { MOCK_REPORT_LIST } from '@/lib/mock/sessions.mock'
import type { SessionMode } from '@/types/session'

const MODE_LABEL: Record<SessionMode, string> = {
  INTERVIEW: '면접',
  PRESENTATION: '발표',
}

export default async function SessionReportPage(
  props: PageProps<'/report/[sessionId]'>
) {
  const { sessionId } = await props.params
  const id = Number(sessionId)

  if (!Number.isInteger(id) || id < 1) {
    notFound()
  }

  const item = MOCK_REPORT_LIST.find((i) => i.session.id === id)

  if (!item) {
    notFound()
  }

  const answers = MOCK_ANSWERS_BY_SESSION[id] ?? []
  const title = `${MODE_LABEL[item.session.mode]} · ${item.session.target}`

  return (
    <PrototypeScreenPage current="reportList" title={title}>
      <SessionAnswerListScreen item={item} answers={answers} />
    </PrototypeScreenPage>
  )
}
