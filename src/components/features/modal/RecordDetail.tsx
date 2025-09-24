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
        <div 
            className="record-modal-wrap"
            ref={containerRef}
            style={position ? {
                top: position.top,
                left: position.left,
                width: position.width,
                zIndex: 1000
            } : {}}
        >
            <div className="record-modal-tit">
                <div>
                    <div style={{ backgroundColor: record.recordGroup?.color || '#e0e0e0' }}></div>
                    <h2>{record.title}</h2>
                </div>
                <button onClick={onClose}><i className="ic-close" /></button>
            </div>
            <div className="record-modal-cont">
                <ul className="record-info">
                    <li><span>일시</span><p>{getTimeRange()}</p></li>
                    {record.description && (
                        <li>
                            <span>메모</span>
                            <p>
                                {record.description.split('\n').map((line, index) => (
                                    <div key={index}>{line}</div>
                                ))}
                            </p>
                        </li>
                    )}
                    {/* {record.recordGroup && (
                        <li>
                            <span>기록장</span>
                            <p className={styles.value}>
                                <div 
                                    style={{ backgroundColor: record.recordGroup.color || '#e0e0e0' }}
                                ></div>
                                {record.recordGroup.title}
                            </p>
                        </li>
                    )} */}
                </ul>
            </div>
            <div className="record-modal-btn">
                <button className="xsm line gray" onClick={onEdit}>수정</button>
                <button className="xsm gray" onClick={onDelete}>삭제</button>
            </div>
        </div>
    );
};

export default RecordDetail;