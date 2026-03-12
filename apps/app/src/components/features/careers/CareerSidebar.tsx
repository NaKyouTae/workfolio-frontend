import React, { useState } from "react";
import { ResumeDetail } from "@workfolio/shared/generated/common";
import { isLoggedIn } from "@workfolio/shared/utils/authUtils";
import LoginModal from "@workfolio/shared/ui/LoginModal";
import GoogleAdBanner from "@/components/ads/GoogleAdBanner";

const NEXT_PUBLIC_ADSENSE_CAREERS_SLOT = process.env.NEXT_PUBLIC_ADSENSE_CAREERS_SLOT;

/** 이력서 완성도 계산 */
const calculateCompleteness = (resume: ResumeDetail): number => {
    const sections = [
        !!(resume.name && resume.name.trim()),
        !!(resume.position && resume.position.trim()),
        resume.careers.length > 0,
        resume.educations.length > 0,
        resume.projects.length > 0,
        resume.activities.length > 0,
        resume.languageSkills.length > 0,
        !!(resume.description && resume.description.trim()),
    ];
    const filledCount = sections.filter(Boolean).length;
    return Math.round((filledCount / sections.length) * 100);
};

interface CareerSidebarProps {
    resumeDetails: ResumeDetail[];
    selectedResumeDetail: ResumeDetail | null;
    onResumeSelect: (resume: ResumeDetail) => void;
    onResumeCreated: () => void;
    onGoHome: () => void;
    isLoading?: boolean;
}

const CareerSidebar: React.FC<CareerSidebarProps> = ({
    resumeDetails,
    selectedResumeDetail,
    onResumeSelect,
    onResumeCreated,
    onGoHome,
}) => {
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
                <button className="md" onClick={handleResumeCreated}>
                    신규 이력서 추가
                </button>
            </div>
            {/* 이력서 섹션 */}
            <div className="aside-cont">
                <div
                    className={`aside-home ${!selectedResumeDetail ? "active" : ""}`}
                    onClick={onGoHome}
                >
                    내 이력서
                </div>
                <div className="aside-group">
                    <p className="aside-group-title">내 이력서 <span style={{ color: 'var(--gray005)', fontWeight: 400, marginLeft: '0.4rem' }}>{resumeDetails.length}</span></p>
                    <ul className="aside-group-list">
                        {(
                            sortedResumes.map((resumeDetail) => {
                                const isSelected = selectedResumeDetail?.id === resumeDetail.id;
                                const percent = calculateCompleteness(resumeDetail);
                                return (
                                    <li
                                        className={`${isSelected ? "active" : ""}`}
                                        key={resumeDetail.id}
                                        onClick={() => onResumeSelect(resumeDetail)}
                                    >
                                        {resumeDetail.isDefault && <img src="/assets/img/ico/ic-resume-check-ov.svg" alt="대표" width={14} height={14} />}
                                        <span className="aside-progress">[{percent}%]</span>
                                        <p>{resumeDetail.title}</p>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            </div>
            {isLoggedIn() && (
                <div>
                    <GoogleAdBanner
                        slot={NEXT_PUBLIC_ADSENSE_CAREERS_SLOT || ""}
                        width={250}
                        height={250}
                    />
                </div>
            )}
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </aside>
    );
};

export default CareerSidebar;
