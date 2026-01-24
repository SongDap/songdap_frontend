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
  pageNumber?: number; // 편지가 붙어있는 페이지 번호 (1부터 시작)
  positionX?: number; // 편지 왼쪽 상단 X 위치 (컨테이너 너비 기준 백분율, 0-100)
  positionY?: number; // 편지 왼쪽 상단 Y 위치 (컨테이너 너비 기준 백분율, 0-100)
  height?: number; // 편지 세로 길이 (컨테이너 너비 기준 백분율)
};

// 임시 샘플 노래 데이터
// pageNumber: 편지가 붙어있는 페이지 번호 (1부터 시작)
// positionX, positionY: 편지 컴포넌트 왼쪽 상단 꼭짓점 기준 (컨테이너 너비 기준 백분율)
// height: 편지 세로 길이 (컨테이너 너비 기준 백분율)
// 주의: positionY + height + 테이프 높이(약 1.5%)는 보드 높이(56.25%, 16:9 비율)를 넘을 수 없음
// 즉, positionY + height <= 54.75% 정도로 제한해야 함
export const SAMPLE_SONGS: SampleSong[] = [
  { 
    id: 1, 
    title: "노래 제목 1", 
    artist: "아티스트 1", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "친구1",
    message: "이 노래를 들으며 당신을 생각해요.\n언제나 함께 있는 것처럼 느껴져요.\n\n오늘도 고마웠어요.\n당신의 하루가 행복하기를 바라요.",
    pageNumber: 1,
    positionX: 5, // 편지 왼쪽 상단 X (컨테이너 너비 기준 백분율)
    positionY: 2, // 편지 왼쪽 상단 Y (컨테이너 너비 기준 백분율)
    height: 48 // 편지 세로 길이 (컨테이너 너비 기준 백분율) - positionY(2) + height(48) + 테이프(1.5) = 51.5 < 56.25
  },
  { 
    id: 2, 
    title: "매우 긴 노래 제목을 가진 아름다운 음악의 멜로디가 흐르는 특별한 순간", 
    artist: "아티스트 2", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "친구2",
    message: "오늘도 고마웠어요.\n당신의 하루가 행복하기를 바라요.\n\n이 멜로디가 당신에게 전해지길.\n특별한 하루가 되길 바라요.",
    pageNumber: 1,
    positionX: 60, // 편지 왼쪽 상단 X (컨테이너 너비 기준 백분율)
    positionY: 1, // 편지 왼쪽 상단 Y (컨테이너 너비 기준 백분율)
    height: 46 // 편지 세로 길이 (컨테이너 너비 기준 백분율) - positionY(1) + height(46) + 테이프(1.5) = 48.5 < 56.25
  },
  { 
    id: 3, 
    title: "이것은 정말로 매우 긴 노래 제목입니다 화면을 넘어서는 긴 제목 테스트용", 
    artist: "아티스트 3", 
    imageUrl: "https://placehold.co/56x56",
    nickname: "친구3",
    pageNumber: 1,
    positionX: 10, // 편지 왼쪽 상단 X (컨테이너 너비 기준 백분율)
    positionY: 28, // 편지 왼쪽 상단 Y (컨테이너 너비 기준 백분율)
    height: 24 // 편지 세로 길이 (컨테이너 너비 기준 백분율) - positionY(28) + height(24) + 테이프(1.5) = 53.5 < 56.25
  },
  { 
    id: 4, 
    title: "노래 제목 4", 
    artist: "아티스트 4", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "친구4",
    message: "함께 듣고 싶었던 노래예요.\n언제나 응원할게요.\n\n이 순간이 오래 기억되길.\n당신의 모든 순간이 아름답기를.",
    pageNumber: 1,
    positionX: 50, // 편지 왼쪽 상단 X (컨테이너 너비 기준 백분율)
    positionY: 26, // 편지 왼쪽 상단 Y (컨테이너 너비 기준 백분율)
    height: 26 // 편지 세로 길이 (컨테이너 너비 기준 백분율) - positionY(26) + height(26) + 테이프(1.5) = 53.5 < 56.25
  },
  { 
    id: 5, 
    title: "노래 제목 5", 
    artist: "아티스트 5", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "친구5",
    message: "이 순간이 오래 기억되길.\n당신의 모든 순간이 아름답기를.\n\n언제나 당신 곁에 있을게요.\n사랑해요.",
    pageNumber: 2,
    positionX: 8, // 편지 왼쪽 상단 X (컨테이너 너비 기준 백분율)
    positionY: 1, // 편지 왼쪽 상단 Y (컨테이너 너비 기준 백분율)
    height: 50 // 편지 세로 길이 (컨테이너 너비 기준 백분율) - positionY(1) + height(50) + 테이프(1.5) = 52.5 < 56.25
  },
  { 
    id: 6, 
    title: "노래 제목 6", 
    artist: "아티스트 6", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "친구6",
    message: "새로운 노래예요.\n많이 들어보세요.\n\n좋은 하루 되세요.",
    pageNumber: 2,
    positionX: 57, // 편지 왼쪽 상단 X (컨테이너 너비 기준 백분율)
    positionY: 3, // 편지 왼쪽 상단 Y (컨테이너 너비 기준 백분율)
    height: 46 // 편지 세로 길이 (컨테이너 너비 기준 백분율) - positionY(3) + height(46) + 테이프(1.5) = 50.5 < 56.25
  },
  { 
    id: 7, 
    title: "노래 제목 7", 
    artist: "아티스트 7", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "친구7",
    message: "이 노래 좋아하시나요?",
    pageNumber: 2,
    positionX: 12, // 편지 왼쪽 상단 X (컨테이너 너비 기준 백분율)
    positionY: 30, // 편지 왼쪽 상단 Y (컨테이너 너비 기준 백분율)
    height: 22 // 편지 세로 길이 (컨테이너 너비 기준 백분율) - positionY(30) + height(22) + 테이프(1.5) = 53.5 < 56.25
  },
  { 
    id: 8, 
    title: "노래 제목 8", 
    artist: "아티스트 8", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "친구8",
    message: "추천하는 노래입니다.\n들어보시면 좋아하실 거예요.",
    pageNumber: 2,
    positionX: 55, // 편지 왼쪽 상단 X (컨테이너 너비 기준 백분율)
    positionY: 28, // 편지 왼쪽 상단 Y (컨테이너 너비 기준 백분율)
    height: 24 // 편지 세로 길이 (컨테이너 너비 기준 백분율) - positionY(28) + height(24) + 테이프(1.5) = 53.5 < 56.25
  },
  { 
    id: 9, 
    title: "노래 제목 9", 
    artist: "아티스트 9", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "친구9",
    message: "특별한 날에 듣고 싶은 노래예요.\n기억에 남을 거예요.",
    pageNumber: 3,
    positionX: 10, // 편지 왼쪽 상단 X (컨테이너 너비 기준 백분율)
    positionY: 3, // 편지 왼쪽 상단 Y (컨테이너 너비 기준 백분율)
    height: 46 // 편지 세로 길이 (컨테이너 너비 기준 백분율) - positionY(3) + height(46) + 테이프(1.5) = 50.5 < 56.25
  },
  { 
    id: 10, 
    title: "노래 제목 10", 
    artist: "아티스트 10", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "친구10",
    message: "이 노래가 제일 좋아요.\n당신도 좋아하시길 바라요.",
    pageNumber: 3,
    positionX: 55, // 편지 왼쪽 상단 X (컨테이너 너비 기준 백분율)
    positionY: 6, // 편지 왼쪽 상단 Y (컨테이너 너비 기준 백분율)
    height: 43 // 편지 세로 길이 (컨테이너 너비 기준 백분율) - positionY(6) + height(43) + 테이프(1.5) = 50.5 < 56.25
  },
  { 
    id: 11, 
    title: "Spring Day", 
    artist: "BTS", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "민수",
    message: "봄날처럼 따뜻한 하루 되세요.\n이 노래를 들으면 당신이 생각나요.\n\n언제나 응원할게요.",
    pageNumber: 3,
    positionX: 8,
    positionY: 25,
    height: 28
  },
  { 
    id: 12, 
    title: "Blinding Lights", 
    artist: "The Weeknd", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "지영",
    message: "밤에 운전할 때 듣기 좋은 노래예요.\n당신과 함께 듣고 싶어요.",
    pageNumber: 3,
    positionX: 58,
    positionY: 22,
    height: 30
  },
  { 
    id: 13, 
    title: "좋은 날", 
    artist: "IU", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "서연",
    message: "오늘도 좋은 하루 되세요!\n이 노래처럼 밝은 하루가 되길 바라요.\n\n항상 고마워요.",
    pageNumber: 4,
    positionX: 5,
    positionY: 2,
    height: 45
  },
  { 
    id: 14, 
    title: "Shape of You", 
    artist: "Ed Sheeran", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "현우",
    message: "운동할 때 듣기 좋은 노래예요.\n에너지가 솟아나요!",
    pageNumber: 4,
    positionX: 60,
    positionY: 1,
    height: 42
  },
  { 
    id: 15, 
    title: "Dynamite", 
    artist: "BTS", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "수진",
    message: "신나는 노래예요!\n기분이 좋아지는 노래입니다.\n\n함께 춤춰요!",
    pageNumber: 4,
    positionX: 10,
    positionY: 30,
    height: 24
  },
  { 
    id: 16, 
    title: "Someone Like You", 
    artist: "Adele", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "준호",
    message: "감성적인 노래예요.\n밤에 혼자 들으면 좋아요.\n\n당신의 마음에 전해지길.",
    pageNumber: 4,
    positionX: 55,
    positionY: 28,
    height: 26
  },
  { 
    id: 17, 
    title: "Celebrity", 
    artist: "IU", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "하은",
    message: "당신은 나에게 celebrity예요.\n특별한 사람이에요.\n\n항상 응원할게요.",
    pageNumber: 5,
    positionX: 8,
    positionY: 3,
    height: 44
  },
  { 
    id: 18, 
    title: "Watermelon Sugar", 
    artist: "Harry Styles", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "도현",
    message: "여름에 딱 맞는 노래예요!\n시원하고 상큼한 느낌이에요.",
    pageNumber: 5,
    positionX: 57,
    positionY: 2,
    height: 40
  },
  { 
    id: 19, 
    title: "Love Story", 
    artist: "Taylor Swift", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "예린",
    message: "로맨틱한 노래예요.\n당신과의 이야기를 생각하며 들었어요.\n\n사랑해요.",
    pageNumber: 5,
    positionX: 12,
    positionY: 28,
    height: 25
  },
  { 
    id: 20, 
    title: "Butter", 
    artist: "BTS", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "민준",
    message: "부드럽고 달콤한 노래예요.\n기분이 좋아지는 노래입니다!",
    pageNumber: 5,
    positionX: 52,
    positionY: 26,
    height: 28
  },
  { 
    id: 21, 
    title: "Stay", 
    artist: "The Kid LAROI & Justin Bieber", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "지민",
    message: "최근에 많이 듣는 노래예요.\n당신도 좋아하실 것 같아요.\n\n함께 들어요!",
    pageNumber: 6,
    positionX: 6,
    positionY: 1,
    height: 46
  },
  { 
    id: 22, 
    title: "Permission to Dance", 
    artist: "BTS", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "서현",
    message: "춤추고 싶어지는 노래예요!\n신나고 즐거운 하루 되세요.",
    pageNumber: 6,
    positionX: 59,
    positionY: 4,
    height: 43
  },
  { 
    id: 23, 
    title: "As It Was", 
    artist: "Harry Styles", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "윤서",
    message: "차분하고 감성적인 노래예요.\n집중할 때 듣기 좋아요.",
    pageNumber: 6,
    positionX: 9,
    positionY: 29,
    height: 24
  },
  { 
    id: 24, 
    title: "Anti-Hero", 
    artist: "Taylor Swift", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "태현",
    message: "최신 히트곡이에요!\n많이 들어보세요.\n\n좋은 노래예요.",
    pageNumber: 6,
    positionX: 54,
    positionY: 27,
    height: 27
  },
  { 
    id: 25, 
    title: "Flowers", 
    artist: "Miley Cyrus", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "채원",
    message: "자신감 넘치는 노래예요.\n당신도 자신감을 가져요!\n\n화이팅!",
    pageNumber: 7,
    positionX: 7,
    positionY: 2,
    height: 45
  },
  { 
    id: 26, 
    title: "Unholy", 
    artist: "Sam Smith & Kim Petras", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "성민",
    message: "강렬한 비트의 노래예요.\n에너지 충만해지는 노래입니다.",
    pageNumber: 7,
    positionX: 61,
    positionY: 1,
    height: 41
  },
  { 
    id: 27, 
    title: "Calm Down", 
    artist: "Rema & Selena Gomez", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "나은",
    message: "편안하고 차분한 노래예요.\n스트레스 풀 때 듣기 좋아요.",
    pageNumber: 7,
    positionX: 11,
    positionY: 30,
    height: 23
  },
  { 
    id: 28, 
    title: "Creepin'", 
    artist: "Metro Boomin, The Weeknd & 21 Savage", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "지훈",
    message: "최근 인기곡이에요.\n들어보시면 좋아하실 거예요.",
    pageNumber: 7,
    positionX: 56,
    positionY: 25,
    height: 29
  },
  { 
    id: 29, 
    title: "Kill Bill", 
    artist: "SZA", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "소영",
    message: "독특한 느낌의 노래예요.\n새로운 느낌을 주는 노래입니다.",
    pageNumber: 8,
    positionX: 5,
    positionY: 3,
    height: 44
  },
  { 
    id: 30, 
    title: "I'm Good (Blue)", 
    artist: "David Guetta & Bebe Rexha", 
    imageUrl: "https://placehold.co/56x56", 
    nickname: "준영",
    message: "클럽 느낌의 노래예요!\n신나고 즐거운 분위기예요.",
    pageNumber: 8,
    positionX: 58,
    positionY: 2,
    height: 42
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
