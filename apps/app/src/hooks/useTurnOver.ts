import { useState, useCallback, useMemo, useEffect } from 'react'
import { TurnOverDetail } from '@workfolio/shared/generated/common'
import { TurnOverDetailResponse, TurnOverDetailListResponse, TurnOverUpsertRequest } from '@workfolio/shared/generated/turn_over'
import { createAllSampleTurnOvers } from '@/utils/sampleTurnOverData'

// 모듈 레벨 캐시: 페이지 리마운트 시에도 데이터 유지
let cachedTurnOvers: TurnOverDetail[] = [];
let isInitialized = false;
// 모듈 레벨 로딩 상태: 모든 컴포넌트가 공유
let globalIsLoading = false;
// 로딩 상태 변경 리스너들
const loadingListeners = new Set<(loading: boolean) => void>();
// turnOvers 상태 변경 리스너들
const turnOversListeners = new Set<(turnOvers: TurnOverDetail[]) => void>();

// 로딩 상태 변경 알림
function notifyLoadingChange(loading: boolean) {
    globalIsLoading = loading;
    loadingListeners.forEach(listener => listener(loading));
}

// turnOvers 상태 변경 알림
function notifyTurnOversChange(turnOvers: TurnOverDetail[]) {
    cachedTurnOvers = turnOvers;
    turnOversListeners.forEach(listener => listener(turnOvers));
}

