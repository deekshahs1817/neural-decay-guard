import React from 'react';

const BackgroundBrain = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-10] overflow-hidden flex items-center justify-center">
      <div className="brain-pulse w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] text-[var(--accent-primary)] opacity-40">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Stylized Brain SVG - Complex paths for high-end look */}
          <path
            d="M50 85C50 85 20 75 15 50C10 25 25 10 50 10C75 10 90 25 85 50C80 75 50 85 50 85Z"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="2 2"
          />
          <path
            d="M50 10V85"
            stroke="currentColor"
            strokeWidth="0.3"
          />
          {/* Left Hemisphere Details */}
          <path d="M45 20C35 22 30 30 32 40" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
          <path d="M40 30C30 35 25 45 30 55" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
          <path d="M42 60C32 65 28 75 35 80" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
          
          {/* Right Hemisphere Details */}
          <path d="M55 20C65 22 70 30 68 40" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
          <path d="M60 30C70 35 75 45 70 55" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />
          <path d="M58 60C68 65 72 75 65 80" stroke="currentColor" strokeWidth="0.4" opacity="0.6" />

          {/* Neural Connections (Floating Particles) */}
          <circle cx="30" cy="40" r="0.8" fill="currentColor" className="animate-pulse" />
          <circle cx="70" cy="35" r="0.8" fill="currentColor" className="animate-pulse" style={{ animationDelay: '1s' }} />
          <circle cx="50" cy="65" r="0.8" fill="currentColor" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
          <circle cx="40" cy="75" r="0.8" fill="currentColor" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
          <circle cx="60" cy="25" r="0.8" fill="currentColor" className="animate-pulse" style={{ animationDelay: '2s' }} />
        </svg>
      </div>
    </div>
  );
};

export default BackgroundBrain;
