import React, { useState, useEffect } from 'react';
import { Interview, Interview_Type } from '@/generated/common';
import { InterviewUpdateRequest } from '@/generated/interview';
import InterviewForm from './InterviewForm';
import HttpMethod from '@/enums/HttpMethod';

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
    id: editingInterview?.id || '',
    title: editingInterview?.title || '',
    type: Interview_Type[editingInterview?.type as unknown as keyof typeof Interview_Type],
    startedAt: editingInterview?.startedAt,
    endedAt: editingInterview?.endedAt,
    memo: editingInterview?.memo || '',
    jobSearchCompanyId: editingInterview?.jobSearchCompany?.id || ''
  });
  
  const [isUpdating, setIsUpdating] = useState(false);

  // editingInterview가 변경될 때 폼 초기화
  useEffect(() => {
    if (editingInterview) {
      setCreateForm({
        id: editingInterview.id || '',
        title: editingInterview.title || '',
        type: editingInterview.type || 0,
        startedAt: editingInterview.startedAt,
        endedAt: editingInterview.endedAt,
        memo: editingInterview.memo || '',
        jobSearchCompanyId: editingInterview.jobSearchCompany?.id || ''
      });
    }
  }, [editingInterview]);

  if (!isOpen || !editingInterview) return null;

  // 폼 변경 핸들러
  const handleFormChange = (field: string, value: string | number | undefined) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 면접 수정
  const updateInterview = async () => {
    try {
      setIsUpdating(true);

      const updateData: InterviewUpdateRequest = {
        id: createForm.id,
        title: createForm.title,
        type: createForm.type,
        startedAt: createForm.startedAt,
        endedAt: createForm.endedAt,
        memo: createForm.memo,
        jobSearchCompanyId: createForm.jobSearchCompanyId,
      };

      const response = await fetch(`/api/interviews`, {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        alert('면접이 성공적으로 수정되었습니다.');
        onSuccess();
        onClose();
      } else {
        const errorData = await response.json();
        alert(`면접 수정에 실패했습니다: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error updating interview:', error);
      alert('면접 수정 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
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
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '30px',
        width: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '1px solid #e9ecef'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#333' }}>
            면접 수정
          </h3>
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

        <form onSubmit={(e) => { e.preventDefault(); updateInterview(); }}>
          <InterviewForm
            formData={createForm}
            onFormChange={handleFormChange}
          />

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '1px solid #e9ecef'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              style={{
                padding: '10px 20px',
                backgroundColor: isUpdating ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isUpdating ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {isUpdating ? '수정 중...' : '수정'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewUpdateModal;
