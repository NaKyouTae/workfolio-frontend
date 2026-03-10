'use client';

import React, { useState, useMemo } from 'react';
import { useNotices, Notice } from '@/hooks/useNotices';
import { useUnreadNotices } from '@/hooks/useUnreadNotices';
import ExpandableCard from '@workfolio/shared/ui/ExpandableCard';
import Pagination from '@workfolio/shared/ui/Pagination';
import DateUtil from '@workfolio/shared/utils/DateUtil';

import Image from 'next/image';

interface NoticesProps {
  onNoticeClick?: (notice: Notice) => void;
}

const Notices: React.FC<NoticesProps> = ({ onNoticeClick }) => {
  const { notices } = useNotices();
  const { markAsRead } = useUnreadNotices();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 페이지네이션 계산
  const paginatedNotices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return notices.slice(startIndex, endIndex);
  }, [notices, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(notices.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 스크롤을 맨 위로
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // if (isLoading) {
  //   return (
  //     <div className={styles.container}>
  //       <LoadingScreen />
  //     </div>
  //   );
  // }

  return (
    <>
        <div className="page-title">
            <div>
                <h2>공지사항</h2>
            </div>
        </div>
        <div className="page-cont">
            <div className="cont-box">
                <div className="cont-tit">
                    <div>
                        <p>총 <span>{notices.length}</span>개</p>
                    </div>
                </div>
            </div>
            <ul className="notice-list">
                {paginatedNotices.length === 0 ? (
                    <li className="empty-cont">
                        <Image
                            src="/assets/img/ico/ic-empty.svg"
                            alt="empty"
                            width={1}
                            height={1}
                        />
                        <div>
                            <p>등록된 공지사항이 없습니다.</p>
                            <span>새로운 소식이 생기면 이곳에 안내드릴게요.</span>
                        </div>
                    </li>
                ) : (
                paginatedNotices.map((notice) => (
                    <ExpandableCard
                        key={notice.id}
                        title={notice.title}
                        date={DateUtil.formatTimestamp(notice.createdAt)}
                        badge={{
                            text: notice.isImportant ? '중요' : '일반',
                            variant: notice.isImportant ? 'red' : 'gray',
                        }}
                        content={
                            <>
                                {notice.content}
                            </>
                        }
                        onToggle={(expanded) => {
                            if (expanded) {
                                markAsRead(notice.id);
                                if (onNoticeClick) {
                                    onNoticeClick(notice);
                                }
                            }
                        }}
                    />
                ))
                )}
            </ul>

            {notices.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            )}

            {notices.length === 0 && (
                <div className="cont-box" style={{ marginTop: '2.4rem' }}>
                    <div className="cont-tit">
                        <div>
                            <h3>워크폴리오 서비스 안내</h3>
                        </div>
                    </div>
                    <ul className="service-guide-cards">
                        <li>
                            <strong>업무 기록 관리</strong>
                            <p>매일의 업무를 체계적으로 기록하고 관리하세요. 시간 단위, 일 단위, 프로젝트 단위로 다양하게 기록할 수 있습니다.</p>
                        </li>
                        <li>
                            <strong>기업 유형별 이력서</strong>
                            <p>스타트업, 중견기업, 공기업, 대기업 등 지원하는 기업에 맞는 이력서를 자동으로 생성할 수 있습니다.</p>
                        </li>
                        <li>
                            <strong>커리어 성장 추적</strong>
                            <p>쌓아둔 기록을 바탕으로 나의 커리어 성장을 시각적으로 확인하고 다음 단계를 준비하세요.</p>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    </>
  );
};

export default Notices;

