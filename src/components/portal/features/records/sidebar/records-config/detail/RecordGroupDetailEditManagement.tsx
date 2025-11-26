import React, { useEffect, useState, useCallback } from 'react';
import '@/styles/records-config.css';
import { RecordGroupDetailResponse, RecordGroupJoinRequest } from '@/generated/record_group';
import { RecordGroup, RecordGroup_RecordGroupRole, RecordGroup_RecordGroupType, Worker, WorkerRecordGroup, WorkerRecordGroup_RecordGroupRole } from '@/generated/common';
import { createSampleWorkers, createSampleRecordGroupDetails } from '@/utils/sampleRecordData';
import { compareEnumValue } from '@/utils/commonUtils';
import FloatingNavigation, { FloatingNavigationItem } from '@/components/portal/ui/FloatingNavigation';
import { useConfirm } from '@/hooks/useConfirm';
import { useUserStore } from '@/store/userStore';
import { useRecordGroups } from '@/hooks/useRecordGroups';
import { useNotification } from '@/hooks/useNotification';
import { isLoggedIn } from '@/utils/authUtils';
import LoginModal from '@/components/portal/ui/LoginModal';
import RecordGroupDetailForm from './RecordGroupDetailForm';

interface RecordGroupDetailEditManagementProps {
    recordGroupsData: {
        ownedRecordGroups: RecordGroup[];
        sharedRecordGroups: RecordGroup[];
        allRecordGroups: RecordGroup[];
        isLoading: boolean;
        refreshRecordGroups: () => void;
        fetchRecordGroupDetails: (recordGroupId: string) => Promise<RecordGroupDetailResponse | null>;
    };
    initialRecordGroup: RecordGroup;
    isPrivate: boolean;
    isAdmin: boolean;
    onBack?: () => void;
}

