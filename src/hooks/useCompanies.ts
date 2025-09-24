import { useState, useEffect, useCallback } from 'react'
import { Company } from '@/generated/common'
import { useUser } from './useUser'
import { createSampleCompanies } from '@/utils/sampleData'

export function useCompanies() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useUser()

    const fetchCompanies = useCallback(async () => {
        setIsLoading(true)
        try {
            if (!user) {
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
    }, [user])

    useEffect(() => {
        fetchCompanies()
    }, [fetchCompanies])

    const refreshCompanies = useCallback(() => {
        fetchCompanies()
    }, [fetchCompanies])

    return {
        companies,
        isLoading,
        refreshCompanies
    }
}
