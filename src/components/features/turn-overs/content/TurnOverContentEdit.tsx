import { TurnOver } from '@/generated/common';
import React from 'react';

interface TurnOversContentEditProps {
  selectedTurnOver: TurnOver | null;
  onCancel?: () => void;
}

const TurnOversContentEdit: React.FC<TurnOversContentEditProps> = ({ selectedTurnOver, onCancel }) => {
  if (!selectedTurnOver) {
    return null;
  }
    
  return (
    <div>
      <h1>이직 내용 편집</h1>
      {onCancel && (
        <button onClick={onCancel}>취소</button>
      )}
    </div>
  );
};

export default TurnOversContentEdit;

