// 백엔드: domain/user/dto/UserMeResponse.java
export interface UserMeResponse {
  id: number
  email: string
  nickname: string
  profileImageUrl: string | null
  role: string
}
