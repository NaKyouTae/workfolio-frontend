import React, { useState, useCallback } from 'react';
import '@workfolio/shared/styles/records-config.css';
import { RecordGroup, RecordGroup_RecordGroupRole, RecordGroup_RecordGroupType, Worker, WorkerRecordGroup, WorkerRecordGroup_RecordGroupRole } from '@workfolio/shared/generated/common';
import { createSampleWorkers } from '@/utils/sampleRecordData';
import { compareEnumValue } from '@workfolio/shared/utils/commonUtils';
import FloatingNavigation, { FloatingNavigationItem } from '@workfolio/shared/ui/FloatingNavigation';
import { useNotification } from '@workfolio/shared/hooks/useNotification';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import LoginModal from '@workfolio/shared/ui/LoginModal';
import RecordGroupDetailForm from './RecordGroupDetailForm';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';
import { RecordGroupDetailResponse } from '@workfolio/shared/generated/record_group';

interface RecordGroupDetailCreateManagementProps {
    recordGroupsData: {
        ownedRecordGroups: RecordGroup[];
        sharedRecordGroups: RecordGroup[];
        allRecordGroups: RecordGroup[];
        isLoading: boolean;
        refreshRecordGroups: () => void;
        fetchRecordGroupDetails: (recordGroupId: string) => Promise<RecordGroupDetailResponse | null>;
    };
    isPrivate: boolean;
    createType: RecordGroup_RecordGroupType;
    onBack?: () => void;
}

const RecordGroupDetailCreateManagement: React.FC<RecordGroupDetailCreateManagementProps> = ({ 
    recordGroupsData, 
    isPrivate,
    createType,
    onBack
}) => {
    const [shareNickname, setShareNickname] = useState('');
    const [searchedWorkers, setSearchedWorkers] = useState<Worker[]>([]);
    const [isComposing, setIsComposing] = useState(false);
    
    const [selectedNewWorkers, setSelectedNewWorkers] = useState<WorkerRecordGroup[]>([]);
    const [selectedExistWorkers] = useState<WorkerRecordGroup[]>([]);

    const [title, setTitle] = useState('');
    const [color, setColor] = useState('#F15B50');
    const [defaultRole, setDefaultRole] = useState<RecordGroup_RecordGroupRole>(RecordGroup_RecordGroupRole.FULL);
    const [recordType, setRecordType] = useState<RecordGroup_RecordGroupType>(createType);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

    const { refreshRecordGroups } = recordGroupsData;
    const { showNotification } = useNotification();
    const [showLoginModal, setShowLoginModal] = useState(false);
    
    const navigationItems: FloatingNavigationItem[] = [
        {
            id: 'record-group-management',
            label: '기록장 관리',
        },
    ];

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
    ): { updatedWorkers: WorkerRecordGroup[]; otherWorkersUpdated?: WorkerRecordGroup[] } => {
        if (newRole === WorkerRecordGroup_RecordGroupRole.ADMIN) {
            const defaultWorkerRole = WorkerRecordGroup_RecordGroupRole[defaultRole as unknown as keyof typeof WorkerRecordGroup_RecordGroupRole];
            
            const allWorkers = [...selectedNewWorkers];
            
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
            
            return { updatedWorkers };
        }
        
        const updatedWorkers = workers.map(w => 
            w.worker?.id === targetWorker.worker?.id 
                ? { ...w, role: newRole } 
                : w
        );
        return { updatedWorkers };
    }, [defaultRole, selectedNewWorkers]);

    // 저장 함수 (생성)
    const handleSave = useCallback(async () => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            return;
        }
        
        if (!title.trim()) {
            showNotification('기록장 이름을 입력해주세요.', 'error');
            return;
        }
        
        if (!recordType) {
            showNotification('기록장 타입을 선택해주세요.', 'error');
            return;
        }

        try {
            const { CreateRecordGroupRequest } = await import('@workfolio/shared/generated/record_group');
            const message = CreateRecordGroupRequest.create({
                title: title,
                color: color,
                type: recordType,
                priority: recordType === RecordGroup_RecordGroupType.PRIVATE 
                    ? recordGroupsData.ownedRecordGroups.length + 1
                    : recordGroupsData.sharedRecordGroups.length + 1,
            });
            
            const response = await fetch('/api/record-groups', {
                method: HttpMethod.POST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: message.title,
                    color: message.color,
                    type: message.type,
                    priority: message.priority.toString(),
                })
            });

            if (response.ok) {
                showNotification('기록장이 생성되었습니다.', 'success');
                if (refreshRecordGroups) {
                    await refreshRecordGroups();
                }
                if (onBack) {
                    onBack();
                }
            } else {
                const errorData = await response.json();
                console.error('기록장 생성 실패:', errorData);
                showNotification('기록장 생성에 실패했습니다. 다시 시도해주세요.', 'error');
            }
        } catch (error) {
            console.error('Error creating record group:', error);
            showNotification('기록장 생성 중 오류가 발생했습니다.', 'error');
        }
    }, [title, color, recordType, recordGroupsData, refreshRecordGroups, onBack, showNotification]);

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
                recordGroup: undefined,
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
    }, [selectedNewWorkers, defaultRole]);

    const handleNewWorkerRoleChange = useCallback((value: WorkerRecordGroup_RecordGroupRole, worker: WorkerRecordGroup) => {
        const result = handleUpdateWorkerRole(selectedNewWorkers, worker, value);
        setSelectedNewWorkers(result.updatedWorkers);
    }, [selectedNewWorkers, handleUpdateWorkerRole]);

    const handleNewWorkerRemove = useCallback((workerId: string) => {
        const filtered = selectedNewWorkers.filter(w => w.worker?.id !== workerId);
        if (filtered.length === 1) {
            const updated = filtered.map(w => ({ ...w, role: WorkerRecordGroup_RecordGroupRole.ADMIN }));
            setSelectedNewWorkers(updated);
        } else {
            setSelectedNewWorkers(filtered);
        }
    }, [selectedNewWorkers]);

    return (
        <div className="page-cont">
            <article>
                <div className="cont-box">
                    <div className="cont-tit" id="record-group-management">
                        <div>
                            <h3>새 기록장 만들기</h3>
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
                        isPrivate={isPrivate}
                        isAdmin={true}
                        isColorPickerOpen={isColorPickerOpen}
                        createMode={true}
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
                        onNewWorkerRemove={handleNewWorkerRemove}
                        onExistWorkerRemove={() => {}}
                        onColorPickerToggle={() => setIsColorPickerOpen(!isColorPickerOpen)}
                        onColorSelect={handleSelectColor}
                    />
                </div>
            </article>
            <FloatingNavigation
                navigationItems={navigationItems}
                onSave={handleSave}
                onCancel={onBack}
                saveButtonText="생성하기"
                cancelButtonText="돌아가기"
            />
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
};

export default RecordGroupDetailCreateManagement;

