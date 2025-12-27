import Image from "next/image";

export default function AlbumListPage() {
  return (
    <div className="relative min-h-screen w-full">
      {/* 배경 이미지 - subBackground */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/subBackground.png"
          alt="Album list background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* 컨텐츠 */}
      <div className="relative z-10 min-h-screen w-full" style={{ backgroundColor: "transparent" }}>
        {/* 서비스 프레임 - 배경 투명 */}
        <div className="service-frame" style={{ backgroundColor: "transparent" }}>
          {/* TODO: 앨범 목록 컴포넌트 추가 */}
          <div style={{ padding: "20px" }}>
            <h1>앨범 저장소</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

