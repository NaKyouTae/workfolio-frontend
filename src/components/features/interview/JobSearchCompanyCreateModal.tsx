import React, { useState } from 'react';
import { JobSearchCompany_Status } from '@/generated/common';
import JobSearchCompanyForm from './JobSearchCompanyForm';
import HttpMethod from '@/enums/HttpMethod';
import { JobSearchCompanyUpsertRequest } from '@/generated/job_search_company';

interface JobSearchCompanyCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  jobSearchId: string;
}

const JobSearchCompanyCreateModal: React.FC<JobSearchCompanyCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  jobSearchId
}) => {
  // 폼 상태
  const [createForm, setCreateForm] = useState<JobSearchCompanyUpsertRequest>({
    name: '',
    status: JobSearchCompany_Status.UNKNOWN,
    appliedAt: undefined,
    closedAt: undefined,
    endedAt: undefined,
    link: undefined,
    industry: undefined,
    location: undefined,
    businessSize: undefined,
    description: undefined,
    memo: undefined,
  });

  if (!isOpen) return null;

  // 구직 회사 생성
  const createJobSearchCompany = async () => {
    try {
      // 필수 필드 검증
      if (!createForm.name || !createForm.status) {
        alert('회사명과 상태는 필수 입력 항목입니다.');
        return;
      }

      console.log('jobSearchId', jobSearchId);

      const response = await fetch(`/api/workers/job-searches/${jobSearchId}/companies`, {
        method: HttpMethod.POST,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: createForm.name,
          status: createForm.status,
          appliedAt: createForm.appliedAt,
          closedAt: createForm.closedAt,
          endedAt: createForm.endedAt,
          link: createForm.link,
          industry: createForm.industry,
          location: createForm.location,
          businessSize: createForm.businessSize,
          description: createForm.description,
          memo: createForm.memo
        }),
      });

      if (response.ok) {
        // 성공 시 목록 새로고침
        onSuccess();
        onClose();
        setCreateForm({
          name: '',
          status: JobSearchCompany_Status.UNKNOWN,
          appliedAt: 0,
          closedAt: 0,
          endedAt: undefined,
          link: undefined,
          industry: undefined,
          location: undefined,
          businessSize: undefined,
          description: undefined,
          memo: undefined,
        });
        alert('구직 회사가 성공적으로 생성되었습니다.');
      } else {
        const errorData = await response.json();
        alert(`구직 회사 생성 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error creating job search company:', error);
      alert('구직 회사 생성 중 오류가 발생했습니다.');
    }
  };

  // 폼 입력 핸들러
  const handleFormChange = (field: string, value: string | number | undefined) => {
    setCreateForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '30px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}>
        {/* 헤더 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '15px',
          borderBottom: '2px solid #e0e0e0'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
            margin: 0
          }}>
            구직 회사 추가
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '0',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={(e) => { e.preventDefault(); createJobSearchCompany(); }}>
          <JobSearchCompanyForm
            formData={createForm}
            onFormChange={handleFormChange}
          />

          {/* 버튼 */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '1px solid #e0e0e0'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              취소
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              생성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobSearchCompanyCreateModal;
