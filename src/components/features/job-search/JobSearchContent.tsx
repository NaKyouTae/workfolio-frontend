import React from 'react';
import { JobSearch, Company } from '@/generated/common';
import JobSearchCompanyPage from '../job-search-company/JobSearchCompanyPage';

interface JobSearchContentProps {
  selectedJobSearch: JobSearch | null;
  companies: Company[];
}

const JobSearchContent: React.FC<JobSearchContentProps> = ({
  selectedJobSearch,
  companies,
}) => {
  // 이직 상세 페이지 표시
  if (selectedJobSearch) {
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
        <JobSearchCompanyPage
          jobSearch={selectedJobSearch}
        />
      </div>
    );
  }

  // 기본 이직 목록 표시
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      backgroundColor: '#f8f9fa'
    }}>
      {/* 이직 데이터 표시 영역 */}
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
          이직 관리
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#666',
          margin: '0 0 20px 0',
          lineHeight: '1.5'
        }}>
          좌측 사이드바에서 이직을 선택하거나 새로운 이직을 추가하세요.
        </p>
        
        {/* 이직 통계 정보 */}
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
              총 이직 수
            </h3>
            <p style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#007bff',
              margin: 0
            }}>
              {companies.length}
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
              진행 중인 이직
            </h3>
            <p style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#28a745',
              margin: 0
            }}>
              {companies.filter(company => !company.endedAt).length}
            </p>
          </div>
        </div>
      </div>

      {/* 하단 영역 - JobSearchCompanyPage 또는 안내 메시지 */}
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
            📋
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333',
            margin: '0 0 10px 0'
          }}>
            이직을 선택해주세요
          </h3>
          <p style={{
            fontSize: '16px',
            margin: 0,
            lineHeight: '1.5'
          }}>
            좌측 사이드바에서 이직을 선택하면<br />
            상세 정보와 회사 정보를 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobSearchContent;
