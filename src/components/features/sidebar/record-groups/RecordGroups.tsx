import React, { useRef } from 'react';
import HttpMethod from '@/enums/HttpMethod';
import { RecordGroup } from '@/generated/common';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import { RecordGroupUpdateRequest } from '@/generated/record_group';
import { RecordGroupColor } from '@/enums/RecordGroupColor';
import RecordGroupItem from './RecordGroupItem';

interface RecordGroupsProps {
    recordGroups: RecordGroup[];
    onUpdateRecordGroups: (updatedGroups: RecordGroup[]) => void;
    onRefresh: () => void;
}

const RecordGroups = ({ 
    recordGroups, 
    onUpdateRecordGroups,
    onRefresh,
}: RecordGroupsProps) => {
    const { checkedGroups, toggleGroup, triggerRecordRefresh } = useRecordGroupStore();

    // 🔍 디버깅: RecordGroups 렌더링 횟수 추적
    const renderCount = useRef(0);
    renderCount.current += 1;

    if (process.env.NODE_ENV === 'development') {
        console.log(`🟡 RecordGroups 렌더링 #${renderCount.current}`, {
            recordGroupsCount: recordGroups.length,
            timestamp: new Date().toISOString()
        });
    }

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
            const updateRequest = RecordGroupUpdateRequest.create({
                title: title,
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
                // record 재조회 트리거
                triggerRecordRefresh();
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
            const updateRequest = RecordGroupUpdateRequest.create({
                title: existingGroup.title,
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
                // record 재조회 트리거 (color 변경 시 record에도 반영)
                triggerRecordRefresh();
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
                // 레코드 그룹 삭제 성공 시 레코드 그룹 다시 조회
                onRefresh();
            } else {
                console.error('Failed to delete group');
            }
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    return (
        <>
            {recordGroups?.map((group, index) => (
                <RecordGroupItem
                    key={group.id || `group-${index}`}
                    group={group}
                    isChecked={checkedGroups.has(group.id)}
                    onToggle={toggleGroup}
                    onUpdate={updateRecordGroup}
                    onUpdateColor={updateRecordGroupColor}
                    onDelete={deleteRecordGroup}
                />
            ))}
        </>
    );
};

export default RecordGroups;
