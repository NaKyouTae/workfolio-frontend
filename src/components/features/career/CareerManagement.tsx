import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Company, Certifications, Degrees, Education } from '@/generated/common';
import CompanyManagement from './CompanyManagement';
import CertificationManagement from './CertificationManagement';
import DegreesManagement from './DegreesManagement';
import EducationManagement from './EducationManagement';
import HttpMethod from '@/enums/HttpMethod';
import { useUser } from '@/hooks/useUser';
import { createSampleCompanies, createSampleCertifications, createSampleDegrees, createSampleEducations } from '@/utils/sampleData';

const CareerManagement: React.FC = () => {
  // 사용자 인증 상태
  const { isLoggedIn, user, isLoading: userLoading, fetchUser } = useUser();
  
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  
  // 현재 선택된 섹션
  const [activeSection, setActiveSection] = useState<string>('companies');
  
  // 서버에서 가져온 데이터
  const [careerData, setCareerData] = useState<{
    companies: Company[];
    certifications: Certifications[];
    degrees: Degrees[];
    educations: Education[];
  }>({
    companies: [],
    certifications: [],
    degrees: [],
    educations: []
  });

  // 섹션 정보
  const sections = [
    { key: 'companies', title: '회사 이력', icon: '🏢' },
    { key: 'certifications', title: '자격증', icon: '📜' },
    { key: 'degrees', title: '학위', icon: '🎓' },
    { key: 'educations', title: '교육', icon: '📚' }
  ];

  // 각 섹션의 ref
  const sectionRefs = {
    companies: useRef<HTMLDivElement>(null),
    certifications: useRef<HTMLDivElement>(null),
    degrees: useRef<HTMLDivElement>(null),
    educations: useRef<HTMLDivElement>(null)
  };

  // 스크롤 컨테이너 ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 초기 로드 여부를 추적하는 ref
  const isInitialLoad = useRef(true);

  // 컴포넌트 마운트 시 사용자 정보 가져오기
  useEffect(() => {
    if (!user && !userLoading) {
      console.log('Fetching user information...');
      fetchUser().catch(error => {
        console.error('Failed to fetch user:', error);
      });
    }
  }, [user, userLoading, fetchUser]);

  // 각 항목별 데이터 조회 함수들
  const fetchCompanies = useCallback(async () => {
    try {
      const response = await fetch('/api/workers/companies', {
        method: HttpMethod.GET,
      });

      if (response.ok) {
        const res = await response.json();
        return res.companies || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching companies:', error);
      return [];
    }
  }, []);

  const fetchCertifications = useCallback(async () => {
    try {
      const response = await fetch('/api/workers/certifications', {
        method: HttpMethod.GET,
      });

      if (response.ok) {
        const res = await response.json();

        return res.certifications || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching certifications:', error);
      return [];
    }
  }, []);

  const fetchDegrees = useCallback(async () => {
    try {
      const response = await fetch('/api/workers/degrees', {
        method: HttpMethod.GET,
      });

      if (response.ok) {
        const res = await response.json();
        return res.degrees || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching degrees:', error);
      return [];
    }
  }, []);

  const fetchEducations = useCallback(async () => {
    try {
      const response = await fetch('/api/workers/educations', {
        method: HttpMethod.GET,
      });

      if (response.ok) {
        const res = await response.json();
        return res.educations || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching educations:', error);
      return [];
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 조회
  useEffect(() => {
    // 사용자 로딩이 완료되고 초기 로드가 필요한 경우에만 데이터 조회
    if (isInitialLoad.current && !userLoading) {
      const fetchAllCareerData = async () => {
        try {
          console.log('========================');
          console.log('CareerManagement: Initial data fetch started');
          console.log('isLoggedIn:', isLoggedIn);
          console.log('user:', user);
          console.log('userLoading:', userLoading);
          console.log('========================');
          
          setIsLoading(true);
          
          let companies: Company[] = [];
          let certifications: Certifications[] = [];
          let degrees: Degrees[] = [];
          let educations: Education[] = [];

          // 쿠키에서 토큰 확인
          const hasToken = document.cookie.includes('accessToken=') || document.cookie.includes('refreshToken=');
          
          // 로그인 상태를 더 정확하게 확인
          const isUserLoggedIn = isLoggedIn && user && user.id && user.id !== 'sample-user-id';
          
          if (isUserLoggedIn || hasToken) {
            console.log('User is logged in, fetching real data');
            console.log('hasToken:', hasToken);
            console.log('user:', user);
            console.log('isLoggedIn:', isLoggedIn);
            
            try {
              // 로그인된 경우 서버에서 데이터 조회
              [companies, certifications, degrees, educations] = await Promise.all([
                fetchCompanies(),
                fetchCertifications(),
                fetchDegrees(),
                fetchEducations()
              ]);
            } catch (apiError) {
              console.error('API 호출 중 에러 발생, 샘플 데이터로 대체:', apiError);
              // API 호출 실패 시 샘플 데이터 사용
              companies = createSampleCompanies();
              certifications = createSampleCertifications();
              degrees = createSampleDegrees();
              educations = createSampleEducations();
            }
          } else {
            // 로그인되지 않은 경우 샘플 데이터 사용
            console.log('User is not logged in, using sample data');
            console.log('hasToken:', hasToken);
            console.log('user:', user);
            console.log('isLoggedIn:', isLoggedIn);
            companies = createSampleCompanies();
            certifications = createSampleCertifications();
            degrees = createSampleDegrees();
            educations = createSampleEducations();
          }

          setCareerData({
            companies,
            certifications,
            degrees,
            educations
          });
          
          isInitialLoad.current = false; // 초기 로드 완료 표시
          
          console.log('========================');
          console.log('CareerManagement: Initial data fetch completed');
          console.log('========================');
        } catch (error) {
          console.error('Error fetching career data:', error);
          // 에러 발생 시에도 샘플 데이터로 대체
          setCareerData({
            companies: createSampleCompanies(),
            certifications: createSampleCertifications(),
            degrees: createSampleDegrees(),
            educations: createSampleEducations()
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchAllCareerData();
    }
  }, [isLoggedIn, user, userLoading, fetchCompanies, fetchCertifications, fetchDegrees, fetchEducations]);

  // 데이터 변경 핸들러들
  const handleCompaniesChange = useCallback((data: Company[]) => {
    setCareerData(prev => ({ ...prev, companies: data }));
  }, []);

  const handleCertificationsChange = useCallback((data: Certifications[]) => {
    setCareerData(prev => ({ ...prev, certifications: data }));
  }, []);

  const handleDegreesChange = useCallback((data: Degrees[]) => {
    setCareerData(prev => ({ ...prev, degrees: data }));
  }, []);

  const handleEducationsChange = useCallback((data: Education[]) => {
    setCareerData(prev => ({ ...prev, educations: data }));
  }, []);

  // 섹션 변경 함수
  const handleSectionChange = (sectionKey: string) => {
    setActiveSection(sectionKey);
    
    // 해당 섹션으로 스크롤 (30px 오프셋 적용)
    const targetRef = sectionRefs[sectionKey as keyof typeof sectionRefs];
    const scrollContainer = scrollContainerRef.current;
    
    if (targetRef?.current && scrollContainer) {
      const targetElement = targetRef.current;
      const containerRect = scrollContainer.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      
      // 현재 스크롤 위치에서 타겟 요소까지의 거리 계산
      const scrollTop = scrollContainer.scrollTop;
      const targetOffsetTop = targetRect.top - containerRect.top + scrollTop;
      
      // 30px 오프셋을 적용하여 스크롤
      scrollContainer.scrollTo({
        top: targetOffsetTop - 30,
        behavior: 'smooth'
      });
    }
  };

  // 사용자 로딩 중이거나 데이터 로딩 중일 때
  if (userLoading || isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px', 
        fontSize: '18px'
      }}>
        {userLoading ? '사용자 정보를 확인하는 중...' : '데이터를 불러오는 중...'}
      </div>
    );
  }

  // 모든 섹션 렌더링
  const renderAllSections = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {/* 회사 이력 섹션 */}
        <div 
          ref={sectionRefs.companies}
          id="companies-section"
          style={{ 
            padding: '30px', 
            backgroundColor: '#fff', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: activeSection === 'companies' ? '2px solid #2196f3' : '2px solid transparent'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '24px', marginRight: '12px' }}>🏢</span>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: 0 }}>회사 이력</h2>
          </div>
          <CompanyManagement
            initialData={careerData.companies}
            onDataChange={handleCompaniesChange}
          />
        </div>

        {/* 자격증 섹션 */}
        <div 
          ref={sectionRefs.certifications}
          id="certifications-section"
          style={{ 
            padding: '30px', 
            backgroundColor: '#fff', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: activeSection === 'certifications' ? '2px solid #2196f3' : '2px solid transparent'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '24px', marginRight: '12px' }}>📜</span>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: 0 }}>자격증</h2>
          </div>
          <CertificationManagement
            initialData={careerData.certifications}
            onDataChange={handleCertificationsChange}
          />
        </div>

        {/* 학위 섹션 */}
        <div 
          ref={sectionRefs.degrees}
          id="degrees-section"
          style={{ 
            padding: '30px', 
            backgroundColor: '#fff', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: activeSection === 'degrees' ? '2px solid #2196f3' : '2px solid transparent'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '24px', marginRight: '12px' }}>🎓</span>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: 0 }}>학위</h2>
          </div>
          <DegreesManagement
            initialData={careerData.degrees}
            onDataChange={handleDegreesChange}
          />
        </div>

        {/* 교육 섹션 */}
        <div 
          ref={sectionRefs.educations}
          id="educations-section"
          style={{ 
            padding: '30px', 
            backgroundColor: '#fff', 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: activeSection === 'educations' ? '2px solid #2196f3' : '2px solid transparent'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '24px', marginRight: '12px' }}>📚</span>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: 0 }}>교육</h2>
          </div>
          <EducationManagement
            initialData={careerData.educations}
            onDataChange={handleEducationsChange}
          />
        </div>
      </div>
    );
  };

  // 메인 뷰
  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 6.4rem)', backgroundColor: '#f8f9fa' }}>
      {/* 좌측 네비게이션 (책갈피) */}
      <div style={{ 
        width: '250px', 
        backgroundColor: '#fff', 
        borderRight: '1px solid #e0e0e0',
        padding: '20px 0',
        boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
      }}>
        {/* 섹션 네비게이션 */}
        <div style={{ padding: '0 10px' }}>
          {sections.map((section) => (
            <div
              key={section.key}
              onClick={() => handleSectionChange(section.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                margin: '4px 0',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: activeSection === section.key ? '#e3f2fd' : 'transparent',
                borderLeft: activeSection === section.key ? '4px solid #2196f3' : '4px solid transparent',
                transition: 'all 0.2s ease',
                fontSize: '14px',
                fontWeight: activeSection === section.key ? '600' : '400',
                color: activeSection === section.key ? '#1976d2' : '#333'
              }}
              onMouseEnter={(e) => {
                if (activeSection !== section.key) {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== section.key) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ marginRight: '12px', fontSize: '16px' }}>{section.icon}</span>
              <span>{section.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 우측 콘텐츠 영역 */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* 전체 헤더 */}
        <div style={{ 
          padding: '20px 30px', 
          backgroundColor: '#fff', 
          borderBottom: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#333', 
            margin: 0 
          }}>
            {user?.nickName ? `${user.nickName}님의 ` : ''}커리어 관리
          </h1>
          {!isLoggedIn && (
            <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 0 0' }}>
              📋 샘플 데이터를 표시하고 있습니다. 로그인하면 실제 데이터를 확인할 수 있습니다.
            </p>
          )}
        </div>

        {/* 모든 섹션 콘텐츠 */}
        <div 
          ref={scrollContainerRef}
          style={{ 
            flex: 1, 
            padding: '30px', 
            overflow: 'auto',
            backgroundColor: '#f8f9fa'
          }}
        >
          {renderAllSections()}
        </div>
      </div>
    </div>
  );
};

export default CareerManagement;
