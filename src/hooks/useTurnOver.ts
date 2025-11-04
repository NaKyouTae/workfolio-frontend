import { useState, useEffect, useCallback, useMemo } from 'react'
import { TurnOverDetail } from '@/generated/common'
import { TurnOverDetailResponse } from '@/generated/turn_over'

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

    // 반환 객체를 메모이제이션하여 불필요한 리렌더링 방지
    return useMemo(() => ({
        turnOvers,
        isLoading,
        refreshTurnOvers,
        getTurnOverDetail
    }), [turnOvers, isLoading, refreshTurnOvers, getTurnOverDetail])
}
