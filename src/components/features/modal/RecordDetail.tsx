import React, { useEffect, useRef } from 'react'
import { Record } from '@/generated/common'
import dayjs from 'dayjs'
import styles from './RecordDetail.module.css'

interface RecordDetailProps {
    isOpen: boolean;
    onClose: () => void;
    record: Record | null;
    onEdit?: () => void;
    onDelete?: () => void;
    position?: {
        top: number;
        left: number;
        width: number;
    };
}

const RecordDetail: React.FC<RecordDetailProps> = ({ 
    isOpen, 
    onClose, 
    record, 
    onEdit, 
    onDelete,
    position
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !record) return null;

    // 날짜 포맷팅
    const formatDateTime = (timestamp: number) => {
        return dayjs(parseInt(timestamp.toString())).format('YYYY. MM. DD. A hh:mm');
    };

    // 시작일과 종료일이 같은지 확인
    const isSameDay = () => {
        if (!record.startedAt || !record.endedAt) return false;
        const startDate = dayjs(parseInt(record.startedAt.toString()));
        const endDate = dayjs(parseInt(record.endedAt.toString()));
        return startDate.isSame(endDate, 'day');
    };

    // 시간 범위 포맷팅
    const getTimeRange = () => {
        if (!record.startedAt || !record.endedAt) return '';
        
        const endDate = dayjs(parseInt(record.endedAt.toString()));
        
        if (isSameDay()) {
            return `${formatDateTime(record.startedAt)} ~ ${endDate.format('A hh:mm')}`;
        } else {
            return `${formatDateTime(record.startedAt)} ~ ${formatDateTime(record.endedAt)}`;
        }
    };

    return (
        <div className={styles.overlay}>
            <div 
                ref={containerRef}
                className={styles.container} 
                style={position ? {
                    position: 'absolute',
                    top: position.top,
                    left: position.left,
                    width: position.width,
                    zIndex: 1000
                } : {}}
            >
                {/* 연결선 */}
                <div className={styles.connector}></div>
                {/* 헤더 */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.colorBar} style={{ backgroundColor: record.recordGroup?.color || '#e0e0e0' }}></div>
                        <h2 className={styles.title}>{record.title}</h2>
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                {/* 내용 */}
                <div className={styles.content}>
                    {/* 일시 */}
                    <div className={styles.section}>
                        <div className={styles.label}>일시</div>
                        <div className={styles.value}>{getTimeRange()}</div>
                    </div>

                    {/* 메모 */}
                    {record.description && (
                        <div className={styles.section}>
                            <div className={styles.label}>메모</div>
                            <div className={styles.value}>
                                {record.description.split('\n').map((line, index) => (
                                    <div key={index}>{line}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 첨부파일 - Record 타입에 attachments가 없으므로 제거 */}

                    {/* 기록장 정보 */}
                    {record.recordGroup && (
                        <div className={styles.section}>
                            <div className={styles.label}>기록장</div>
                            <div className={styles.value}>
                                <div className={styles.recordGroup}>
                                    <div 
                                        className={styles.recordGroupColor} 
                                        style={{ backgroundColor: record.recordGroup.color || '#e0e0e0' }}
                                    ></div>
                                    {record.recordGroup.title}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 액션 버튼들 */}
                <div className={styles.actions}>
                    <button className={styles.editButton} onClick={onEdit}>
                        수정
                    </button>
                    <button className={styles.deleteButton} onClick={onDelete}>
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecordDetail;