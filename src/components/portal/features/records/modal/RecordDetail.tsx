import React, { useEffect, useRef } from 'react'
import { Record } from '@/generated/common'
import dayjs from 'dayjs'
import { DateUtil } from '@/utils/DateUtil';

interface RecordDetailProps {
    isOpen: boolean;
    onClose: () => void;
    record: Record | null;
    onEdit?: () => void;
    onDelete?: () => void;
    position?: {
        top: number;
        left?: number;
        right?: number;
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
    const format = 'YYYY. MM. DD. A hh:mm';
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

    // 시작일과 종료일이 같은지 확인
    const isSameDay = () => {
        if (!record.startedAt || !record.endedAt) return false;
        const startDate = dayjs(record.startedAt);
        const endDate = dayjs(record.endedAt);
        return startDate.isSame(endDate, 'day');
    };

    // 시간 범위 포맷팅
    const getTimeRange = () => {
        if (!record.startedAt || !record.endedAt) return '';
        
        if (isSameDay()) {
            return `${DateUtil.formatTimestamp(record.startedAt, format)} ~ ${DateUtil.formatTimestamp(record.endedAt, format)}`;
        } else {
            return `${DateUtil.formatTimestamp(record.startedAt, format)} ~ ${DateUtil.formatTimestamp(record.endedAt, format)}`;
        }
    };

    // 설명 텍스트를 줄바꿈으로 분리하여 렌더링
    const renderDescription = () => {
        if (!record.description) return null;
        
        return record.description.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                {index < record.description.split('\n').length - 1 && <br />}
            </span>
        ));
    };

    return (
        <div 
            className="record-modal-wrap"
            ref={containerRef}
            style={position ? {
                top: position.top,
                ...(position.left !== undefined && { left: position.left }),
                ...(position.right !== undefined && { right: position.right }),
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
                                {renderDescription()}
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
                <button className="xsm semi-gray" onClick={onDelete}>삭제</button>
            </div>
        </div>
    );
};

export default RecordDetail;