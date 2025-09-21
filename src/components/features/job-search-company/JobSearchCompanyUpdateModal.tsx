import React, { useEffect, useState } from 'react';
import { JobSearchCompany, JobSearchCompany_Status } from '@/generated/common';
import { JobSearchCompanyUpdateRequest } from '@/generated/job_search_company';
import styles from './JobSearchCompanyUpdate.module.css';
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
  jobSearchId
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [createForm, setCreateForm] = useState<JobSearchCompanyUpdateRequest>({
    id: '',
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

  // 편집할 회사 정보로 폼 초기화
  useEffect(() => {
    if (editingCompany) {
      setCreateForm({
        id: editingCompany.id,
        name: editingCompany.name,
        status: editingCompany.status,
        appliedAt: editingCompany.appliedAt,
        closedAt: editingCompany.closedAt,
        endedAt: editingCompany.endedAt,
        link: editingCompany.link,
        industry: editingCompany.industry,
        location: editingCompany.location,
        businessSize: editingCompany.businessSize,
        description: editingCompany.description,
        memo: editingCompany.memo,
        jobSearchId: jobSearchId
      });
    }
  }, [editingCompany, jobSearchId]);

  if (!isOpen) return null;

  // 구직 회사 수정
  const updateJobSearchCompany = async () => {
    try {
      // 필수 필드 검증
      if (!createForm.name || !createForm.status) {
        alert('회사명과 상태는 필수 입력 항목입니다.');
        return;
      }

      setIsUpdating(true);

      const updateData: JobSearchCompanyUpdateRequest = {
        id: createForm.id,
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

      console.log('updateData', updateData);
      console.log('jobSearchId', jobSearchId);
      console.log('editingCompany.id', editingCompany?.id);

      const response = await fetch(`/api/job-search-companies`, {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        onSuccess();
        onClose();
        setCreateForm({
          id: '',
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
        alert('구직 회사가 성공적으로 수정되었습니다.');
      } else {
        const errorData = await response.json();
        alert(`구직 회사 수정 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error updating job search company:', error);
      alert('구직 회사 수정 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
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
            구직 회사 수정
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={(e) => { e.preventDefault(); updateJobSearchCompany(); }}>
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
              disabled={isUpdating}
              className={`${styles.button} ${styles.updateButton}`}
            >
              {isUpdating ? (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  수정 중...
                </div>
              ) : (
                '수정'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobSearchCompanyUpdateModal;