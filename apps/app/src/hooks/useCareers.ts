import { useState, useEffect, useCallback, useMemo } from 'react'
import { Career } from '@workfolio/shared/generated/common'
import { createSampleCareers } from '@/utils/sampleCareerData'

export function useCareers() {
    const [careers, setCareers] = useState<Career[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchCompanies = useCallback(async () => {
        setIsLoading(true)
        try {
            // 토큰 확인 (useUser 대신 직접 확인하여 불필요한 의존성 제거)
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (!accessToken) {
                // 로그인하지 않은 경우 샘플 데이터 사용
                const sampleCareers = createSampleCareers()
                setCareers(sampleCareers)
                setIsLoading(false)
                return
            }

            const response = await fetch('/api/workers/careers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const data = await response.json()
                // 로그인한 경우 API 데이터만 사용 (샘플 데이터 사용하지 않음)
                setCareers(data.careers || [])
            } else {
                console.error('Failed to fetch companies')
                // API 실패 시 빈 배열
                setCareers([])
            }
        } catch (error) {
            console.error('Error fetching companies:', error)
            // 에러 시 빈 배열
            setCareers([])
        } finally {
            setIsLoading(false)
        }
    }, [])

    // 초기 로드 (한 번만 실행)
    useEffect(() => {
        fetchCompanies()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // 의도적으로 빈 배열 - 마운트 시 한 번만 실행

    const refreshCareers = useCallback(() => {
        fetchCompanies()
    }, [fetchCompanies])

    // 반환 객체를 메모이제이션하여 불필요한 리렌더링 방지
    return useMemo(() => ({
        careers,
        isLoading,
        refreshCareers
    }), [careers, isLoading, refreshCareers])
}
