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
    <aside> 
      <div className="aside-button">
          <button className="md" onClick={handleResumeCreated}>신규 이력 추가</button>
      </div>
      {/* 이력서 섹션 */}
      <div className="aside-cont">
        <div 
          className={`career-home ${!selectedResumeDetail ? 'active' : ''}`}
          onClick={onGoHome}>
            내 이력 관리
        </div>
        <div className="career-group">
          <p className="career-group-title">내 이력서</p>
          <ul className="career-group-list">
            {resumeDetails.length > 0 ? (
              <>
                {resumeDetails.map((resumeDetail) => {
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
              </>
            ) : (
              <li>
                <div className="empty">아직 등록된 이력서가 없어요.</div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default CareerSidebar;
