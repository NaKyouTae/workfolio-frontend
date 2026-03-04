import React from 'react';
import Image from 'next/image';

interface EmptyStateProps {
  text: string;
  noBorder?: boolean;
  centerVertically?: boolean;
}

/**
 * 데이터가 없을 때 표시하는 Empty State 컴포넌트
 */
const EmptyState: React.FC<EmptyStateProps> = ({ text, noBorder, centerVertically }) => {
    const style: React.CSSProperties = {
        ...(noBorder && { border: 'none' }),
        ...(centerVertically && { flex: 1, justifyContent: 'center' }),
    };
    return (
        <div className="empty-cont" style={Object.keys(style).length > 0 ? style : undefined}>
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

