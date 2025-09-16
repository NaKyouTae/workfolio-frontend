import React, { useState } from 'react';

const Mypage: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState('profile');
    const [nickname, setNickname] = useState('춤추는 제이미');
    const [nicknameError, setNicknameError] = useState('이 닉네임은 이미 사용 중이에요.');

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
        if (e.target.value === '춤추는 제이미') {
            setNicknameError('이 닉네임은 이미 사용 중이에요.');
        } else {
            setNicknameError('');
        }
    };

    const handleDuplicateCheck = () => {
        // 중복 확인 로직
        console.log('닉네임 중복 확인');
    };

    const handleWithdraw = () => {
        // 회원 탈퇴 로직
        console.log('회원 탈퇴');
    };

    return (
        <div style={{
            display: 'flex',
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            flexDirection: 'column',
            backgroundColor: '#ffffff'
        }}>
            {/* Header */}
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
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                border: '1px solid #e9ecef',
                                                borderRadius: '4px',
                                                fontSize: '14px',
                                                outline: 'none'
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
                                    <button
                                        onClick={handleDuplicateCheck}
                                        disabled={!nickname || nickname === '춤추는 제이미'}
                                        style={{
                                            padding: '12px 20px',
                                            backgroundColor: nickname && nickname !== '춤추는 제이미' ? '#000000' : '#6c757d',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: nickname && nickname !== '춤추는 제이미' ? 'pointer' : 'not-allowed',
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        중복 확인
                                    </button>
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
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#6c757d',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'not-allowed',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    탈퇴하기
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
    );
};

export default Mypage;
