import Image from "next/image";

type LPProps = {
  size?: number;
  className?: string;
  imageUrl?: string | null;
};

export default function LP({ size = 120, className = "", imageUrl }: LPProps) {
  // 중앙 이미지 영역 크기 (가장 안쪽 고리 안쪽)
  const centerSize = size * 0.35;

  return (
    <div
      className={`relative rounded-full ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `
          radial-gradient(circle at center,
            ${imageUrl ? 'transparent' : 'transparent'} 0%,
            ${imageUrl ? 'transparent' : 'transparent'} ${(centerSize / size) * 100}%,
            hsl(0 0% 20%) ${(centerSize / size) * 100}%,
            hsl(0 0% 15%) 15%,
            hsl(0 0% 10%) 25%,
            hsl(0 0% 8%) 35%,
            hsl(0 0% 12%) 40%,
            hsl(0 0% 8%) 45%,
            hsl(0 0% 12%) 50%,
            hsl(0 0% 8%) 55%,
            hsl(0 0% 12%) 60%,
            hsl(0 0% 8%) 70%,
            hsl(0 0% 15%) 100%
          )
        `,
      }}
    >
      {/* 중앙 이미지 영역 */}
      {imageUrl ? (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden"
          style={{ width: `${centerSize}px`, height: `${centerSize}px` }}
        >
          <Image
            src={imageUrl}
            alt="Album cover"
            width={centerSize}
            height={centerSize}
            className="w-full h-full object-cover"
          />
        </div>
      ) : null}

      {/* 중앙 구멍 */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-900"
        style={{ width: `${size * 0.08}px`, height: `${size * 0.08}px` }}
      ></div>
    </div>
  );
}
