"use client";

import { useState, useEffect, useRef } from "react";
import { AlbumArea, AlbumButtonSection, AlbumInputSection, AlbumInputSectionStep2 } from "@/features/album/create";
import { COLORS, FONTS, responsive, ALBUM_AREA } from "@/features/album/create/constants";

// 제목 관련 상수
const TITLE_TEXT_STEP1 = "앨범의 제목과 설명을";
const TITLE_SUBTEXT_STEP1 = "알려주세요~";
const TITLE_TEXT_STEP2 = "앨범 카테고리를";
const TITLE_SUBTEXT_STEP2 = "만들어 주세요~";
const TITLE_SPACING = 40; // 제목과 앨범 영역 간격

// 폰트 크기 계산 상수
const TARGET_WIDTH_RATIO = 0.7;
const MIN_FONT_SIZE = 30;
const MAX_FONT_SIZE = 100;
const FONT_SIZE_ITERATIONS = 30;
const FONT_SIZE_TOLERANCE = 1;

export default function CreateAlbumForm() {
  const [step, setStep] = useState(1); // 단계 관리
  const [albumName, setAlbumName] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [situationValue, setSituationValue] = useState("");
  const [titleFontSize, setTitleFontSize] = useState(60);
  const [titleHeight, setTitleHeight] = useState(0);
  const titleRef = useRef<HTMLDivElement>(null);
  const serviceFrameRef = useRef<HTMLDivElement>(null);
  const isButtonEnabled = albumName.trim().length > 0;

  // step에 따른 제목 텍스트
  const titleText = step === 1 ? TITLE_TEXT_STEP1 : TITLE_TEXT_STEP2;
  const titleSubtext = step === 1 ? TITLE_SUBTEXT_STEP1 : TITLE_SUBTEXT_STEP2;

  useEffect(() => {
    const updateFontSize = () => {
      if (!serviceFrameRef.current) return;
      
      const targetWidth = serviceFrameRef.current.offsetWidth * TARGET_WIDTH_RATIO;
      const tempElement = document.createElement('div');
      Object.assign(tempElement.style, {
        position: 'absolute',
        visibility: 'hidden',
        whiteSpace: 'nowrap',
        fontFamily: FONTS.DUNG_GEUN_MO,
        fontWeight: '900',
      });
      tempElement.textContent = titleText;
      document.body.appendChild(tempElement);
      
      let fontSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, (targetWidth / titleText.length) * 1.2));
      let step = fontSize / 4;
      let direction = 1;
      
      for (let i = 0; i < FONT_SIZE_ITERATIONS; i++) {
        tempElement.style.fontSize = `${fontSize}px`;
        const textWidth = tempElement.offsetWidth;
        
        if (Math.abs(textWidth - targetWidth) < FONT_SIZE_TOLERANCE) break;
        
        if (textWidth < targetWidth) {
          if (direction === -1) step /= 2;
          direction = 1;
          fontSize += step;
        } else {
          if (direction === 1) step /= 2;
          direction = -1;
          fontSize -= step;
        }
        
        fontSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, fontSize));
        if (step < 0.1) break;
      }
      
      document.body.removeChild(tempElement);
      setTitleFontSize(Math.round(fontSize));
      
      // 제목 높이 측정
      if (titleRef.current) {
        setTitleHeight(titleRef.current.offsetHeight);
      }
    };

    const updateTitleHeight = () => {
      if (titleRef.current) {
        setTitleHeight(titleRef.current.offsetHeight);
      }
    };

    const handleResize = () => {
      updateFontSize();
      updateTitleHeight();
    };

    const timeoutId = setTimeout(handleResize, 0);
    
    const resizeObserver = new ResizeObserver(handleResize);
    
    if (serviceFrameRef.current) {
      resizeObserver.observe(serviceFrameRef.current);
    }
    if (titleRef.current) {
      resizeObserver.observe(titleRef.current);
    }
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [step, titleText]);

  // 앨범 영역 top 위치 계산
  const albumAreaTop = titleHeight > 0 
    ? `calc(max(80px, calc(100 * 100vh / 1024)) + ${titleHeight}px + ${responsive.vh(TITLE_SPACING)})`
    : 'calc(226 * max(700px, 100vh) / 1024)';

  // 입력 섹션 top 위치 계산
  const inputSectionTop = titleHeight > 0 
    ? `calc(max(80px, calc(100 * 100vh / 1024)) + ${titleHeight}px + ${responsive.vh(TITLE_SPACING)} + ${ALBUM_AREA.HEIGHT} + ${responsive.vh(TITLE_SPACING)})`
    : `calc(226 * max(700px, 100vh) / 1024 + ${ALBUM_AREA.HEIGHT} + ${responsive.vh(TITLE_SPACING)})`;

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center p-4">
      <div 
        ref={serviceFrameRef}
        className="bg-[#fefaf0] relative service-frame service-frame-scroll"
        style={{
          width: 'min(clamp(100vw, calc(768 * 100vw / 1820), 900px), 900px)',
          maxWidth: '100%',
        }}
      >
        <div 
          ref={titleRef}
          className="absolute font-black album-create-title"
          style={{
            fontFamily: FONTS.DUNG_GEUN_MO,
            left: 'min(calc(32 * 100% / 768), 32px)',
            top: 'max(80px, calc(100 * 100vh / 1024))',
            fontSize: `${titleFontSize}px`,
            lineHeight: '1.2',
            color: COLORS.BLACK,
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
          }}
        >
          <div>{titleText}</div>
          <div>{titleSubtext}</div>
        </div>
        
        <div
          style={{
            position: 'absolute',
            left: '0',
            top: albumAreaTop,
            width: '100%',
          }}
        >
          <AlbumArea 
            albumName={albumName} 
            albumDescription={albumDescription}
            category={category}
            selectedTag={selectedTag}
            situationValue={situationValue}
          />
        </div>
        
        <div
          style={{
            position: 'absolute',
            left: '0',
            top: inputSectionTop,
            bottom: responsive.vh(144),
            width: '100%',
            paddingLeft: 'min(calc(32 * 100% / 768), 32px)',
            paddingRight: 'min(calc(32 * 100% / 768), 32px)',
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        >
          {step === 1 ? (
            <AlbumInputSection
              albumName={albumName}
              albumDescription={albumDescription}
              onAlbumNameChange={setAlbumName}
              onAlbumDescriptionChange={setAlbumDescription}
            />
          ) : (
            <AlbumInputSectionStep2
              category={category}
              onCategoryChange={setCategory}
              selectedTag={selectedTag}
              onTagChange={setSelectedTag}
              situationValue={situationValue}
              onSituationChange={setSituationValue}
            />
          )}
        </div>
        
        <div
          style={{
            position: 'absolute',
            left: '0',
            bottom: '0',
            width: '100%',
          }}
        >
          <AlbumButtonSection
            onNextClick={() => {
              if (step === 1) {
                setStep(2);
              } else {
                // TODO: 앨범 생성 로직 구현
                console.log('앨범 생성');
              }
            }}
            onPrevClick={() => {
              if (step > 1) {
                setStep(step - 1);
              } else {
                // TODO: 이전 페이지로 이동 로직 구현
                console.log('이전 페이지로 이동');
              }
            }}
            nextDisabled={step === 1 && !isButtonEnabled}
            nextText="다음"
          />
        </div>
      </div>
    </div>
  );
}

