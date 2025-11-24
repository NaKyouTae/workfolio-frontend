import React, { useEffect, useState, useCallback } from 'react';
import '@/styles/records-config.css';
import { RecordGroupDetailResponse, RecordGroupJoinRequest } from '@/generated/record_group';
import { WorkerListResponse } from '@/generated/worker';
import HttpMethod from '@/enums/HttpMethod';
import { RecordGroup, RecordGroup_RecordGroupRole, RecordGroup_RecordGroupType, Worker, WorkerRecordGroup, WorkerRecordGroup_RecordGroupRole } from '@/generated/common';
import { createSampleWorkers, createSampleRecordGroupDetails } from '@/utils/sampleRecordData';
import { compareEnumValue, normalizeEnumValue } from '@/utils/commonUtils';
import Dropdown from '@/components/portal/ui/Dropdown';
import FloatingNavigation, { FloatingNavigationItem } from '@/components/portal/ui/FloatingNavigation';
import RecordGroupColorModal from '../../record-groups/RecordGroupColorModal';
import { useConfirm } from '@/hooks/useConfirm';
import { useUserStore } from '@/store/userStore';
import { useRecordGroups } from '@/hooks/useRecordGroups';

interface RecordGroupDetailManagementProps {
    recordGroupsData: {
        ownedRecordGroups: RecordGroup[];
        sharedRecordGroups: RecordGroup[];
        allRecordGroups: RecordGroup[];
        isLoading: boolean;
        refreshRecordGroups: () => void;
        fetchRecordGroupDetails: (recordGroupId: string) => Promise<RecordGroupDetailResponse | null>;
    };
    initialRecordGroup?: RecordGroup | undefined;
    isPrivate: boolean;
    isAdmin: boolean;
    onBack?: () => void;
}

