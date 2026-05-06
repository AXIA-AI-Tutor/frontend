'use client'

import { BottomSheet } from '@/components/ui/BottomSheet'
import { useState } from 'react'

export function TranscriptCard() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mb-2.5 w-full rounded-[18px] border border-slate-200 bg-white p-[13px] text-left shadow-sm"
      >
        <h3 className="mb-2 flex items-center justify-between text-base font-black">
          실시간 자막
          <span className="text-xs text-blue-400">전체 보기 ›</span>
        </h3>
        <p className="text-[12.5px] leading-relaxed text-slate-500">
          안녕하세요, 저는 데이터 분석을 통해 문제를 발견하고
          <br />
          해결하는 것에 큰 보람을 느끼는 지원자입니다.
        </p>
        <p className="mt-1 text-[12.5px] font-black text-blue-700">
          ● 이전 직무에서는 매출 예측 모델을 개선하여
        </p>
        <p className="text-[12.5px] text-slate-500">예측 정확도를 15% 향상시켰고,</p>
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <h3 className="mb-3 font-black">전체 자막</h3>
        <p className="text-[13px] leading-relaxed text-slate-600">
          안녕하세요, 저는 데이터 분석을 통해 문제를 발견하고 해결하는 것에 큰 보람을 느끼는
          지원자입니다.
          <br />
          <br />
          이전 직무에서는 매출 예측 모델을 개선하여 예측 정확도를 15% 향상시켰고, 그 과정에서
          데이터 정제와 모델 검증을 담당했습니다.
        </p>
        <button
          onClick={() => setOpen(false)}
          className="mt-2.5 w-full rounded-[14px] border-0 bg-gradient-to-r from-blue-600 to-purple-700 py-3 font-black text-white"
        >
          닫기
        </button>
      </BottomSheet>
    </>
  )
}