export function useTurnOver() {
    // 캐시된 데이터가 있으면 초기값으로 사용
    const [turnOvers, setTurnOvers] = useState<TurnOverDetail[]>(cachedTurnOvers)
    // 모듈 레벨 로딩 상태를 구독
    const [isLoading, setIsLoading] = useState(() => {
        // 캐시된 데이터가 있으면 로딩하지 않음
        if (cachedTurnOvers.length > 0) {
            return false;
        }
        // 초기화되지 않았고 데이터도 없으면 로딩
        return !isInitialized;
    })

    // 로딩 상태 리스너 등록
    useEffect(() => {
        const loadingListener = (loading: boolean) => {
            setIsLoading(loading);
        };
        loadingListeners.add(loadingListener);
        // 초기값 설정
        setIsLoading(globalIsLoading);
        
        return () => {
            loadingListeners.delete(loadingListener);
        };
    }, [])

    // turnOvers 상태 리스너 등록
    useEffect(() => {
        const turnOversListener = (newTurnOvers: TurnOverDetail[]) => {
            setTurnOvers(newTurnOvers);
        };
        turnOversListeners.add(turnOversListener);
        // 초기값 설정
        setTurnOvers(cachedTurnOvers);
        
        return () => {
            turnOversListeners.delete(turnOversListener);
        };
    }, [])

    const fetchTurnOvers = useCallback(async (): Promise<TurnOverDetail[]> => {
        notifyLoadingChange(true)
        try {
            // 토큰 확인 (useUser 대신 직접 확인하여 불필요한 의존성 제거)
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                // 로그인하지 않은 경우 샘플 데이터 사용
                const sampleTurnOvers = createAllSampleTurnOvers()
                const dataToUse = cachedTurnOvers.length > 0 ? cachedTurnOvers : sampleTurnOvers
                notifyTurnOversChange(dataToUse) // 모든 컴포넌트에 알림
                isInitialized = true
                notifyLoadingChange(false)
                return dataToUse
            }

            const response = await fetch('/api/turn-overs/details', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const data: TurnOverDetailListResponse = await response.json()
                const fetchedTurnOvers = data.turnOvers || []
                // 로그인한 경우 API 데이터만 사용 (샘플 데이터 사용하지 않음)
                notifyTurnOversChange(fetchedTurnOvers) // 모든 컴포넌트에 알림
                isInitialized = true
                notifyLoadingChange(false) // 명시적으로 로딩 상태 해제
                return fetchedTurnOvers
            } else {
                // API 실패 시 빈 배열
                notifyTurnOversChange([]) // 모든 컴포넌트에 알림
                isInitialized = true
                notifyLoadingChange(false) // 명시적으로 로딩 상태 해제
                return []
            }
        } catch (error) {
            console.error('Error fetching turn overs:', error)
            // 에러 발생 시 빈 배열
            notifyTurnOversChange([]) // 모든 컴포넌트에 알림
            isInitialized = true
            notifyLoadingChange(false) // 명시적으로 로딩 상태 해제
            return []
        } finally {
            // finally 블록에서도 확실히 로딩 상태 해제
            notifyLoadingChange(false)
        }
    }, [])

    const refreshTurnOvers = useCallback(() => {
        fetchTurnOvers()
    }, [fetchTurnOvers])

    const getTurnOverDetail = useCallback(async (id: string): Promise<TurnOverDetail | null> => {
        try {
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                // 로그인하지 않은 경우 샘플 데이터에서 찾기
                const sampleTurnOvers = createAllSampleTurnOvers()
                return sampleTurnOvers.find(to => to.id === id) || null
            }

            const response = await fetch(`/api/turn-over/details/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const data: TurnOverDetailResponse = await response.json()
                // 로그인한 경우 API 데이터만 사용 (샘플 데이터 사용하지 않음)
                return data.turnOver || null
            } else {
                console.error('Failed to fetch turn over detail')
                // API 실패 시 null 반환
                return null
            }
        } catch (error) {
            console.error('Error fetching turn over detail:', error)
            // 에러 발생 시 null 반환
            return null
        }
    }, [])

    // 이직 활동 생성/수정
    const upsertTurnOver = useCallback(async (request: TurnOverUpsertRequest): Promise<string | null> => {
        try {
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                return null
            }

            // 데이터 필터링: 기본값만 있는 항목 제거
            const filteredRequest: TurnOverUpsertRequest = { ...request };

            // Helper function to check if a string has meaningful content
            const hasContent = (value: string | undefined): boolean => {
                return value !== undefined && value !== null && value.trim() !== '';
            };

            // Helper function to check if a number has meaningful value
            const hasValue = (value: number | undefined): boolean => {
                return value !== undefined && value !== null && value > 0;
            };

            // TurnOverGoal 필터링
            if (filteredRequest.turnOverGoal) {
                const goal = filteredRequest.turnOverGoal;

                // SelfIntroductions 필터링
                if (goal.selfIntroductions) {
                    goal.selfIntroductions = goal.selfIntroductions.filter(item =>
                        hasContent(item.question) || hasContent(item.content)
                    );
                }

                // InterviewQuestions 필터링
                if (goal.interviewQuestions) {
                    goal.interviewQuestions = goal.interviewQuestions.filter(item =>
                        hasContent(item.question) || hasContent(item.answer)
                    );
                }

                // CheckList 필터링
                if (goal.checkList) {
                    goal.checkList = goal.checkList.filter(item =>
                        hasContent(item.content)
                    );
                }

                // Memos 필터링
                if (goal.memos) {
                    goal.memos = goal.memos.filter(memo =>
                        hasContent(memo.content)
                    );
                }

                // Attachments 필터링
                if (goal.attachments) {
                    goal.attachments = goal.attachments.filter(attachment =>
                        hasContent(attachment.fileName) || hasContent(attachment.fileUrl) || hasContent(attachment.url)
                    );
                }

                // Goal 전체가 비어있으면 undefined로 설정
                // 단, id가 있으면 기존 데이터가 있다는 의미이므로 유지
                if (
                    !goal.id && // id가 없을 때만 제거 가능
                    !hasContent(goal.reason) &&
                    !hasContent(goal.goal) &&
                    (!goal.selfIntroductions || goal.selfIntroductions.length === 0) &&
                    (!goal.interviewQuestions || goal.interviewQuestions.length === 0) &&
                    (!goal.checkList || goal.checkList.length === 0) &&
                    (!goal.memos || goal.memos.length === 0) &&
                    (!goal.attachments || goal.attachments.length === 0)
                ) {
                    filteredRequest.turnOverGoal = undefined;
                }
            }

            // TurnOverChallenge 필터링
            if (filteredRequest.turnOverChallenge) {
                const challenge = filteredRequest.turnOverChallenge;

                // JobApplications 필터링
                if (challenge.jobApplications) {
                    challenge.jobApplications = challenge.jobApplications.filter(jobApp => {
                        // ApplicationStages 필터링
                        if (jobApp.applicationStages) {
                            jobApp.applicationStages = jobApp.applicationStages.filter(stage =>
                                hasContent(stage.name) || hasContent(stage.memo)
                            );
                        }

                        // JobApplication이 의미있는 데이터를 가지고 있는지 확인
                        return (
                            hasContent(jobApp.name) ||
                            hasContent(jobApp.position) ||
                            hasContent(jobApp.jobPostingTitle) ||
                            hasContent(jobApp.jobPostingUrl) ||
                            hasContent(jobApp.applicationSource) ||
                            hasContent(jobApp.memo) ||
                            (jobApp.applicationStages && jobApp.applicationStages.length > 0)
                        );
                    });
                }

                // Memos 필터링
                if (challenge.memos) {
                    challenge.memos = challenge.memos.filter(memo =>
                        hasContent(memo.content)
                    );
                }

                // Attachments 필터링
                if (challenge.attachments) {
                    challenge.attachments = challenge.attachments.filter(attachment =>
                        hasContent(attachment.fileName) || hasContent(attachment.fileUrl) || hasContent(attachment.url)
                    );
                }

                // Challenge 전체가 비어있으면 undefined로 설정
                if (
                    (!challenge.jobApplications || challenge.jobApplications.length === 0) &&
                    (!challenge.memos || challenge.memos.length === 0) &&
                    (!challenge.attachments || challenge.attachments.length === 0)
                ) {
                    filteredRequest.turnOverChallenge = undefined;
                }
            }

            // TurnOverRetrospective 필터링
            if (filteredRequest.turnOverRetrospective) {
                const retrospective = filteredRequest.turnOverRetrospective;

                // Memos 필터링
                if (retrospective.memos) {
                    retrospective.memos = retrospective.memos.filter(memo =>
                        hasContent(memo.content)
                    );
                }

                // Attachments 필터링
                if (retrospective.attachments) {
                    retrospective.attachments = retrospective.attachments.filter(attachment =>
                        hasContent(attachment.fileName) || hasContent(attachment.fileUrl) || hasContent(attachment.url)
                    );
                }

                // Retrospective 전체가 비어있으면 undefined로 설정
                if (
                    !hasContent(retrospective.name) &&
                    !hasValue(retrospective.salary) &&
                    !hasContent(retrospective.position) &&
                    !hasContent(retrospective.jobTitle) &&
                    !hasContent(retrospective.rank) &&
                    !hasContent(retrospective.department) &&
                    !hasContent(retrospective.reason) &&
                    !hasValue(retrospective.score) &&
                    !hasContent(retrospective.reviewSummary) &&
                    !hasContent(retrospective.workType) &&
                    (!retrospective.memos || retrospective.memos.length === 0) &&
                    (!retrospective.attachments || retrospective.attachments.length === 0)
                ) {
                    filteredRequest.turnOverRetrospective = undefined;
                }
            }

            const response = await fetch('/api/turn-over', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filteredRequest),
            })

            if (response.ok) {
                // 목록 새로고침 (캐시 업데이트됨)
                const updatedTurnOvers = await fetchTurnOvers()
                // 저장된 ID 반환 (새로 생성된 경우 목록에서 가장 최근 항목 찾기)
                if (filteredRequest.id) {
                    return filteredRequest.id
                } else {
                    // 새로 생성된 경우, 가장 최근 항목의 ID 반환
                    const latestTurnOver = updatedTurnOvers[0] // 목록이 최신순으로 정렬되어 있다고 가정
                    return latestTurnOver?.id || null
                }
            } else {
                console.error('Failed to upsert turn over')
                return null
            }
        } catch (error) {
            console.error('Error upserting turn over:', error)
            return null
        }
    }, [fetchTurnOvers])

    // 이직 활동 복제
    const duplicateTurnOver = useCallback(async (id: string): Promise<boolean> => {
        try {
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                return false
            }

            const response = await fetch(`/api/turn-over/${id}/duplicate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                // 목록 새로고침 (캐시 업데이트됨)
                await fetchTurnOvers()
                return true
            } else {
                console.error('Failed to duplicate turn over')
                return false
            }
        } catch (error) {
            console.error('Error duplicating turn over:', error)
            return false
        }
    }, [fetchTurnOvers])

    // 이직 활동 삭제
    const deleteTurnOver = useCallback(async (id: string): Promise<boolean> => {
        try {
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                return false
            }

            const response = await fetch(`/api/turn-over/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                // 목록 새로고침 (캐시 업데이트됨)
                await fetchTurnOvers()
                return true
            } else {
                console.error('Failed to delete turn over')
                return false
            }
        } catch (error) {
            console.error('Error deleting turn over:', error)
            return false
        }
    }, [fetchTurnOvers])

    // 반환 객체를 메모이제이션하여 불필요한 리렌더링 방지
    return useMemo(() => ({
        turnOvers,
        isLoading,
        refreshTurnOvers,
        getTurnOverDetail,
        upsertTurnOver,
        duplicateTurnOver,
        deleteTurnOver
    }), [turnOvers, isLoading, refreshTurnOvers, getTurnOverDetail, upsertTurnOver, duplicateTurnOver, deleteTurnOver])
}