const RecordGroupDetailManagement: React.FC<RecordGroupDetailManagementProps> = ({ recordGroupsData, initialRecordGroup, onBack, isPrivate, isAdmin }) => {
    const [selectedRecordGroup, setSelectedRecordGroup] = useState<RecordGroup | undefined>(initialRecordGroup || undefined);
    const [recordGroupDetails, setRecordGroupDetails] = useState<RecordGroupDetailResponse | undefined>(undefined);

    const [shareNickname, setShareNickname] = useState('');
    const [searchedWorkers, setSearchedWorkers] = useState<Worker[]>([]);
    const [isComposing, setIsComposing] = useState(false);
    
    const [selectedNewWorkers, setSelectedNewWorkers] = useState<WorkerRecordGroup[]>([]);
    const [selectedExistWorkers, setSelectedExistWorkers] = useState<WorkerRecordGroup[]>([]);

    const [title, setTitle] = useState(initialRecordGroup?.title || '');
    const [color, setColor] = useState(initialRecordGroup?.color || '');
    const [defaultRole, setDefaultRole] = useState<RecordGroup_RecordGroupRole | undefined>(initialRecordGroup?.defaultRole || undefined);
    const [recordType, setRecordType] = useState<RecordGroup_RecordGroupType | undefined>(initialRecordGroup?.type || undefined);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

    // props로 받은 recordGroupsData 사용
    const { refreshRecordGroups, fetchRecordGroupDetails } = recordGroupsData;
    
    // useRecordGroups 훅 사용
    const { leaveRecordGroup, deleteRecordGroup } = useRecordGroups();
    
    // useConfirm 훅 사용
    const { confirm } = useConfirm();
    
    // user 정보 가져오기
    const { user } = useUserStore();
    
    // 네비게이션 아이템 설정
    const navigationItems: FloatingNavigationItem[] = [
        {
            id: 'record-group-management',
            label: '기록장 관리',
        },
    ];

    // initialRecordGroup이 변경되면 selectedRecordGroup 업데이트
    useEffect(() => {
        if (initialRecordGroup) {
            // 실제로 다른 그룹으로 변경된 경우에만 업데이트
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
            // 로그인 상태 확인 (쿠키에서 accessToken 확인)
            const hasToken = document.cookie.includes('accessToken=');
            
            // 로그인 안되어있을 때 샘플 데이터 사용
            if (!hasToken) {
                const sampleDetails = createSampleRecordGroupDetails(selectedRecordGroup);
                setRecordGroupDetails(sampleDetails);
                if (selectedExistWorkers.length === 0) {
                    setSelectedExistWorkers(sampleDetails?.workers || []);
                }
            } else {
                // 로그인되어있을 때 API 호출
                fetchRecordGroupDetails(selectedRecordGroup.id).then((details: RecordGroupDetailResponse | null) => {
                    setRecordGroupDetails(details || undefined);
                    // selectedExistWorkers가 비어있을 때만 초기화 (사용자가 수정 중이면 유지)
                    if (selectedExistWorkers.length === 0) {
                        setSelectedExistWorkers(details?.workers || []);
                    }
                }).catch(error => {
                    console.error('레코드 그룹 상세 정보 조회 실패:', error);
                    // 에러 발생 시에도 샘플 데이터 사용
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
        
        // 로그인 상태 확인 (쿠키에서 accessToken 확인)
        const hasToken = document.cookie.includes('accessToken=');
        
        // 로그인 안되어있을 때 샘플 데이터 사용
        if (!hasToken) {
            const sampleWorkers = createSampleWorkers();
            // 닉네임으로 필터링 (부분 일치)
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
                method: HttpMethod.GET
            });

            if (response.ok) {
                const data: WorkerListResponse = await response.json();
                if (data.workers && data.workers.length > 0) {
                    setSearchedWorkers(data.workers);
                    return data.workers;
                } else {
                    console.warn('해당 닉네임의 워커를 찾을 수 없습니다.');
                    setSearchedWorkers([]);
                    return [];
                }
            } else if (response.status === 401 || response.status === 403) {
                // 인증 실패 시 샘플 데이터 사용
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
            } else {
                console.error('워커 검색 실패:', response.status);
                setSearchedWorkers([]);
                return [];
            }
        } catch (error) {
            console.error('워커 검색 중 에러 발생:', error);
            // 에러 발생 시에도 샘플 데이터 사용
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
    }, []);

    // 엔터 키 이벤트 핸들러
    const handleNicknameKeyDown = useCallback(async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(shareNickname.trim() === '') {
            setSearchedWorkers([]);
            return;
        }

        // 한글 조합 중에는 Enter 키 이벤트 무시
        if (e.key === 'Enter' && !isComposing) {
            e.preventDefault();
            await handleSearchWorkerByNickname(shareNickname);
        }
    }, [shareNickname, setSearchedWorkers, handleSearchWorkerByNickname, isComposing]);

    // 한글 조합 시작 핸들러
    const handleCompositionStart = useCallback(() => {
        setIsComposing(true);
    }, []);

    // 한글 조합 종료 핸들러
    const handleCompositionEnd = useCallback(() => {
        setIsComposing(false);
    }, []);

    // 워커의 역할 업데이트 핸들러 (selectedNewWorkers와 selectedExistWorkers를 모두 고려)
    const handleUpdateWorkerRole = useCallback((
        workers: WorkerRecordGroup[],
        targetWorker: WorkerRecordGroup,
        newRole: WorkerRecordGroup_RecordGroupRole,
        isNewWorker: boolean // selectedNewWorkers인지 selectedExistWorkers인지 구분
    ): { updatedWorkers: WorkerRecordGroup[]; otherWorkersUpdated?: WorkerRecordGroup[] } => {
        // 관리자 권한(ADMIN)으로 변경하는 경우, selectedNewWorkers와 selectedExistWorkers 모두에서 기존 관리자를 찾아 defaultRole로 변경
        if (newRole === WorkerRecordGroup_RecordGroupRole.ADMIN) {
            // defaultRole을 WorkerRecordGroup_RecordGroupRole로 변환
            const defaultWorkerRole = WorkerRecordGroup_RecordGroupRole[defaultRole as unknown as keyof typeof WorkerRecordGroup_RecordGroupRole];
            
            // 전체 worker 목록 (selectedNewWorkers + selectedExistWorkers 또는 recordGroupDetails.workers)
            const displayExistWorkers = selectedExistWorkers.length > 0 
                ? selectedExistWorkers 
                : (recordGroupDetails?.workers || []);
            const allWorkers = [...selectedNewWorkers, ...displayExistWorkers];
            
            // 기존 관리자 찾기
            const existingAdmin = allWorkers.find(w => 
                w.worker?.id !== targetWorker.worker?.id && 
                compareEnumValue(w.role, WorkerRecordGroup_RecordGroupRole.ADMIN, WorkerRecordGroup_RecordGroupRole)
            );
            
            // 현재 업데이트할 배열에서 타겟 worker 업데이트 및 기존 관리자 처리
            const updatedWorkers = workers.map(w => {
                // 타겟 worker는 newRole로 설정
                if (w.worker?.id === targetWorker.worker?.id) {
                    return { ...w, role: newRole };
                }
                // 기존 관리자가 현재 배열에 있으면 defaultRole로 변경
                if (existingAdmin && w.worker?.id === existingAdmin.worker?.id) {
                    return { ...w, role: defaultWorkerRole };
                }
                return w;
            });
            
            // 기존 관리자가 다른 배열에 있는 경우 그 배열도 업데이트
            let otherWorkersUpdated: WorkerRecordGroup[] | undefined;
            if (existingAdmin) {
                if (isNewWorker) {
                    // selectedNewWorkers를 업데이트하는 경우, selectedExistWorkers도 확인
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
                    // selectedExistWorkers를 업데이트하는 경우, selectedNewWorkers도 확인
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
        
        // 관리자 권한이 아닌 경우 기존 로직 사용
        const updatedWorkers = workers.map(w => 
            w.worker?.id === targetWorker.worker?.id 
                ? { ...w, role: newRole } 
                : w
        );
        return { updatedWorkers };
    }, [defaultRole, selectedNewWorkers, selectedExistWorkers, recordGroupDetails?.workers]);

    // 저장 함수
    const handleSave = useCallback(async () => {
        if (!selectedRecordGroup) {
            alert('저장할 기록장이 없습니다.');
            return;
        }

        // recordType이 PRIVATE인 경우 확인 다이얼로그 표시
        const isPrivateType = compareEnumValue(recordType, RecordGroup_RecordGroupType.PRIVATE, RecordGroup_RecordGroupType);
        if (isPrivateType) {
            const confirmed = await confirm({
                title: '개인 기록장으로 변경',
                icon: '/assets/img/ico/ic-warning.svg',
                description: '개인 기록장으로 변경 시 공유 멤버가 전부 사라지며 기록은 남습니다.',
                confirmText: '확인',
                cancelText: '취소',
            });
            
            if (!confirmed) {
                return; // 사용자가 취소한 경우 저장하지 않음
            }
        }

        try {
            // PRIVATE인 경우 workers를 빈 배열로 처리
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
                method: HttpMethod.POST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(joinRequest)
            });

            if (response.ok) {
                try {
                    if (refreshRecordGroups) {
                        await refreshRecordGroups();
                    } else {
                        console.warn('refreshRecordGroups가 정의되지 않았습니다.');
                    }
                } catch (refreshError) {
                    console.error('refreshRecordGroups 실행 중 오류:', refreshError);
                }
                // 저장 후 뒤로가기 또는 성공 메시지 표시
                if (onBack) {
                    onBack();
                }
            } else {
                const errorData = await response.json();
                console.error('기록장 저장 실패:', errorData);
                alert('저장에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('Error saving record group:', error);
            alert('저장 중 오류가 발생했습니다.');
        }
    }, [selectedRecordGroup, title, color, recordType, defaultRole, selectedNewWorkers, selectedExistWorkers, refreshRecordGroups, onBack, confirm]);

    // 기록장 탈퇴 핸들러
    const handleLeave = useCallback(async () => {
        if (!selectedRecordGroup?.id || !user?.id) {
            alert('기록장 정보를 찾을 수 없습니다.');
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
            alert('탈퇴에 실패했습니다. 다시 시도해주세요.');
        }
    }, [selectedRecordGroup?.id, user?.id, confirm, leaveRecordGroup, onBack]);

    // 기록장 삭제 핸들러
    const handleDelete = useCallback(async () => {
        if (!selectedRecordGroup?.id) {
            alert('기록장 정보를 찾을 수 없습니다.');
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
            alert('삭제에 실패했습니다. 다시 시도해주세요.');
        }
    }, [selectedRecordGroup?.id, confirm, deleteRecordGroup, onBack]);

    const handleSelectColor = useCallback((color: string) => {
        setColor(color);
        setIsColorPickerOpen(false);
    }, []);

    return (
        <div className="page-cont">
            <article>
                <div className="cont-box">
                    <div className="cont-tit" id="record-group-management">
                        <div>
                            <h3>기록장 관리</h3>
                        </div>
                    </div>
                    <ul className="setting-list">
                        <li>
                            <p>기록장 이름 및 색상</p>
                            <div>
                                <div 
                                    className="color-picker" 
                                    style={{ backgroundColor: color || '#fff' }}
                                    onClick={() => !isAdmin ? undefined : setIsColorPickerOpen(!isColorPickerOpen)}
                                />
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    disabled={!isAdmin}
                                />
                            </div>
                            {isColorPickerOpen && (
                                <RecordGroupColorModal
                                    isOpen={isColorPickerOpen}
                                    currentColor={color}
                                    onColorSelect={handleSelectColor}
                                />
                            )}
                        </li>
                        <li>
                            <p>기록장 공유 설정</p>
                            <ul className="input-list">
                                <li>
                                    <input
                                        id="type-private"
                                        type="radio"
                                        name="recordGroupType"
                                        disabled={initialRecordGroup?.isDefault || !isAdmin}
                                        value={RecordGroup_RecordGroupType.PRIVATE}
                                        checked={compareEnumValue(recordType, RecordGroup_RecordGroupType.PRIVATE, RecordGroup_RecordGroupType)}
                                        onChange={() => setRecordType(RecordGroup_RecordGroupType.PRIVATE)}
                                    />
                                    <label htmlFor="type-private"><p>개인 기록장</p></label>
                                </li>
                                <li>
                                    <input
                                        id="type-shared"
                                        type="radio"
                                        name="recordGroupType"
                                        disabled={initialRecordGroup?.isDefault || !isAdmin}
                                        value={RecordGroup_RecordGroupType.SHARED}
                                        checked={compareEnumValue(recordType, RecordGroup_RecordGroupType.SHARED, RecordGroup_RecordGroupType)}
                                        onChange={() => setRecordType(RecordGroup_RecordGroupType.SHARED)}
                                    />
                                    <label htmlFor="type-shared"><p>공유 기록장</p></label>
                                </li>
                                {isPrivate && initialRecordGroup?.isDefault && (
                                    <li><p>기본 기록장은 공유 기록장으로 변경할 수 없어요.</p></li>
                                )}
                            </ul>
                        </li>
                        {
                            isAdmin && (
                                <li>
                                    <p>기록장 공유 멤버</p>
                                    <div>
                                        <input 
                                            type="text" 
                                            placeholder="공유할 분의 닉네임을 입력해 주세요."
                                            value={shareNickname}
                                            onChange={(e) => setShareNickname(e.target.value)}
                                            onKeyDown={handleNicknameKeyDown}
                                            onCompositionStart={handleCompositionStart}
                                            onCompositionEnd={handleCompositionEnd}
                                            disabled={compareEnumValue(recordType, RecordGroup_RecordGroupType.PRIVATE, RecordGroup_RecordGroupType) || !isAdmin}
                                        />
                                        <ul className="shared-mem-search" style={{ display: searchedWorkers.length > 0 ? 'block' : 'none' }}>
                                            {searchedWorkers.map((worker: Worker, index: number) => {
                                                return (
                                                    <li key={worker.id || index}>
                                                        <button
                                                            id={`new-worker-${worker.id}`}
                                                            name="new-worker"
                                                            disabled={compareEnumValue(recordType, RecordGroup_RecordGroupType.PRIVATE, RecordGroup_RecordGroupType) || !isAdmin}
                                                            onClick={() => {
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
                                                                    // 한 명만 남으면 자동으로 admin으로 설정
                                                                    if (filtered.length === 1) {
                                                                        const updated = filtered.map(w => ({ ...w, role: WorkerRecordGroup_RecordGroupRole.ADMIN }));
                                                                        setSelectedNewWorkers(updated);
                                                                    } else {
                                                                        setSelectedNewWorkers(filtered);
                                                                    }
                                                                }
                                                                setSearchedWorkers([]);
                                                            }}
                                                        >{worker.nickName || ''}</button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        <button onClick={() => handleSearchWorkerByNickname(shareNickname)} disabled={isPrivate}>검색</button>
                                    </div>
                                </li>
                            )
                        }
                        {
                            compareEnumValue(recordType, RecordGroup_RecordGroupType.SHARED, RecordGroup_RecordGroupType) && (
                                <>
                                    <li>
                                        <p>기록장 공유 멤버</p>
                                        <ul className="shared-mem-list">
                                            {selectedNewWorkers.length > 0 ? (
                                                selectedNewWorkers.map((worker: WorkerRecordGroup, index: number) => (
                                                    <li key={worker.id || index} className="new">
                                                        <div className="info">
                                                            <p>{worker.worker?.nickName || ''}</p>
                                                            <span className="label red">NEW</span>
                                                        </div>
                                                        <div className="option">
                                                            <Dropdown
                                                                selectedOption={normalizeEnumValue(worker.role, WorkerRecordGroup_RecordGroupRole)}
                                                                options={[
                                                                    { value: WorkerRecordGroup_RecordGroupRole.ADMIN, label: '관리자 권한' }, 
                                                                    { value: WorkerRecordGroup_RecordGroupRole.FULL, label: '전체 권한' }, 
                                                                    { value: WorkerRecordGroup_RecordGroupRole.VIEW, label: '보기 권한' }
                                                                ]}
                                                                setValue={(value) => {
                                                                    const result = handleUpdateWorkerRole(selectedNewWorkers, worker, value as WorkerRecordGroup_RecordGroupRole, true);
                                                                    setSelectedNewWorkers(result.updatedWorkers);
                                                                    if (result.otherWorkersUpdated) {
                                                                        setSelectedExistWorkers(result.otherWorkersUpdated);
                                                                    }
                                                                }}
                                                                disabled={compareEnumValue(recordType, RecordGroup_RecordGroupType.PRIVATE, RecordGroup_RecordGroupType) || !isAdmin}
                                                            />
                                                            {user?.id !== worker.worker?.id && (
                                                                <button 
                                                                    onClick={() => {
                                                                        const filtered = selectedNewWorkers.filter(w => w.worker?.id !== worker.worker?.id);
                                                                        // 한 명만 남으면 자동으로 admin으로 설정
                                                                        if (filtered.length === 1) {
                                                                            const updated = filtered.map(w => ({ ...w, role: WorkerRecordGroup_RecordGroupRole.ADMIN }));
                                                                            setSelectedNewWorkers(updated);
                                                                        } else {
                                                                            setSelectedNewWorkers(filtered);
                                                                        }
                                                                    }}
                                                                    disabled={compareEnumValue(recordType, RecordGroup_RecordGroupType.PRIVATE, RecordGroup_RecordGroupType) || !isAdmin}
                                                                ><i className="ic-delete" /></button>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <li>선택된 멤버가 없습니다.</li>
                                            )}
                                            {(() => {
                                                const displayWorkers = selectedExistWorkers.length > 0 
                                                    ? selectedExistWorkers 
                                                    : (recordGroupDetails?.workers || []);
                                                
                                                return displayWorkers.length > 0 ? (
                                                    displayWorkers.map((worker: WorkerRecordGroup, index: number) => (
                                                        <li key={worker.id || index}>
                                                            <div className="info">
                                                                <p>{worker.worker?.nickName || ''}</p>
                                                            </div>
                                                            <div className="option">
                                                                <Dropdown
                                                                    selectedOption={normalizeEnumValue(worker.role, WorkerRecordGroup_RecordGroupRole)}
                                                                    options={[
                                                                        { value: WorkerRecordGroup_RecordGroupRole.ADMIN, label: '관리자 권한' }, 
                                                                        { value: WorkerRecordGroup_RecordGroupRole.FULL, label: '전체 권한' }, 
                                                                        { value: WorkerRecordGroup_RecordGroupRole.VIEW, label: '보기 권한' },
                                                                    ]}
                                                                    setValue={(value) => {
                                                                        const currentWorkers = selectedExistWorkers.length > 0 
                                                                            ? selectedExistWorkers 
                                                                            : (recordGroupDetails?.workers || []);
                                                                        const result = handleUpdateWorkerRole(currentWorkers, worker, value as WorkerRecordGroup_RecordGroupRole, false);
                                                                        setSelectedExistWorkers(result.updatedWorkers);
                                                                        if (result.otherWorkersUpdated) {
                                                                            setSelectedNewWorkers(result.otherWorkersUpdated);
                                                                        }
                                                                    }}
                                                                    disabled={compareEnumValue(recordType, RecordGroup_RecordGroupType.PRIVATE, RecordGroup_RecordGroupType) || !isAdmin}
                                                                />
                                                                {!isPrivate && isAdmin && (
                                                                    <button 
                                                                        onClick={() => {
                                                                            const currentWorkers = selectedExistWorkers.length > 0 
                                                                                ? selectedExistWorkers 
                                                                                : (recordGroupDetails?.workers || []);
                                                                            const filtered = currentWorkers.filter(w => w.worker?.id !== worker.worker?.id);
                                                                            // 한 명만 남으면 자동으로 admin으로 설정
                                                                            if (filtered.length === 1) {
                                                                                const updated = filtered.map(w => ({ ...w, role: WorkerRecordGroup_RecordGroupRole.ADMIN }));
                                                                                setSelectedExistWorkers(updated);
                                                                            } else {
                                                                                setSelectedExistWorkers(filtered);
                                                                            }
                                                                        }}
                                                                        disabled={compareEnumValue(recordType, RecordGroup_RecordGroupType.PRIVATE, RecordGroup_RecordGroupType)}
                                                                    ><i className="ic-delete" /></button>
                                                                )}
                                                            </div>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li>공유된 멤버가 없습니다.</li>
                                                );
                                            })()}
                                        </ul>
                                    </li>
                                    {
                                        !isPrivate && isAdmin && (
                                            <li>
                                                <p>기록장 공유 기본 권한</p>
                                                <ul className="input-list">
                                                    <li>
                                                        <input 
                                                            id="role-full"
                                                            type="radio"
                                                            name="default-role"
                                                            value="full"
                                                            checked={compareEnumValue(defaultRole, RecordGroup_RecordGroupRole.FULL, RecordGroup_RecordGroupRole)}
                                                            onChange={() => {
                                                                setDefaultRole(RecordGroup_RecordGroupRole.FULL);
                                                            }}
                                                        />
                                                        <label htmlFor="role-full"><p>전체 권한</p></label>
                                                    </li>  
                                                    <li>
                                                        <input 
                                                            id="role-view"
                                                            type="radio" 
                                                            name="default-role"
                                                            value={RecordGroup_RecordGroupRole.VIEW}
                                                            checked={compareEnumValue(defaultRole, RecordGroup_RecordGroupRole.VIEW, RecordGroup_RecordGroupRole)}
                                                            onChange={() => {
                                                                setDefaultRole(RecordGroup_RecordGroupRole.VIEW);
                                                            }}
                                                        />
                                                        <label htmlFor="role-view"><p>보기 권한</p></label>
                                                    </li>  
                                                </ul>
                                            </li>
                                        )
                                    }
                                </>
                            )
                        }
                        {isPrivate || isAdmin ? (
                            <li>
                                <p>기록장 삭제</p>
                                <div>
                                    {selectedRecordGroup?.isDefault ? (
                                        <div className="btn">
                                            <p>기본 기록장은 삭제할 수 없어요.</p>
                                        </div>
                                    ): (
                                        <div className="btn">
                                            <button onClick={handleDelete}>삭제하기</button>
                                            <p>기록장에 있는 모든 기록이 삭제돼요.</p>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ) : (
                            <li>
                                <p>기록장 탈퇴</p>
                                <div className="btn">
                                    <button onClick={handleLeave}>탈퇴하기</button>
                                    <p>기록장을 삭제하면 공유 멤버 모두에게서 없어지고, 안에 있는 기록들도 함께 지워져요.</p>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </article>
            <FloatingNavigation
                navigationItems={navigationItems}
                onSave={isAdmin ? handleSave : undefined}
                onCancel={onBack}
                saveButtonText="저장하기"
                cancelButtonText="돌아가기"
            />
        </div>
    );
};

export default RecordGroupDetailManagement;

