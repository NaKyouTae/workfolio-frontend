import React, { useState } from 'react';
import { ResumeDetail } from '@/generated/common';
import { isLoggedIn } from '@/utils/authUtils';
import LoginModal from '@/components/portal/ui/LoginModal';
import SidebarListSkeleton from '@/components/portal/ui/skeleton/SidebarListSkeleton';
import { KakaoAdfitBanner } from '../../ui/KakaoAdfitBanner';

const NEXT_PUBLIC_KAKAO_ADFIT_CAREERS_KEY = process.env.NEXT_PUBLIC_KAKAO_ADFIT_CAREERS_KEY;

interface CareerSidebarProps {
  resumeDetails: ResumeDetail[];
  selectedResumeDetail: ResumeDetail | null;
  onResumeSelect: (resume: ResumeDetail) => void; 
  onResumeCreated: () => void;
  onGoHome: () => void;
  isLoading?: boolean;
}

const CareerSidebar: React.FC<CareerSidebarProps> = ({ resumeDetails, selectedResumeDetail, onResumeSelect, onResumeCreated, onGoHome, isLoading = false }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const handleResumeCreated = () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
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
            {isLoading ? (
              <SidebarListSkeleton count={3} />
            ) : (
              sortedResumes.map((resumeDetail) => {
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
              })
            )}
          </ul>
        </div>
      </div>
      <div>
        <KakaoAdfitBanner unit={NEXT_PUBLIC_KAKAO_ADFIT_CAREERS_KEY || ''} width={250} height={250} disabled={false} />
      </div>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </aside>
  );
};

export default CareerSidebar;
