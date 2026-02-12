import React from 'react';

interface LoadingScreenProps {
  message?: string;
  minHeight?: string;
  className?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
}) => {
  return (
    <main>
        <div  className="loading">
            <i className="ic-rocket"/>
            <p>커리어 성장 중</p>
        </div>
    </main>
  );
};

export default LoadingScreen;

