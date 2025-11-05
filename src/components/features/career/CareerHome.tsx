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
    <section>
      <div className="contents">
        <div className="page-title">
          <h2>내 이력 관리</h2>
        </div>
        <div className="page-cont">
          <div className="cont-box">
            <div className="cont-tit">
              <div>
                <h3>내 이력 현황</h3>
              </div>
            </div>
            <ul className="stats-summary">
              <li>
                <p>전체 이력서</p>
                <div>{resumeDetails.length}<span>개</span></div>
              </li>
              <li>
                <p>PDF 변환 이력서</p>
                <div>0<span>개</span></div>
              </li>
              <li>
                <p>URL 공유 이력서</p>
                <div>0<span>개</span></div>
              </li>
            </ul>
          </div>
          <div className="cont-box">
            <div className="cont-tit">
              <div>
                <h3>전체 이력서</h3>
                <p>{resumeDetails.length}개</p>
              </div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'recent' | 'oldest')}
              >
                <option value="recent">최근 수정일 순</option>
                <option value="oldest">오래된 순</option>
              </select>
            </div>
            <ul className="summary-list">
              {sortedResumes.map((resume) => (
                <li key={resume.id}>
                  <div className="info">
                    <div>
                      <div>
                        <input type="radio" name="default" id={`resume-${resume.id}`} checked={resume.isDefault} /><label htmlFor="resume1"></label>
                        <p>{resume.title}</p>
                      </div>
                      <ul>
                        <li onClick={() => handleEdit(resume)}>편집</li>
                        <li onClick={() => handleDuplicate(resume)}>복제</li>
                        <li onClick={() => handleDelete(resume)}>삭제</li>
                        <li className="font-bl" onClick={() => handleExportPDF(resume)}>PDF 내보내기</li>
                        <li className="font-bl" onClick={() => handleCopyURL(resume)}>URL 공유하기</li>
                      </ul>
                    </div>
                    <ul>
                      <li>{resume.job || '직무'}</li>
                      <li>{calculateTotalCareer(resume) || '경력 없음'}</li>
                    </ul>
                  </div>
                  <div className="desc">
                    <p>최종 수정일 : {DateUtil.formatTimestamp(resume.updatedAt || 0, 'YYYY. MM. DD.')}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerHome;

