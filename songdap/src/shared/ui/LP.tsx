import Image from "next/image";

interface LPProps {
  circleColor?: string;
  circleImageUrl?: string;
  size?: number;
}

export default function LP({ circleColor = "#ffffff", circleImageUrl, size = 300 }: LPProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Center 원 - 아래 레이어 */}
      <div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: circleImageUrl ? "transparent" : circleColor,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {circleImageUrl ? (
          <Image
            src={circleImageUrl}
            alt="LP circle image"
            width={size}
            height={size}
            className="w-full h-full"
            style={{
              objectFit: "cover",
              borderRadius: "50%",
            }}
            unoptimized
          />
        ) : null}
      </div>
      
      {/* 베이스 이미지 - 위 레이어 */}
      <Image
        src="/images/lp.png"
        alt="LP base"
        width={size}
        height={size}
        className="w-full h-full relative"
        style={{
          zIndex: 2,
        }}
      />
    </div>
  );
}


