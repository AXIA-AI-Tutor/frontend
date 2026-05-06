import { notFound } from 'next/navigation'

import { AuthGate } from '@/components/auth/AuthGate'
import { SessionAnswerListScreen } from '@/components/report/SessionAnswerListScreen'
import { MOCK_ANSWERS_BY_SESSION } from '@/lib/mock/answers.mock'
import { MOCK_REPORT_LIST } from '@/lib/mock/sessions.mock'

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

  return (
    <AuthGate>
      <div className="min-h-screen bg-[#f8faff]">
        <div className="mx-auto max-w-[430px]">
          <section className="relative min-h-[812px]">
            <SessionAnswerListScreen item={item} answers={answers} />
          </section>
        </div>
      </div>
    </AuthGate>
  )
}
