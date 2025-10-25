import React from 'react';
import Image from 'next/image';

interface EmptyStateProps {
  text: string;
}

/**
 * 데이터가 없을 때 표시하는 Empty State 컴포넌트
 */
const EmptyState: React.FC<EmptyStateProps> = ({ text }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      backgroundColor: '#fafafa'
    }}>
      <Image
        src="/assets/img/ico/ic-empty.png" 
        alt="empty" 
        style={{ marginBottom: '16px', opacity: 0.5 }}
        width={80}
        height={80}
      />
      <p style={{ 
        fontSize: '14px', 
        color: '#666', 
        margin: 0,
        textAlign: 'center'
      }}>
        {text}
      </p>
    </div>
  );
};

export default EmptyState;

