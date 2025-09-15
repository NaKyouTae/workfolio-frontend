import React, { useRef } from 'react';
import Image from 'next/image';
import { CreateRecordGroupRequest } from '../../../../generated/create-record-group'
import HttpMethod from "@/enums/HttpMethod"
import { RecordGroupColor } from '@/enums/RecordGroupColor';

interface RecordGroupHeaderProps {
    title: string;
    isGroupsExpanded: boolean;
    onToggleGroups: () => void;
}

const RecordGroupHeader: React.FC<RecordGroupHeaderProps> = ({
    title,
    isGroupsExpanded,
    onToggleGroups,
}) => {
    const triggerRef = useRef<HTMLDivElement>(null);

    const createRecordGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const message = CreateRecordGroupRequest.create({
            title: '[기본] 업무',
            color: RecordGroupColor.RED,
            priority: 0.1,
        });
        
        try {
            const data = await fetch('/api/record-groups', {
                method: HttpMethod.POST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        title: message.title,
                        color: message.color,
                        priority: message.priority.toString(),
                    }
                ) }
            );
            console.log('Created Group:', data);
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };
    
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
            <div ref={triggerRef}>
                <Image
                    src="/ic-add.png"
                    alt="Add groups"
                    width={14}
                    height={14}
                    onClick={createRecordGroup}
                    style={{ cursor: 'pointer' }}
                />
            </div>
        </div>
    );
};

export default RecordGroupHeader; 