import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { RecordGroup, RecordGroup_RecordGroupCategory, Record as RecordProto } from '@workfolio/shared/generated/common';
import { ResumeUpdateRequest_ProjectRequest } from '@workfolio/shared/generated/resume';
import Dropdown, { IDropdown } from '@workfolio/shared/ui/Dropdown';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';
import DateUtil from '@workfolio/shared/utils/DateUtil';
import { convertRecordsToProject } from '../utils/recordToProject';
import { detectTemplateType } from '../../records/templates/recordTemplates';

interface ImportFromRecordsModalProps {
    isOpen: boolean;
    onClose: () => void;
    allRecordGroups: RecordGroup[];
    onImport: (project: ResumeUpdateRequest_ProjectRequest) => void;
    currentProjectCount: number;
}

type Step = 'select' | 'preview';

const TEMPLATE_LABELS: Record<string, string> = {
    project_overview: '프로젝트 개요',
    task: '업무 기록',
    project_review_v2: '프로젝트 회고',
};

const ImportFromRecordsModal: React.FC<ImportFromRecordsModalProps> = ({
    isOpen,
    onClose,
    allRecordGroups,
    onImport,
    currentProjectCount,
}) => {
    const [step, setStep] = useState<Step>('select');
    const [selectedGroupId, setSelectedGroupId] = useState<string>('');
    const [records, setRecords] = useState<RecordProto[]>([]);
    const [selectedRecordIds, setSelectedRecordIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);

    // Filter only PROJECT category groups
    const projectGroups = useMemo(() =>
        allRecordGroups.filter(g => g.category === RecordGroup_RecordGroupCategory.PROJECT),
        [allRecordGroups]
    );

    const groupDropdownOptions: IDropdown[] = useMemo(() =>
        projectGroups.map(g => ({
            value: g.id,
            label: g.title,
            color: g.color,
        })), [projectGroups]
    );

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep('select');
            setSelectedGroupId(projectGroups[0]?.id || '');
            setRecords([]);
            setSelectedRecordIds(new Set());
        }
    }, [isOpen, projectGroups]);

    // Fetch records when group is selected
    useEffect(() => {
        if (!selectedGroupId || !isOpen) return;

        const fetchRecords = async () => {
            setLoading(true);
            try {
                // Use monthly API with wide range to get all records for this group
                const now = new Date();
                const year = now.getFullYear();
                const promises = [];

                // Fetch last 3 years of records
                for (let y = year - 2; y <= year; y++) {
                    for (let m = 1; m <= 12; m++) {
                        promises.push(
                            fetch(`/api/records/monthly?year=${y}&month=${m}&recordGroupIds=${selectedGroupId}`, {
                                method: HttpMethod.GET,
                            }).then(res => {
                                if (!res.ok) return [];
                                return res.json().then(data => {
                                    if (Array.isArray(data?.records)) return data.records;
                                    if (Array.isArray(data)) return data;
                                    return [];
                                });
                            })
                        );
                    }
                }

                const results = await Promise.all(promises);
                const allRecords: RecordProto[] = results.flat();

                // Deduplicate by id
                const uniqueMap = new Map<string, RecordProto>();
                for (const r of allRecords) {
                    if (r.id) uniqueMap.set(r.id, r);
                }

                const uniqueRecords = Array.from(uniqueMap.values());
                setRecords(uniqueRecords);

                // Auto-select all records
                setSelectedRecordIds(new Set(uniqueRecords.map(r => r.id)));
            } catch (error) {
                console.error('기록 조회 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, [selectedGroupId, isOpen]);

    // Escape key handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        if (isOpen) document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const toggleRecord = useCallback((id: string) => {
        setSelectedRecordIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const toggleAll = useCallback(() => {
        if (selectedRecordIds.size === records.length) {
            setSelectedRecordIds(new Set());
        } else {
            setSelectedRecordIds(new Set(records.map(r => r.id)));
        }
    }, [records, selectedRecordIds.size]);

    const selectedGroup = projectGroups.find(g => g.id === selectedGroupId);

    const preview = useMemo(() => {
        if (selectedRecordIds.size === 0 || !selectedGroup) return null;
        return convertRecordsToProject(
            { title: selectedGroup.title, records },
            Array.from(selectedRecordIds),
            currentProjectCount,
        );
    }, [selectedRecordIds, selectedGroup, records, currentProjectCount]);

    const handleImport = () => {
        if (preview) {
            onImport(preview);
            onClose();
        }
    };

    const getTemplateLabel = (record: RecordProto): string => {
        const type = record.templateType || detectTemplateType(record.description);
        return TEMPLATE_LABELS[type] || '일반';
    };

    if (!isOpen) return null;

    return (
        <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-wrap" style={{ maxWidth: '640px' }}>
                <div className="modal-tit">
                    <h2>기록에서 가져오기</h2>
                    <button onClick={onClose}><i className="ic-close" /></button>
                </div>
                <div className="modal-cont">
                    {step === 'select' && (
                        <>
                            <ul className="record-info-input">
                                <li>
                                    <p>프로젝트 기록장</p>
                                    {projectGroups.length === 0 ? (
                                        <p className="text-gray">프로젝트 기록장이 없습니다. 먼저 프로젝트 기록장을 만들어 주세요.</p>
                                    ) : (
                                        <div className="record-select">
                                            <div className="color" style={{
                                                backgroundColor: selectedGroup?.color || '#ddd',
                                            }}></div>
                                            <Dropdown
                                                options={groupDropdownOptions}
                                                selectedOption={selectedGroupId}
                                                setValue={(v) => setSelectedGroupId(v as string)}
                                            />
                                        </div>
                                    )}
                                </li>
                            </ul>

                            {loading && <p style={{ textAlign: 'center', padding: '20px 0' }}>불러오는 중...</p>}

                            {!loading && records.length === 0 && selectedGroupId && (
                                <p style={{ textAlign: 'center', padding: '20px 0', color: '#999' }}>기록이 없습니다.</p>
                            )}

                            {!loading && records.length > 0 && (
                                <div className="import-record-list">
                                    <div className="import-record-header">
                                        <input
                                            type="checkbox"
                                            id="import-select-all"
                                            checked={selectedRecordIds.size === records.length}
                                            onChange={toggleAll}
                                        />
                                        <label htmlFor="import-select-all">
                                            <p>전체 선택 ({selectedRecordIds.size}/{records.length})</p>
                                        </label>
                                    </div>
                                    <ul>
                                        {records.map(record => (
                                            <li key={record.id}>
                                                <input
                                                    type="checkbox"
                                                    id={`import-record-${record.id}`}
                                                    checked={selectedRecordIds.has(record.id)}
                                                    onChange={() => toggleRecord(record.id)}
                                                />
                                                <label htmlFor={`import-record-${record.id}`}>
                                                    <div className="import-record-item">
                                                        <span className="badge">{getTemplateLabel(record)}</span>
                                                        <strong>{record.title}</strong>
                                                        <span className="date">{DateUtil.formatTimestamp(record.startedAt)}</span>
                                                    </div>
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}

                    {step === 'preview' && preview && (
                        <div className="import-preview">
                            <ul className="record-info-input">
                                <li>
                                    <p>프로젝트명</p>
                                    <p className="preview-value">{preview.title}</p>
                                </li>
                                {preview.affiliation && (
                                    <li>
                                        <p>소속</p>
                                        <p className="preview-value">{preview.affiliation}</p>
                                    </li>
                                )}
                                {preview.role && (
                                    <li>
                                        <p>역할</p>
                                        <p className="preview-value">{preview.role}</p>
                                    </li>
                                )}
                                <li className="full">
                                    <p>내용</p>
                                    <pre className="preview-description">{preview.description}</pre>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="modal-btn">
                    {step === 'select' && (
                        <>
                            <button type="button" onClick={onClose}>취소</button>
                            <button
                                type="button"
                                onClick={() => setStep('preview')}
                                disabled={selectedRecordIds.size === 0}
                            >
                                미리보기
                            </button>
                        </>
                    )}
                    {step === 'preview' && (
                        <>
                            <button type="button" onClick={() => setStep('select')}>이전</button>
                            <button type="button" onClick={handleImport}>가져오기</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImportFromRecordsModal;
