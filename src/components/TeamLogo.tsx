import React, { useState, useEffect } from 'react';

interface TeamLogoProps {
  className?: string;
  glow?: boolean;
  logoUrl?: string;
}

export default function TeamLogo({ className = 'w-16 h-16', glow = false, logoUrl }: TeamLogoProps) {
  const [finalLogoUrl, setFinalLogoUrl] = useState(logoUrl || '');

  useEffect(() => {
    if (logoUrl) {
      setFinalLogoUrl(logoUrl);
    } else {
      try {
        const store = localStorage.getItem('faraby_settings');
        if (store) {
          const parsed = JSON.parse(store);
          if (parsed && parsed.logoUrl) {
            setFinalLogoUrl(parsed.logoUrl);
          } else {
            setFinalLogoUrl('');
          }
        } else {
          setFinalLogoUrl('');
        }
      } catch (e) {
        setFinalLogoUrl('');
      }
    }
  }, [logoUrl]);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const store = localStorage.getItem('faraby_settings');
        if (store) {
          const parsed = JSON.parse(store);
          if (parsed && parsed.logoUrl) {
            setFinalLogoUrl(parsed.logoUrl);
          } else {
            setFinalLogoUrl('');
          }
        } else {
          setFinalLogoUrl('');
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localSettingsUpdate', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localSettingsUpdate', handleStorageChange);
    };
  }, []);

  const isRealImage = finalLogoUrl && (
    finalLogoUrl.startsWith('data:') || 
    finalLogoUrl.startsWith('http:') || 
    finalLogoUrl.startsWith('https:')
  );

  if (isRealImage) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden rounded-full ${className} aspect-square`}>
        {glow && (
          <div className="absolute inset-0 bg-amber-500/15 rounded-full blur-xl animate-pulse" />
        )}
        <img 
          src={finalLogoUrl} 
          alt="Al Faraby FC Logo" 
          className="w-full h-full object-cover rounded-full border-2 border-amber-500 shadow-md aspect-square bg-slate-900" 
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {glow && (
        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
      )}
      <svg
        id="al-faraby-crest-svg"
        viewBox="0 0 500 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl select-none"
      >
        <defs>
          {/* Gold Outline Gradient */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DF9930" />
            <stop offset="30%" stopColor="#FFF2AF" />
            <stop offset="50%" stopColor="#C48419" />
            <stop offset="70%" stopColor="#F9D776" />
            <stop offset="100%" stopColor="#8A5100" />
          </linearGradient>

          {/* Navy Blue Shield Fill */}
          <linearGradient id="navyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E305C" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Crimson Red Stripe Fill */}
          <linearGradient id="crimsonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#881B24" />
            <stop offset="100%" stopColor="#580811" />
          </linearGradient>

          {/* Golden Ribbon Fill */}
          <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#AA6D11" />
            <stop offset="50%" stopColor="#F6CA5E" />
            <stop offset="100%" stopColor="#AA6D11" />
          </linearGradient>

          {/* Banner Drop Shadow */}
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.5" />
          </filter>

          {/* Metallic Gold Ball Accents */}
          <radialGradient id="ballShading" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#E2E8F0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0.9" />
          </radialGradient>
        </defs>

        {/* --- Main Shield Path --- */}
        {/* Curved football shield: straight-ish top, points outward, curves down to a sharp base point */}
        <path
          d="M 120,105 C 200,125 300,125 380,105 C 385,160 395,340 370,420 C 340,515 280,555 250,565 C 220,555 160,515 130,420 C 105,340 115,160 120,105 Z"
          fill="url(#navyGrad)"
          stroke="url(#goldGrad)"
          strokeWidth="14"
          strokeLinejoin="round"
        />

        {/* --- Burgundy Vertical Stripes --- */}
        {/* Centered vertical stripes on the background */}
        <g>
          {/* Central Stripe */}
          <path
            d="M 230,121 C 230,200 230,450 230,560 C 243,563 257,563 270,560 C 270,450 270,200 270,121 Z"
            fill="url(#crimsonGrad)"
          />
          {/* Left Stripe 1 */}
          <path
            d="M 175,115 C 175,200 178,420 185,502 C 193,514 201,525 210,535 C 202,400 200,200 200,119 Z"
            fill="url(#crimsonGrad)"
          />
          {/* Right Stripe 1 */}
          <path
            d="M 325,115 C 325,200 322,420 315,502 C 307,514 299,525 290,535 C 298,400 300,200 300,119 Z"
            fill="url(#crimsonGrad)"
          />
          {/* Left-most Stripe 2 */}
          <path
            d="M 130,108 C 131,180 135,350 145,445 C 148,452 152,460 156,467 C 152,380 150,200 150,111 Z"
            fill="url(#crimsonGrad)"
          />
          {/* Right-most Stripe 2 */}
          <path
            d="M 370,108 C 369,180 365,350 355,445 C 352,452 348,460 344,467 C 348,380 350,200 350,111 Z"
            fill="url(#crimsonGrad)"
          />
        </g>

        {/* Golden Inner Border Detail */}
        <path
          d="M 134,120 C 206,137 294,137 366,120 C 371,170 380,330 358,410 C 330,495 276,535 250,544 C 224,535 170,495 142,410 C 120,330 129,170 134,120 Z"
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="3"
          strokeOpacity="0.7"
        />

        {/* --- Ribbon Banner Backing (Left & Right Foldouts) --- */}
        {/* Left Side Banner Flap */}
        <path
          d="M 100,210 L 60,210 L 80,240 L 60,270 L 110,270 Z"
          fill="#0D1933"
          stroke="url(#goldGrad)"
          strokeWidth="3.5"
        />
        {/* Right Side Banner Flap */}
        <path
          d="M 400,210 L 440,210 L 420,240 L 440,270 L 390,270 Z"
          fill="#0D1933"
          stroke="url(#goldGrad)"
          strokeWidth="3.5"
        />

        {/* --- Arched Navy Main Banner --- */}
        {/* Beautiful high quality curved crest banner with gold borders */}
        <path
          d="M 75,260 C 130,200 370,200 425,260 L 413,295 C 360,240 140,240 87,295 Z"
          fill="url(#navyGrad)"
          stroke="url(#goldGrad)"
          strokeWidth="6"
          strokeLinejoin="round"
          filter="url(#shadow)"
        />

        {/* --- "AL-FARABY FC" Display Text --- */}
        {/* Scaled/rotated text aligned with the arch */}
        <text filter="url(#shadow)">
          <textPath
            href="#crestTextPath"
            startOffset="50%"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="32"
            fontWeight="900"
            fontFamily="'Inter', 'Space Grotesk', sans-serif"
            letterSpacing="2"
          >
            AL-FARABY FC
          </textPath>
        </text>

        {/* Hidden curve used ONLY for laying out the arched text */}
        <path
          id="crestTextPath"
          d="M 90,265 C 140,225 360,225 410,265"
          fill="none"
          stroke="none"
        />

        {/* --- White "AKADEMI" Sub-Badge --- */}
        {/* Rounded Pill Shape Badge under main label */}
        <rect
          x="175"
          y="290"
          width="150"
          height="45"
          rx="22.5"
          fill="#FFFFFF"
          stroke="#000000"
          strokeWidth="5"
          filter="url(#shadow)"
        />
        <text
          x="250"
          y="321"
          textAnchor="middle"
          fill="#000000"
          fontSize="22"
          fontWeight="900"
          fontFamily="'Inter', 'Space Grotesk', sans-serif"
          letterSpacing="4"
        >
          AKADEMI
        </text>

        {/* --- Classic Soccer Ball Center Bottom --- */}
        <g id="soccer-ball" filter="url(#shadow)" transform="translate(250, 440) scale(1.1)">
          {/* Main Ball Sphere */}
          <circle cx="0" cy="0" r="48" fill="#FFFFFF" stroke="url(#goldGrad)" strokeWidth="4" />
          <circle cx="0" cy="0" r="48" fill="url(#ballShading)" />

          {/* Central Pentagon Pentagons */}
          {/* Center */}
          <polygon points="0,-12 -11,-3 -7,11 7,11 11,-3" fill="#111827" />

          {/* Outer pentagonal elements and connection lines to represent ball seams */}
          {/* Top panel seam */}
          <line x1="0" y1="-12" x2="0" y2="-28" stroke="#111827" strokeWidth="3" />
          <polygon points="-12,-38 12,-38 0,-28" fill="#111827" />

          {/* Top Left seam */}
          <line x1="-11" y1="-3" x2="-26" y2="-12" stroke="#111827" strokeWidth="3" />
          <polygon points="-40,0 -34,-22 -26,-12" fill="#111827" />

          {/* Top Right seam */}
          <line x1="11" y1="-3" x2="26" y2="-12" stroke="#111827" strokeWidth="3" />
          <polygon points="40,0 34,-22 26,-12" fill="#111827" />

          {/* Bottom Left seam */}
          <line x1="-7" y1="11" x2="-22" y2="24" stroke="#111827" strokeWidth="3" />
          <polygon points="-38,15 -18,38 -22,24" fill="#111827" />

          {/* Bottom Right seam */}
          <line x1="7" y1="11" x2="22" y2="24" stroke="#111827" strokeWidth="3" />
          <polygon points="38,15 18,38 22,24" fill="#111827" />

          {/* Bottom center bottom panel connection */}
          <line x1="-18" y1="38" x2="-10" y2="47" stroke="#111827" strokeWidth="3" />
          <line x1="18" y1="38" x2="10" y2="47" stroke="#111827" strokeWidth="3" />
          <line x1="-34" y1="-22" x2="-45" y2="-16" stroke="#111827" strokeWidth="3" />
          <line x1="34" y1="-22" x2="45" y2="-16" stroke="#111827" strokeWidth="3" />
          <line x1="0" y1="-38" x2="0" y2="-48" stroke="#111827" strokeWidth="3" />
          <line x1="-40" y1="0" x2="-48" y2="0" stroke="#111827" strokeWidth="3" />
          <line x1="40" y1="0" x2="48" y2="0" stroke="#111827" strokeWidth="3" />
          
          {/* Seam outlines to give a beautiful rounded feel */}
          <path d="M 0,-12 L -11,-3 L -7,11 L 7,11 L 11,-3 Z" fill="none" stroke="#111827" strokeWidth="3.5" />
          <path d="M 0,-28 L -12,-38 M 0,-28 L 12,-38" fill="none" stroke="#111827" strokeWidth="3" />
          <path d="M -26,-12 L -34,-22 M -26,-12 L -40,0" fill="none" stroke="#111827" strokeWidth="3" />
          <path d="M 26,-12 L 34,-22 M 26,-12 L 40,0" fill="none" stroke="#111827" strokeWidth="3" />
          <path d="M -22,24 L -18,38 M -22,24 L -38,15" fill="none" stroke="#111827" strokeWidth="3" />
          <path d="M 22,24 L 18,38 M 22,24 L 38,15" fill="none" stroke="#111827" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}
