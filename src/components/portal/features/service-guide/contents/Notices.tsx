'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useNotices, Notice } from '@/hooks/useNotices';
import ExpandableCard from '@/components/portal/ui/ExpandableCard';
import Pagination from '@/components/portal/ui/Pagination';
import styles from './Notices.module.css';
import DateUtil from '@/utils/DateUtil';

import Image from 'next/image';

interface NoticesProps {
  onNoticeClick?: (notice: Notice) => void;
}

const Notices: React.FC<NoticesProps> = ({ onNoticeClick }) => {
  const { notices, isLoading } = useNotices();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 페이지네이션 계산
  const paginatedNotices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return notices.slice(startIndex, endIndex);
  }, [notices, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(notices.length / itemsPerPage);

  // 페이지 변경 시 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 변경 시 스크롤을 맨 위로
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

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
                            if (expanded && onNoticeClick) {
                            onNoticeClick(notice);
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
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            )}
        </div>
    </>
  );
};

export default Notices;

