import React from 'react';
import { ResumeDetail } from '@/generated/common';
import CareerContent from './CareerContent';

interface CareerHomeProps {
  selectedResumeDetail: ResumeDetail | null;
  resumeDetails: ResumeDetail[];
  onRefresh?: () => void;
}

const CareerHome: React.FC<CareerHomeProps> = ({
  selectedResumeDetail,
  resumeDetails,
  onRefresh,
}) => {
  // 이력서 상세 페이지 표시
  if (selectedResumeDetail) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#f8f9fa',
        height: '100%',
        width: '100%'
      }}>
        <CareerContent
          selectedResumeDetail={selectedResumeDetail}
          onRefresh={onRefresh}
        />
      </div>
    );
  }

  // 기본 이력서 목록 표시
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: '#f8f9fa'
    }}>
      {/* 이력서 데이터 표시 영역 */}
      <div style={{
        padding: '30px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333',
          margin: '0 0 20px 0'
        }}>
          이력 관리
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#666',
          margin: '0 0 20px 0',
          lineHeight: '1.5'
        }}>
          좌측 사이드바에서 이력서를 선택하거나 새로운 이력서를 추가하세요.
        </p>
        
        {/* 이력서 통계 정보 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          <div style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
              margin: '0 0 10px 0'
            }}>
              총 이력서 수
            </h3>
            <p style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#007bff',
              margin: 0
            }}>
              {resumeDetails.length}
            </p>
          </div>
          
          <div style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
              margin: '0 0 10px 0'
            }}>
              기본 이력서
            </h3>
            <p style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#28a745',
              margin: 0
            }}>
              {resumeDetails.filter(resumeDetail => resumeDetail.isDefault).length}
            </p>
          </div>
          
          <div style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
              margin: '0 0 10px 0'
            }}>
              공개 이력서
            </h3>
            <p style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#17a2b8',
              margin: 0
            }}>
              {resumeDetails.filter(resumeDetail => resumeDetail.isPublic).length}
            </p>
          </div>
        </div>
      </div>

      {/* 하단 영역 - 안내 메시지 */}
      <div style={{
        flex: 1,
        padding: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#666'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '20px'
          }}>
            📄
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333',
            margin: '0 0 10px 0'
          }}>
            이력서를 선택해주세요
          </h3>
          <p style={{
            fontSize: '16px',
            margin: 0,
            lineHeight: '1.5'
          }}>
            좌측 사이드바에서 이력서를 선택하면<br />
            회사 이력, 자격증, 학위, 교육 정보를 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareerHome;

