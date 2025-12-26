import Image from "next/image";

interface LPProps {
  circleColor?: string;
  size?: number;
}

export default function LP({ circleColor = "#ffffff", size = 300 }: LPProps) {
  const circleSizeRatio = 108 / 300; // 300:108 비율

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* 베이스 이미지 */}
      <Image
        src="/images/lpBase.png"
        alt="LP base"
        width={size}
        height={size}
        className="w-full h-full"
      />
      
      {/* 색상 변경 가능한 원 */}
      <div
        className="absolute rounded-full"
        style={{
          width: `${circleSizeRatio * 100}%`,
          height: `${circleSizeRatio * 100}%`,
          backgroundColor: circleColor,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
}


