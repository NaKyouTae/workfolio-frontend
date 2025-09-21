import React, { useState, useEffect } from 'react';
import { Interview, Interview_Type } from '@/generated/common';
import { InterviewUpdateRequest } from '@/generated/interview';
import InterviewForm from './InterviewForm';
import HttpMethod from '@/enums/HttpMethod';
import styles from './InterviewUpdate.module.css';

interface InterviewUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingInterview: Interview | undefined;
  onSuccess: () => void;
}

const InterviewUpdateModal: React.FC<InterviewUpdateModalProps> = ({
  isOpen,
  onClose,
  editingInterview,
  onSuccess
}) => {
  const [createForm, setCreateForm] = useState<InterviewUpdateRequest>({
    id: '',
    title: '',
    type: Interview_Type.UNKNOWN,
    startedAt: undefined,
    endedAt: undefined,
    memo: undefined,
    jobSearchCompanyId: ''
  });
  
  const [isUpdating, setIsUpdating] = useState(false);

  // 편집할 면접 정보로 폼 초기화
  useEffect(() => {
    if (editingInterview) {
      setCreateForm({
        id: editingInterview.id,
        title: editingInterview.title,
        type: editingInterview.type,
        startedAt: editingInterview.startedAt,
        endedAt: editingInterview.endedAt,
        memo: editingInterview.memo,
        jobSearchCompanyId: editingInterview.jobSearchCompany?.id || ''
      });
    }
  }, [editingInterview]);

  if (!isOpen) return null;

  // 면접 수정
  const updateInterview = async () => {
    try {
      // 필수 필드 검증
      if (!createForm.title || !createForm.type) {
        alert('제목과 면접 유형은 필수 입력 항목입니다.');
        return;
      }

      setIsUpdating(true);

      const response = await fetch(`/api/interviews`, {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm)
      });

      if (response.ok) {
        alert('면접이 성공적으로 수정되었습니다.');
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        alert(`면접 수정 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error updating interview:', error);
      alert('면접 수정 중 오류가 발생했습니다.');
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
            면접 수정
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={(e) => { e.preventDefault(); updateInterview(); }}>
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

export default InterviewUpdateModal;