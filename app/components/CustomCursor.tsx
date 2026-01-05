'use client';

import React, { useEffect, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile) {
      return () => window.removeEventListener('resize', checkMobile);
    }

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('button, a, .interactive, .card-hover, input, textarea, select, [role="button"]');
      setIsHovering(!!isInteractive);
    };

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile, isVisible]);

  if (isMobile) return null;

  return (
    <>
      <div
        className={`cursor-dot ${isHovering ? 'hover' : ''}`}
        style={{
          left: `${position.x - 4}px`,
          top: `${position.y - 4}px`,
          opacity: isVisible ? 1 : 0,
        }}
      />
      <div
        className={`cursor-ring ${isHovering ? 'hover' : ''}`}
        style={{
          left: `${position.x - 16}px`,
          top: `${position.y - 16}px`,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
};

export default CustomCursor;
