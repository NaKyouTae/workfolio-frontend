import React, { useEffect, useState, useCallback } from 'react';
import '@workfolio/shared/styles/records-config.css';
import { RecordGroup, RecordGroup_RecordGroupType } from '@workfolio/shared/generated/common';
import { compareEnumValue } from '@workfolio/shared/utils/commonUtils';
import DraggableList from '@workfolio/shared/ui/DraggableList';
import DraggableItem from '@workfolio/shared/ui/DraggableItem';
import { useRecordGroupStore } from '@workfolio/shared/store/recordGroupStore';
import { useShallow } from 'zustand/react/shallow';
import { useConfirm } from '@workfolio/shared/hooks/useConfirm';
import { useRecordGroups } from '@/hooks/useRecordGroups';
import { useNotification } from '@workfolio/shared/hooks/useNotification';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import LoginModal from '@workfolio/shared/ui/LoginModal';

interface RecordSharedGroupManagementProps {
    onGroupSettingsClick?: (group: RecordGroup) => void;
    userId: string;
    onCreateGroup?: () => void;
}

const RecordSharedGroupManagement: React.FC<RecordSharedGroupManagementProps> = ({ 
    onGroupSettingsClick,
    userId,
    onCreateGroup,
}) => {
    const [selectedRecordGroup, setSelectedRecordGroup] = useState<RecordGroup | null>(null);
    
    const { sharedRecordGroups, setSharedRecordGroups } = useRecordGroupStore(
        useShallow((state) => ({
            sharedRecordGroups: state.sharedRecordGroups,
            setSharedRecordGroups: state.setSharedRecordGroups,
        }))
    );

    const { confirm } = useConfirm();
    const { deleteRecordGroup, updateSharedPriorities } = useRecordGroups();
    const { showNotification } = useNotification();
    const [showLoginModal, setShowLoginModal] = useState(false);

    // 기록장 삭제 핸들러
    const handleDelete = useCallback(async (recordGroupId: string) => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            return;
        }
        
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
        if (sharedRecordGroups.length > 0 && !selectedRecordGroup) {
            setSelectedRecordGroup(sharedRecordGroups[0]);
        }
    }, [sharedRecordGroups, selectedRecordGroup]);

    // 드래그로 순서 변경 핸들러
    const handleReorder = useCallback(async (reorderedGroups: RecordGroup[]) => {
        // 로컬 상태 먼저 업데이트 (낙관적 업데이트)
        setSharedRecordGroups(reorderedGroups);
        
        // API 호출하여 서버에 순서 반영 (공유 기록장 전용 API 사용)
        const success = await updateSharedPriorities(reorderedGroups);
        
        if (!success) {
            // 실패 시 원래 순서로 복구하기 위해 목록 새로고침
            showNotification('우선순위 업데이트에 실패했습니다. 다시 시도해주세요.', 'error');
            // refreshRecordGroups는 updateSharedPriorities 내부에서 이미 호출됨
        }
    }, [updateSharedPriorities, setSharedRecordGroups, showNotification]);

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
            const isAdmin = group.worker?.id === userId;
            return `${isAdmin ? '관리자' : '멤버'}`;
        }
        return '';
    };

    return (
        <div className="cont-box">
            <div className="cont-tit">
                <div>
                    <h3>공유 기록장 목록</h3>
                    <p>{sharedRecordGroups.length}개</p>
                </div>
                <button onClick={() => {
                    if (onCreateGroup) {
                        onCreateGroup();
                    }
                }}><i className="ic-add" />추가</button>
            </div>
            <DraggableList
                items={sharedRecordGroups}
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
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
};

export default RecordSharedGroupManagement;
