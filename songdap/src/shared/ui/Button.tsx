"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  outerColor?: string;
  innerColor?: string;
}

export default function Button({ 
  children, 
  onClick, 
  className = "",
  disabled = false,
  outerColor,
  innerColor
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative ${className}`}
      style={{
        width: '100%',
        height: 'calc(96 * 100vh / 1024)',
        border: '3px solid #000000',
        borderRadius: '10px',
        backgroundColor: outerColor || 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {/* 안쪽 네모 */}
      <div
        style={{
          width: 'calc(682 * 100% / 704)',
          height: 'calc(74 * 100vh / 1024)',
          borderRadius: '4px',
          backgroundColor: innerColor || 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-galmuri9)',
          fontSize: 'calc(35 * 100vh / 1024 * 96 / 90)',
        }}
      >
        {children}
      </div>
    </button>
  );
}

