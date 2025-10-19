import { useState, useCallback, useEffect, useMemo } from 'react';
import { SystemConfig, SystemConfig_SystemConfigType, systemConfig_SystemConfigTypeToJSON } from '@/generated/common';
import { SystemConfigGetResponse, SystemConfigUpdateRequest } from '@/generated/system_config';
import HttpMethod from '@/enums/HttpMethod';

interface UseSystemConfigReturn {
    systemConfig: SystemConfig | null;
    isLoading: boolean;
    error: string | null;
    fetchSystemConfig: () => Promise<void>;
    updateSystemConfig: (value: string) => Promise<boolean>;
}

/**
 * 시스템 설정을 가져오고 관리하는 훅
 * @param type - SystemConfig_SystemConfigType enum 값
 * @returns 시스템 설정 데이터와 관련 함수들
 * 
 * @example
 * const { systemConfig, isLoading, fetchSystemConfig } = useSystemConfig(
 *   SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE
 * );
 */
export const useSystemConfig = (type: SystemConfig_SystemConfigType): UseSystemConfigReturn => {
    const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // enum 값을 문자열로 변환
    const typeString = useMemo(() => systemConfig_SystemConfigTypeToJSON(type), [type]);

    // 시스템 설정 조회 함수
    const fetchSystemConfig = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`/api/system-configs/${typeString}`, {
                method: HttpMethod.GET
            });

            if (response.ok) {
                const data: SystemConfigGetResponse = await response.json();
                setSystemConfig(data.systemConfig || null);
            } else {
                const errorMessage = `Failed to fetch system config: ${response.status}`;
                setError(errorMessage);
                console.error(errorMessage);
            }
        } catch (error) {
            const errorMessage = 'Error fetching system config';
            setError(errorMessage);
            console.error(errorMessage, error);
        } finally {
            setIsLoading(false);
        }
    }, [typeString]);

    // 시스템 설정 업데이트 함수 (API 호출)
    const updateSystemConfig = useCallback(async (value: string): Promise<boolean> => {
        if (!systemConfig) {
            console.error('System config not loaded yet');
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const requestBody: SystemConfigUpdateRequest = {
                id: systemConfig.id,
                type: type,
                value: value
            };

            const response = await fetch('/api/system-configs', {
                method: HttpMethod.PUT,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                // 로컬 상태 업데이트
                setSystemConfig({
                    ...systemConfig,
                    value
                });
                console.log('System config updated successfully');
                return true;
            } else {
                const errorMessage = `Failed to update system config: ${response.status}`;
                setError(errorMessage);
                console.error(errorMessage);
                return false;
            }
        } catch (error) {
            const errorMessage = 'Error updating system config';
            setError(errorMessage);
            console.error(errorMessage, error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [systemConfig, type]);

    // 초기 로드
    useEffect(() => {
        fetchSystemConfig();
    }, [fetchSystemConfig]);

    return {
        systemConfig,
        isLoading,
        error,
        fetchSystemConfig,
        updateSystemConfig
    };
};

