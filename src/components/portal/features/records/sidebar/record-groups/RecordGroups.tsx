import React, { useCallback } from 'react';
import HttpMethod from '@/enums/HttpMethod';
import { RecordGroup } from '@/generated/common';
import { useRecordGroupStore } from '@/store/recordGroupStore';
import { RecordGroupUpdateRequest } from '@/generated/record_group';
import { RecordGroupColor } from '@/enums/RecordGroupColor';
import RecordGroupItem from './RecordGroupItem';
import { useShallow } from 'zustand/react/shallow';

interface RecordGroupsProps {
    recordGroups: RecordGroup[];
    onRefresh: () => void;
}

const RecordGroups = React.memo(({ 
    recordGroups, 
    onRefresh,
}: RecordGroupsProps) => {
    // Zustand 한 번에 구독
    const { checkedGroups, toggleGroup, triggerRecordRefresh } = useRecordGroupStore(
        useShallow((state) => ({
            checkedGroups: state.checkedGroups,
            toggleGroup: state.toggleGroup,
            triggerRecordRefresh: state.triggerRecordRefresh,
        }))
    );

    const updateRecordGroup = useCallback(async (id: string, title: string) => {
        try {
            // 토큰이 없으면 로그인 페이지로 리다이렉트
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                // window.location.href = '/login'; // 임시 주석 처리
                console.log('⚠️ [RecordGroups] No access token found (임시 주석 처리)');
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
                // window.location.href = '/login'; // 임시 주석 처리
                console.log('⚠️ [RecordGroups] 401 Unauthorized (임시 주석 처리)');
                return;
            }

            if (response.ok) {
                // 서버 업데이트 성공 시 전체 데이터 새로고침
                onRefresh();
                // record 재조회 트리거
                triggerRecordRefresh();
            } else {
                console.error('Failed to update group');
            }
        } catch (error) {
            console.error('Error updating group:', error);
        }
    }, [recordGroups, onRefresh, triggerRecordRefresh]);

    const updateRecordGroupColor = useCallback(async (id: string, color: string) => {
        try {
            // 토큰이 없으면 로그인 페이지로 리다이렉트
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                // window.location.href = '/login'; // 임시 주석 처리
                console.log('⚠️ [RecordGroups] No access token found (임시 주석 처리)');
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
                // window.location.href = '/login'; // 임시 주석 처리
                console.log('⚠️ [RecordGroups] 401 Unauthorized (임시 주석 처리)');
                return;
            }

            if (response.ok) {
                // 서버 업데이트 성공 시 전체 데이터 새로고침
                onRefresh();
                // record 재조회 트리거 (color 변경 시 record에도 반영)
                triggerRecordRefresh();
            } else {
                console.error('Failed to update group color');
            }
        } catch (error) {
            console.error('Error updating group color:', error);
        }
    }, [recordGroups, onRefresh, triggerRecordRefresh]);

    const deleteRecordGroup = useCallback(async (id: string) => {
        try {
            // 토큰이 없으면 로그인 페이지로 리다이렉트
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                // window.location.href = '/login'; // 임시 주석 처리
                console.log('⚠️ [RecordGroups] No access token found (임시 주석 처리)');
                return;
            }

            const response = await fetch(`/api/record-groups/${id}`, {
                method: HttpMethod.DELETE,
            });

            if (response.status === 401) {
                // window.location.href = '/login'; // 임시 주석 처리
                console.log('⚠️ [RecordGroups] 401 Unauthorized (임시 주석 처리)');
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
    }, [onRefresh]);

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
});

RecordGroups.displayName = 'RecordGroups';

export default RecordGroups;
