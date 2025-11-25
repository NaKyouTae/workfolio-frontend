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

  // 정렬된 이력서 목록
  const sortedResumes = [...resumeDetails].sort((a, b) => {
    // 대표 이력서(isDefault가 true)는 항상 첫 번째로
    if (a.isDefault && !b.isDefault) return -1;
    
    return (a.createdAt || 0) - (b.createdAt || 0);
  });

  return (
    <aside> 
      <div className="aside-button">
          <button className="md" onClick={handleResumeCreated}>신규 이력 추가</button>
      </div>
      {/* 이력서 섹션 */}
      <div className="aside-cont">
        <div 
          className={`aside-home ${!selectedResumeDetail ? 'active' : ''}`}
          onClick={onGoHome}>
            내 이력 관리
        </div>
        <div className="aside-group">
          <p className="aside-group-title">내 이력서</p>
          <ul className="aside-group-list">
            {sortedResumes.map((resumeDetail) => {
              const isSelected = selectedResumeDetail?.id === resumeDetail.id;
              return (
                <li
                  className={`${isSelected ? 'active' : ''}`}
                  key={resumeDetail.id}
                  onClick={() => onResumeSelect(resumeDetail)}
                >
                  {resumeDetail.isDefault && (
                    <span>[대표]</span>
                  )}
                  <p>{resumeDetail.title}</p>
                </li>
              );
            })}
            {/* 빈 배열일 때는 아무것도 표시하지 않음 (로딩 중 이전 데이터 유지) */}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default CareerSidebar;
