import React, { useState, useEffect, useCallback } from 'react';
import { WorkerCareerListResponse } from '../../../generated/worker_career';
import { Company, Certifications, Degrees, Education } from '@/generated/common';
import CompanyManagement from './CompanyManagement';
import CertificationManagement from './CertificationManagement';
import DegreesManagement from './DegreesManagement';
import EducationManagement from './EducationManagement';

const CareerManagement: React.FC = () => {
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  
  // 서버에서 가져온 데이터
  const [careerData, setCareerData] = useState<WorkerCareerListResponse>({
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


  // 각 항목별 데이터 조회 함수들
  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/workers/companies');
      if (response.ok) {
        const res = await response.json();
        return res.data?.companies || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching companies:', error);
      return [];
    }
  };

  const fetchCertifications = async () => {
    try {
      const response = await fetch('/api/workers/certifications');
      if (response.ok) {
        const res = await response.json();
        return res.data?.certifications || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching certifications:', error);
      return [];
    }
  };

  const fetchDegrees = async () => {
    try {
      const response = await fetch('/api/workers/degrees');
      if (response.ok) {
        const res = await response.json();
        return res.data?.degrees || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching degrees:', error);
      return [];
    }
  };

  const fetchEducations = async () => {
    try {
      const response = await fetch('/api/workers/educations');
      if (response.ok) {
        const res = await response.json();
        return res.data?.educations || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching educations:', error);
      return [];
    }
  };


  // 컴포넌트 마운트 시 데이터 조회
  useEffect(() => {
    const fetchAllCareerData = async () => {
      try {
        setIsLoading(true);
        const [companies, certifications, degrees, educations] = await Promise.all([
          fetchCompanies(),
          fetchCertifications(),
          fetchDegrees(),
          fetchEducations()
        ]);

        setCareerData({
          companies,
          certifications,
          degrees,
          educations
        });
      } catch (error) {
        console.error('Error fetching career data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCareerData();
  }, []);

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
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>커리어 관리</h2>
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
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
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
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
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
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
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
