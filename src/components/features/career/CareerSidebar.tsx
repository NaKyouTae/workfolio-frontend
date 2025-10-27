import React from 'react';
import { ResumeDetail } from '@/generated/common';

interface CareerSidebarProps {
  resumeDetails: ResumeDetail[];
  selectedResumeDetail: ResumeDetail | null;
  onResumeSelect: (resume: ResumeDetail) => void; 
  onResumeCreated: () => void;
  onGoHome: () => void;
}

const CareerSidebar: React.FC<CareerSidebarProps> = ({ resumeDetails, selectedResumeDetail, onResumeSelect, onResumeCreated, onGoHome }) => {
  const handleResumeCreated = () => {
    onResumeCreated();
  };

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
          onClick={handleResumeCreated}
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
          이력서 추가
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
            backgroundColor: !selectedResumeDetail ? '#e3f2fd' : 'transparent',
            borderTop: !selectedResumeDetail ? '1px solid #2196f3' : '1px solid transparent',
            borderRight: !selectedResumeDetail ? '1px solid #2196f3' : '1px solid transparent',
            borderBottom: '1px solid #e0e0e0',
            borderLeft: !selectedResumeDetail ? '1px solid #2196f3' : '1px solid transparent',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '14px',
            color: !selectedResumeDetail ? '#1976d2' : '#333',
          }}
          onMouseOver={(e) => {
            if (selectedResumeDetail) {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }
          }}
          onMouseOut={(e) => {
            if (selectedResumeDetail) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <div style={{ 
            fontWeight: 'bold',
            marginBottom: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            내 이력 관리
          </div>
        </div>
        <div style={{ padding: '0 10px' }}>
          <div style={{ padding: '12px 0px', margin: '4px 0', fontSize: '14px', color: '#333' }}>
            내 이력서
          </div>

          {/* 이력서 목록 */}
        {resumeDetails.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {resumeDetails.map((resumeDetail) => {
              const isSelected = selectedResumeDetail?.id === resumeDetail.id;
              return (
                <div
                  key={resumeDetail.id}
                  onClick={() => onResumeSelect(resumeDetail)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#333',
                    backgroundColor: isSelected ? '#e3f2fd' : (resumeDetail.isDefault ? '#e8f5e9' : '#f5f5f5'),
                    borderTop: isSelected ? '2px solid #2196f3' : (resumeDetail.isDefault ? '1px solid #4caf50' : '1px solid transparent'),
                    borderRight: isSelected ? '2px solid #2196f3' : (resumeDetail.isDefault ? '1px solid #4caf50' : '1px solid transparent'),
                    borderBottom: isSelected ? '2px solid #2196f3' : (resumeDetail.isDefault ? '1px solid #4caf50' : '1px solid transparent'),
                    borderLeft: isSelected ? '2px solid #2196f3' : (resumeDetail.isDefault ? '1px solid #4caf50' : '1px solid transparent'),
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = resumeDetail.isDefault ? '#c8e6c9' : '#e0e0e0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = resumeDetail.isDefault ? '#e8f5e9' : '#f5f5f5';
                    } else {
                      e.currentTarget.style.backgroundColor = '#e3f2fd';
                    }
                  }}
                >
                <div style={{ fontWeight: resumeDetail.isDefault ? '600' : '400' }}>
                  {resumeDetail.title || '제목 없음'}
                  {resumeDetail.isDefault && (
                    <span style={{ 
                      marginLeft: '6px', 
                      fontSize: '10px',
                      color: '#4caf50',
                      fontWeight: '600'
                    }}>
                      ✓ 기본
                    </span>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: '#999', padding: '8px 0' }}>
            이력서가 없습니다.
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default CareerSidebar;
