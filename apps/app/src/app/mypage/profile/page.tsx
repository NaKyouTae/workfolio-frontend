"use client";

import ProfileManagement from '@/components/features/mypage/ProfileManagement';

export default function ProfilePage() {
    return (
        <>
            <div className="page-title">
                <div>
                    <h2>프로필 관리</h2>
                </div>
            </div>
            <div className="page-cont">
                <ProfileManagement />
            </div>
        </>
    );
}