const RecordGroupDetailEditManagement: React.FC<RecordGroupDetailEditManagementProps> = ({ 
    recordGroupsData, 
    initialRecordGroup, 
    onBack, 
    isPrivate, 
    isAdmin 
}) => {
    const [selectedRecordGroup, setSelectedRecordGroup] = useState<RecordGroup | undefined>(initialRecordGroup);
    const [recordGroupDetails, setRecordGroupDetails] = useState<RecordGroupDetailResponse | undefined>(undefined);

    const [shareNickname, setShareNickname] = useState('');
    const [searchedWorkers, setSearchedWorkers] = useState<Worker[]>([]);
    const [isComposing, setIsComposing] = useState(false);
    
    const [selectedNewWorkers, setSelectedNewWorkers] = useState<WorkerRecordGroup[]>([]);
    const [selectedExistWorkers, setSelectedExistWorkers] = useState<WorkerRecordGroup[]>([]);

    const [title, setTitle] = useState(initialRecordGroup.title);
    const [color, setColor] = useState(initialRecordGroup.color);
    const [defaultRole, setDefaultRole] = useState<RecordGroup_RecordGroupRole | undefined>(initialRecordGroup.defaultRole);
    const [recordType, setRecordType] = useState<RecordGroup_RecordGroupType | undefined>(initialRecordGroup.type);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

    const { refreshRecordGroups, fetchRecordGroupDetails } = recordGroupsData;
    const { leaveRecordGroup, deleteRecordGroup } = useRecordGroups();
    const { confirm } = useConfirm();
    const { showNotification } = useNotification();
    const { user } = useUserStore();
    const [showLoginModal, setShowLoginModal] = useState(false);
    
    const navigationItems: FloatingNavigationItem[] = [
        {
            id: 'record-group-management',
            label: '기록장 관리',
        },
    ];

    // initialRecordGroup이 변경되면 selectedRecordGroup 업데이트
    useEffect(() => {
        if (initialRecordGroup) {
            if (!selectedRecordGroup || selectedRecordGroup.id !== initialRecordGroup.id) {
                setSelectedRecordGroup(initialRecordGroup);
                setTitle(initialRecordGroup.title);
                setColor(initialRecordGroup.color);
                setDefaultRole(initialRecordGroup.defaultRole);
                setRecordType(initialRecordGroup.type);
                setSelectedNewWorkers([]);
                setSelectedExistWorkers([]);
            }
        }
    }, [initialRecordGroup, selectedRecordGroup]);

    // 선택된 레코드 그룹이 변경될 때 상세 정보 조회
    useEffect(() => {
        if (selectedRecordGroup) {
            const hasToken = document.cookie.includes('accessToken=');
            
            if (!hasToken) {
                const sampleDetails = createSampleRecordGroupDetails(selectedRecordGroup);
                setRecordGroupDetails(sampleDetails);
                if (selectedExistWorkers.length === 0) {
                    setSelectedExistWorkers(sampleDetails?.workers || []);
                }
            } else {
                fetchRecordGroupDetails(selectedRecordGroup.id).then((details: RecordGroupDetailResponse | null) => {
                    setRecordGroupDetails(details || undefined);
                    if (selectedExistWorkers.length === 0) {
                        setSelectedExistWorkers(details?.workers || []);
                    }
                }).catch(error => {
                    console.error('레코드 그룹 상세 정보 조회 실패:', error);
                    const sampleDetails = createSampleRecordGroupDetails(selectedRecordGroup);
                    setRecordGroupDetails(sampleDetails);
                    if (selectedExistWorkers.length === 0) {
                        setSelectedExistWorkers(sampleDetails?.workers || []);
                    }
                });
            }
        }
    }, [selectedRecordGroup, fetchRecordGroupDetails, selectedExistWorkers.length]);

    // 닉네임으로 워커 검색 함수
    const handleSearchWorkerByNickname = useCallback(async (nickname: string) => {
        if (!nickname.trim()) {
            return [];
        }
        
        const hasToken = document.cookie.includes('accessToken=');
        
        if (!hasToken) {
            const sampleWorkers = createSampleWorkers();
            const filteredWorkers = sampleWorkers.filter(worker => 
                worker.nickName.toLowerCase().includes(nickname.toLowerCase())
            );
            
            if (filteredWorkers.length > 0) {
                setSearchedWorkers(filteredWorkers);
                return filteredWorkers;
            } else {
                setSearchedWorkers([]);
                return [];
            }
        }
        
        try {
            const response = await fetch(`/api/workers/${nickname}`, {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.workers && data.workers.length > 0) {
                    setSearchedWorkers(data.workers);
                    return data.workers;
                } else {
                    setSearchedWorkers([]);
                    return [];
                }
            } else {
                setSearchedWorkers([]);
                return [];
            }
        } catch (error) {
            console.error('워커 검색 중 에러 발생:', error);
            setSearchedWorkers([]);
            return [];
        }
    }, []);

    const handleNicknameKeyDown = useCallback(async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(shareNickname.trim() === '') {
            setSearchedWorkers([]);
            return;
        }

        if (e.key === 'Enter' && !isComposing) {
            e.preventDefault();
            await handleSearchWorkerByNickname(shareNickname);
        }
    }, [shareNickname, handleSearchWorkerByNickname, isComposing]);

    const handleCompositionStart = useCallback(() => {
        setIsComposing(true);
    }, []);

    const handleCompositionEnd = useCallback(() => {
        setIsComposing(false);
    }, []);

    // 워커의 역할 업데이트 핸들러
    const handleUpdateWorkerRole = useCallback((
        workers: WorkerRecordGroup[],
        targetWorker: WorkerRecordGroup,
        newRole: WorkerRecordGroup_RecordGroupRole,
        isNewWorker: boolean
    ): { updatedWorkers: WorkerRecordGroup[]; otherWorkersUpdated?: WorkerRecordGroup[] } => {
        if (newRole === WorkerRecordGroup_RecordGroupRole.ADMIN) {
            const defaultWorkerRole = WorkerRecordGroup_RecordGroupRole[defaultRole as unknown as keyof typeof WorkerRecordGroup_RecordGroupRole];
            
            const displayExistWorkers = selectedExistWorkers.length > 0 
                ? selectedExistWorkers 
                : (recordGroupDetails?.workers || []);
            const allWorkers = [...selectedNewWorkers, ...displayExistWorkers];
            
            const existingAdmin = allWorkers.find(w => 
                w.worker?.id !== targetWorker.worker?.id && 
                compareEnumValue(w.role, WorkerRecordGroup_RecordGroupRole.ADMIN, WorkerRecordGroup_RecordGroupRole)
            );
            
            const updatedWorkers = workers.map(w => {
                if (w.worker?.id === targetWorker.worker?.id) {
                    return { ...w, role: newRole };
                }
                if (existingAdmin && w.worker?.id === existingAdmin.worker?.id) {
                    return { ...w, role: defaultWorkerRole };
                }
                return w;
            });
            
            let otherWorkersUpdated: WorkerRecordGroup[] | undefined;
            if (existingAdmin) {
                if (isNewWorker) {
                    const otherWorkers = selectedExistWorkers.length > 0 
                        ? selectedExistWorkers 
                        : (recordGroupDetails?.workers || []);
                    const hasAdminInOther = otherWorkers.some(w => w.worker?.id === existingAdmin.worker?.id);
                    if (hasAdminInOther) {
                        otherWorkersUpdated = otherWorkers.map(w => 
                            w.worker?.id === existingAdmin.worker?.id 
                                ? { ...w, role: defaultWorkerRole }
                                : w
                        );
                    }
                } else {
                    const hasAdminInOther = selectedNewWorkers.some(w => w.worker?.id === existingAdmin.worker?.id);
                    if (hasAdminInOther) {
                        otherWorkersUpdated = selectedNewWorkers.map(w => 
                            w.worker?.id === existingAdmin.worker?.id 
                                ? { ...w, role: defaultWorkerRole }
                                : w
                        );
                    }
                }
            }
            
            return { updatedWorkers, otherWorkersUpdated };
        }
        
        const updatedWorkers = workers.map(w => 
            w.worker?.id === targetWorker.worker?.id 
                ? { ...w, role: newRole } 
                : w
        );
        return { updatedWorkers };
    }, [defaultRole, selectedNewWorkers, selectedExistWorkers, recordGroupDetails?.workers]);

    // 저장 함수
    const handleSave = useCallback(async () => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            return;
        }
        
        if (!selectedRecordGroup) {
            showNotification('저장할 기록장이 없습니다.', 'error');
            return;
        }

        const isPrivateType = compareEnumValue(recordType, RecordGroup_RecordGroupType.PRIVATE, RecordGroup_RecordGroupType);
        if (isPrivateType && initialRecordGroup && !compareEnumValue(initialRecordGroup.type, RecordGroup_RecordGroupType.PRIVATE, RecordGroup_RecordGroupType)) {
            const confirmed = await confirm({
                title: '개인 기록장으로 변경',
                icon: '/assets/img/ico/ic-warning.svg',
                description: '개인 기록장으로 변경 시 공유 멤버가 전부 사라지며 기록은 남습니다.',
                confirmText: '확인',
                cancelText: '취소',
            });
            
            if (!confirmed) {
                return;
            }
        }

        try {
            const newWorkers = isPrivateType ? [] : selectedNewWorkers.map((workerRecordGroup: WorkerRecordGroup) => {
                return {
                    workerId: workerRecordGroup.worker?.id || '',
                    role: workerRecordGroup.role as WorkerRecordGroup_RecordGroupRole,
                };
            });
            
            const existWorkers = isPrivateType ? [] : selectedExistWorkers.map((workerRecordGroup: WorkerRecordGroup) => {
                return {
                    workerId: workerRecordGroup.worker?.id || '',
                    role: workerRecordGroup.role as WorkerRecordGroup_RecordGroupRole,
                };
            });
            
            const joinRequest = RecordGroupJoinRequest.create({
                id: selectedRecordGroup.id,
                title: title,
                color: color,
                type: recordType as RecordGroup_RecordGroupType,
                defaultRole: defaultRole as RecordGroup_RecordGroupRole,
                newWorkers: newWorkers,
                existWorkers: existWorkers,
            });

            const response = await fetch(`/api/record-groups/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(joinRequest)
            });

            if (response.ok) {
                if (refreshRecordGroups) {
                    await refreshRecordGroups();
                }
                if (onBack) {
                    onBack();
                }
            } else {
                const errorData = await response.json();
                console.error('기록장 저장 실패:', errorData);
                showNotification('저장에 실패했습니다. 다시 시도해주세요.', 'error');
            }
        } catch (error) {
            console.error('Error saving record group:', error);
            showNotification('저장 중 오류가 발생했습니다.', 'error');
        }
    }, [selectedRecordGroup, title, color, recordType, defaultRole, selectedNewWorkers, selectedExistWorkers, refreshRecordGroups, onBack, confirm, showNotification, initialRecordGroup]);

    const handleLeave = useCallback(async () => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            return;
        }
        
        if (!selectedRecordGroup?.id || !user?.id) {
            showNotification('기록장 정보를 찾을 수 없습니다.', 'error');
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
        
        const success = await leaveRecordGroup(selectedRecordGroup.id, user.id);
        
        if (success) {
            if (onBack) {
                onBack();
            }
        } else {
            showNotification('탈퇴에 실패했습니다. 다시 시도해주세요.', 'error');
        }
    }, [selectedRecordGroup?.id, user?.id, confirm, leaveRecordGroup, onBack, showNotification]);

    const handleDelete = useCallback(async () => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            return;
        }
        
        if (!selectedRecordGroup?.id) {
            showNotification('기록장 정보를 찾을 수 없습니다.', 'error');
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
        
        const success = await deleteRecordGroup(selectedRecordGroup.id);
        
        if (success) {
            if (onBack) {
                onBack();
            }
        } else {
            showNotification('삭제에 실패했습니다. 다시 시도해주세요.', 'error');
        }
    }, [selectedRecordGroup?.id, confirm, deleteRecordGroup, onBack, showNotification]);

    const handleSelectColor = useCallback((color: string) => {
        setColor(color);
        setIsColorPickerOpen(false);
    }, []);

    const handleWorkerSelect = useCallback((worker: Worker) => {
        if (!selectedNewWorkers.some(w => w.worker?.id === worker.id)) {
            setSelectedNewWorkers([...selectedNewWorkers, {
                id: worker.id,
                publicId: '',
                priority: selectedNewWorkers.length + 1,
                role: WorkerRecordGroup_RecordGroupRole[defaultRole as unknown as keyof typeof WorkerRecordGroup_RecordGroupRole],
                worker: worker,
                recordGroup: selectedRecordGroup,
                createdAt: worker.createdAt,
                updatedAt: worker.updatedAt,
            }]);
        } else {
            const filtered = selectedNewWorkers.filter(w => w.worker?.id !== worker?.id);
            if (filtered.length === 1) {
                const updated = filtered.map(w => ({ ...w, role: WorkerRecordGroup_RecordGroupRole.ADMIN }));
                setSelectedNewWorkers(updated);
            } else {
                setSelectedNewWorkers(filtered);
            }
        }
        setSearchedWorkers([]);
    }, [selectedNewWorkers, defaultRole, selectedRecordGroup]);

    const handleNewWorkerRoleChange = useCallback((value: WorkerRecordGroup_RecordGroupRole, worker: WorkerRecordGroup) => {
        const result = handleUpdateWorkerRole(selectedNewWorkers, worker, value, true);
        setSelectedNewWorkers(result.updatedWorkers);
        if (result.otherWorkersUpdated) {
            setSelectedExistWorkers(result.otherWorkersUpdated);
        }
    }, [selectedNewWorkers, handleUpdateWorkerRole]);

    const handleExistWorkerRoleChange = useCallback((value: WorkerRecordGroup_RecordGroupRole, worker: WorkerRecordGroup) => {
        const currentWorkers = selectedExistWorkers.length > 0 
            ? selectedExistWorkers 
            : (recordGroupDetails?.workers || []);
        const result = handleUpdateWorkerRole(currentWorkers, worker, value, false);
        setSelectedExistWorkers(result.updatedWorkers);
        if (result.otherWorkersUpdated) {
            setSelectedNewWorkers(result.otherWorkersUpdated);
        }
    }, [selectedExistWorkers, recordGroupDetails?.workers, handleUpdateWorkerRole]);

    const handleNewWorkerRemove = useCallback((workerId: string) => {
        const filtered = selectedNewWorkers.filter(w => w.worker?.id !== workerId);
        if (filtered.length === 1) {
            const updated = filtered.map(w => ({ ...w, role: WorkerRecordGroup_RecordGroupRole.ADMIN }));
            setSelectedNewWorkers(updated);
        } else {
            setSelectedNewWorkers(filtered);
        }
    }, [selectedNewWorkers]);

    const handleExistWorkerRemove = useCallback((workerId: string) => {
        const currentWorkers = selectedExistWorkers.length > 0 
            ? selectedExistWorkers 
            : (recordGroupDetails?.workers || []);
        const filtered = currentWorkers.filter(w => w.worker?.id !== workerId);
        if (filtered.length === 1) {
            const updated = filtered.map(w => ({ ...w, role: WorkerRecordGroup_RecordGroupRole.ADMIN }));
            setSelectedExistWorkers(updated);
        } else {
            setSelectedExistWorkers(filtered);
        }
    }, [selectedExistWorkers, recordGroupDetails?.workers]);

    return (
        <div className="page-cont">
            <article>
                <div className="cont-box">
                    <div className="cont-tit" id="record-group-management">
                        <div>
                            <h3>기록장 관리</h3>
                        </div>
                    </div>
                    <RecordGroupDetailForm
                        title={title}
                        color={color}
                        recordType={recordType}
                        defaultRole={defaultRole}
                        shareNickname={shareNickname}
                        searchedWorkers={searchedWorkers}
                        selectedNewWorkers={selectedNewWorkers}
                        selectedExistWorkers={selectedExistWorkers}
                        recordGroupDetails={recordGroupDetails}
                        isPrivate={isPrivate}
                        isAdmin={isAdmin}
                        isColorPickerOpen={isColorPickerOpen}
                        initialRecordGroup={initialRecordGroup}
                        createMode={false}
                        user={user}
                        onTitleChange={setTitle}
                        onColorChange={setColor}
                        onRecordTypeChange={setRecordType}
                        onDefaultRoleChange={setDefaultRole}
                        onShareNicknameChange={setShareNickname}
                        onNicknameKeyDown={handleNicknameKeyDown}
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
                        onSearchWorker={() => handleSearchWorkerByNickname(shareNickname)}
                        onWorkerSelect={handleWorkerSelect}
                        onWorkerRoleChange={handleUpdateWorkerRole}
                        onNewWorkerRoleChange={handleNewWorkerRoleChange}
                        onExistWorkerRoleChange={handleExistWorkerRoleChange}
                        onNewWorkerRemove={handleNewWorkerRemove}
                        onExistWorkerRemove={handleExistWorkerRemove}
                        onColorPickerToggle={() => setIsColorPickerOpen(!isColorPickerOpen)}
                        onColorSelect={handleSelectColor}
                        onDelete={handleDelete}
                        onLeave={handleLeave}
                    />
                </div>
            </article>
            <FloatingNavigation
                navigationItems={navigationItems}
                onSave={isAdmin ? handleSave : undefined}
                onCancel={onBack}
                saveButtonText="저장하기"
                cancelButtonText="돌아가기"
            />
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
};

export default RecordGroupDetailEditManagement;

