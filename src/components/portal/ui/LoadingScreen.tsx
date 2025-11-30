import React from 'react';

interface LoadingScreenProps {
  message?: string;
  minHeight?: string;
  className?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = '로딩 중...', 
  minHeight = '400px',
  className = ''
}) => {
  return (
    <div 
      style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: minHeight 
      }}
      className={className}
    >
      <div>{message}</div>
    </div>
  );
};

export default LoadingScreen;

