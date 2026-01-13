import type { AlbumData } from "@/features/song/components/types";
import AlbumDetailClient from "@/features/album/detail/AlbumDetailClient";

// 예시 데이터 (하나만)
const EXAMPLE_ALBUM: AlbumData = {
  albumName: "겨울 감성 플레이리스트",
  albumDescription: "추운 겨울날 듣기 좋은 따뜻한 노래들을 모아봤어요. 함께 들어요!",
  category: "mood",
  categoryTag: "감성적인",
  isPublic: "public",
  songCount: 5,
  coverColor: "#98d9d4",
  lpColor: "#98d9d4",
  coverImageUrl: undefined,
  lpCircleImageUrl: undefined,
  nickname: "음악러버",
  createdDate: "2025.12.30",
  songs: [
    {
      title: "Make Up (Feat. Crush)",
      artist: "샘김 (Sam Kim)",
    },
    {
      title: "그건 아마 우리의 잘못은 아닐 거야",
      artist: "백예린 (Yerin Baek)",
    },
    {
      title: "Fly away",
      artist: "권진아",
    },
    {
      title: "가끔",
      artist: "Crush",
    },
    {
      title: "한숨",
      artist: "이하이",
    },
  ],
};

// 정적 생성을 위한 params 생성 함수 (예시 id)
export function generateStaticParams() {
  return [
    { id: "1" },
    { id: "example" },
    { id: "test" },
  ];
}

export default async function AlbumDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> | { id: string } 
}) {
  // params가 Promise인 경우 await 처리
  const resolvedParams = params instanceof Promise ? await params : params;
  
  // 예시 데이터 사용 (나중에 실제 데이터로 교체 가능)
  // 어떤 id든 예시 데이터를 표시 (테스트용)
  const album = EXAMPLE_ALBUM;

  return <AlbumDetailClient album={album} />;
}
