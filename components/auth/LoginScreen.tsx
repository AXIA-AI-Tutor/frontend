import {
  ArrowRight,
  CheckCircle2,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react'

import { CoachAvatar } from '@/components/ui/CoachAvatar'

const CHECK_ITEMS = ['세션 기록 이어보기', '맞춤 피드백 저장', '연습 자료 관리']

export function LoginScreen() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:px-6 lg:px-8">
        <header className="flex h-12 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
              <MessageSquareText size={19} />
            </span>
            <span className="text-lg font-black tracking-tight">AI 코치</span>
          </div>
          <span className="hidden rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 shadow-sm sm:inline-flex">
            Google 세션 로그인
          </span>
        </header>

        <section className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(460px,1fr)] lg:py-12">
          <div className="mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <p className="text-sm font-bold text-blue-600">로그인</p>
              <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-4xl">
                연습 흐름을 그대로 이어가세요
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                면접과 발표 준비 기록을 안전하게 불러오고 다음 연습을 바로
                시작합니다.
              </p>
            </div>

            <button
              type="button"
              className="flex h-[52px] w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 text-left text-sm font-black text-slate-900 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-[17px] font-black text-blue-600">
                  G
                </span>
                <span className="truncate">Google로 계속하기</span>
              </span>
              <ArrowRight className="shrink-0 text-slate-400" size={18} />
            </button>

            <div className="mt-5 grid gap-2">
              {CHECK_ITEMS.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm font-bold text-slate-600"
                >
                  <CheckCircle2 className="text-emerald-500" size={17} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">
              <ShieldCheck
                className="mt-0.5 shrink-0 text-blue-600"
                size={17}
              />
              <p>
                로그인 정보는 백엔드 세션으로 관리되며, 브라우저에 별도 인증
                토큰을 저장하지 않습니다.
              </p>
            </div>
          </div>

          <aside className="hidden min-h-[560px] overflow-hidden rounded-lg border border-slate-200 bg-[#101827] text-white shadow-sm lg:block">
            <div className="grid h-full grid-rows-[auto_1fr_auto]">
              <div className="border-b border-white/10 px-6 py-5">
                <p className="text-sm font-bold text-blue-200">
                  Practice workspace
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  오늘의 답변을 더 선명하게
                </h2>
              </div>

              <div className="relative px-8 py-8">
                <div className="absolute left-0 top-12 h-px w-full bg-white/10" />
                <div className="absolute bottom-24 left-0 h-px w-full bg-white/10" />
                <div className="absolute left-14 top-0 h-full w-px bg-white/10" />
                <div className="absolute right-20 top-0 h-full w-px bg-white/10" />

                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-8">
                    <div className="max-w-xs">
                      <span className="inline-flex rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-black text-white">
                        면접 모드
                      </span>
                      <p className="mt-4 text-4xl font-black leading-tight tracking-tight">
                        질문, 답변, 피드백을 한 화면에서
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/95 px-4 pb-0 pt-5 shadow-sm">
                      <CoachAvatar scale={1.05} />
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div className="h-2 w-32 rounded-full bg-emerald-400" />
                    <div className="h-2 w-56 rounded-full bg-white/70" />
                    <div className="h-2 w-44 rounded-full bg-blue-300" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 border-t border-white/10">
                {[
                  ['82점', '최근 점수'],
                  ['3개', '추천 과제'],
                  ['12분', '평균 연습'],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="border-r border-white/10 p-5 last:border-r-0"
                  >
                    <strong className="block text-2xl font-black">
                      {value}
                    </strong>
                    <span className="mt-1 block text-xs font-bold text-slate-300">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
