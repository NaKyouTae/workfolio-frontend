import React from 'react';
import { JobSearch } from '@/generated/common';
import DateUtil from '@/utils/DateUtil';

interface JobSearchSidebarProps {
  jobSearches: JobSearch[];
  selectedJobSearch: JobSearch | null;
  onJobSearchSelect: (jobSearch: JobSearch) => void;
  onAddJobSearch: () => void;
  onGoHome: () => void;
}

const JobSearchSidebar: React.FC<JobSearchSidebarProps> = ({
  jobSearches,
  selectedJobSearch,
  onJobSearchSelect,
  onAddJobSearch,
  onGoHome
}) => {
  return (
    <aside style={{ 
      width: '300px', 
      backgroundColor: '#fff', 
      borderRight: '1px solid #e0e0e0',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 사이드바 상단 - 이직 추가 버튼 */}
      <div style={{ 
        padding: '20px', 
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa'
      }}>
        <button
          onClick={onAddJobSearch}
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
          이직 추가
        </button>
      </div>

      {/* 사이드바 하단 - 이직 목록 */}
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
          이직 목록
        </div>
        <div style={{ padding: '0 10px' }}>
          {/* 이직 홈 아이템 */}
          <div
            onClick={onGoHome}
            style={{
              padding: '12px 16px',
              margin: '4px 0',
              backgroundColor: !selectedJobSearch ? '#e3f2fd' : 'transparent',
              border: !selectedJobSearch ? '1px solid #2196f3' : '1px solid transparent',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '14px',
              color: !selectedJobSearch ? '#1976d2' : '#333'
            }}
            onMouseOver={(e) => {
              if (selectedJobSearch) {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }
            }}
            onMouseOut={(e) => {
              if (selectedJobSearch) {
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
              🏠 이직 홈
            </div>
            <div style={{ 
              fontSize: '12px',
              color: '#666',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              이직 통계 및 개요
            </div>
          </div>

          {/* 이직 목록 */}
          {jobSearches.length === 0 ? (
            <div style={{ 
              padding: '20px', 
              textAlign: 'center', 
              color: '#999',
              fontSize: '14px'
            }}>
              등록된 이직이 없습니다
            </div>
          ) : (
            jobSearches.map((jobSearch) => {
              const isSelected = selectedJobSearch ? (selectedJobSearch as JobSearch).id === jobSearch.id : false;
              return (
                <div
                  key={jobSearch.id}
                  onClick={() => onJobSearchSelect(jobSearch)}
                  style={{
                    padding: '12px 16px',
                    margin: '4px 0',
                    backgroundColor: isSelected ? '#e3f2fd' : 'transparent',
                    border: isSelected ? '1px solid #2196f3' : '1px solid transparent',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '14px',
                    color: isSelected ? '#1976d2' : '#333'
                  }}
                  onMouseOver={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isSelected) {
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
                    {jobSearch.title}
                  </div>
                  <div style={{ 
                    fontSize: '12px',
                    color: '#666',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {DateUtil.formatTimestamp(jobSearch.startedAt)} ~ {jobSearch.endedAt ? DateUtil.formatTimestamp(jobSearch.endedAt) : '진행중'}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
};

export default JobSearchSidebar;
