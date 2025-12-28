// 데이터 타입을 정의한 파일
// 이건 백이랑 얘기해야하는 부분

export interface UserInfo {
    id: number;
    nickname: string;
    email?: string;
    profileImage?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: UserInfo;
}