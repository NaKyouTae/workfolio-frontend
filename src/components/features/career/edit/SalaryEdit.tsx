import React, { useState } from 'react';
import { Salary } from '@/generated/common';
import HttpMethod from '@/enums/HttpMethod';
import { DateTime } from 'luxon';

interface SalaryEditProps {
  salary: Salary;
  onUpdate: (updatedSalary: Salary) => void;
  onCancel: () => void;
}

const SalaryEdit: React.FC<SalaryEditProps> = ({ salary, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: salary.amount,
    negotiationDate: salary.negotiationDate || 0,
    memo: salary.memo || '',
    isVisible: salary.isVisible,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/salaries/${salary.id}`, {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // 업데이트된 데이터를 상위 컴포넌트로 전달
        const updatedSalary: Salary = {
          ...salary,
          ...formData
        };
        onUpdate(updatedSalary);
      } else {
        console.error('Failed to update salary');
      }
    } catch (error) {
      console.error('Error updating salary:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
        급여 정보 수정
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            급여 <span style={{ color: 'red' }}>*</span>
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              required
              min="0"
              step="1000"
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
            <span style={{ fontSize: '14px', color: '#666', minWidth: 'fit-content' }}>
              원
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
            현재: {formatCurrency(formData.amount)}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            협상일
          </label>
          <input
            type="date"
            value={formData.negotiationDate ? DateTime.fromMillis(formData.negotiationDate).toFormat('yyyy-MM-dd') : ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              negotiationDate: e.target.value ? new Date(e.target.value).getTime() : 0
            })}
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

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            메모
          </label>
          <textarea
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            rows={3}
            placeholder="급여 관련 추가 정보나 조건을 입력하세요"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.isVisible}
              onChange={(e) => setFormData({ 
                ...formData, 
                isVisible: e.target.checked
              })}
              style={{ marginRight: '8px' }}
            />
            <span style={{ fontSize: '14px' }}>공개 표시</span>
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

export default SalaryEdit;
