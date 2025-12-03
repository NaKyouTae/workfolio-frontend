import React, { useState } from 'react';
import { ResumeDetail } from '@/generated/common';
import DateUtil from '@/utils/DateUtil';

import Footer from "@/components/portal/layouts/Footer"
import Dropdown from '../../ui/Dropdown';
import { isLoggedIn } from '@/utils/authUtils';
import LoginModal from '@/components/portal/ui/LoginModal';
import EmptyState from '@/components/portal/ui/EmptyState';
import SummaryListSkeleton from '@/components/portal/ui/skeleton/SummaryListSkeleton';

interface CareerIntegrationProps {
  resumeDetails: ResumeDetail[];
  onView: (resume: ResumeDetail) => void;
  onEdit: (resume: ResumeDetail) => void;
  duplicateResume: (resumeId?: string) => Promise<void>;
  deleteResume: (resumeId?: string) => Promise<void>;
  // exportPDF: (resumeId?: string) => Promise<void>;
  // copyURL: (publicId?: string) => Promise<void>;
  calculateTotalCareer: (resume: ResumeDetail) => string;
  changeDefault: (resumeId?: string) => Promise<void>;
  isLoading?: boolean;
}

const CareerIntegration: React.FC<CareerIntegrationProps> = ({
  resumeDetails,
  onView,
  onEdit,
  duplicateResume,
  deleteResume,
  // exportPDF,
  // copyURL,
  calculateTotalCareer,
  changeDefault,
  isLoading = false,
}) => {
  const [sortOrder, setSortOrder] = useState<'recent' | 'oldest'>('recent');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 이력서 상세보기
  const handleView = (resume: ResumeDetail) => {
    onView(resume);
  };

  // 이력서 편집
  const handleEdit = (e: React.MouseEvent, resume: ResumeDetail) => {
    e.stopPropagation();
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    onEdit(resume);
  };

  // 이력서 복제
  const handleDuplicate = (e: React.MouseEvent, resume: ResumeDetail) => {
    e.stopPropagation();
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    duplicateResume(resume.id);
  };

  // 이력서 삭제
  const handleDelete = (e: React.MouseEvent, resume: ResumeDetail) => {
    e.stopPropagation();
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    deleteResume(resume.id);
  };

  // // PDF 내보내기
  // const handleExportPDF = (e: React.MouseEvent, resume: ResumeDetail) => {
  //   e.stopPropagation();
  //   exportPDF(resume.id);
  // };

  // // URL 공유하기
  // const handleCopyURL = (e: React.MouseEvent, resume: ResumeDetail) => {
  //   e.stopPropagation();
  //   copyURL(resume.publicId);
  // };

  // 기본 이력서 변경
  const handleChangeDefault = (e: React.MouseEvent, resume: ResumeDetail) => {
    e.stopPropagation();
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    changeDefault(resume.id);
  };

  // 정렬된 이력서 목록
  const sortedResumes = [...resumeDetails].sort((a, b) => {
    // 대표 이력서(isDefault가 true)는 항상 첫 번째로
    if (a.isDefault && !b.isDefault) return -1;
    // if (!a.isDefault && b.isDefault) return 1;
    
    // 둘 다 대표가 아니거나 둘 다 대표인 경우 sortOrder에 따라 정렬
    if (sortOrder === 'recent') {
      // 최근 수정일 순 (updatedAt 내림차순)
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    } else {
      // 오래된 순 (createdAt 오름차순)
      return (a.createdAt || 0) - (b.createdAt || 0);
    }
  });

  // 기본 이력서 목록 표시
  return (
    <section>
        <div className="contents">
            <div className="page-title">
                <div>
                    <h2>내 이력 관리</h2>
                </div>
            </div>
            <div className="page-cont">
                <div className="cont-box">
                    <div className="cont-tit">
                        <div>
                            <h3>전체 이력서</h3>
                            <p>{resumeDetails.length}개</p>
                        </div>
                        <div>
                            <Dropdown
                                options={[
                                    { value: 'recent', label: '최근 수정일 순' },
                                    { value: 'oldest', label: '오래된 순' },
                                ]}
                                selectedOption={sortOrder}
                                setValue={(value) => setSortOrder(value as 'recent' | 'oldest')}
                            />
                        </div>
                    </div>
                    {isLoading ? (
                        <SummaryListSkeleton count={3} />
                    ) : sortedResumes.length === 0 ? (
                        <EmptyState text="등록된 이력서가 없습니다." />
                    ) : (
                        <ul className="summary-list">
                            {sortedResumes.map((resume) => (
                            <li key={resume.id} onClick={() => handleView(resume)}>
                                <div className="info">
                                    <div>
                                        <div>
                                            <input 
                                                type="radio" 
                                                name="default" 
                                                id={`resume-${resume.id}`} 
                                                checked={resume.isDefault} 
                                                readOnly 
                                                onChange={() => {}}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleChangeDefault(e, resume);
                                                }}
                                                className="input-resume"
                                            />
                                            <label 
                                                htmlFor={`resume-${resume.id}`}
                                                onClick={(e) => {
                                                e.stopPropagation();
                                                if (!isLoggedIn()) {
                                                  setShowLoginModal(true);
                                                  return;
                                                }
                                                changeDefault(resume.id);
                                                }}
                                            ></label>
                                            <p onClick={() => handleView(resume)}>{resume.title}</p>
                                        </div>
                                        <ul>
                                            <li onClick={(e) => handleEdit(e, resume)}>편집</li>
                                            <li onClick={(e) => handleDuplicate(e, resume)}>복제</li>
                                            <li onClick={(e) => handleDelete(e, resume)}>삭제</li>
                                            {/* <li className="font-black" onClick={(e) => handleExportPDF(e, resume)}>PDF 내보내기</li> */}
                                            {/* <li className="font-black" onClick={(e) => handleCopyURL(e, resume)}>URL 공유하기</li> */}
                                        </ul>
                                    </div>
                                    <ul>
                                        <li>{resume.position || '직무'}</li>
                                        <li>{calculateTotalCareer(resume) || '경력 없음'}</li>
                                    </ul>
                                </div>
                                <div className="desc">
                                    {/* <p>최종 등록일 : {DateUtil.formatTimestamp(resume.createdAt || 0, 'YYYY. MM. DD.')}</p> */}
                                    <p>최종 수정일 : {DateUtil.formatTimestamp(resume.updatedAt || 0, 'YYYY. MM. DD.')}</p>
                                </div>
                            </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
        <Footer/>
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </section>
  );
};

export default CareerIntegration;

