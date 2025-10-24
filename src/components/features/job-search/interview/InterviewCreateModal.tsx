import React, { useState } from 'react';
import { InterviewCreateRequest } from '@/generated/interview';
import { JobSearchCompany, Interview_Type } from '@/generated/common';
import InterviewForm from './InterviewForm';
import HttpMethod from '@/enums/HttpMethod';
import styles from './InterviewCreate.module.css';

interface InterviewCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobSearchCompany: JobSearchCompany;
  onSuccess: () => void;
}

const InterviewCreateModal: React.FC<InterviewCreateModalProps> = ({
  isOpen,
  onClose,
  jobSearchCompany,
  onSuccess
}) => {
  const [createForm, setCreateForm] = useState<InterviewCreateRequest>({
    title: '',
    type: Interview_Type.ONLINE,
    startedAt: undefined,
    endedAt: undefined,
    memo: undefined,
    jobSearchCompanyId: jobSearchCompany.id
  });
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  // 면접 생성
  const createInterview = async () => {
    try {
      // 필수 필드 검증
      if (!createForm.title || !createForm.type) {
        alert('제목과 면접 유형은 필수 입력 항목입니다.');
        return;
      }

      setIsCreating(true);
      
      const createData: InterviewCreateRequest = {
        title: createForm.title,
        type: Interview_Type[createForm.type as unknown as keyof typeof Interview_Type],
        startedAt: createForm.startedAt,
        endedAt: createForm.endedAt,
        memo: createForm.memo,
        jobSearchCompanyId: createForm.jobSearchCompanyId
      };

      console.log('createData', createData);
      
      const response = await fetch('/api/interviews', {
        method: HttpMethod.POST,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createData),
      });

      if (response.ok) {
        onSuccess();
        onClose();
        setCreateForm({
          title: '',
          type: Interview_Type.UNKNOWN,
          startedAt: undefined,
          endedAt: undefined,
          memo: undefined,
          jobSearchCompanyId: jobSearchCompany.id
        });
      } else {
        const errorData = await response.json();
        alert(`면접 생성 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error creating interview:', error);
      alert('면접 생성 중 오류가 발생했습니다.');
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
            면접 추가
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={(e) => { e.preventDefault(); createInterview(); }}>
          <div className={styles.content}>
            <InterviewForm
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

export default InterviewCreateModal;