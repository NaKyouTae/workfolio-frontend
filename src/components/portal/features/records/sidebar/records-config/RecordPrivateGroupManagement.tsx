import React, { useEffect, useState, useMemo, useCallback } from 'react';
import '@/styles/records-config.css';
import { RecordGroup, RecordGroup_RecordGroupType } from '@/generated/common';
import { compareEnumValue } from '@/utils/commonUtils';
import DraggableList from '@/components/portal/ui/DraggableList';
import DraggableItem from '@/components/portal/ui/DraggableItem';
import { useUserStore } from '@/store/userStore';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import { useShallow } from 'zustand/react/shallow';
import { useConfirm } from '@/hooks/useConfirm';
import { useRecordGroups } from '@/hooks/useRecordGroups';
import { useNotification } from '@/hooks/useNotification';

interface RecordPrivateGroupManagementProps {
    onGroupSettingsClick?: (group: RecordGroup) => void;
}

const RecordPrivateGroupManagement: React.FC<RecordPrivateGroupManagementProps> = ({ 
    onGroupSettingsClick 
}) => {
    const [selectedRecordGroup, setSelectedRecordGroup] = useState<RecordGroup | null>(null);
    
    const { ownedRecordGroups, setOwnedRecordGroups } = useRecordGroupStore(
        useShallow((state) => ({
            ownedRecordGroups: state.ownedRecordGroups,
            setOwnedRecordGroups: state.setOwnedRecordGroups,
        }))
    );
    
    // allRecordGroups 자동 계산
    const allRecordGroups = useMemo(() => {
        return [...ownedRecordGroups];
    }, [ownedRecordGroups]);
    
    const { user } = useUserStore();
    const { confirm } = useConfirm();
    const { deleteRecordGroup, updatePriorities } = useRecordGroups();
    const { showNotification } = useNotification();

    // 기록장 삭제 핸들러
    const handleDelete = useCallback(async (recordGroupId: string) => {
        const confirmed = await confirm({
            title: '기록장 삭제',
            icon: '/assets/img/ico/ic-delete.svg',
            description: '기록장을 삭제하면 기록장에 있는 모든 기록이 삭제돼요.',
            confirmText: '삭제하기',
            cancelText: '취소',
        });
        
        if (!confirmed) {
            return;
        }
        
        const success = await deleteRecordGroup(recordGroupId);
        
        if (success) {
            showNotification('기록장이 삭제되었습니다.', 'success');
        } else {
            showNotification('삭제에 실패했습니다. 다시 시도해주세요.', 'error');
        }
    }, [deleteRecordGroup, confirm, showNotification]);
    
    // 첫 렌더링 시 첫 번째 레코드 그룹 선택
    useEffect(() => {
        if (allRecordGroups.length > 0 && !selectedRecordGroup) {
            setSelectedRecordGroup(allRecordGroups[0]);
        }
    }, [allRecordGroups, selectedRecordGroup]);

    // 드래그로 순서 변경 핸들러
    const handleReorder = useCallback(async (reorderedGroups: RecordGroup[]) => {
        // 로컬 상태 먼저 업데이트 (낙관적 업데이트)
        setOwnedRecordGroups(reorderedGroups);
        
        // API 호출하여 서버에 순서 반영
        const success = await updatePriorities(RecordGroup_RecordGroupType.PRIVATE, reorderedGroups);
        
        if (!success) {
            // 실패 시 원래 순서로 복구하기 위해 목록 새로고침
            showNotification('우선순위 업데이트에 실패했습니다. 다시 시도해주세요.', 'error');
            // refreshRecordGroups는 updatePriorities 내부에서 이미 호출됨
        }
    }, [updatePriorities, setOwnedRecordGroups, showNotification]);

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
            return '';
        } else if (compareEnumValue(group.type, RecordGroup_RecordGroupType.SHARED, RecordGroup_RecordGroupType)) {
            // 공유 기록장인 경우, ownedRecordGroups에 있으면 관리자, sharedRecordGroups에 있으면 멤버
            const isMaster = user?.id === group.worker?.id;
            return `${isMaster ? '관리자' : '멤버'}`;
        }
        return '';
    };

    return (
        <div className="cont-box">
            <div className="cont-tit">
                <div>
                    <h3>내 기록장 목록</h3>
                    <p>{allRecordGroups.length}개</p>
                </div>
                <button><i className="ic-add" />추가</button>
            </div>
            <DraggableList
                items={allRecordGroups}
                onReorder={handleReorder}
                getItemId={(group, idx) => group.id || `record-group-${idx}`}
                renderItem={(group, index) => (
                    <DraggableItem 
                        id={group.id || `record-group-${index}`}
                        showDragButton={true}
                    >
                        <div className="list">
                            <div>
                                <span style={{ backgroundColor: group.color || '#ccc' }}></span>
                                <h4>{getRecordGroupTitle(group)}</h4>
                                <p>{getRecordGroupTypeLabel(group)}</p>
                            </div>
                            <ul>
                                <li
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (onGroupSettingsClick) {
                                            onGroupSettingsClick(group);
                                        }
                                    }}
                                >
                                    설정
                                </li>
                                <li
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (group.id) {
                                            handleDelete(group.id);
                                        }
                                    }}
                                >
                                    삭제
                                </li>
                            </ul>
                        </div>
                    </DraggableItem>
                )}
            />
        </div>
    );
};

export default RecordPrivateGroupManagement;
