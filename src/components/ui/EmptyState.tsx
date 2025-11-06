import React from 'react';
import Image from 'next/image';

interface EmptyStateProps {
  text: string;
}

/**
 * 데이터가 없을 때 표시하는 Empty State 컴포넌트
 */
const EmptyState: React.FC<EmptyStateProps> = ({ text }) => {
    return (
        <div className="empty-cont">
            <Image
                src="/assets/img/ico/ic-empty.svg" 
                alt="empty" 
                width={1}
                height={1}
            />
            <div>
                <p>{text}</p>
            </div>
        </div>
    );
};

export default EmptyState;

