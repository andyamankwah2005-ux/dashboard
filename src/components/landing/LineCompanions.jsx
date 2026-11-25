import React from 'react';

export function LineCompanionLeft() {
  return (
    <svg
      className="wink-companion wink-companion-left"
      viewBox="0 0 110 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Peeking trader character in 2px black linework + white fill + solid black hair */}
      <path
        d="M28 54 C22 30, 38 14, 60 16 C78 18, 88 32, 84 52"
        fill="#000000"
      />
      <circle cx="56" cy="52" r="24" fill="#ffffff" stroke="#000000" strokeWidth="2.2" />
      <path d="M36 42 C44 26, 72 24, 80 42 C72 34, 48 34, 36 42 Z" fill="#000000" />
      <circle cx="48" cy="53" r="2.2" fill="#000000" />
      <circle cx="64" cy="53" r="2.2" fill="#000000" />
      <path d="M51 62 Q56 66 62 62" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M34 118 C34 90, 42 78, 58 78 C74 78, 84 92, 86 118"
        fill="#000000"
      />
      {/* Hand resting on stage edge */}
      <path
        d="M78 88 C92 86, 102 90, 102 98 C102 104, 92 106, 80 104"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LineCompanionRight() {
  return (
    <svg
      className="wink-companion wink-companion-right"
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Second peeking companion with glasses */}
      <path
        d="M30 48 C28 24, 44 14, 64 16 C82 18, 92 32, 88 52"
        fill="#000000"
      />
      <circle cx="58" cy="52" r="23" fill="#ffffff" stroke="#000000" strokeWidth="2.2" />
      <circle cx="49" cy="52" r="6" fill="#ffffff" stroke="#000000" strokeWidth="2" />
      <circle cx="67" cy="52" r="6" fill="#ffffff" stroke="#000000" strokeWidth="2" />
      <line x1="55" y1="52" x2="61" y2="52" stroke="#000000" strokeWidth="2" />
      <circle cx="49" cy="52" r="1.8" fill="#000000" />
      <circle cx="67" cy="52" r="1.8" fill="#000000" />
      <path d="M53 63 Q58 67 64 63" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
      {/* Jacket & waving hand */}
      <path
        d="M34 122 C36 92, 46 78, 60 78 C76 78, 86 92, 88 122"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="2.2"
      />
      <path
        d="M36 94 C22 88, 12 92, 12 100 C12 106, 22 108, 36 105"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DeskConnectedIllustration() {
  return (
    <svg
      className="wink-desk-illustration"
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Central truss mast in black ink + #0075de blue cross-bracing */}
      <line x1="152" y1="36" x2="152" y2="210" stroke="#0d0d0d" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="176" y1="36" x2="176" y2="210" stroke="#0d0d0d" strokeWidth="3.2" strokeLinecap="round" />
      <path
        d="M152 60 L176 82 L152 104 L176 126 L152 148 L176 170 L152 192 L176 208"
        stroke="#0075de"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Base plate */}
      <path d="M126 212 H202" stroke="#0d0d0d" strokeWidth="4.5" strokeLinecap="round" />

      {/* Top beam */}
      <path
        d="M96 36 L224 28 L224 42 L96 48 Z"
        fill="#ffffff"
        stroke="#0d0d0d"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Middle beam */}
      <path
        d="M116 74 L268 82 L262 94 L116 86 Z"
        fill="#ffffff"
        stroke="#0d0d0d"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Lower beam */}
      <path
        d="M54 116 L216 124 L216 136 L54 128 Z"
        fill="#ffffff"
        stroke="#0d0d0d"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Hanging circle (left top) */}
      <line x1="108" y1="48" x2="108" y2="66" stroke="#0d0d0d" strokeWidth="2.4" />
      <circle cx="108" cy="84" r="18" fill="#0075de" stroke="#0d0d0d" strokeWidth="3" />

      {/* Hanging diamond (bottom left) */}
      <line x1="78" y1="128" x2="78" y2="148" stroke="#0d0d0d" strokeWidth="2.4" />
      <rect
        x="62"
        y="156"
        width="32"
        height="32"
        rx="4"
        transform="rotate(45 78 172)"
        fill="#0075de"
        stroke="#0d0d0d"
        strokeWidth="3"
      />

      {/* Hanging triangle (right) */}
      <line x1="250" y1="94" x2="250" y2="142" stroke="#0d0d0d" strokeWidth="2.4" />
      <path
        d="M250 142 L278 192 H222 Z"
        fill="#0075de"
        stroke="#0d0d0d"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

