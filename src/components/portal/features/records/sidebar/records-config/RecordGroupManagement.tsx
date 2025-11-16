import React, { useEffect, useState } from 'react';
import '@/styles/records-config.css';
import { RecordGroupDetailResponse } from '@/generated/record_group';
import { RecordGroup, RecordGroup_RecordGroupType } from '@/generated/common';
import { compareEnumValue } from '@/utils/commonUtils';
import DraggableList from '@/components/portal/ui/DraggableList';
import DraggableItem from '@/components/portal/ui/DraggableItem';
import { useUserStore } from '@/store/userStore';

interface RecordGroupManagementProps {
    recordGroupsData: {
        ownedRecordGroups: RecordGroup[];
        sharedRecordGroups: RecordGroup[];
        allRecordGroups: RecordGroup[];
        isLoading: boolean;
        refreshRecordGroups: () => void;
        fetchRecordGroupDetails: (recordGroupId: string) => Promise<RecordGroupDetailResponse | null>;
    };
    onGroupSettingsClick?: (group: RecordGroup) => void;
}

const RecordGroupManagement: React.FC<RecordGroupManagementProps> = ({ recordGroupsData, onGroupSettingsClick }) => {
    const [selectedRecordGroup, setSelectedRecordGroup] = useState<RecordGroup | null>(null);
    const [recordGroups, setRecordGroups] = useState<RecordGroup[]>([]);
    
    // props로 받은 recordGroupsData 사용
    const { allRecordGroups, sharedRecordGroups } = recordGroupsData;
    const { user } = useUserStore();
    
    // allRecordGroups가 변경되면 로컬 state 업데이트
    useEffect(() => {
        setRecordGroups(allRecordGroups);
    }, [allRecordGroups]);

    // 첫 렌더링 시 첫 번째 레코드 그룹 선택
    useEffect(() => {
        if (recordGroups.length > 0 && !selectedRecordGroup) {
            setSelectedRecordGroup(recordGroups[0]);
        }
    }, [recordGroups, selectedRecordGroup]);

    // 드래그로 순서 변경 핸들러
    const handleReorder = (reorderedGroups: RecordGroup[]) => {
        setRecordGroups(reorderedGroups);
        // TODO: API 호출하여 서버에 순서 반영
    };

    // 기록장 제목 반환 (기본 기록장 여부 포함)
    const getRecordGroupTitle = (group: RecordGroup): string => {
        if (group.isDefault) {
            return `[기본] ${group.title}`;
        }
        return group.title;
    };

    // 기록장 타입에 따른 라벨 반환
    const getRecordGroupTypeLabel = (group: RecordGroup): string => {
        if (compareEnumValue(group.type, RecordGroup_RecordGroupType.PRIVATE, RecordGroup_RecordGroupType)) {
            return '개인 기록장';
        } else if (compareEnumValue(group.type, RecordGroup_RecordGroupType.SHARED, RecordGroup_RecordGroupType)) {
            // 공유 기록장인 경우, ownedRecordGroups에 있으면 관리자, sharedRecordGroups에 있으면 멤버
            const isMaster = user?.id === group.worker?.id;
            return `공유 기록장(${isMaster ? '관리자' : '멤버'})`;
        }
        return '';
    };

    return (
        <div className="cont-box">
            <div className="cont-tit">
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <h3>기록장 목록</h3>
                    <span>{recordGroups.length}개</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100px' }}>
                    <button>+ 추가</button>
                </div>
            </div>
            <ul className="setting-list">
                <DraggableList
                    items={recordGroups}
                    onReorder={handleReorder}
                    getItemId={(group, idx) => group.id || `record-group-${idx}`}
                    renderItem={(group, index) => (
                        <DraggableItem 
                            id={group.id || `record-group-${index}`}
                            showDragButton={true}
                        >
                            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid #ccc',
                                width: '100%', borderRadius: '4px' }}>
                                <div 
                                    style={{ 
                                        width: '20px', 
                                        height: '20px', 
                                        backgroundColor: group.color || '#ccc',
                                        borderRadius: '4px',
                                        flexShrink: 0
                                    }} 
                                />
                                <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>{getRecordGroupTitle(group)}</h3>
                                <span style={{ fontSize: '14px', color: '#666' }}>{getRecordGroupTypeLabel(group)}</span>
                                <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
                                    {compareEnumValue(group.type, RecordGroup_RecordGroupType.SHARED, RecordGroup_RecordGroupType) && 
                                     sharedRecordGroups.some((sharedGroup: RecordGroup) => sharedGroup.id === group.id) ? (
                                        <>
                                            <a href="#" style={{ color: '#666' }}>탈퇴</a>
                                            {
                                                user?.id === group.worker?.id && (
                                                    <>
                                                        <span>|</span>
                                                        <a 
                                                            href="#" 
                                                            style={{ color: '#666', cursor: 'pointer' }}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                if (onGroupSettingsClick) {
                                                                    onGroupSettingsClick(group);
                                                                }
                                                            }}
                                                        >
                                                            설정
                                                        </a>
                                                        <span>|</span>
                                                        <a href="#" style={{ color: '#666' }}>삭제</a>
                                                    </>
                                                )
                                            }
                                            
                                        </>
                                    ) : (
                                        <>
                                            <a 
                                                href="#" 
                                                style={{ color: '#666', cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (onGroupSettingsClick) {
                                                        onGroupSettingsClick(group);
                                                    }
                                                }}
                                            >
                                                설정
                                            </a>
                                            <span>|</span>
                                            <a href="#" style={{ color: '#666' }}>삭제</a>
                                        </>
                                    )}
                                </div>
                            </li>
                        </DraggableItem>
                    )}
                />
            </ul>
        </div>
    );
};

export default RecordGroupManagement;
