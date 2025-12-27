import Image from "next/image";
import CreateAlbumForm from "@/features/album/CreateAlbumForm";

export default function CreateAlbumPage() {
  return (
    <div className="relative min-h-screen w-full">
      {/* 배경 이미지 */}
      <div className="relative min-h-screen">
        <Image
          src="/images/subBackground.png"
          alt="Album create background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* 컨텐츠 */}
        <div className="relative z-10 min-h-screen w-full">
          <CreateAlbumForm />
        </div>
      </div>
    </div>
  );
}