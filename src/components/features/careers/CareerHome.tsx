import React, { useState } from 'react';
import { ResumeDetail } from '@/generated/common';
import DateUtil from '@/utils/DateUtil';

interface CareerHomeProps {
  resumeDetails: ResumeDetail[];
  onEdit: (resume: ResumeDetail) => void;
  duplicateResume: (resumeId?: string) => Promise<void>;
  deleteResume: (resumeId?: string) => Promise<void>;
  exportPDF: (resumeId?: string) => Promise<void>;
  copyURL: (publicId?: string) => Promise<void>;
  calculateTotalCareer: (resume: ResumeDetail) => string;
}

const CareerHome: React.FC<CareerHomeProps> = ({
  resumeDetails,
  onEdit,
  duplicateResume,
  deleteResume,
  exportPDF,
  copyURL,
  calculateTotalCareer,
}) => {
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');

  // 이력서 편집
  const handleEdit = (resume: ResumeDetail) => {
    onEdit(resume);
  };

  // 이력서 복제
  const handleDuplicate = (resume: ResumeDetail) => {
    duplicateResume(resume.id);
  };

  // 이력서 삭제
  const handleDelete = (resume: ResumeDetail) => {
    deleteResume(resume.id);
  };

  // PDF 내보내기
  const handleExportPDF = (resume: ResumeDetail) => {
    exportPDF(resume.id);
  };

  // URL 공유하기
  const handleCopyURL = (resume: ResumeDetail) => {
    copyURL(resume.publicId);
  };

  // 정렬된 이력서 목록
  const sortedResumes = [...resumeDetails].sort((a, b) => {
    if (sortOrder === 'recent') {
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    } else {
      return (a.updatedAt || 0) - (b.updatedAt || 0);
    }
  });

  // 기본 이력서 목록 표시
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      backgroundColor: '#fff'
    }}>
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* 제목 */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#000',
          marginBottom: '30px'
        }}>
          내 이력 관리
        </h1>

        {/* 내 이력 현황 */}
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#000',
          marginBottom: '16px'
        }}>
          내 이력 현황
        </h2>

        {/* 통계 카드들 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '40px'
        }}>
          <div style={{
            padding: '24px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#fff'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '8px'
            }}>
              전체 이력서
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#000'
            }}>
              {resumeDetails.length} <span style={{ fontSize: '18px', fontWeight: '400' }}>개</span>
            </div>
          </div>

          <div style={{
            padding: '24px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#fff'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '8px'
            }}>
              PDF 변환 이력서
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#000'
            }}>
              0 <span style={{ fontSize: '18px', fontWeight: '400' }}>개</span>
            </div>
          </div>

          <div style={{
            padding: '24px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            backgroundColor: '#fff'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '8px'
            }}>
              URL 공유 이력서
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#000'
            }}>
              0 <span style={{ fontSize: '18px', fontWeight: '400' }}>개</span>
            </div>
          </div>
        </div>

        {/* 전체 이력서 헤더 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#000',
            margin: 0
          }}>
            전체 이력서 {resumeDetails.length}개
          </h2>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'recent' | 'oldest')}
            style={{
              padding: '8px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="recent">최근 수정일 순</option>
            <option value="oldest">오래된 순</option>
          </select>
        </div>

        {/* 이력서 리스트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sortedResumes.map((resume) => (
            <div
              key={resume.id}
              style={{
                padding: '24px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                backgroundColor: '#fff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {/* 왼쪽: 이력서 정보 */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    {resume.isDefault && (
                      <span style={{
                        padding: '2px 8px',
                        backgroundColor: '#ffd700',
                        color: '#000',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        ⭐
                      </span>
                    )}
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: resume.title ? '#000' : '#ddd',
                      margin: 0
                    }}>
                      {resume.title}
                    </h3>
                  </div>
                  <div style={{
                    fontSize: '14px',
                    marginBottom: '4px',
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <span style={{ color: resume.position ? '#666' : '#ddd' }}>
                      {resume.position || '직무'}
                    </span>
                    <span style={{ color: '#666' }}>|</span>
                    <span style={{ color: calculateTotalCareer(resume) ? '#666' : '#ddd' }}>
                      {calculateTotalCareer(resume) || '경력 없음'}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#999'
                  }}>
                    최종 수정일 : {DateUtil.formatTimestamp(resume.updatedAt || 0, 'YYYY. MM. DD.')}
                  </div>
                </div>

                {/* 오른쪽: 액션 링크들 */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  <span
                    onClick={() => handleEdit(resume)}
                    style={{
                      cursor: 'pointer',
                      color: '#333',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    편집
                  </span>
                  <span style={{ color: '#ddd' }}>|</span>
                  <span
                    onClick={() => handleDuplicate(resume)}
                    style={{
                      cursor: 'pointer',
                      color: '#333',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    복제
                  </span>
                  <span style={{ color: '#ddd' }}>|</span>
                  <span
                    onClick={() => handleDelete(resume)}
                    style={{
                      cursor: 'pointer',
                      color: '#333',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    삭제
                  </span>
                  <span style={{ color: '#ddd' }}>|</span>
                  <span
                    onClick={() => handleExportPDF(resume)}
                    style={{
                      cursor: 'pointer',
                      color: '#333',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    PDF 내보내기
                  </span>
                  <span style={{ color: '#ddd' }}>|</span>
                  <span
                    onClick={() => handleCopyURL(resume)}
                    style={{
                      cursor: 'pointer',
                      color: '#333',
                      textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  >
                    URL 공유하기
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerHome;

