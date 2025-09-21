import React, { useState, useEffect } from 'react';
import { JobSearch, Company } from '@/generated/common';
import { JobSearchUpdateRequest } from '@/generated/job_search';
import JobSearchForm from './JobSearchForm';
import HttpMethod from '@/enums/HttpMethod';
import styles from './JobSearchUpdate.module.css';

interface JobSearchUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingJobSearch: JobSearch | null;
  companies: Company[];
  onSuccess: () => void;
}

const JobSearchUpdateModal: React.FC<JobSearchUpdateModalProps> = ({
  isOpen,
  onClose,
  editingJobSearch,
  companies,
  onSuccess
}) => {
  const [createForm, setCreateForm] = useState<JobSearchUpdateRequest>({
    id: '',
    title: '',
    startedAt: 0,
    endedAt: undefined,
    prevCompanyId: undefined,
    nextCompanyId: undefined,
    memo: undefined
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // 편집할 구직 정보로 폼 초기화
  useEffect(() => {
    if (editingJobSearch) {
      setCreateForm({
        id: editingJobSearch.id || '',
        title: editingJobSearch.title || '',
        startedAt: editingJobSearch.startedAt,
        endedAt: editingJobSearch.endedAt,
        prevCompanyId: editingJobSearch.prevCompany?.id,
        nextCompanyId: editingJobSearch.nextCompany?.id,
        memo: editingJobSearch.memo
      });
    }
  }, [editingJobSearch]);

  if (!isOpen) return null;

  // 구직 수정
  const updateJobSearch = async () => {
    try {
      // 필수 필드 검증
      if (!createForm.title) {
        alert('제목은 필수 입력 항목입니다.');
        return;
      }

      setIsUpdating(true);

      const updateData: JobSearchUpdateRequest = {
        id: createForm.id,
        title: createForm.title,
        startedAt: createForm.startedAt,
        endedAt: createForm.endedAt,
        prevCompanyId: createForm.prevCompanyId,
        nextCompanyId: createForm.nextCompanyId,
        memo: createForm.memo
      };

      const response = await fetch(`/api/job-searches`, {
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
          title: '',
          startedAt: 0,
          endedAt: undefined,
          prevCompanyId: undefined,
          nextCompanyId: undefined,
          memo: undefined
        });
        alert('구직이 성공적으로 수정되었습니다.');
      } else {
        const errorData = await response.json();
        alert(`구직 수정 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error updating job search:', error);
      alert('구직 수정 중 오류가 발생했습니다.');
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
            구직 수정
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={(e) => { e.preventDefault(); updateJobSearch(); }}>
          <div className={styles.content}>
            <JobSearchForm
              formData={createForm}
              onFormChange={handleFormChange}
              companies={companies}
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

export default JobSearchUpdateModal;