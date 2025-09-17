import React, { useState } from 'react';
import HttpMethod from '@/enums/HttpMethod';
import { RecordGroup } from '../../../../generated/common';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import { SuccessRecordGroupResponse, UpdateRecordGroupRequest } from '../../../../generated/record_group';
import { RecordGroupColor } from '@/enums/RecordGroupColor';
import ColorSelectModal from './ColorSelectModal';

interface RecordGroupItemProps {
    group: RecordGroup;
    isChecked: boolean;
    onToggle: (id: string) => void;
    onUpdate?: (id: string, title: string) => void;
    onUpdateColor?: (id: string, color: string) => void;
    onDelete?: (id: string) => void;
}

interface NewRecordGroupItemProps {
    onSave: (title: string) => void;
    onCancel: () => void;
}

const RecordGroupItem = ({ group, isChecked, onToggle, onUpdate, onUpdateColor, onDelete }: RecordGroupItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(group.title);
    const [showColorModal, setShowColorModal] = useState(false);

    const handleSave = () => {
        if (editTitle.trim() && onUpdate) {
            onUpdate(group.id, editTitle.trim());
        }
        setIsEditing(false);
    };

    const handleCancel = async () => {
        try {
            const response = await fetch(`/api/record-groups/${group.id}`, {
                method: HttpMethod.DELETE,
            });

            if (response.ok) {
                const result: SuccessRecordGroupResponse = await response.json();
                if (result.isSuccess) {
                    // 삭제 성공 시 부모 컴포넌트에 알림
                    if (onDelete) {
                        onDelete(group.id);
                    }
                } else {
                    console.error('Failed to delete record group:', result);
                }
            } else {
                console.error('Failed to delete record group');
            }
        } catch (error) {
            console.error('Error deleting record group:', error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const handleColorSelect = (color: string) => {
        if (onUpdateColor) {
            onUpdateColor(group.id, color);
        }
        setShowColorModal(false);
    };

    return (
        <li>
            <div className="info">
                <input checked={isChecked} type="checkbox" id={`group${group.id}`} onClick={() => !isEditing && onToggle(group.id)} />
                <label 
                    htmlFor={`group${group.id}`}
                    style={{"--group-color": `${group.color}` } as React.CSSProperties} 
                >
                    {isEditing ? (
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={handleKeyPress}
                            onBlur={handleSave}
                            autoFocus
                        />
                    ) : (
                        <p>{group.title}</p>
                    )}
                </label>
            </div>
            <div className="more">
                <button className="trans active" onClick={() => setShowColorModal(true)}><i className="ic-more" /></button>
                {showColorModal && (
                    <div className="record-edit-modal-wrap">
                        <button onClick={() => setIsEditing(true)}>기록장 이름 변경</button>
                        <ColorSelectModal
                            isOpen={showColorModal}
                            currentColor={group.color}
                            onColorSelect={handleColorSelect}
                            onClose={() => setShowColorModal(false)}
                            title="기록장 색상 변경"
                        />
                    </div>
                )}
            </div>
            {/* <div className="more">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} style={{
                            background: 'none',
                            border: 'none',
                            padding: '4px',
                            cursor: 'pointer',
                            color: '#007bff'
                        }}>
                            ✓
                        </button>
                        <button onClick={handleCancel} style={{
                            background: 'none',
                            border: 'none',
                            padding: '4px',
                            cursor: 'pointer',
                            color: '#dc3545'
                        }}>
                            ✕
                        </button>
                    </>
                ) : (
                    <>
                        {showOptions && (
                            <>
                                <button onClick={() => setShowColorModal(true)} style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '4px',
                                    cursor: 'pointer',
                                    color: '#007bff'
                                }}>
                                    🎨
                                </button>
                                <button onClick={() => onDelete && onDelete(group.id)} style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '4px',
                                    cursor: 'pointer',
                                    color: '#dc3545'
                                }}>
                                    X
                                </button>
                            </>
                        )}
                        <button 
                            onClick={() => setIsEditing(true)}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            ✏️
                        </button>
                        <button 
                            onClick={() => setShowOptions(!showOptions)}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            ⋮
                        </button>
                    </>
                )}
                
            </div> */}
        </li>
    );
};

const NewRecordGroupItem = ({ onSave, onCancel }: NewRecordGroupItemProps) => {
    const [title, setTitle] = useState('');

    const handleSave = () => {
        if (title.trim()) {
            onSave(title.trim());
            setTitle('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <div className="record-group-item">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flex: 1
            }}>
                <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: '2px solid #ccc',
                    backgroundColor: '#f8f9fa',
                    marginRight: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                </div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onBlur={handleSave}
                    autoFocus
                    placeholder="새 그룹 이름 입력"
                    style={{
                        fontSize: '14px',
                        border: '1px solid #007bff',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        outline: 'none',
                        width: '100%'
                    }}
                />
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button onClick={handleSave} style={{
                    background: 'none',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    color: '#007bff'
                }}>
                    ✓
                </button>
                <button onClick={onCancel} style={{
                    background: 'none',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    color: '#dc3545'
                }}>
                    ✕
                </button>
            </div>
        </div>
    );
};


interface RecordGroupsProps {
    recordGroups: RecordGroup[];
    onUpdateRecordGroups: (updatedGroups: RecordGroup[]) => void;
    isCreatingGroup?: boolean;
    onCreateGroup?: (title: string) => void;
    onCancelCreateGroup?: () => void;
}

const RecordGroups = ({ 
    recordGroups, 
    onUpdateRecordGroups, 
    isCreatingGroup, 
    onCreateGroup, 
    onCancelCreateGroup 
}: RecordGroupsProps) => {
    const { checkedGroups, toggleGroup } = useRecordGroupStore();


    const updateRecordGroup = async (id: string, title: string) => {
        try {
            // 토큰이 없으면 로그인 페이지로 리다이렉트
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                window.location.href = '/login';
                return;
            }

            // 기존 그룹 정보 찾기
            const existingGroup = recordGroups.find(group => group.id === id);
            if (!existingGroup) {
                console.error('Group not found');
                return;
            }

            // UpdateRecordGroupRequest 생성
            const updateRequest = UpdateRecordGroupRequest.create({
                title: title,
                isPublic: existingGroup.isPublic || false,
                color: existingGroup.color || RecordGroupColor.RED,
                priority: existingGroup.priority || 1
            });

            const response = await fetch(`/api/record-groups/${id}`, {
                method: HttpMethod.PUT,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: updateRequest.title,
                    isPublic: updateRequest.isPublic,
                    color: updateRequest.color,
                    priority: updateRequest.priority.toString()
                })
            });

            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }

            if (response.ok) {
                const updatedGroups = recordGroups.map(group => 
                    group.id === id ? { ...group, title } : group
                );
                onUpdateRecordGroups(updatedGroups);
                console.log('Updated Group:', id, title);
            } else {
                console.error('Failed to update group');
            }
        } catch (error) {
            console.error('Error updating group:', error);
        }
    };

    const updateRecordGroupColor = async (id: string, color: string) => {
        try {
            // 토큰이 없으면 로그인 페이지로 리다이렉트
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                window.location.href = '/login';
                return;
            }

            // 기존 그룹 정보 찾기
            const existingGroup = recordGroups.find(group => group.id === id);
            if (!existingGroup) {
                console.error('Group not found');
                return;
            }

            // UpdateRecordGroupRequest 생성
            const updateRequest = UpdateRecordGroupRequest.create({
                title: existingGroup.title,
                isPublic: existingGroup.isPublic || false,
                color: color,
                priority: existingGroup.priority || 1
            });

            const response = await fetch(`/api/record-groups/${id}`, {
                method: HttpMethod.PUT,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: updateRequest.title,
                    isPublic: updateRequest.isPublic,
                    color: updateRequest.color,
                    priority: updateRequest.priority.toString()
                })
            });

            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }

            if (response.ok) {
                const updatedGroups = recordGroups.map(group => 
                    group.id === id ? { ...group, color } : group
                );
                onUpdateRecordGroups(updatedGroups);
                console.log('Updated Group Color:', id, color);
            } else {
                console.error('Failed to update group color');
            }
        } catch (error) {
            console.error('Error updating group color:', error);
        }
    };

    const deleteRecordGroup = async (id: string) => {
        try {
            // 토큰이 없으면 로그인 페이지로 리다이렉트
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                window.location.href = '/login';
                return;
            }

            const response = await fetch(`/api/record-groups/${id}`, {
                method: HttpMethod.DELETE,
            });

            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }

            if (response.ok) {
                const updatedGroups = recordGroups.filter(group => group.id !== id);
                onUpdateRecordGroups(updatedGroups);
                console.log('Deleted Group:', id);
            } else {
                console.error('Failed to delete group');
            }
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };


    const handleSaveNewGroup = (title: string) => {
        if (onCreateGroup) {
            onCreateGroup(title);
        }
    };

    const handleCancelNewGroup = () => {
        if (onCancelCreateGroup) {
            onCancelCreateGroup();
        }
    };

    return (
        <>
            {recordGroups?.map((group) => (
                <RecordGroupItem
                    key={group.id}
                    group={group}
                    isChecked={checkedGroups.has(group.id)}
                    onToggle={toggleGroup}
                    onUpdate={updateRecordGroup}
                    onUpdateColor={updateRecordGroupColor}
                    onDelete={deleteRecordGroup}
                />
            ))}
            {isCreatingGroup && (
                <NewRecordGroupItem
                    onSave={handleSaveNewGroup}
                    onCancel={handleCancelNewGroup}
                />
            )}
        </>
    );
};

export default RecordGroups;
