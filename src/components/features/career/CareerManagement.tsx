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
  const { isLoggedIn } = useUser();
  
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  
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

  // 각 섹션의 펼침/접힘 상태
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    companies: true,
    certifications: true,
    degrees: true,
    educations: true
  });

  // 초기 로드 여부를 추적하는 ref
  const isInitialLoad = useRef(true);

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
    if (isInitialLoad.current) {
      const fetchAllCareerData = async () => {
        try {
          console.log('========================');
          console.log('CareerManagement: Initial data fetch started');
          console.log('isLoggedIn:', isLoggedIn);
          console.log('========================');
          
          setIsLoading(true);
          
          let companies: Company[] = [];
          let certifications: Certifications[] = [];
          let degrees: Degrees[] = [];
          let educations: Education[] = [];

          if (isLoggedIn) {
            // 로그인된 경우 서버에서 데이터 조회
            [companies, certifications, degrees, educations] = await Promise.all([
              fetchCompanies(),
              fetchCertifications(),
              fetchDegrees(),
              fetchEducations()
            ]);
          } else {
            // 로그인되지 않은 경우 샘플 데이터 사용
            console.log('Using sample data for non-logged-in user');
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
        } finally {
          setIsLoading(false);
        }
      };

      fetchAllCareerData();
    }
  }, [isLoggedIn, fetchCompanies, fetchCertifications, fetchDegrees, fetchEducations]);

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

  // 섹션 토글 함수
  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };




  // 로딩 중일 때
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px', 
        fontSize: '18px'
      }}>
        로딩 중...
      </div>
    );
  }

  // 메인 뷰
  return (
    <div style={{ padding: '20px' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '15px', borderBottom: '2px solid #e0e0e0' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>커리어 관리</h2>
          {!isLoggedIn && (
            <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 0 0' }}>
              📋 샘플 데이터를 표시하고 있습니다. 로그인하면 실제 데이터를 확인할 수 있습니다.
            </p>
          )}
        </div>
      </div>

      {/* 각 항목 관리 컴포넌트들 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* 회사 이력 섹션 */}
        <div style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '15px 20px', 
              backgroundColor: '#f8f9fa',
              cursor: 'pointer',
              borderBottom: expandedSections.companies ? '1px solid #e0e0e0' : 'none'
            }}
            onClick={() => toggleSection('companies')}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: 0 }}>회사 이력</h3>
            <span style={{ fontSize: '16px', color: '#666' }}>
              {expandedSections.companies ? '▼' : '▶'}
            </span>
          </div>
          {expandedSections.companies && (
            <div style={{ padding: '0' }}>
              <CompanyManagement
                initialData={careerData.companies}
                onDataChange={handleCompaniesChange}
              />
            </div>
          )}
        </div>

        {/* 자격증 섹션 */}
        <div style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '15px 20px', 
              backgroundColor: '#f8f9fa',
              cursor: 'pointer',
              borderBottom: expandedSections.certifications ? '1px solid #e0e0e0' : 'none'
            }}
            onClick={() => toggleSection('certifications')}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: 0 }}>자격증</h3>
            <span style={{ fontSize: '16px', color: '#666' }}>
              {expandedSections.certifications ? '▼' : '▶'}
            </span>
          </div>
          {expandedSections.certifications && (
            <div style={{ padding: '0' }}>
              <CertificationManagement
                initialData={careerData.certifications}
                onDataChange={handleCertificationsChange}
              />
            </div>
          )}
        </div>

        {/* 학위 섹션 */}
        <div style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '15px 20px', 
              backgroundColor: '#f8f9fa',
              cursor: 'pointer',
              borderBottom: expandedSections.degrees ? '1px solid #e0e0e0' : 'none'
            }}
            onClick={() => toggleSection('degrees')}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: 0 }}>학위</h3>
            <span style={{ fontSize: '16px', color: '#666' }}>
              {expandedSections.degrees ? '▼' : '▶'}
            </span>
          </div>
          {expandedSections.degrees && (
            <div style={{ padding: '0' }}>
              <DegreesManagement
                initialData={careerData.degrees}
                onDataChange={handleDegreesChange}
              />
            </div>
          )}
        </div>

        {/* 교육 섹션 */}
        <div style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '15px 20px', 
              backgroundColor: '#f8f9fa',
              cursor: 'pointer',
              borderBottom: expandedSections.educations ? '1px solid #e0e0e0' : 'none'
            }}
            onClick={() => toggleSection('educations')}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: 0 }}>교육</h3>
            <span style={{ fontSize: '16px', color: '#666' }}>
              {expandedSections.educations ? '▼' : '▶'}
            </span>
          </div>
          {expandedSections.educations && (
            <div style={{ padding: '0' }}>
              <EducationManagement
                initialData={careerData.educations}
                onDataChange={handleEducationsChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerManagement;
