import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  subtitle?: string;
}

export const RouteResQLogo: React.FC<LogoProps> = ({
  className = '',
  size = 36,
  showText = true,
  subtitle,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        className="shrink-0 drop-shadow-sm select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="shieldGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#142D4F" />
            <stop offset="100%" stop-color="#0B1A2F" />
          </linearGradient>
          <linearGradient id="roadGradComp" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#2878E8" />
            <stop offset="100%" stop-color="#13A878" />
          </linearGradient>
        </defs>

        {/* Shield Shell */}
        <path
          d="M 256,40 C 360,80 440,90 440,210 C 440,340 330,430 256,472 C 182,430 72,340 72,210 C 72,90 152,80 256,40 Z"
          fill="url(#shieldGradComp)"
          stroke="#2878E8"
          strokeWidth="10"
        />

        {/* Emergency Signal Wave */}
        <path
          d="M 256,120 A 136,136 0 0 1 352,160"
          fill="none"
          stroke="#2878E8"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M 256,90 A 166,166 0 0 1 374,140"
          fill="none"
          stroke="#13A878"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Road Perspective */}
        <path d="M 190,380 L 235,210 L 277,210 L 322,380 Z" fill="url(#roadGradComp)" opacity="0.95" />
        <line x1="256" y1="220" x2="256" y2="250" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
        <line x1="256" y1="280" x2="256" y2="320" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
        <line x1="256" y1="345" x2="256" y2="375" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />

        {/* Red Medical Cross */}
        <g transform="translate(256, 175)">
          <rect x="-38" y="-12" width="76" height="24" rx="4" fill="#F00016" stroke="#FFFFFF" strokeWidth="4" />
          <rect x="-12" y="-38" width="24" height="76" rx="4" fill="#F00016" stroke="#FFFFFF" strokeWidth="4" />
        </g>
      </svg>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col select-none">
          <div className="flex items-center tracking-tight">
            <span className="text-lg font-extrabold text-[#142D4F]">Route</span>
            <span className="text-lg font-extrabold text-[#2878E8]">ResQ</span>
          </div>
          {subtitle && (
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider -mt-1">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
