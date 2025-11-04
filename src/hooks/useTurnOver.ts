import { useState, useEffect, useCallback, useMemo } from 'react'
import { TurnOverDetail } from '@/generated/common'
import { TurnOverDetailResponse, TurnOverUpsertRequest } from '@/generated/turn_over'

export function useTurnOver() {
    const [turnOvers, setTurnOvers] = useState<TurnOverDetail[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchTurnOvers = useCallback(async () => {
        setIsLoading(true)
        try {
            // 토큰 확인 (useUser 대신 직접 확인하여 불필요한 의존성 제거)
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                // 로그인하지 않은 경우 빈 배열 사용
                setTurnOvers([])
                return
            }

            const response = await fetch('/api/turn-over', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const data = await response.json()
                setTurnOvers(data.turnOvers || [])
            } else {
                console.error('Failed to fetch turn overs')
                setTurnOvers([])
            }
        } catch (error) {
            console.error('Error fetching turn overs:', error)
            setTurnOvers([])
        } finally {
            setIsLoading(false)
        }
    }, [])

    // 초기 로드 (한 번만 실행)
    useEffect(() => {
        fetchTurnOvers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // 의도적으로 빈 배열 - 마운트 시 한 번만 실행

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
                console.error('No access token found')
                return null
            }

            const response = await fetch(`/api/turn-over/details/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const data: TurnOverDetailResponse = await response.json()
                return data.turnOver || null
            } else {
                console.error('Failed to fetch turn over detail')
                return null
            }
        } catch (error) {
            console.error('Error fetching turn over detail:', error)
            return null
        }
    }, [])

    // 이직 활동 생성/수정
    const upsertTurnOver = useCallback(async (request: TurnOverUpsertRequest): Promise<boolean> => {
        try {
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                console.error('No access token found')
                return false
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
                if (
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
                // 목록 새로고침
                await fetchTurnOvers()
                return true
            } else {
                console.error('Failed to upsert turn over')
                return false
            }
        } catch (error) {
            console.error('Error upserting turn over:', error)
            return false
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
                console.error('No access token found')
                return false
            }

            const response = await fetch(`/api/turn-over/${id}/duplicate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                // 목록 새로고침
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
                console.error('No access token found')
                return false
            }

            const response = await fetch(`/api/turn-over/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                // 목록 새로고침
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
