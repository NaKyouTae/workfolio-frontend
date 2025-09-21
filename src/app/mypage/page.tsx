"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import CareerManagement from '@/components/features/career/CareerManagement';
import JobSearchPage from '@/components/features/job-search/JobSearchPage';
import Header from '@/components/layouts/Header';

const Mypage: React.FC = () => {
    const { user, updateUserNickname, deleteAccount, isLoading, isLoggedIn } = useUser();
    const [activeMenu, setActiveMenu] = useState('profile');
    const [nickname, setNickname] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // 유저 정보가 로드되면 닉네임 설정
    useEffect(() => {
        if (user) {
            setNickname(user.nickName);
        } else if (!isLoggedIn) {
            // 로그인하지 않은 경우 샘플 닉네임 설정
            setNickname('샘플 사용자');
        }
    }, [user, isLoggedIn]);

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
        // 닉네임 변경 시 오류 메시지 초기화
        if (nicknameError) {
            setNicknameError('');
        }
    };

    const handleDuplicateCheck = async () => {
        if (!nickname || nickname === user?.nickName) {
            return;
        }
        
        try {
            setIsUpdating(true);
            setNicknameError('');
            
            await updateUserNickname(nickname);
            
            // 성공 시 오류 메시지 초기화
            setNicknameError('');
        } catch {
            // 에러는 updateUserNickname에서 처리됨
            setNicknameError('이 닉네임은 이미 사용 중이에요.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleWithdraw = async () => {
        if (!confirm('정말로 회원 탈퇴를 하시겠습니까? 탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.')) {
            return;
        }
        
        try {
            setIsDeleting(true);
            await deleteAccount();
            // 성공 시에는 자동으로 리다이렉트되므로 여기까지 도달하지 않음
        } catch (error) {
            console.error('회원 탈퇴 실패:', error);
            // 400 에러는 이미 deleteAccount에서 성공으로 처리되므로 여기까지 오지 않음
            alert('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Header />
            <div style={{
                display: 'flex',
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                flexDirection: 'column',
                backgroundColor: '#ffffff'
            }}>
                {/* Page Title */}
                <div style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    padding: '20px 40px',
                    fontSize: '18px',
                    fontWeight: 'bold'
                }}>
                    마이페이지
                </div>

            {/* Main Content */}
            <div style={{
                display: 'flex',
                flex: 1,
                height: 'calc(100vh - 120px)'
            }}>
                {/* Left Menu */}
                <div style={{
                    width: '200px',
                    backgroundColor: '#f8f9fa',
                    borderRight: '1px solid #e9ecef',
                    padding: '20px 0'
                }}>
                    <div style={{
                        padding: '15px 30px',
                        cursor: 'pointer',
                        backgroundColor: activeMenu === 'profile' ? '#ffffff' : 'transparent',
                        borderRight: activeMenu === 'profile' ? '3px solid #000000' : 'none',
                        fontWeight: activeMenu === 'profile' ? 'bold' : 'normal'
                    }} onClick={() => setActiveMenu('profile')}>
                        프로필 관리
                    </div>
                    <div style={{
                        padding: '15px 30px',
                        cursor: 'pointer',
                        backgroundColor: activeMenu === 'career' ? '#ffffff' : 'transparent',
                        borderRight: activeMenu === 'career' ? '3px solid #000000' : 'none',
                        fontWeight: activeMenu === 'career' ? 'bold' : 'normal'
                    }} onClick={() => setActiveMenu('career')}>
                        커리어 관리
                    </div>
                    <div style={{
                        padding: '15px 30px',
                        cursor: 'pointer',
                        backgroundColor: activeMenu === 'jobsearch' ? '#ffffff' : 'transparent',
                        borderRight: activeMenu === 'jobsearch' ? '3px solid #000000' : 'none',
                        fontWeight: activeMenu === 'jobsearch' ? 'bold' : 'normal'
                    }} onClick={() => setActiveMenu('jobsearch')}>
                        구직 관리
                    </div>
                    <div style={{
                        padding: '15px 30px',
                        cursor: 'pointer',
                        backgroundColor: activeMenu === 'withdraw' ? '#ffffff' : 'transparent',
                        borderRight: activeMenu === 'withdraw' ? '3px solid #000000' : 'none',
                        fontWeight: activeMenu === 'withdraw' ? 'bold' : 'normal'
                    }} onClick={() => setActiveMenu('withdraw')}>
                        회원 탈퇴
                    </div>
                </div>

                {/* Right Content */}
                <div style={{
                    flex: 1,
                    padding: '40px',
                    overflow: 'auto',
                    backgroundColor: '#ffffff'
                }}>
                    {activeMenu === 'profile' && (
                        <div>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                marginBottom: '30px',
                                color: '#000000'
                            }}>
                                프로필 관리
                            </h2>
                            
                            {!isLoggedIn && (
                                <div style={{
                                    backgroundColor: '#fff3cd',
                                    border: '1px solid #ffeaa7',
                                    borderRadius: '4px',
                                    padding: '15px',
                                    marginBottom: '30px',
                                    color: '#856404'
                                }}>
                                    📋 샘플 데이터를 표시하고 있습니다. 로그인하면 실제 프로필을 관리할 수 있습니다.
                                </div>
                            )}
                            
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    marginBottom: '8px',
                                    color: '#000000'
                                }}>
                                    닉네임(필수)
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <input
                                            type="text"
                                            value={nickname}
                                            onChange={handleNicknameChange}
                                            disabled={!isLoggedIn}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '1px solid #e9ecef',
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                backgroundColor: !isLoggedIn ? '#f8f9fa' : '#ffffff',
                                                color: !isLoggedIn ? '#6c757d' : '#000000'
                                            }}
                                        />
                                        {nickname && (
                                            <button
                                                onClick={() => setNickname('')}
                                                style={{
                                                    position: 'absolute',
                                                    right: '12px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    fontSize: '16px',
                                                    color: '#6c757d'
                                                }}
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                    <div>
                                        <button 
                                            onClick={handleDuplicateCheck} 
                                            disabled={!isLoggedIn || !nickname || nickname === user?.nickName || isUpdating || isLoading}
                                            style={{ 
                                                width: '70px', 
                                                height: '30px', 
                                                backgroundColor: (!isLoggedIn || !nickname || nickname === user?.nickName || isUpdating || isLoading) ? "#6c757d" : "#007bff", 
                                                color: 'white', 
                                                border: 'none', 
                                                borderRadius: '4px',
                                                cursor: (!isLoggedIn || !nickname || nickname === user?.nickName || isUpdating || isLoading) ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            {isUpdating ? '변경 중...' : '중복 확인'}
                                        </button>
                                    </div>
                                    
                                </div>
                                {nicknameError && (
                                    <div style={{
                                        color: '#dc3545',
                                        fontSize: '12px',
                                        marginTop: '5px'
                                    }}>
                                        {nicknameError}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeMenu === 'career' && (
                        <CareerManagement />
                    )}

                    {activeMenu === 'jobsearch' && (
                        <JobSearchPage />
                    )}

                    {activeMenu === 'withdraw' && (
                        <div>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                marginBottom: '30px',
                                color: '#000000'
                            }}>
                                회원 탈퇴
                            </h2>
                            
                            {!isLoggedIn && (
                                <div style={{
                                    backgroundColor: '#fff3cd',
                                    border: '1px solid #ffeaa7',
                                    borderRadius: '4px',
                                    padding: '15px',
                                    marginBottom: '30px',
                                    color: '#856404'
                                }}>
                                    📋 로그인하지 않은 상태에서는 회원 탈퇴 기능을 사용할 수 없습니다.
                                </div>
                            )}
                            
                            <div style={{ marginBottom: '30px' }}>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#6c757d',
                                    marginBottom: '20px'
                                }}>
                                    회원 탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
                                </p>
                                <button
                                    onClick={handleWithdraw}
                                    disabled={!isLoggedIn || isDeleting || isLoading}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: (!isLoggedIn || isDeleting || isLoading) ? '#6c757d' : '#dc3545',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: (!isLoggedIn || isDeleting || isLoading) ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {isDeleting ? '탈퇴 중...' : '탈퇴하기'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div style={{
                backgroundColor: '#f8f9fa',
                borderTop: '1px solid #e9ecef',
                padding: '20px 40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                color: '#6c757d'
            }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <span style={{ cursor: 'pointer' }}>고객센터</span>
                    <span style={{ color: '#e9ecef' }}>|</span>
                    <span style={{ cursor: 'pointer' }}>이용약관</span>
                    <span style={{ color: '#e9ecef' }}>|</span>
                    <span style={{ cursor: 'pointer' }}>개인정보처리방침</span>
                </div>
                <div>
                    © 2025 Spectrum. All rights reserved.
                </div>
            </div>
        </div>
        </>
    );
};

export default Mypage;
