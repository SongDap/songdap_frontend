/**
 * 예시/목 데이터 모음
 * 개발 및 테스트 목적으로 사용되는 샘플 데이터들
 */

// 색상 팔레트 리스트
export const PRESET_COLORS = [
  "#00c7fc",
  "#3a88fe",
  "#5e30eb",
  "#d357fe",
  "#ed719e",
  "#ff6251",
  "#ff8647",
  "#ffb43f",
  "#fecb3e",
  "#FFD93D",
  "#e4ef65",
  "#96d35f",
  "#929292",
];

// 색상 팔레트에서 랜덤 색상 선택
export function getRandomColorFromPalette(): string {
  const randomIndex = Math.floor(Math.random() * PRESET_COLORS.length);
  return PRESET_COLORS[randomIndex];
}

// 앨범 샘플 데이터 타입 (백엔드 API 명세에 맞춤)
export type SampleAlbum = {
  uuid: string;
  title: string;
  description: string;
  isPublic: boolean;
  musicCount: number; // 현재 곡 개수
  musicCountLimit: number; // 설정된 앨범 곡 개수
  color: string;
  imageUrl?: string | null;
  createdAt: string;
};

// 임시 샘플 앨범 데이터
export const SAMPLE_ALBUMS: SampleAlbum[] = [
  {
    uuid: "1",
    title: "2024 여름 플레이리스트",
    description: "시원한 여름을 위한 신나는 음악들",
    color: "#00c7fc",
    isPublic: true,
    musicCount: 10,
    musicCountLimit: 15,
    imageUrl: null,
    createdAt: "2024.01.15",
  },
  {
    uuid: "2",
    title: "드라이빙 뮤직",
    description: "길에서 차를 타고 달릴 때 듣는 감성적인 음악 모음",
    color: "#3a88fe",
    isPublic: true,
    musicCount: 18,
    musicCountLimit: 20,
    imageUrl: null,
    createdAt: "2024.02.20",
  },
  {
    uuid: "3",
    title: "나만의 음악",
    description: "혼자만 아는 특별한 플레이리스트",
    color: "#5e30eb",
    isPublic: false,
    musicCount: 8,
    musicCountLimit: 12,
    imageUrl: null,
    createdAt: "2024.03.10",
  },
  {
    uuid: "4",
    title: "감성 밤 음악",
    description: "밤에 혼자 감상하기 좋은 차분하고 아련한 음악들",
    color: "#d357fe",
    isPublic: true,
    musicCount: 15,
    musicCountLimit: 18,
    imageUrl: null,
    createdAt: "2024.04.05",
  },
  {
    uuid: "5",
    title: "운동할 때 듣는 음악",
    description: "헬스장이나 조깅할 때 에너지를 올려주는 비트 강한 음악",
    color: "#ed719e",
    isPublic: true,
    musicCount: 22,
    musicCountLimit: 25,
    imageUrl: null,
    createdAt: "2024.05.12",
  },
  {
    uuid: "6",
    title: "집중할 때",
    description: "공부나 작업할 때 집중력을 높여주는 배경 음악",
    color: "#ff6251",
    isPublic: false,
    musicCount: 5,
    musicCountLimit: 10,
    imageUrl: null,
    createdAt: "2024.06.01",
  },
];

// 노래 샘플 데이터 타입
export type SampleSong = {
  id: number;
  title: string;
  artist: string;
  imageUrl?: string | null;
  message?: string; // 메시지 (가사처럼 표시)
  nickname?: string; // 메시지를 보낸 사람의 닉네임
};

// 임시 샘플 노래 데이터
export const SAMPLE_SONGS: SampleSong[] = [
  { 
    id: 1, 
    title: "노래 제목 1", 
    artist: "아티스트 1", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "친구1",
    message: "이 노래를 들으며 당신을 생각해요.\n언제나 함께 있는 것처럼 느껴져요.\n\n오늘도 고마웠어요.\n당신의 하루가 행복하기를 바라요." 
  },
  { 
    id: 2, 
    title: "매우 긴 노래 제목을 가진 아름다운 음악의 멜로디가 흐르는 특별한 순간", 
    artist: "아티스트 2", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "친구2",
    message: "오늘도 고마웠어요.\n당신의 하루가 행복하기를 바라요.\n\n이 멜로디가 당신에게 전해지길.\n특별한 하루가 되길 바라요." 
  },
  { 
    id: 3, 
    title: "이것은 정말로 매우 긴 노래 제목입니다 화면을 넘어서는 긴 제목 테스트용", 
    artist: "아티스트 3", 
    imageUrl: "https://placehold.co/56x56",
    nickname: "친구3"
  },
  { 
    id: 4, 
    title: "노래 제목 4", 
    artist: "아티스트 4", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "친구4",
    message: "함께 듣고 싶었던 노래예요.\n언제나 응원할게요.\n\n이 순간이 오래 기억되길.\n당신의 모든 순간이 아름답기를." 
  },
  { 
    id: 5, 
    title: "노래 제목 5", 
    artist: "아티스트 5", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "친구5",
    message: "이 순간이 오래 기억되길.\n당신의 모든 순간이 아름답기를.\n\n언제나 당신 곁에 있을게요.\n사랑해요." 
  },
];

// OAuth Mock 데이터 (oauthApi.ts에서 사용)
// AuthResponse 타입과 호환되도록 작성됨
export const MOCK_AUTH_DATA = {
  accessToken: "test_access_token_12345",
  user: {
    id: 1,
    nickname: "테스트용 송답",
    email: "songdap@test.com",
    profileImage: "https://via.placeholder.com/150",
  },
};
