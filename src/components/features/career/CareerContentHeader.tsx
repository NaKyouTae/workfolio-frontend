import React from 'react';
import { ResumeDetail } from '@/generated/common';

interface CareerContentHeaderProps {
  selectedResumeDetail: ResumeDetail | null;
  isLoggedIn: boolean;
  isEditMode: boolean;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onExportPDF?: () => void;
}

const CareerContentHeader: React.FC<CareerContentHeaderProps> = ({ 
  selectedResumeDetail, 
  isLoggedIn,
  isEditMode,
  onEdit,
  onDuplicate,
  onExportPDF
}) => {
  return (
    <div style={{ 
      padding: '20px 30px', 
      backgroundColor: '#fff', 
      borderBottom: '1px solid #e0e0e0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: !isLoggedIn ? '5px' : 0
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#333', 
          margin: 0 
        }}>
          {selectedResumeDetail?.title}
          {selectedResumeDetail?.title && isEditMode && (
            <span style={{
              marginLeft: '12px',
              fontSize: '14px',
              fontWeight: 'normal',
              color: '#ff9800',
              backgroundColor: '#fff3e0',
              padding: '4px 12px',
              borderRadius: '4px',
              border: '1px solid #ffe0b2'
            }}>
              ✏️ 편집 중
            </span>
          )}
        </h1>
        
        {/* 액션 링크들 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px'
        }}>
          <button
            onClick={onEdit}
            style={{
              background: isEditMode ? '#4caf50' : 'none',
              border: isEditMode ? '1px solid #4caf50' : 'none',
              color: isEditMode ? '#fff' : '#2196f3',
              cursor: 'pointer',
              padding: '6px 12px',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              borderRadius: '4px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!isEditMode) {
                e.currentTarget.style.textDecoration = 'underline';
              } else {
                e.currentTarget.style.backgroundColor = '#45a049';
              }
            }}
            onMouseLeave={(e) => {
              if (!isEditMode) {
                e.currentTarget.style.textDecoration = 'none';
              } else {
                e.currentTarget.style.backgroundColor = '#4caf50';
              }
            }}
          >
            {isEditMode ? '완료' : '편집'}
          </button>
          
          {/* 편집 모드가 아닐 때만 복제/PDF 내보내기 표시 */}
          {!isEditMode && (
            <>
              <span style={{ color: '#ddd' }}>|</span>
              <button
                onClick={onDuplicate}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2196f3',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                복제
              </button>
              <span style={{ color: '#ddd' }}>|</span>
              <button
                onClick={onExportPDF}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2196f3',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                PDF 내보내기
              </button>
            </>
          )}
        </div>
      </div>
      
      {!isLoggedIn && (
        <p style={{ fontSize: '14px', color: '#999', margin: '5px 0 0 0' }}>
          📋 샘플 데이터를 표시하고 있습니다. 로그인하면 실제 데이터를 확인할 수 있습니다.
        </p>
      )}
    </div>
  );
};

export default CareerContentHeader;

