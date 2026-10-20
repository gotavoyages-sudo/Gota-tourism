// Premium GOTA International Group Logo — black with orange TA accent
export function GotaLogo({ size = 72, mono = false }: { size?: number; mono?: boolean }) {
  return (
    <svg width={size} height={size * 0.78} viewBox="0 0 600 470" xmlns="http://www.w3.org/2000/svg" aria-label="GOTA International Group">
      <rect width="600" height="470" fill={mono ? "transparent" : "#000"} />
      {/* G */}
      <text x="110" y="220" fontFamily="Georgia, serif" fontSize="200" fontWeight="400" fill="#fff" textAnchor="middle" letterSpacing="-8">G</text>
      {/* Plane inside G */}
      <g transform="translate(70,150) scale(0.5)" fill="#fff">
        <path d="M40 80 L55 65 L70 80 L70 70 L85 70 L75 50 L90 50 L90 45 L55 45 L55 30 L65 25 L40 20 L15 25 L25 30 L25 45 L-10 45 L-10 50 L5 50 L-5 70 L10 70 L10 80 Z"/>
      </g>
      {/* O */}
      <text x="255" y="220" fontFamily="Georgia, serif" fontSize="200" fontWeight="400" fill="#fff" textAnchor="middle" letterSpacing="-8">O</text>
      {/* House inside O */}
      <g transform="translate(222,145) scale(0.55)" fill="#fff">
        <path d="M30 10 L60 40 L60 45 L54 45 L54 70 L6 70 L6 45 L0 45 Z"/>
        <rect x="22" y="52" width="16" height="18" fill="#000"/>
      </g>
      {/* T and A — orange */}
      <text x="375" y="220" fontFamily="Georgia, serif" fontSize="200" fontWeight="400" fill="#EE8A1D" textAnchor="middle" letterSpacing="-8">T</text>
      <text x="500" y="220" fontFamily="Georgia, serif" fontSize="200" fontWeight="400" fill="#EE8A1D" textAnchor="middle" letterSpacing="-8">A</text>
      {/* Subtitle: INTERNATIONAL GROUP */}
      <text x="300" y="290" fontFamily="Georgia, serif" fontSize="42" letterSpacing="22" fill="#fff" textAnchor="middle">
        <tspan fill="#EE8A1D">I N T E R</tspan><tspan fill="#fff">N A T I O N A L</tspan>
      </text>
      <text x="300" y="350" fontFamily="Georgia, serif" fontSize="54" letterSpacing="26" fill="#EE8A1D" textAnchor="middle">G R O U P</text>
    </svg>
  );
}

// Wordmark-only variant (compact)
export function GotaWordmark({ height = 28 }: { height?: number }) {
  return (
    <div className="flex items-baseline gap-0.5 font-serif font-bold leading-none" style={{ height }}>
      <span className="text-white">G</span>
      <span className="text-white">O</span>
      <span className="text-[#EE8A1D]">T</span>
      <span className="text-[#EE8A1D]">A</span>
      <span className="ml-1 text-[9px] tracking-[0.2em] text-white/80 font-sans font-normal">VOYAGES</span>
    </div>
  );
}

export const COMPANY_PHONE = "+229 01 96 87 05 29";
export const COMPANY_EMAIL = "tourisme@gotainternational.com";
export const BRAND_GOLD = "#C9A86A";
export const BRAND_ORANGE = "#EE8A1D";
