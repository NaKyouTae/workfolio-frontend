'use client';

import React, { useState } from 'react';
import { ListRecordResponse } from '@/generated/record';
import { Record, RecordGroup } from '@/generated/common';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import timezone from 'dayjs/plugin/timezone';
import RecordDetail from '../modal/RecordDetail';
import RecordUpdateModal from '../modal/RecordUpdateModal';
import { useConfirm } from '@/hooks/useConfirm';
import HttpMethod from '@/enums/HttpMethod';
import { formatRecordDisplayTime } from '@/utils/calendarUtils';
import { isLoggedIn } from '@/utils/authUtils';
import LoginModal from '@/components/portal/ui/LoginModal';

dayjs.locale('ko');
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Seoul');

interface RecordSearchProps {
  searchResults: ListRecordResponse | null;
  allRecordGroups: RecordGroup[];
  keyword?: string;
}

const RecordSearch: React.FC<RecordSearchProps> = ({
  searchResults,
  allRecordGroups,
  keyword = '',
}) => {
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [detailPosition, setDetailPosition] = useState<{top: number, left: number, width: number} | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { confirm } = useConfirm();

  const normalizedRecords = React.useMemo(() => {
    if (!searchResults || searchResults.records.length === 0) {
      return [];
    }

    return searchResults.records;
  }, [searchResults]);

  // searchResults가 없으면 아무것도 렌더링하지 않음
  if (!searchResults) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    const date = dayjs(timestamp);
    return date.format('MM. DD. ddd');
  };

  const formatTime = (record: Record) => {
    return formatRecordDisplayTime(record);
  };

  const getCalendarColor = (record: Record) => {
    return record.recordGroup?.color || '#e0e0e0';
  };

  const getCalendarName = (record: Record) => {
    return record.recordGroup?.title || '';
  };

  // 키워드 하이라이트 함수
  const highlightKeyword = (text: string, keyword: string) => {
    if (!keyword || !text) {
      return text;
    }

    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedKeyword})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      // 대소문자 구분 없이 비교
      if (part.toLowerCase() === keyword.toLowerCase()) {
        return (
          <span key={index} style={{ color: '#FFBB26', fontWeight: '600' }}>{part}</span>
        );
      }
      return part;
    });
  };

  const handleRecordClick = (record: Record, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRecord(record);
    
    // 클릭한 위치를 기준으로 모달 위치 계산
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDetailPosition({
      top: rect.bottom + 4,
      left: rect.left + 4,
      width: 400,
    });
    
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedRecord(null);
    setDetailPosition(null);
  };

  const handleOpenUpdateModal = () => {
    setIsDetailModalOpen(false);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedRecord(null);
  };

  const handleDeleteRecord = async () => {
    if (!selectedRecord) return;

    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }

    const confirmed = await confirm({
      title: '기록을 삭제하시겠어요?',
      icon: '/assets/img/ico/ic-delete.svg',
      description: '삭제하면 이 기록에 담긴 내용이 모두 없어져요.\n한 번 삭제하면 되돌릴 수 없어요.',
      confirmText: '삭제하기',
      cancelText: '돌아가기',
    });

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/records/${selectedRecord.id}`, {
        method: HttpMethod.DELETE,
      });

      if (response.ok) {
        handleCloseDetailModal();
        handleCloseUpdateModal();
      } else {
        console.error('Failed to delete record');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  return (
    <>
        <div className="calendar-wrap">
            <table className="list search">
                <colgroup>
                    <col style={{width: '8rem'}} />
                    <col style={{width: '8rem'}} />
                    <col style={{width: '16rem'}} />
                    <col style={{width: 'auto'}} />
                </colgroup>
                <thead>
                    <tr>
                        <th>일자</th>
                        <th>시간</th>
                        <th>캘린더</th>
                        <th>내용</th>
                    </tr>
                </thead>
                <tbody>
                    {normalizedRecords.length === 0 ? (
                    <tr>
                        <td colSpan={4}>
                            <p className="empty">앗, 검색된 결과가 없어요.</p>
                        </td>
                    </tr>
                    ) : (
                    normalizedRecords.map((record, index) => {
                        const startTimestamp = parseInt(record.startedAt.toString());
                        const startDate = dayjs(startTimestamp);
                        const isWeekend = startDate.day() === 0 || startDate.day() === 6; // 0: 일요일, 6: 토요일
                        
                        return (
                            <tr key={record.id || index}>
                                <td className={isWeekend ? 'holiday' : ''}>{formatDate(startTimestamp)}</td>
                                <td><p>{formatTime(record)}</p></td>
                                <td>
                                    <div>
                                        <div style={{ backgroundColor: getCalendarColor(record) }}></div>
                                        <p>{getCalendarName(record)}</p>
                                    </div>
                                </td>
                                <td onClick={(e) => handleRecordClick(record, e)}>
                                    <p className="text-left">{highlightKeyword(record.title, keyword)}</p>
                                </td>
                            </tr>
                        );
                    })
                    )}
                </tbody>
            </table>
        </div>

        {/* 레코드 상세 모달 */}
        <RecordDetail
            isOpen={isDetailModalOpen}
            onClose={handleCloseDetailModal}
            record={selectedRecord}
            onEdit={handleOpenUpdateModal}
            onDelete={handleDeleteRecord}
            position={detailPosition || undefined}
        />

        {/* RecordUpdateModal */}
        <RecordUpdateModal
            isOpen={isUpdateModalOpen}
            onClose={handleCloseUpdateModal}
            onDelete={handleDeleteRecord}
            record={selectedRecord}
            allRecordGroups={allRecordGroups}
        />
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default RecordSearch;

