import { notFound } from 'next/navigation'

import { PrototypeScreenPage } from '@/components/layout/PrototypeScreenPage'
import { SessionAnswerListScreen } from '@/components/report/SessionAnswerListScreen'

export default async function SessionReportPage(
  props: PageProps<'/report/[sessionId]'>
) {
  const { sessionId } = await props.params
  const id = Number(sessionId)

  if (!Number.isInteger(id) || id < 1) {
    notFound()
  }

  return (
    <PrototypeScreenPage current="reportList">
      <SessionAnswerListScreen sessionId={id} />
    </PrototypeScreenPage>
  )
}
