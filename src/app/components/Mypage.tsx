import React from 'react';

const Mypage: React.FC = () => {
    return (
        <div style={{
            display: 'flex',
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            flexDirection: 'column',
            padding: '20px'
        }}>
            <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '20px'
            }}>
                마이페이지
            </div>
            
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div style={{
                    padding: '20px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9'
                }}>
                    <h3>프로필 정보</h3>
                    <p>닉네임: 닉네임</p>
                    <p>이메일: user@example.com</p>
                </div>
                
                <div style={{
                    padding: '20px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9'
                }}>
                    <h3>설정</h3>
                    <p>알림 설정</p>
                    <p>테마 설정</p>
                    <p>언어 설정</p>
                </div>
                
                <div style={{
                    padding: '20px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9'
                }}>
                    <h3>통계</h3>
                    <p>총 작업 시간: 120시간</p>
                    <p>완료된 작업: 45개</p>
                    <p>활성 프로젝트: 3개</p>
                </div>
            </div>
        </div>
    );
};

export default Mypage;
