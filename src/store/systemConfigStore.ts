import { create } from 'zustand';
import { SystemConfig, SystemConfig_SystemConfigType, systemConfig_SystemConfigTypeToJSON } from '@/generated/common';
import { SystemConfigGetResponse, SystemConfigUpdateRequest } from '@/generated/system_config';
import HttpMethod from '@/enums/HttpMethod';

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
                const errorMessage = `Failed to fetch system config: ${response.status}`;
                set({ error: errorMessage, isLoading: false });
                console.error(errorMessage);
            }
        } catch (error) {
            const errorMessage = 'Error fetching system config';
            set({ error: errorMessage, isLoading: false });
            console.error(errorMessage, error);
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

