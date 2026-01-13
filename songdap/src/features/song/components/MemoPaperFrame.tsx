"use client";

import { responsive } from "@/features/album/create/constants";

interface MemoPaperFrameProps {
  serviceFrameWidth: number;
  children?: React.ReactNode;
}

/**
 * 메모장 느낌의 프레임 컴포넌트
 * - 위에 테이프 디자인
 * - 종이 배경
 * - 반응형 크기 (서비스 프레임 가로 길이 768 기준, 양쪽 패딩 20씩 제외)
 */
export default function MemoPaperFrame({ serviceFrameWidth, children }: MemoPaperFrameProps) {
  // 서비스 프레임 가로 길이 768 기준, 양쪽 패딩 20씩 제외
  // 반응형: 실제 serviceFrameWidth에서 양쪽 패딩 20씩 제외
  const padding = 20;
  const paperWidth = serviceFrameWidth - (padding * 2);
  
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        paddingLeft: `${padding}px`,
        paddingRight: `${padding}px`,
        paddingTop: responsive.sizeVh(20, 24, 28, 28),
        paddingBottom: responsive.sizeVh(20, 24, 28, 28),
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "relative",
          width: `${paperWidth}px`,
          maxWidth: "100%",
          minHeight: "100%",
          overflow: "visible",
        }}
      >
        {/* 검정색 배경 메모장 (그림자) - 아래, 오른쪽 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${paperWidth}px`,
            minHeight: "100%",
            backgroundColor: "#000000",
            borderRadius: "20px",
            boxSizing: "border-box",
          }}
        />
        
        {/* 흰색 메모장 (위에 올라가는 것) - 위, 왼쪽 */}
        <div
          style={{
            position: "relative",
            top: 0,
            left: 0,
            width: `${paperWidth - 10}px`,
            height: "calc(100% - 10px)",
            maxHeight: "calc(100% - 10px)",
            backgroundColor: "#FCDFA4",
            borderRadius: "18px",
            padding: responsive.sizeVh(20, 24, 28, 28),
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            overflow: "visible",
          }}
        >
          {/* 위에 테이프 */}
          <div
            style={{
              position: "absolute",
              top: responsive.sizeVh(-18, -20, -22, -22), // Moved up to accommodate larger height
              left: "50%",
              transform: "translateX(-50%)",
              width: responsive.sizeVh(120, 140, 160, 160),
              height: responsive.sizeVh(36, 40, 44, 44), // Increased height
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderRadius: "2px",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.15)",
              zIndex: 1,
            }}
          />
          
          {/* 종이 내용 영역 */}
          <div 
            style={{ 
              position: "relative", 
              zIndex: 0,
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              paddingTop: responsive.sizeVh(20, 24, 28, 28), // Added top padding to move content down
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

