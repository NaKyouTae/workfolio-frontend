import React, { useState } from 'react';
import { Company } from '@/generated/common';
import { JobSearchCreateRequest } from '@/generated/job_search';
import JobSearchForm from './JobSearchForm';
import HttpMethod from '@/enums/HttpMethod';
import dayjs from 'dayjs';
import styles from './JobSearchCreate.module.css';

interface JobSearchCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  onSuccess: () => void;
}

const JobSearchCreateModal: React.FC<JobSearchCreateModalProps> = ({
  isOpen,
  onClose,
  companies,
  onSuccess
}) => {
  const [createForm, setCreateForm] = useState<JobSearchCreateRequest>({
    title: '',
    startedAt: dayjs().unix(),
    endedAt: undefined,
    prevCompanyId: undefined,
    nextCompanyId: undefined,
    memo: undefined
  });
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  // 구직 생성
  const createJobSearch = async () => {
    try {
      // 필수 필드 검증
      if (!createForm.title) {
        alert('제목은 필수 입력 항목입니다.');
        return;
      }

      setIsCreating(true);

      const response = await fetch('/api/job-searches', {
        method: HttpMethod.POST,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm)
      });

      if (response.ok) {
        onSuccess();
        onClose();
        setCreateForm({
          title: '',
          startedAt: dayjs().unix(),
          endedAt: undefined,
          prevCompanyId: undefined,
          nextCompanyId: undefined,
          memo: undefined
        });
      } else {
        const errorData = await response.json();
        alert(`구직 생성 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error creating job search:', error);
      alert('구직 생성 중 오류가 발생했습니다.');
    } finally {
      setIsCreating(false);
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
            구직 추가
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={(e) => { e.preventDefault(); createJobSearch(); }}>
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
              disabled={isCreating}
              className={`${styles.button} ${styles.createButton}`}
            >
              {isCreating ? (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  생성 중...
                </div>
              ) : (
                '생성'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobSearchCreateModal;