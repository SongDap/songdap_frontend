// 모킹만 함 -> 실제 백엔드 API통신 안됨 되면 할 예정
import { AuthResponse } from '../model/types';

// 백엔드 통신 함수 (가짜 버전)
export async function loginWithKakao(code: string) {
  console.log('[API] 카카오 인가 코드를 받았습니다:', code);

  // 1. 실제 서버처럼 1초 동안 기다리기 (로딩 흉내)
  await new Promise(function(resolve) {
    setTimeout(resolve, 1000);
  });

  // 2. 가짜 데이터 반환 (백엔드가 보낼 데이터 모양을 흉내 냄)
  // 이 데이터가 나중에 'useOauthStore'의 login 함수로 전달됩니다.
  const mockData: AuthResponse = {
    accessToken: "test_access_token_12345", // 가짜 토큰
    user: {
      id: 1,
      nickname: "테스트용 송답",  // 화면에 뜰 이름
      email: "songdap@test.com",
      profileImage: "https://via.placeholder.com/150"
    }
  };

  return mockData;
}