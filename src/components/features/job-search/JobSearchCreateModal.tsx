import React, { useState } from 'react';
import { Company } from '@/generated/common';
import { JobSearchCreateRequest } from '@/generated/job_search';
import JobSearchForm from './JobSearchForm';
import HttpMethod from '@/enums/HttpMethod';
import dayjs from 'dayjs';

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
    memo: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  // 폼 변경 핸들러
  const handleFormChange = (field: string, value: string | number | undefined) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 구직 생성
  const createJobSearch = async () => {
    try {
      setIsCreating(true);

      const response = await fetch('/api/job-searches', {
        method: HttpMethod.POST,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm)
      });

      if (response.ok) {
        alert('구직이 성공적으로 생성되었습니다.');
        onSuccess();
        onClose();
        // 폼 초기화
        setCreateForm({
          title: '',
          startedAt: dayjs().unix(),
          endedAt: undefined,
          prevCompanyId: undefined,
          nextCompanyId: undefined,
          memo: ''
        });
      } else {
        const errorData = await response.json();
        alert(`구직 생성에 실패했습니다: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error creating job search:', error);
      alert('구직 생성 중 오류가 발생했습니다.');
    } finally {
      setIsCreating(false);
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
            구직 추가
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

        <form onSubmit={(e) => { e.preventDefault(); createJobSearch(); }}>
          <JobSearchForm
            formData={createForm}
            onFormChange={handleFormChange}
            companies={companies}
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
              disabled={isCreating}
              style={{
                padding: '10px 20px',
                backgroundColor: isCreating ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isCreating ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {isCreating ? '생성 중...' : '생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobSearchCreateModal;
