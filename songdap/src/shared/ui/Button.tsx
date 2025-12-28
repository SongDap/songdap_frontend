"use client";

import React, { useState } from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  outerColor?: string;
  innerColor?: string;
  style?: React.CSSProperties;
}

export default function Button({ 
  children, 
  onClick, 
  className = "",
  disabled = false,
  outerColor,
  innerColor,
  style
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const baseBackgroundColor = outerColor || 'transparent';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative ${className}`}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        height: 'clamp(48px, calc(96 * 100vh / 1024), 96px)',
        border: '3px solid #000000',
        borderRadius: '12px',
        backgroundColor: isHovered && !disabled 
          ? (baseBackgroundColor === 'transparent' ? '#fafafa' : adjustBrightness(baseBackgroundColor, 0.95))
          : baseBackgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-cafe24-proslim)',
        fontSize: 'clamp(20px, calc(35 * 100vh / 1024), 35px)',
        color: '#000000',
        transition: 'all 0.2s ease',
        transform: isHovered && !disabled ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered && !disabled 
          ? '0 4px 8px rgba(0, 0, 0, 0.15)' 
          : '0 2px 4px rgba(0, 0, 0, 0.1)',
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// 배경색 밝기 조정 헬퍼 함수
function adjustBrightness(hex: string, factor: number): string {
  // transparent나 빈 문자열인 경우 처리
  if (!hex || hex === 'transparent') return hex;
  
  // # 제거
  const color = hex.replace('#', '');
  
  // RGB 값 추출
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  // 밝기 조정
  const newR = Math.round(r * factor);
  const newG = Math.round(g * factor);
  const newB = Math.round(b * factor);
  
  // 다시 hex로 변환
  return `#${[newR, newG, newB].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
}

