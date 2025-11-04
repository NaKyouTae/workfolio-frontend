import React, { useEffect } from 'react';
import { TurnOver } from '@/generated/common';
import { useTurnOver } from '@/hooks/useTurnOver';

interface TurnOversSidebarProps {
  selectedTurnOver: TurnOver | null;
  onGoHome: () => void;
  onTurnOverSelect: (turnOver: TurnOver) => void;
}

const TurnOversSidebar: React.FC<TurnOversSidebarProps> = ({ selectedTurnOver, onGoHome, onTurnOverSelect }) => {
  const { turnOvers, refreshTurnOvers } = useTurnOver();

  const handleTurnOverCreated = () => {
    console.log('turn over created');
  };

  useEffect(() => {
    refreshTurnOvers();
  }, [refreshTurnOvers]);

  return (
    <div style={{ 
      width: '250px', 
      backgroundColor: '#fff', 
      borderRight: '1px solid #e0e0e0',
      boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}> 
      {/* 이력서 추가 버튼 */}
      <div style={{
        padding: '20px', 
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa'
      }}>
        <button
          onClick={handleTurnOverCreated}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            height: '32px',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          신규 이직 추가
        </button>
      </div>

      {/* 이력서 섹션 */}
      <div style={{ 
        flex: 1, 
        overflow: 'auto',
        borderBottom: '1px solid #e0e0e0',
      }}>
        <div
          onClick={onGoHome}
          style={{ 
            padding: '12px 8px',
            margin: '8px 0',
            backgroundColor: '#e3f2fd',
            borderTop: '1px solid #2196f3',
            borderRight: '1px solid #2196f3',
            borderBottom: '1px solid #e0e0e0',
            borderLeft: '1px solid #2196f3',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '14px',
            color: '#1976d2',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#e3f2fd';
          }}
        >
          <div style={{ 
            fontWeight: 'bold',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            내 이직 내역 관리
          </div>
        </div>
        <div style={{ padding: '0 10px' }}>
          <div style={{ padding: '12px 0px', margin: '4px 0', fontSize: '14px', color: '#333' }}>
            내 이직 내역
          </div>

          {/* 이력서 목록 */}
        {turnOvers.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {turnOvers.map((turnOver) => {
              const isSelected = selectedTurnOver?.id === turnOver.id;
              return (
                <div
                  key={turnOver.id}
                  onClick={() => onTurnOverSelect(turnOver)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#333',
                    backgroundColor: isSelected ? '#e3f2fd' : '#f5f5f5',
                    borderTop: isSelected ? '2px solid #2196f3' : '1px solid transparent',
                    borderRight: isSelected ? '2px solid #2196f3' : '1px solid transparent',
                    borderBottom: isSelected ? '2px solid #2196f3' : '1px solid transparent',
                    borderLeft: isSelected ? '2px solid #2196f3' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#e0e0e0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    } else {
                      e.currentTarget.style.backgroundColor = '#e3f2fd';
                    }
                  }}
                >
                <div style={{ fontWeight: '600' }}>
                  {turnOver.name}
                </div>
              </div>
              );
            })}
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: '#999', padding: '8px 0' }}>
            이직 내역이 없습니다.
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default TurnOversSidebar;
