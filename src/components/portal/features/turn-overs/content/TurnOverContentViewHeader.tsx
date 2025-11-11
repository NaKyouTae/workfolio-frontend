import React from 'react';
import DateUtil from '@/utils/DateUtil';

interface TurnOverContentViewHeaderProps {
  title: string;
  updatedAt: number;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

const TurnOverContentViewHeader: React.FC<TurnOverContentViewHeaderProps> = ({ 
  title, 
  updatedAt, 
  onEdit, 
  onDuplicate, 
  onDelete 
}) => {
  return (
    <div className="page-title">
        <div>
            <h2>{title}</h2>
            <p>최종 수정일 : {DateUtil.formatTimestamp(updatedAt, 'YYYY. MM. DD. HH:mm')}</p>
        </div>
        <ul>
            {onEdit && (
                <li onClick={onEdit}>편집</li>
            )}
            {onDuplicate && (
                <li onClick={onDuplicate}>복제</li>
            )}
            {onDelete && (
                <li onClick={onDelete}>삭제</li>
            )}
        </ul>
    </div>
  );
};

export default TurnOverContentViewHeader;

