const Logo = ({ variant = 'color', size = 'md' }) => {
  const sizes = {
    sm: { width: 160, height: 50 },
    md: { width: 220, height: 65 },
    lg: { width: 300, height: 90 },
    icon: { width: 60, height: 60 },
  };

  const { width, height } = sizes[size] || sizes.md;
  const isWhite = variant === 'white';
  const blueColor = isWhite ? '#FFFFFF' : '#2E6DA4';
  const darkColor = isWhite ? '#FFFFFF' : '#2C3E50';
  const yellowColor = '#F5A623';

  if (size === 'icon') {
    return (
      <svg width={width} height={height} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Semicircle arc */}
        <path d="M25 75 C25 45, 50 20, 75 35" stroke={blueColor} strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M20 70 C20 35, 55 10, 80 30" stroke={blueColor} strokeWidth="6" fill="none" strokeLinecap="round"/>
        {/* Letter e */}
        <circle cx="52" cy="55" r="18" stroke={blueColor} strokeWidth="5" fill="none"/>
        <line x1="34" y1="55" x2="70" y2="55" stroke={blueColor} strokeWidth="5"/>
        <path d="M70 55 C70 65, 60 75, 48 72" stroke={blueColor} strokeWidth="5" fill="none" strokeLinecap="round"/>
        {/* Yellow dots */}
        <circle cx="35" cy="22" r="5" fill={yellowColor}/>
        <circle cx="48" cy="15" r="5" fill={yellowColor}/>
        <circle cx="62" cy="15" r="5" fill={yellowColor}/>
        <circle cx="75" cy="22" r="5" fill={yellowColor}/>
        <circle cx="28" cy="32" r="4" fill={yellowColor}/>
      </svg>
    );
  }

  return (
    <svg width={width} height={height} viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Icon part */}
      <g transform="translate(0, 5)">
        {/* Semicircle arcs */}
        <path d="M18 70 C18 38, 42 15, 68 28" stroke={blueColor} strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M14 65 C14 30, 45 8, 72 22" stroke={blueColor} strokeWidth="5" fill="none" strokeLinecap="round"/>
        {/* Letter e */}
        <circle cx="45" cy="50" r="16" stroke={blueColor} strokeWidth="4.5" fill="none"/>
        <line x1="29" y1="50" x2="61" y2="50" stroke={blueColor} strokeWidth="4.5"/>
        <path d="M61 50 C61 60, 53 68, 42 66" stroke={blueColor} strokeWidth="4.5" fill="none" strokeLinecap="round"/>
        {/* Yellow dots */}
        <circle cx="28" cy="18" r="4.5" fill={yellowColor}/>
        <circle cx="40" cy="11" r="4.5" fill={yellowColor}/>
        <circle cx="53" cy="11" r="4.5" fill={yellowColor}/>
        <circle cx="65" cy="18" r="4.5" fill={yellowColor}/>
        <circle cx="22" cy="28" r="3.5" fill={yellowColor}/>
      </g>
      {/* Text part */}
      <text x="100" y="42" fontFamily="'Outfit', sans-serif" fontSize="28" fontWeight="300" letterSpacing="2" fill={darkColor}>
        INNOVACIÓN
      </text>
      <text x="100" y="70" fontFamily="'Outfit', sans-serif" fontSize="18" fontWeight="400" letterSpacing="3" fill={blueColor}>
        e-LEARNING S.A.S
      </text>
    </svg>
  );
};

export default Logo;
