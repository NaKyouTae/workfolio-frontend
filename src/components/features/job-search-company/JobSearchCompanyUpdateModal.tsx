import React, { useState } from 'react';
import { JobSearchCompany } from '@/generated/common';
import { JobSearchCompanyUpdateRequest } from '@/generated/job_search_company';
import HttpMethod from '@/enums/HttpMethod';
import JobSearchCompanyForm from './JobSearchCompanyForm';

interface JobSearchCompanyUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCompany: JobSearchCompany | undefined;
  onSuccess: () => void;
  jobSearchId: string;
}

const JobSearchCompanyUpdateModal: React.FC<JobSearchCompanyUpdateModalProps> = ({
  isOpen,
  onClose,
  editingCompany,
  onSuccess,
  jobSearchId,
}) => {
  const [createForm, setCreateForm] = useState<JobSearchCompanyUpdateRequest>({
    name: editingCompany?.name || '',
    link: editingCompany?.link,
    industry: editingCompany?.industry,
    businessSize: editingCompany?.businessSize,
    location: editingCompany?.location,
    description: editingCompany?.description,
    status: editingCompany?.status || 0,
    appliedAt: editingCompany?.appliedAt || 0,
    closedAt: editingCompany?.closedAt || 0,
    endedAt: editingCompany?.endedAt,
    memo: editingCompany?.memo,
    id: editingCompany?.id || '',
    jobSearchId: jobSearchId
  });

  if (!isOpen || !editingCompany) return null;

  // 구직 회사 수정
  const updateJobSearchCompany = async () => {
    if (!editingCompany) return;

    try {
      const updateData: JobSearchCompanyUpdateRequest = {
        name: createForm.name,
        link: createForm.link,
        industry: createForm.industry,
        businessSize: createForm.businessSize,
        location: createForm.location,
        description: createForm.description,
        status: createForm.status,
        appliedAt: createForm.appliedAt,
        closedAt: createForm.closedAt,
        endedAt: createForm.endedAt,
        memo: createForm.memo,
        id: editingCompany?.id || '',
        jobSearchId: jobSearchId
      };

      console.log('updateData', updateData);
      console.log('jobSearchId', jobSearchId);
      console.log('editingCompany.id', editingCompany?.id);

      const response = await fetch(`/api/job-search-companies/${editingCompany?.id}`, {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        // 성공 시 목록 새로고침
        onSuccess();
        onClose();
        alert('구직 회사가 성공적으로 수정되었습니다.');
      } else {
        const errorData = await response.json();
        alert(`구직 회사 수정 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error updating job search company:', error);
      alert('구직 회사 수정 중 오류가 발생했습니다.');
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
            구직 회사 수정
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
        <form onSubmit={(e) => { e.preventDefault(); updateJobSearchCompany(); }}>
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
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              수정
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobSearchCompanyUpdateModal;
