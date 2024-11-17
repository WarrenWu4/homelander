import React, { useState } from 'react';

const DynamicButton = React.memo(({ onClick, variant = 'primary', children, fullWidth = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
  
    const getBackgroundColor = () => {
      if (variant === 'primary') {
        if (isPressed) return '#c41025';
        if (isHovered) return '#ff1f41';
        return '#E31837';
      }
      return 'white';
    };
  
    const baseStyle = {
      padding: '12px 24px',
      backgroundColor: getBackgroundColor(),
      color: variant === 'primary' ? 'white' : '#E31837',
      border: variant === 'primary' ? 'none' : '2px solid #E31837',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1.1rem',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      position: 'relative',
      overflow: 'hidden',
      width: fullWidth ? '100%' : 'auto',
      transform: `scale(${isPressed ? 0.98 : isHovered ? 1.02 : 1})`,
      boxShadow: isHovered 
        ? '0 4px 15px rgba(227, 24, 55, 0.3)' 
        : '0 2px 5px rgba(0,0,0,0.1)',
    };
  
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressed(false);
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        style={baseStyle}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transform: `translateY(${isPressed ? '1px' : '0'})`
        }}>
          {children}
        </div>
      </button>
    );
  });

export default DynamicButton;