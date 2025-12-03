import React from 'react';
import '@/styles/records-config.css';
import { RecordGroup, RecordGroup_RecordGroupRole, RecordGroup_RecordGroupType, Worker, WorkerRecordGroup, WorkerRecordGroup_RecordGroupRole } from '@/generated/common';
import { RecordGroupDetailResponse } from '@/generated/record_group';
import { compareEnumValue, normalizeEnumValue } from '@/utils/commonUtils';
import Dropdown from '@/components/portal/ui/Dropdown';
import RecordGroupColorModal from '../../record-groups/RecordGroupColorModal';

interface RecordGroupDetailFormProps {
    title: string;
    color: string;
    recordType: RecordGroup_RecordGroupType | undefined;
    defaultRole: RecordGroup_RecordGroupRole | undefined;
    shareNickname: string;
    searchedWorkers: Worker[];
    selectedNewWorkers: WorkerRecordGroup[];
    selectedExistWorkers: WorkerRecordGroup[];
    recordGroupDetails?: RecordGroupDetailResponse | undefined;
    isPrivate: boolean;
    isAdmin: boolean;
    isColorPickerOpen: boolean;
    initialRecordGroup?: RecordGroup | undefined;
    createMode?: boolean;
    user?: { id?: string } | null;
    onTitleChange: (title: string) => void;
    onColorChange: (color: string) => void;
    onRecordTypeChange: (type: RecordGroup_RecordGroupType) => void;
    onDefaultRoleChange: (role: RecordGroup_RecordGroupRole) => void;
    onShareNicknameChange: (nickname: string) => void;
    onNicknameKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onCompositionStart: () => void;
    onCompositionEnd: () => void;
    onSearchWorker: () => void;
    onWorkerSelect: (worker: Worker) => void;
    onWorkerRoleChange: (workers: WorkerRecordGroup[], targetWorker: WorkerRecordGroup, newRole: WorkerRecordGroup_RecordGroupRole, isNewWorker: boolean) => { updatedWorkers: WorkerRecordGroup[]; otherWorkersUpdated?: WorkerRecordGroup[] };
    onNewWorkerRoleChange?: (value: WorkerRecordGroup_RecordGroupRole, worker: WorkerRecordGroup) => void;
    onExistWorkerRoleChange?: (value: WorkerRecordGroup_RecordGroupRole, worker: WorkerRecordGroup) => void;
    onNewWorkerRemove: (workerId: string) => void;
    onExistWorkerRemove: (workerId: string) => void;
    onColorPickerToggle: () => void;
    onColorSelect: (color: string) => void;
    onDelete?: () => void;
    onLeave?: () => void;
}

