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

  return (
    <div
      className={`rounded-[20px] ${bgColor} flex items-center justify-center overflow-hidden ${className}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        ...bgStyle,
      }}
    >
      <LP size={lpSizeValue} imageUrl={imageUrl} />
    </div>
  );
}
