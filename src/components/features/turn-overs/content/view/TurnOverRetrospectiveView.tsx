import React from 'react';
import { TurnOverRetrospective } from '@/generated/common';

interface TurnOverRetrospectiveViewProps {
  turnOverRetrospective: TurnOverRetrospective | null;
}

const TurnOverRetrospectiveView: React.FC<TurnOverRetrospectiveViewProps> = ({ turnOverRetrospective }) => {
  if (!turnOverRetrospective) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
        <p>회고 정보가 없습니다.</p>
      </div>
    );
  }
    
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 20px 0' }}>회고</h2>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>회고 정보를 여기에 표시합니다.</p>
      </div>
    </div>
  );
};

export default TurnOverRetrospectiveView;

