import React from 'react';

interface GmailIconProps {
  size?: number;
  className?: string;
}

export const GmailIcon: React.FC<GmailIconProps> = ({ size = 16, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={Math.round(size * 0.75)} 
      viewBox="52 42 88 66" 
      fill="none" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Gmail"
    >
      {/* Official Google Workspace Gmail Logo Geometry */}
      {/* Left Column (Google Blue) */}
      <path fill="#4285F4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" />
      {/* Right Column (Google Green) */}
      <path fill="#34A853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" />
      {/* Top Right Fold (Google Yellow) */}
      <path fill="#FBBC04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" />
      {/* Central V Chevron (Google Red) */}
      <path fill="#EA4335" d="M72 74V48l24 18 24-18v26L96 92" />
      {/* Top Left Fold (Google Dark Red) */}
      <path fill="#C5221F" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" />
    </svg>
  );
};

export default GmailIcon;
