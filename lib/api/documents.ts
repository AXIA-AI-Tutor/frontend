import axios from 'axios'

import { apiClient, type ApiResponse } from './client'
import type {
  DocumentResponse,
  DocumentType,
  DocumentUploadUrlRequest,
  DocumentUploadUrlResponse,
} from '@/types/document'

export const ALLOWED_DOCUMENT_FILE_TYPES = [
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export const MAX_DOCUMENT_FILE_SIZE_BYTES = 10 * 1024 * 1024

interface UploadSessionDocumentPayload {
  docType: DocumentType
  file: File
}

function getFileType(file: File) {
  return file.type || 'application/octet-stream'
}

export async function issueDocumentUploadUrl(
  payload: DocumentUploadUrlRequest
): Promise<DocumentUploadUrlResponse> {
  const response = await apiClient.post<ApiResponse<DocumentUploadUrlResponse>>(
    '/api/documents/upload-url',
    payload
  )

  return response.data.data
}

export async function completeDocumentUpload(
  documentId: number
): Promise<DocumentResponse> {
  const response = await apiClient.post<ApiResponse<DocumentResponse>>(
    `/api/documents/${documentId}/complete`
  )

  return response.data.data
}

export async function uploadFileToSignedUrl(
  upload: DocumentUploadUrlResponse,
  file: File
) {
  await axios.put(upload.uploadUrl, file, {
    headers: {
      ...upload.requiredHeaders,
      'Content-Type': getFileType(file),
    },
  })
}

export async function uploadSessionDocument(
  sessionId: number,
  payload: UploadSessionDocumentPayload
): Promise<DocumentResponse> {
  const fileType = getFileType(payload.file)

  if (!ALLOWED_DOCUMENT_FILE_TYPES.includes(fileType)) {
    throw new Error('PDF, TXT, DOC, DOCX 파일만 업로드할 수 있습니다.')
  }

  if (payload.file.size > MAX_DOCUMENT_FILE_SIZE_BYTES) {
    throw new Error('문서 파일 크기는 10MB 이하여야 합니다.')
  }

  const upload = await issueDocumentUploadUrl({
    sessionId,
    docType: payload.docType,
    originalFileName: payload.file.name,
    fileType,
    fileSize: payload.file.size,
  })

  await uploadFileToSignedUrl(upload, payload.file)

  return completeDocumentUpload(upload.documentId)
}
