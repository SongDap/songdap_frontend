"use client";

import React from "react";

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
        fontFamily: 'var(--font-cafe24-proslim)',
        fontSize: 'calc(35 * 100vh / 1024 * 96 / 90)',
        color: '#000000',
        ...style,
      }}
    >
      {children}
    </button>
  );
}