const RecordGroupDetailForm: React.FC<RecordGroupDetailFormProps> = ({
    title,
    color,
    recordType,
    defaultRole,
    shareNickname,
    searchedWorkers,
    selectedNewWorkers,
    selectedExistWorkers,
    recordGroupDetails,
    isPrivate,
    isAdmin,
    isColorPickerOpen,
    initialRecordGroup,
    createMode = false,
    user,
    onTitleChange,
    onRecordTypeChange,
    onDefaultRoleChange,
    onShareNicknameChange,
    onNicknameKeyDown,
    onCompositionStart,
    onCompositionEnd,
    onSearchWorker,
    onWorkerSelect,
    onWorkerRoleChange,
    onNewWorkerRemove,
    onExistWorkerRemove,
    onColorPickerToggle,
    onColorSelect,
    onDelete,
    onLeave,
}) => {
    return (
        <ul className="setting-list">
            <li>
                <p>기록장 이름 및 색상</p>
                <div>
                    <div 
                        className="color-picker" 
                        style={{ backgroundColor: color || '#fff' }}
                        onClick={() => !isAdmin ? undefined : onColorPickerToggle()}
                    />
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        disabled={!isAdmin}
                    />
                </div>
                {isColorPickerOpen && (
                    <RecordGroupColorModal
                        isOpen={isColorPickerOpen}
                        currentColor={color}
                        onColorSelect={onColorSelect}
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
                            disabled={(!createMode && initialRecordGroup?.isDefault) || !isAdmin}
                            value={RecordGroup_RecordGroupType.PRIVATE}
                            checked={compareEnumValue(recordType, RecordGroup_RecordGroupType.PRIVATE, RecordGroup_RecordGroupType)}
                            onChange={() => onRecordTypeChange(RecordGroup_RecordGroupType.PRIVATE)}
                        />
                        <label htmlFor="type-private"><p>개인 기록장</p></label>
                    </li>
                    <li>
                        <input
                            id="type-shared"
                            type="radio"
                            name="recordGroupType"
                            disabled={(!createMode && initialRecordGroup?.isDefault) || !isAdmin}
                            value={RecordGroup_RecordGroupType.SHARED}
                            checked={compareEnumValue(recordType, RecordGroup_RecordGroupType.SHARED, RecordGroup_RecordGroupType)}
                            onChange={() => onRecordTypeChange(RecordGroup_RecordGroupType.SHARED)}
                        />
                        <label htmlFor="type-shared"><p>공유 기록장</p></label>
                    </li>
                    {!createMode && isPrivate && initialRecordGroup?.isDefault && (
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
                                onChange={(e) => onShareNicknameChange(e.target.value)}
                                onKeyDown={onNicknameKeyDown}
                                onCompositionStart={onCompositionStart}
                                onCompositionEnd={onCompositionEnd}
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
                                                onClick={() => onWorkerSelect(worker)}
                                            >{worker.nickName || ''}</button>
                                        </li>
                                    );
                                })}
                            </ul>
                            <button onClick={onSearchWorker} disabled={isPrivate}>검색</button>
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
                                                        onWorkerRoleChange(selectedNewWorkers, worker, value as WorkerRecordGroup_RecordGroupRole, true);
                                                        // 부모 컴포넌트에서 상태 업데이트를 처리하도록 콜백 전달
                                                    }}
                                                    disabled={compareEnumValue(recordType, RecordGroup_RecordGroupType.PRIVATE, RecordGroup_RecordGroupType) || !isAdmin}
                                                />
                                                {user?.id !== worker.worker?.id && (
                                                    <button 
                                                        onClick={() => onNewWorkerRemove(worker.worker?.id || '')}
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
                                                            onWorkerRoleChange(currentWorkers, worker, value as WorkerRecordGroup_RecordGroupRole, false);
                                                            // 부모 컴포넌트에서 상태 업데이트를 처리하도록 콜백 전달
                                                        }}
                                                        disabled={compareEnumValue(recordType, RecordGroup_RecordGroupType.PRIVATE, RecordGroup_RecordGroupType) || !isAdmin}
                                                    />
                                                    {!isPrivate && isAdmin && (
                                                        <button 
                                                            onClick={() => onExistWorkerRemove(worker.worker?.id || '')}
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
                                                    onDefaultRoleChange(RecordGroup_RecordGroupRole.FULL);
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
                                                    onDefaultRoleChange(RecordGroup_RecordGroupRole.VIEW);
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
            {!createMode && (isPrivate || isAdmin ? (
                <li>
                    <p>기록장 삭제</p>
                    <div>
                        {initialRecordGroup?.isDefault ? (
                            <div className="btn">
                                <p>기본 기록장은 삭제할 수 없어요.</p>
                            </div>
                        ): (
                            <div className="btn">
                                <button onClick={onDelete}>삭제하기</button>
                                <p>기록장에 있는 모든 기록이 삭제돼요.</p>
                            </div>
                        )}
                    </div>
                </li>
            ) : (
                <li>
                    <p>기록장 탈퇴</p>
                    <div className="btn">
                        <button onClick={onLeave}>탈퇴하기</button>
                        <p>기록장을 삭제하면 공유 멤버 모두에게서 없어지고, 안에 있는 기록들도 함께 지워져요.</p>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default RecordGroupDetailForm;

