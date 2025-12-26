"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/shared/ui";
import { AlbumNameInput, AlbumDescriptionInput, AlbumArea } from "@/features/album/create";

export default function AlbumCreatePage() {
  const [albumName, setAlbumName] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const isButtonEnabled = albumName.trim().length > 0;

  return (
    <div className="relative min-h-dvh">
      <div className="relative min-h-screen">
        <Image
          src="/images/subBackground.png"
          alt="Album create background"
          fill
          priority
          className="object-cover object-center"
        />

        <div className="relative z-10 flex min-h-screen flex-col items-center p-4">
          {/* 서비스 영역 프레임 */}
          <div 
            className="w-full max-w-[768px] bg-[#fefaf0] relative service-frame"
          >
            {/* 제목 텍스트 */}
            <div 
              className="absolute font-black album-create-title"
              style={{
                fontFamily: 'var(--font-dung-geun-mo)',
                left: 'min(calc(32 * 100% / 768), 32px)',
                top: 'calc(84 * max(700px, 100vh) / 1024)',
                fontSize: 'clamp(calc(75 * 100vh / 1024 * 0.6 * 0.8), calc(75 * 100vh / 1024 * 0.8), calc((100% - min(calc(32 * 100% / 768), 32px) * 2) / 10 * 0.8))',
                maxWidth: 'calc(100% - min(calc(32 * 100% / 768), 32px) * 2)',
                lineHeight: '1.2',
              }}
            >
              <div>앨범의 제목과 설명을</div>
              <div>알려주세요~</div>
            </div>
            
            {/* 앨범 영역 */}
            <div
              style={{
                position: 'absolute',
                left: 'min(calc(32 * 100% / 768), 32px)',
                top: 'calc(226 * max(700px, 100vh) / 1024)',
                width: 'calc(100% - min(calc(32 * 100% / 768), 32px) * 2)',
              }}
            >
              <AlbumArea albumName={albumName} albumDescription={albumDescription} />
            </div>
            
            {/* 앨범명 입력 */}
            <div
              style={{
                position: 'absolute',
                left: 'min(calc(32 * 100% / 768), 32px)',
                top: 'calc(530 * max(700px, 100vh) / 1024)',
                width: 'calc(100% - min(calc(32 * 100% / 768), 32px) * 2)',
              }}
            >
              <AlbumNameInput value={albumName} onChange={setAlbumName} />
            </div>
            
            {/* 앨범 설명 입력 */}
            <div
              style={{
                position: 'absolute',
                left: 'min(calc(32 * 100% / 768), 32px)',
                top: 'calc(678 * max(700px, 100vh) / 1024)',
                width: 'calc(100% - min(calc(32 * 100% / 768), 32px) * 2)',
              }}
            >
              <AlbumDescriptionInput value={albumDescription} onChange={setAlbumDescription} />
            </div>
            <div
              style={{
                position: 'absolute',
                left: 'min(calc(32 * 100% / 768), 32px)',
                top: 'calc(900 * max(700px, 100vh) / 1024)',
                width: 'calc(100% - min(calc(32 * 100% / 768), 32px) * 2)',
              }}
            >
              <Button 
                onClick={() => console.log('버튼 클릭')}
                disabled={!isButtonEnabled}
                outerColor={isButtonEnabled ? '#98d9d4' : '#D1d1d1'}
                innerColor={isButtonEnabled ? '#8BC9C4' : '#c4c4c4'}
              >
                다음
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
