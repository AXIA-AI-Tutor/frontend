// 백엔드: domain/document/entity/DocumentType.java
export type DocumentType = 'RESUME' | 'PORTFOLIO' | 'JOB_DESCRIPTION' | 'ETC'

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

// 백엔드: domain/document/dto/DocumentMetadataResponse.java
// 세션 문서 업로드 완료 후 확인(GET /api/sessions/:id/documents) 시 반환. uploadUrlExpiresAt 미포함.
export interface DocumentMetadataResponse {
  documentId: number
  sessionId: number
  docType: DocumentType
  originalFileName: string
  fileType: string
  fileSize: number
  storageProvider: string
  storageBucket: string
  storagePath: string
  uploadStatus: UploadStatus
  status: DocumentStatus
  summary: string | null
  createdAt: string
  uploadedAt: string | null
}

// 백엔드: domain/document/dto/DocumentResponse.java
// Presigned URL 발급(POST /api/documents/upload-url) 직후 반환. uploadUrlExpiresAt 포함, id/userId 노출.
export interface DocumentResponse {
  id: number
  userId: number
  sessionId: number
  docType: DocumentType
  originalFileName: string
  fileType: string
  fileSize: number
  storageProvider: string
  storageBucket: string
  storagePath: string
  uploadStatus: UploadStatus
  uploadUrlExpiresAt: string | null
  uploadedAt: string | null
  summary: string | null
  status: DocumentStatus
  createdAt: string
}
