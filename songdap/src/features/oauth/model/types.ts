// 데이터 타입을 정의한 파일
// 이건 백이랑 얘기해야하는 부분

export interface UserInfo {
    // UI 표시(닉네임/프로필)만 필요한 화면이 많아
    // localStorage hydrate 시에는 id가 없을 수 있음
    id?: number;
    nickname: string;
    email?: string;
    profileImage?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: UserInfo;
}