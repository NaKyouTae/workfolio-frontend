import React, { useState } from 'react';
import CareerCreateModal from './CareerCreateModal';
import { ResumeDetail } from '@/generated/common';

interface CareerSidebarProps {
  resumeDetails: ResumeDetail[];
  selectedResumeDetail: ResumeDetail | null;
  refreshResumeDetails: () => void;
  onResumeSelect: (resume: ResumeDetail) => void;
  onGoHome: () => void;
}

const CareerSidebar: React.FC<CareerSidebarProps> = ({ resumeDetails, refreshResumeDetails, selectedResumeDetail, onResumeSelect, onGoHome }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleResumeCreated = () => {
    refreshResumeDetails(); // 이력서 목록 새로고침
  };

  return (
    <div style={{ 
      width: '250px', 
      backgroundColor: '#fff', 
      borderRight: '1px solid #e0e0e0',
      padding: '20px 0',
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
          onClick={handleModalOpen}
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
            transition: 'background-color 0.2s'
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
        padding: '10px 0'
      }}>
        <div style={{ 
          padding: '0 20px 10px 20px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#666',
          borderBottom: '1px solid #e0e0e0',
          marginBottom: '10px'
        }}>
          이력서 목록
        </div>
        <div style={{ padding: '0 10px' }}>
          {/* 이력서 홈 아이템 */}
          <div
            onClick={onGoHome}
            style={{
              padding: '12px 16px',
              margin: '4px 0',
              backgroundColor: !selectedResumeDetail ? '#e3f2fd' : 'transparent',
              border: !selectedResumeDetail ? '1px solid #2196f3' : '1px solid transparent',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '14px',
              color: !selectedResumeDetail ? '#1976d2' : '#333'
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
              🏠 이력서 홈
            </div>
            <div style={{ 
              fontSize: '12px',
              color: '#666',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              이력서 통계 및 개요
            </div>
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
                    border: isSelected ? '2px solid #2196f3' : (resumeDetail.isDefault ? '1px solid #4caf50' : '1px solid transparent'),
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
                  {resumeDetail.title}
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

      {/* 이력서 생성 모달 */}
      <CareerCreateModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleResumeCreated}
      />
    </div>
  );
};

export default CareerSidebar;

