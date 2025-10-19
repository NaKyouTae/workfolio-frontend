import { useState, useEffect, useCallback, useMemo } from 'react'
import { Company } from '@/generated/common'
import { createSampleCompanies } from '@/utils/sampleData'

export function useCompanies() {
    const [companies, setCompanies] = useState<Company[]>([])
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
                const sampleCompanies = createSampleCompanies()
                setCompanies(sampleCompanies)
                return
            }

            const response = await fetch('/api/workers/companies', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const data = await response.json()
                setCompanies(data.companies || [])
            } else {
                console.error('Failed to fetch companies')
                // API 실패 시 샘플 데이터 사용
                const sampleCompanies = createSampleCompanies()
                setCompanies(sampleCompanies)
            }
        } catch (error) {
            console.error('Error fetching companies:', error)
            // 에러 시 샘플 데이터 사용
            const sampleCompanies = createSampleCompanies()
            setCompanies(sampleCompanies)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // 초기 로드 (한 번만 실행)
    useEffect(() => {
        fetchCompanies()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // 의도적으로 빈 배열 - 마운트 시 한 번만 실행

    const refreshCompanies = useCallback(() => {
        fetchCompanies()
    }, [fetchCompanies])

    // 반환 객체를 메모이제이션하여 불필요한 리렌더링 방지
    return useMemo(() => ({
        companies,
        isLoading,
        refreshCompanies
    }), [companies, isLoading, refreshCompanies])
}
