import React from 'react';
import Image from 'next/image';

interface RecordGroupHeaderProps {
    title: string;
    isGroupsExpanded: boolean;
    onToggleGroups: () => void;
    onOpenModal: () => void;
}

const RecordGroupHeader: React.FC<RecordGroupHeaderProps> = ({
    title,
    isGroupsExpanded,
    onToggleGroups,
    onOpenModal
}) => {
    return (
        <div className="record-group-navigation-header">
            <div className="record-group-navigation-label-container">
                <span className="record-group-navigation-label">{title}</span>
                <Image
                    src="/ic-arrow-up.png"
                    alt="Toggle groups"
                    width={14}
                    height={14}
                    onClick={onToggleGroups}
                    style={{ cursor: 'pointer' }}
                    className={`record-group-navigation-arrow ${isGroupsExpanded ? 'expanded' : ''}`}
                />
            </div>
            <div>
                <Image
                    src="/ic-add.png"
                    alt="Add groups"
                    width={14}
                    height={14}
                    onClick={onOpenModal}
                    style={{ cursor: 'pointer' }}
                />
            </div>
        </div>
    );
};

export default RecordGroupHeader; 