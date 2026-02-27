"use client";

import React, { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useNotification } from '@workfolio/shared/hooks/useNotification';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';

export default function WithdrawPage() {
    const { deleteAccount, isLoading } = useUser();
    const { showNotification } = useNotification();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleWithdraw = async () => {
        if (!confirm('정말로 회원 탈퇴를 하시겠습니까? 탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.')) {
            return;
        }

        try {
            setIsDeleting(true);
            await deleteAccount();
        } catch (error) {
            console.error('회원 탈퇴 실패:', error);
            showNotification('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="page-cont">
            <div className="cont-box">
                <div className="cont-tit">
                    <div>
                        <h3>회원 탈퇴</h3>
                    </div>
                </div>
                <ul className="setting-list">
                    <li>
                        <p>회원 탈퇴</p>
                        <button className="xsm" onClick={handleWithdraw} disabled={!isLoggedIn || isDeleting || isLoading}>탈퇴하기</button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
