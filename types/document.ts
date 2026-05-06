// 백엔드: domain/document/entity/DocumentType.java
// gcs-signed-url-upload-guide.md 기준으로 작성. 백엔드 미구현 항목은 주석 처리.
export type DocumentType =
  | 'RESUME'
  | 'PORTFOLIO'
  | 'COVER_LETTER' // 하드코딩 필요 판단: 백엔드 미구현 (자소서)
  | 'JOB_DESCRIPTION' // 가이드 표기: 'JD'
  | 'PRESENTATION' // 하드코딩 필요 판단: 백엔드 미구현
  | 'ETC'

// 백엔드: domain/document/entity/DocumentStatus.java
export type DocumentStatus =
  | 'CREATED'
  | 'READY_FOR_AI'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'

// 백엔드: domain/document/entity/UploadStatus.java
export type UploadStatus = 'PENDING' | 'UPLOADED' | 'FAILED'

// 백엔드: domain/document/dto/DocumentUploadUrlRequest.java
export interface DocumentUploadUrlRequest {
  sessionId: number
  docType: DocumentType
  originalFileName: string
  fileType: string
  fileSize: number
}

// 백엔드: domain/document/dto/DocumentUploadUrlResponse.java
export interface DocumentUploadUrlResponse {
  documentId: number
  uploadUrl: string
  method: string
  storageProvider: string
  storageBucket: string
  storagePath: string
  uploadUrlExpiresAt: string
  requiredHeaders: Record<string, string>
}
