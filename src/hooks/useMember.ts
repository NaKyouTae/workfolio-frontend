import { useState, useEffect } from 'react'
import { Worker } from '../../generated/common'

interface UseMemberReturn {
    memberInfo: Worker | null
    loading: boolean
    error: string | null
    refetch: () => void
}

/**
 * 멤버 정보를 관리하는 커스텀 훅
 */
export const useMember = (): UseMemberReturn => {
    const [memberInfo, setMemberInfo] = useState<Worker | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchMemberInfo = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch('/api/member', {
                method: 'GET',
                credentials: 'include', // 쿠키 포함
            })

            if (!response.ok) {
                if (response.status === 401) {
                    setError('로그인이 필요합니다')
                    return
                }
                throw new Error('Failed to fetch member info')
            }

            const data = await response.json()
            setMemberInfo(data.worker)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
        } finally {
            setLoading(false)
        }
    }

    const refetch = () => {
        fetchMemberInfo()
    }

    useEffect(() => {
        fetchMemberInfo()
    }, [])

    return {
        memberInfo,
        loading,
        error,
        refetch
    }
}
