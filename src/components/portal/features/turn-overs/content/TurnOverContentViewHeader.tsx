import React from 'react';
import DateUtil from '@/utils/DateUtil';
import { isLoggedIn } from '@/utils/authUtils';

interface TurnOverContentViewHeaderProps {
  title: string;
  updatedAt: number;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onShowLoginModal?: () => void;
}

const TurnOverContentViewHeader: React.FC<TurnOverContentViewHeaderProps> = ({ 
  title, 
  updatedAt, 
  onEdit, 
  onDuplicate, 
  onDelete,
  onShowLoginModal,
}) => {
  const handleEdit = () => {
    if (!isLoggedIn()) {
      onShowLoginModal?.();
      return;
    }
    onEdit?.();
  };

  return (
    <div className="page-title">
        <div>
            <h2>{title}</h2>
            <p>최종 수정일 : {DateUtil.formatTimestamp(updatedAt, 'YYYY. MM. DD. HH:mm')}</p>
        </div>
        <ul>
            {onEdit && (
                <li onClick={handleEdit}>편집</li>
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

