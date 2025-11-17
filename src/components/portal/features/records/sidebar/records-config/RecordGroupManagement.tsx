import React, { useEffect, useState, useMemo, useCallback } from 'react';
import '@/styles/records-config.css';
import { RecordGroupDetailResponse } from '@/generated/record_group';
import { RecordGroup, RecordGroup_RecordGroupType } from '@/generated/common';
import { compareEnumValue } from '@/utils/commonUtils';
import DraggableList from '@/components/portal/ui/DraggableList';
import DraggableItem from '@/components/portal/ui/DraggableItem';
import { useUserStore } from '@/store/userStore';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import { useShallow } from 'zustand/react/shallow';
import HttpMethod from '@/enums/HttpMethod';
import { useConfirm } from '@/hooks/useConfirm';

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

// worker-record-groups 삭제 API 호출 함수 (공통으로 사용)
export const handleLeaveRecordGroup = async (
    recordGroupId: string,
    targetWorkerId: string
): Promise<boolean> => {
    try {
        const response = await fetch(
            `/api/worker-record-groups?recordGroupId=${recordGroupId}&targetWorkerId=${targetWorkerId}`,
            {
                method: HttpMethod.DELETE,
            }
        );

        if (response.ok) {
            console.log('기록장 탈퇴 성공');
            return true;
        } else {
            const errorData = await response.json();
            console.error('기록장 탈퇴 실패:', errorData);
            return false;
        }
    } catch (error) {
        console.error('Error leaving record group:', error);
        return false;
    }
};

const RecordGroupManagement: React.FC<RecordGroupManagementProps> = ({ recordGroupsData, onGroupSettingsClick }) => {
    const [selectedRecordGroup, setSelectedRecordGroup] = useState<RecordGroup | null>(null);
    
    // Zustand store에서 직접 구독하여 자동 갱신
    const { ownedRecordGroups, sharedRecordGroups } = useRecordGroupStore(
        useShallow((state) => ({
            ownedRecordGroups: state.ownedRecordGroups,
            sharedRecordGroups: state.sharedRecordGroups,
        }))
    );
    
    // allRecordGroups 자동 계산
    const allRecordGroups = useMemo(() => {
        return [...ownedRecordGroups, ...sharedRecordGroups];
    }, [ownedRecordGroups, sharedRecordGroups]);
    
    const { user } = useUserStore();
    const { refreshRecordGroups } = recordGroupsData;
    const { confirm } = useConfirm();
    
    // 기록장 탈퇴 핸들러
    const handleLeave = useCallback(async (recordGroupId: string) => {
        if (!user?.id) {
            alert('사용자 정보를 찾을 수 없습니다.');
            return;
        }
        
        const confirmed = await confirm({
            title: '기록장 탈퇴',
            description: '기록장에서 탈퇴하면 더 이상 공유 기록장에 있는 기록을 볼 수 없어요.',
            confirmText: '확인',
            cancelText: '취소',
        });
        
        if (!confirmed) {
            return;
        }
        
        const success = await handleLeaveRecordGroup(recordGroupId, user.id);
        
        if (success) {
            await refreshRecordGroups();
            alert('기록장에서 탈퇴했습니다.');
        } else {
            alert('탈퇴에 실패했습니다. 다시 시도해주세요.');
        }
    }, [user?.id, refreshRecordGroups, confirm]);
    
    // 첫 렌더링 시 첫 번째 레코드 그룹 선택
    useEffect(() => {
        if (allRecordGroups.length > 0 && !selectedRecordGroup) {
            setSelectedRecordGroup(allRecordGroups[0]);
        }
    }, [allRecordGroups, selectedRecordGroup]);

    // 드래그로 순서 변경 핸들러
    const handleReorder = () => {
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
                    <span>{allRecordGroups.length}개</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100px' }}>
                    <button>+ 추가</button>
                </div>
            </div>
            <ul className="setting-list">
                <DraggableList
                    items={allRecordGroups}
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
                                            <a 
                                                href="#" 
                                                style={{ color: '#666', cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (group.id && user?.id) {
                                                        handleLeave(group.id);
                                                    }
                                                }}
                                            >탈퇴</a>
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
