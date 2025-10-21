import React, { useState } from 'react';
import { Degrees, Degrees_DegreesStatus } from '@/generated/common';
import HttpMethod from '@/enums/HttpMethod';
import { DateTime } from 'luxon';

interface DegreesEditProps {
  degree: Degrees;
  onUpdate: (updatedDegree: Degrees) => void;
  onCancel: () => void;
}

const DegreesEdit: React.FC<DegreesEditProps> = ({ degree, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: degree.name,
    major: degree.major,
    startedAt: degree.startedAt,
    endedAt: degree.endedAt,
    status: degree.status,
    isVisible: degree.isVisible,
    resume: degree.resume,
    createdAt: degree.createdAt,
    updatedAt: degree.updatedAt,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/degrees/${degree.id}`, {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // 업데이트된 데이터를 상위 컴포넌트로 전달
        const updatedDegree: Degrees = {
          ...degree,
          ...formData
        };
        onUpdate(updatedDegree);
      } else {
        console.error('Failed to update degree');
      }
    } catch (error) {
      console.error('Error updating degree:', error);
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
        학위 정보 수정
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            학교명 <span style={{ color: 'red' }}>*</span>
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
              전공 <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.major}
              onChange={(e) => setFormData({ ...formData, major: e.target.value })}
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
              학위 <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as unknown as Degrees_DegreesStatus })}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            >
              <option value={Degrees_DegreesStatus.UNKNOWN}>선택</option>
              <option value={Degrees_DegreesStatus.IN_PROGRESS}>진행중</option>
              <option value={Degrees_DegreesStatus.GRADUATING}>졸업예정</option>
              <option value={Degrees_DegreesStatus.GRADUATED}>졸업</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              입학일 <span style={{ color: 'red' }}>*</span>
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
              졸업일 <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="date"
              value={formData.endedAt ? DateTime.fromMillis(formData.endedAt).toFormat('yyyy-MM-dd') : ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                endedAt: new Date(e.target.value).getTime() 
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

export default DegreesEdit;

