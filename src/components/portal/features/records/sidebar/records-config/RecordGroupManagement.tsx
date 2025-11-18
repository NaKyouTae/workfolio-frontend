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
import { useConfirm } from '@/hooks/useConfirm';
import { useRecordGroups } from '@/hooks/useRecordGroups';

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

// 기록장 아이템 액션 버튼 컴포넌트
interface RecordGroupItemActionsProps {
    group: RecordGroup;
    sharedRecordGroups: RecordGroup[];
    user: { id: string } | null;
    onGroupSettingsClick?: (group: RecordGroup) => void;
    onLeave: (recordGroupId: string) => void;
    onDelete: (recordGroupId: string) => void;
}

const RecordGroupItemActions: React.FC<RecordGroupItemActionsProps> = ({
    group,
    sharedRecordGroups,
    user,
    onGroupSettingsClick,
    onLeave,
    onDelete,
}) => {
    const isPrivate = compareEnumValue(group.type, RecordGroup_RecordGroupType.PRIVATE, RecordGroup_RecordGroupType);
    const isShared = compareEnumValue(group.type, RecordGroup_RecordGroupType.SHARED, RecordGroup_RecordGroupType);
    
    // 개인 기록장: 설정, 삭제 필수
    if (isPrivate) {
        return (
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
                <a 
                    href="#" 
                    style={{ color: '#666', cursor: 'pointer' }}
                    onClick={(e) => {
                        e.preventDefault();
                        if (group.id) {
                            onDelete(group.id);
                        }
                    }}
                >
                    삭제
                </a>
            </>
        );
    }
    
    // 공유 기록장
    if (isShared) {
        // 관리자 여부 확인 (ownedRecordGroups에 있으면 관리자)
        const isAdmin = sharedRecordGroups.some((sharedGroup: RecordGroup) => sharedGroup.worker?.id === user?.id);
        
        if (isAdmin) {
            // 관리자: 설정, 삭제
            return (
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
                    <a 
                        href="#" 
                        style={{ color: '#666', cursor: 'pointer' }}
                        onClick={(e) => {
                            e.preventDefault();
                            if (group.id) {
                                onDelete(group.id);
                            }
                        }}
                    >
                        삭제
                    </a>
                </>
            );
        } else {
            // 관리자 아님: 탈퇴만
            return (
                <a 
                    href="#" 
                    style={{ color: '#666', cursor: 'pointer' }}
                    onClick={(e) => {
                        e.preventDefault();
                        if (group.id && user?.id) {
                            onLeave(group.id);
                        }
                    }}
                >
                    탈퇴
                </a>
            );
        }
    }
    
    return null;
};

const RecordGroupManagement: React.FC<RecordGroupManagementProps> = ({ 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    recordGroupsData, 
    onGroupSettingsClick 
}) => {
    // recordGroupsData는 하위 호환성을 위해 유지하지만 사용하지 않음 (useRecordGroups 훅 사용)
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
    const { confirm } = useConfirm();
    const { leaveRecordGroup, deleteRecordGroup } = useRecordGroups();
    
    // 기록장 탈퇴 핸들러
    const handleLeave = useCallback(async (recordGroupId: string) => {
        if (!user?.id) {
            alert('사용자 정보를 찾을 수 없습니다.');
            return;
        }
        
        const confirmed = await confirm({
            title: '기록장 탈퇴',
            icon: '/assets/img/ico/ic-warning.svg',
            description: '기록장에서 탈퇴하면 더 이상 공유 기록장에 있는 기록을 볼 수 없어요.',
            confirmText: '확인',
            cancelText: '취소',
        });
        
        if (!confirmed) {
            return;
        }
        
        const success = await leaveRecordGroup(recordGroupId, user.id);
        
        if (success) {
            alert('기록장에서 탈퇴했습니다.');
        } else {
            alert('탈퇴에 실패했습니다. 다시 시도해주세요.');
        }
    }, [user?.id, leaveRecordGroup, confirm]);

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
            alert('기록장이 삭제되었습니다.');
        } else {
            alert('삭제에 실패했습니다. 다시 시도해주세요.');
        }
    }, [deleteRecordGroup, confirm]);
    
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
                                    <RecordGroupItemActions
                                        group={group}
                                        sharedRecordGroups={sharedRecordGroups}
                                        user={user}
                                        onGroupSettingsClick={onGroupSettingsClick}
                                        onLeave={handleLeave}
                                        onDelete={handleDelete}
                                    />
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
