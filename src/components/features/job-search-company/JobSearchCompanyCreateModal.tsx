import React, { useState } from 'react';
import { JobSearchCompany_Status } from '@/generated/common';
import JobSearchCompanyForm from './JobSearchCompanyForm';
import HttpMethod from '@/enums/HttpMethod';
import { JobSearchCompanyCreateRequest } from '@/generated/job_search_company';
import styles from './JobSearchCompanyCreate.module.css';

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
  const [createForm, setCreateForm] = useState<JobSearchCompanyCreateRequest>({
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
    jobSearchId: jobSearchId
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

      const createData: JobSearchCompanyCreateRequest = {
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
        memo: createForm.memo,
        jobSearchId: jobSearchId
      };

      const response = await fetch(`/api/job-search-companies`, {
        method: HttpMethod.POST,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createData),
      });

      if (response.ok) {
        // 성공 시 목록 새로고침
        onSuccess();
        onClose();
        setCreateForm({
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
          jobSearchId: jobSearchId
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
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            구직 회사 추가
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={(e) => { e.preventDefault(); createJobSearchCompany(); }}>
          <div className={styles.content}>
            <JobSearchCompanyForm
              formData={createForm}
              onFormChange={handleFormChange}
            />
          </div>

          {/* 버튼 */}
          <div className={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              className={`${styles.button} ${styles.cancelButton}`}
            >
              취소
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.createButton}`}
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
