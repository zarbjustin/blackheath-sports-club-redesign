import React from "react";

// Custom sport icons drawn to match lucide-react's conventions:
// 24x24 viewBox, no fill, currentColor stroke, 2px round-capped strokes.
// currentColor lets them inherit each sport card's accent colour.
function Svg({ size = 24, children, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

// Rugby ball: diagonal prolate spheroid with a lacing seam.
export function RugbyIcon(props) {
  return (
    <Svg {...props}>
      <g transform="rotate(45 12 12)">
        <ellipse cx="12" cy="12" rx="9" ry="5" />
        <line x1="6.5" y1="12" x2="17.5" y2="12" />
        <line x1="9.5" y1="10.6" x2="9.5" y2="13.4" />
        <line x1="12" y1="10.6" x2="12" y2="13.4" />
        <line x1="14.5" y1="10.6" x2="14.5" y2="13.4" />
      </g>
    </Svg>
  );
}

// Cricket: an angled bat with a ball.
export function CricketIcon(props) {
  return (
    <Svg {...props}>
      <g transform="rotate(45 12 12)">
        <line x1="12" y1="2.5" x2="12" y2="7" />
        <rect x="9.5" y="7" width="5" height="12" rx="1.8" />
      </g>
      <circle cx="5.6" cy="18.4" r="2" />
    </Svg>
  );
}

// Tennis ball: circle with the classic curved seam.
export function TennisIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M6.5 5 Q 14 12 6.5 19" />
      <path d="M17.5 5 Q 10 12 17.5 19" />
    </Svg>
  );
}

// Squash: a racket with a small ball.
export function SquashIcon(props) {
  return (
    <Svg {...props}>
      <g transform="rotate(-40 12 12)">
        <ellipse cx="12" cy="7.5" rx="4.5" ry="5.5" />
        <line x1="12" y1="13" x2="12" y2="21" />
        <line x1="8" y1="7.5" x2="16" y2="7.5" />
        <line x1="12" y1="3" x2="12" y2="12" />
      </g>
      <circle cx="19" cy="18.5" r="1.7" />
    </Svg>
  );
}
