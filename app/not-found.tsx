import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f9fc] px-5 text-slate-950">
      <section className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 text-center shadow-sm">
        <p className="text-4xl font-black text-blue-600">404</p>
        <h1 className="mt-2 text-lg font-black">페이지를 찾을 수 없습니다</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-black text-white transition-colors hover:bg-blue-700"
        >
          홈으로
        </Link>
      </section>
    </main>
  )
}
