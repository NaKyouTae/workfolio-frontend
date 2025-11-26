import { create } from 'zustand';
import { SystemConfig, SystemConfig_SystemConfigType, systemConfig_SystemConfigTypeToJSON } from '@/generated/common';
import { SystemConfigGetResponse, SystemConfigUpdateRequest } from '@/generated/system_config';
import HttpMethod from '@/enums/HttpMethod';
import { isLoggedIn } from '@/utils/authUtils';

interface SystemConfigState {
    // SystemConfig 데이터 (타입별로 저장)
    configs: Map<SystemConfig_SystemConfigType, SystemConfig>;
    
    // 로딩 상태
    isLoading: boolean;
    
    // 에러 상태
    error: string | null;
    
    // 액션들
    fetchSystemConfig: (type: SystemConfig_SystemConfigType) => Promise<void>;
    updateSystemConfig: (type: SystemConfig_SystemConfigType, value: string) => Promise<boolean>;
    getSystemConfig: (type: SystemConfig_SystemConfigType) => SystemConfig | undefined;
    setSystemConfig: (type: SystemConfig_SystemConfigType, config: SystemConfig) => void;
}

export const useSystemConfigStore = create<SystemConfigState>((set, get) => ({
    configs: new Map(),
    isLoading: false,
    error: null,

    // 시스템 설정 조회
    fetchSystemConfig: async (type: SystemConfig_SystemConfigType) => {
        // 로그인하지 않은 경우 샘플 데이터 사용
        if (!isLoggedIn()) {
            // DEFAULT_RECORD_TYPE의 기본값 설정
            if (type === SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE) {
                const sampleConfig: SystemConfig = {
                    id: 'sample-default-record-type',
                    type: SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE,
                    value: 'MONTHLY', // 기본값
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                };
                const newConfigs = new Map(get().configs);
                newConfigs.set(type, sampleConfig);
                set({ configs: newConfigs, isLoading: false });
                return;
            }
            set({ isLoading: false });
            return;
        }
        
        set({ isLoading: true, error: null });
        
        try {
            const typeString = systemConfig_SystemConfigTypeToJSON(type);
            const response = await fetch(`/api/system-configs/${typeString}`, {
                method: HttpMethod.GET
            });

            if (response.ok) {
                const data: SystemConfigGetResponse = await response.json();
                if (data.systemConfig) {
                    const newConfigs = new Map(get().configs);
                    newConfigs.set(type, data.systemConfig);
                    set({ configs: newConfigs, isLoading: false });
                }
            } else {
                // 401 에러면 샘플 데이터 사용
                if (response.status === 401) {
                    if (type === SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE) {
                        const sampleConfig: SystemConfig = {
                            id: 'sample-default-record-type',
                            type: SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE,
                            value: 'MONTHLY',
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                        };
                        const newConfigs = new Map(get().configs);
                        newConfigs.set(type, sampleConfig);
                        set({ configs: newConfigs, isLoading: false });
                        return;
                    }
                }
                const errorMessage = `Failed to fetch system config: ${response.status}`;
                set({ error: errorMessage, isLoading: false });
                // 로그인하지 않은 상태에서 발생하는 에러는 조용히 처리
                if (isLoggedIn()) {
                    console.error(errorMessage);
                }
            }
        } catch (error) {
            // 로그인하지 않은 상태에서 발생하는 에러는 조용히 처리하고 샘플 데이터 사용
            if (!isLoggedIn()) {
                if (type === SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE) {
                    const sampleConfig: SystemConfig = {
                        id: 'sample-default-record-type',
                        type: SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE,
                        value: 'MONTHLY',
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                    };
                    const newConfigs = new Map(get().configs);
                    newConfigs.set(type, sampleConfig);
                    set({ configs: newConfigs, isLoading: false });
                    return;
                }
            }
            const errorMessage = 'Error fetching system config';
            set({ error: errorMessage, isLoading: false });
            if (isLoggedIn()) {
                console.error(errorMessage, error);
            }
        }
    },

    // 시스템 설정 업데이트
    updateSystemConfig: async (type: SystemConfig_SystemConfigType, value: string): Promise<boolean> => {
        const config = get().configs.get(type);
        
        if (!config) {
            return false;
        }

        set({ isLoading: true, error: null });

        try {
            const requestBody: SystemConfigUpdateRequest = {
                id: config.id,
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
                const newConfigs = new Map(get().configs);
                newConfigs.set(type, { ...config, value });
                set({ configs: newConfigs, isLoading: false });
                return true;
            } else {
                const errorMessage = `Failed to update system config: ${response.status}`;
                set({ error: errorMessage, isLoading: false });
                console.error(errorMessage);
                return false;
            }
        } catch (error) {
            const errorMessage = 'Error updating system config';
            set({ error: errorMessage, isLoading: false });
            console.error(errorMessage, error);
            return false;
        }
    },

    // 시스템 설정 가져오기 (즉시)
    getSystemConfig: (type: SystemConfig_SystemConfigType) => {
        return get().configs.get(type);
    },

    // 시스템 설정 직접 설정
    setSystemConfig: (type: SystemConfig_SystemConfigType, config: SystemConfig) => {
        const newConfigs = new Map(get().configs);
        newConfigs.set(type, config);
        set({ configs: newConfigs });
    }
}));

