import LP from "./LP";

type AlbumCoverProps = {
  size?: number;
  className?: string;
  backgroundColor?: string;
  backgroundColorHex?: string;
  imageUrl?: string | null;
  lpSize?: number;
};

export default function AlbumCover({
  size = 150,
  className = "",
  backgroundColor,
  backgroundColorHex,
  imageUrl,
  lpSize,
}: AlbumCoverProps) {
  const lpSizeValue = lpSize || size * 0.8; // 기본값: size의 80%

  // backgroundColorHex가 있으면 우선 사용, 없으면 backgroundColor 사용, 둘 다 없으면 기본값
  const bgColor = backgroundColorHex 
    ? undefined 
    : backgroundColor || "bg-gray-100";
  
  const bgStyle = backgroundColorHex 
    ? { backgroundColor: backgroundColorHex }
    : undefined;

  // LP가 오른쪽 끝으로 이동하는 거리 계산
  // LP의 중심이 오른쪽 끝에 오려면: size - lpSizeValue/2
  // 현재 중심 위치: size/2
  // 이동 거리: size - lpSizeValue/2 - size/2 = (size - lpSizeValue)/2 (오른쪽으로)
  const slideDistance = (size - lpSizeValue) / 2;

  return (
    <div
      className={`rounded-[20px] ${bgColor} relative overflow-hidden ${className}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        ...bgStyle,
      }}
    >
      <div
        className="album-cover-lp absolute top-1/2 left-1/2 transition-transform duration-300 ease-out"
        style={{ 
          '--slide-distance': `${slideDistance}px`,
        } as React.CSSProperties & { '--slide-distance': string }}
      >
        <LP size={lpSizeValue} imageUrl={imageUrl} />
      </div>
    </div>
  );
}
