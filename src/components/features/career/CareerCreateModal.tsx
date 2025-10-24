import React, { useState } from 'react';
import HttpMethod from '@/enums/HttpMethod';
import { ResumeCreateRequest } from '@/generated/resume';

interface CareerCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CareerCreateModal: React.FC<CareerCreateModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      const requestData: ResumeCreateRequest = {
        title: title.trim(),
      };

      const response = await fetch('/api/resumes', {
        method: HttpMethod.POST,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        onSuccess();
        handleClose();
      } else {
        const error = await response.json();
        console.error('Error creating resume response error:', error);
      }
    } catch (error) {
      console.error('Error creating resume:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    onClose();
  };

  if (!isOpen) return null;

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
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      }}>
        {/* 헤더 */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
            신규 이력서 추가
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>

        {/* 폼 컨텐츠 */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                제목 <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="이력서 제목"
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* 푸터 버튼 */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: '#fff',
                color: '#333',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: isSubmitting ? '#ccc' : '#2196f3',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? '생성 중...' : '생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CareerCreateModal;

