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
import styles from './RecordSearch.module.css';

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
          <span key={index} style={{ color: 'red' }}>
            {part}
          </span>
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
      top: rect.bottom + 10,
      left: rect.left,
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

    const confirmed = await confirm({
      title: '기록 삭제',
      description: '정말 이 기록을 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
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
      <div className={styles.searchResults}>
        <table className={styles.searchTable}>
          <thead>
            <tr>
              <th className={styles.dateColumn}>일자</th>
              <th className={styles.timeColumn}>시간</th>
              <th className={styles.calendarColumn}>캘린더</th>
              <th className={styles.contentColumn}>내용</th>
            </tr>
          </thead>
          <tbody>
            {normalizedRecords.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                  앗, 검색된 결과가 없어요.
                </td>
              </tr>
            ) : (
              normalizedRecords.map((record, index) => {
                const startTimestamp = parseInt(record.startedAt.toString());
                const startDate = dayjs(startTimestamp);
                const isWeekend = startDate.day() === 0 || startDate.day() === 6; // 0: 일요일, 6: 토요일
                
                return (
                <tr key={record.id || index} className={styles.tableRow}>
                  <td 
                    className={styles.dateCell}
                    style={isWeekend ? { color: 'red' } : {}}
                  >
                    {formatDate(startTimestamp)}
                  </td>
                  <td className={styles.timeCell}>{formatTime(record)}</td>
                  <td className={styles.calendarCell}>
                    <div
                      className={styles.calendarBar}
                      style={{ backgroundColor: getCalendarColor(record) }}
                    >
                      {getCalendarName(record)}
                    </div>
                  </td>
                  <td className={styles.contentCell}>
                    <span 
                      className={styles.contentLink}
                      onClick={(e) => handleRecordClick(record, e)}
                    >
                      {highlightKeyword(record.title, keyword)}
                    </span>
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
    </>
  );
};

export default RecordSearch;

