import React, { useState } from 'react';
import '@workfolio/shared/styles/records-config.css';
import RecordManagement from './RecordManagement';
import { SystemConfig_SystemConfigType } from '@workfolio/shared/generated/common';
import { SystemConfigUpdateRequest } from '@workfolio/shared/generated/system_config';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';
import { useSystemConfigStore } from '@workfolio/shared/store/systemConfigStore';
import { useNotification } from '@workfolio/shared/hooks/useNotification';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import LoginModal from '@workfolio/shared/ui/LoginModal';

interface RecordConfigProps {
    onClose: () => void;
}

const RecordConfig: React.FC<RecordConfigProps> = ({ onClose }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { getSystemConfig } = useSystemConfigStore();
    const { showNotification } = useNotification();

    const handleSave = async () => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            return;
        }

        try {
            const systemConfig = getSystemConfig(SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE);

            if (!systemConfig) {
                showNotification('설정을 불러오는 중입니다. 잠시 후 다시 시도해주세요.', 'error');
                return;
            }

            const requestBody: SystemConfigUpdateRequest = {
                id: systemConfig.id,
                type: SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE,
                value: systemConfig.value
            };

            const response = await fetch('/api/system-configs', {
                method: HttpMethod.PUT,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                showNotification('설정이 저장되었습니다.', 'success');
                onClose();
            } else {
                console.error(`Failed to update system config: ${response.status}`);
                showNotification('설정 저장에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error('Error updating system config:', error);
            showNotification('설정 저장 중 오류가 발생했습니다.', 'error');
        }
    };

    return (
        <div className="record-config-content">
            <article>
                <RecordManagement />
            </article>
            <div className="modal-btn">
                <button onClick={handleSave}>저장하기</button>
            </div>
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
};

export default RecordConfig;
