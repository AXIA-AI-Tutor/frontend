'use client'

import { useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DocumentType } from '@/types/document'

interface DocumentItem {
  docType: DocumentType
  icon: string
  label: string
}

const DOCUMENT_ITEMS: DocumentItem[] = [
  { docType: 'RESUME', icon: '📄', label: '이력서' },
  { docType: 'ETC', icon: '✎', label: '자기소개서' },
  { docType: 'PORTFOLIO', icon: '💼', label: '포트폴리오' },
  { docType: 'JOB_DESCRIPTION', icon: '📋', label: '직무기술서' },
]

interface UploadGridProps {
  onUpload?: (docType: DocumentType, label: string, file: File) => Promise<void>
  onDelete?: (docType: DocumentType, label: string) => void
  onUploadError?: (docType: DocumentType, label: string, file: File) => void
}

export function UploadGrid({
  onUpload,
  onDelete,
  onUploadError,
}: UploadGridProps) {
  const [files, setFiles] = useState<Partial<Record<DocumentType, File>>>({})
  const [uploadingDocType, setUploadingDocType] = useState<DocumentType | null>(
    null
  )
  const [pendingItem, setPendingItem] = useState<DocumentItem | null>(null)
  const [manageItem, setManageItem] = useState<DocumentItem | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const openFilePicker = (item: DocumentItem) => {
    if (uploadingDocType) return

    setPendingItem(item)
    inputRef.current?.click()
  }

  const handleClick = (item: DocumentItem) => {
    if (uploadingDocType) return

    if (files[item.docType]) {
      setManageItem(item)
      return
    }

    openFilePicker(item)
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    const item = pendingItem

    event.target.value = ''
    setPendingItem(null)

    if (file && item) {
      setUploadingDocType(item.docType)

      try {
        await onUpload?.(item.docType, item.label, file)
        setFiles((prev) => ({ ...prev, [item.docType]: file }))
        setManageItem(null)
      } catch {
        onUploadError?.(item.docType, item.label, file)
      } finally {
        setUploadingDocType(null)
      }
    }
  }

  const handleChangeFile = () => {
    if (!manageItem) return
    openFilePicker(manageItem)
  }

  const handleDeleteFile = () => {
    if (!manageItem) return

    setFiles((prev) => {
      const next = { ...prev }
      delete next[manageItem.docType]
      return next
    })
    onDelete?.(manageItem.docType, manageItem.label)
    setManageItem(null)
  }

  const selectedFile = manageItem ? files[manageItem.docType] : undefined

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,.doc,.docx,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={handleFileChange}
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="grid grid-cols-4 gap-[7px]">
        {DOCUMENT_ITEMS.map((item) => {
          const { docType, icon, label } = item
          const done = Boolean(files[docType])
          const uploading = uploadingDocType === docType
          return (
            <button
              key={docType}
              type="button"
              onClick={() => handleClick(item)}
              disabled={Boolean(uploadingDocType)}
              title={files[docType]?.name}
              className={cn(
                'relative min-h-[88px] rounded-[14px] border bg-white px-1 py-[11px] text-center transition-all duration-200',
                done
                  ? '-translate-y-0.5 border-indigo-300 shadow-md'
                  : 'border-slate-200',
                uploadingDocType && !uploading
                  ? 'cursor-wait opacity-60'
                  : undefined
              )}
            >
              {/* 완료 체크 */}
              {done && (
                <span className="absolute right-[7px] top-[7px] grid h-[18px] w-[18px] place-items-center rounded-full bg-emerald-500 text-[12px] font-black text-white">
                  ✓
                </span>
              )}
              <div className="mx-auto mb-2 grid h-[31px] w-[31px] place-items-center rounded-[10px] bg-gradient-to-br from-blue-100 to-blue-50 text-[17px] text-indigo-600">
                {uploading ? (
                  <Loader2 className="animate-spin" size={17} />
                ) : (
                  icon
                )}
              </div>
              <b className="block text-[13px]">{label}</b>
              <span
                className={cn(
                  'text-[11px]',
                  done ? 'font-black text-emerald-500' : 'text-slate-400'
                )}
              >
                {uploading ? '업로드 중' : done ? '완료' : '업로드 ⇧'}
              </span>
            </button>
          )
        })}
      </div>

      {manageItem && (
        <div
          className="fixed inset-0 z-[120] grid place-items-center bg-slate-950/45 px-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) setManageItem(null)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-manage-title"
            className="relative w-full max-w-[360px] rounded-lg bg-white p-5 text-center shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setManageItem(null)}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-lg font-black text-slate-500 hover:bg-slate-100"
              aria-label="파일 관리 모달 닫기"
            >
              ×
            </button>
            <h3
              id="upload-manage-title"
              className="pr-8 text-base font-black text-slate-950"
            >
              {manageItem.label} 자료 관리
            </h3>
            <p className="mx-auto mt-3 max-w-[260px] text-sm leading-6 text-slate-600">
              첨부된 파일을 수정하거나 삭제할 수 있습니다.
            </p>
            {selectedFile && (
              <p className="mt-2 truncate rounded-lg bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500">
                {selectedFile.name}
              </p>
            )}
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleChangeFile}
                className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                변경
              </button>
              <button
                type="button"
                onClick={handleDeleteFile}
                className="rounded-lg bg-red-500 px-4 py-3 text-sm font-black text-white shadow-sm transition-colors hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
