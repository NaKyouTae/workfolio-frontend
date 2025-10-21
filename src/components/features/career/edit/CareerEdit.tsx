import React, { useState } from 'react';
import { Career } from '@/generated/common';
import HttpMethod from '@/enums/HttpMethod';
import { DateTime } from 'luxon';

interface CareerEditProps {
  career: Career;
  onUpdate: (updatedCareer: Career) => void;
  onCancel: () => void;
}

const CareerEdit: React.FC<CareerEditProps> = ({ career, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: career.name,
    startedAt: career.startedAt,
    endedAt: career.endedAt,
    isWorking: career.isWorking,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/careers/${career.id}`, {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // 업데이트된 데이터를 상위 컴포넌트로 전달
        const updatedCareer: Career = {
          ...career,
          ...formData
        };
        onUpdate(updatedCareer);
      } else {
        console.error('Failed to update career');
      }
    } catch (error) {
      console.error('Error updating career:', error);
    }
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
        회사 정보 수정
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            회사명 <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
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

        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              입사일 <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="date"
              value={formData.startedAt ? DateTime.fromMillis(formData.startedAt).toFormat('yyyy-MM-dd') : ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                startedAt: new Date(e.target.value).getTime() 
              })}
              required
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

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              퇴사일
            </label>
            <input
              type="date"
              value={formData.endedAt ? DateTime.fromMillis(formData.endedAt).toFormat('yyyy-MM-dd') : ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                endedAt: e.target.value ? new Date(e.target.value).getTime() : 0
              })}
              disabled={formData.isWorking}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                backgroundColor: formData.isWorking ? '#f5f5f5' : '#fff'
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.isWorking}
              onChange={(e) => setFormData({ 
                ...formData, 
                isWorking: e.target.checked,
                endedAt: e.target.checked ? 0 : formData.endedAt
              })}
              style={{ marginRight: '8px' }}
            />
            <span style={{ fontSize: '14px' }}>현재 재직 중</span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            onClick={onCancel}
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
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#2196f3',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            저장
          </button>
        </div>
      </form>
    </div>
  );
};

export default CareerEdit;

