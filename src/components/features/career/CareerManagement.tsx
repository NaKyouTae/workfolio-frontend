import React, { useState, useEffect } from 'react';
import { WorkerCareerListResponse } from '../../../generated/worker_career';
import CareerManagementView from './CareerManagementView';
import CareerManagementUpdate from './CareerManagementUpdate';
import HttpMethod from '@/enums/HttpMethod';

const CareerManagement: React.FC = () => {
  // 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 서버에서 가져온 데이터 (조회 모드용)
  const [careerData, setCareerData] = useState<WorkerCareerListResponse>({
    companies: [],
    certifications: [],
    degrees: [],
    educations: []
  });

  // 데이터 로딩 함수
  const fetchCareerData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/workers/careers');
      if (response.ok) {
        const data: WorkerCareerListResponse = await response.json();
        setCareerData(data);
      } else {
        console.error('Failed to fetch career data');
      }
    } catch (error) {
      console.error('Error fetching career data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    fetchCareerData();
  }, []);

  // 수정 모드 진입 함수
  const enterEditMode = () => {
    setIsEditMode(true);
  };

  // 수정 모드 종료 함수
  const exitEditMode = () => {
    setIsEditMode(false);
    // 데이터 새로고침
    fetchCareerData();
  };

  // 저장 완료 후 처리
  const handleSaveComplete = () => {
    exitEditMode();
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

  // 수정 모드일 때
  if (isEditMode) {
    return (
      <CareerManagementUpdate
        careerData={careerData}
        onSave={handleSaveComplete}
        onCancel={exitEditMode}
      />
    );
  }

  // 조회 모드일 때
  return (
    <CareerManagementView
      careerData={careerData}
      onEditClick={enterEditMode}
    />
  );
};

export default CareerManagement;
