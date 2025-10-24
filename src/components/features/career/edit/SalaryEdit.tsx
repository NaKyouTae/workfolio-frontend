import React, { useState, useEffect } from 'react';
import { ResumeUpdateRequest_CareerRequest_Salary } from '@/generated/resume';
import DatePicker from '@/components/ui/DatePicker';
import { DateTime } from 'luxon';

interface SalaryEditProps {
  salary: ResumeUpdateRequest_CareerRequest_Salary;
  onUpdate: (updatedSalary: ResumeUpdateRequest_CareerRequest_Salary) => void;
  onCancel: () => void;
}

/**
 * 급여 정보 편집 컴포넌트
 * ResumeUpdateRequest_CareerRequest_Salary 타입에 맞춰 설계
 */
const SalaryEdit: React.FC<SalaryEditProps> = ({ salary, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState<ResumeUpdateRequest_CareerRequest_Salary>({
    amount: salary.amount,
    negotiationDate: salary.negotiationDate,
    memo: salary.memo,
    isVisible: salary.isVisible !== undefined ? salary.isVisible : true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      id: salary.id || undefined,
      amount: salary.amount,
      negotiationDate: salary.negotiationDate,
      memo: salary.memo,
      isVisible: salary.isVisible !== undefined ? salary.isVisible : true,
    });
  }, [salary]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'amount') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (dateString: string) => {
    const timestamp = DateTime.fromISO(dateString).toMillis();
    setFormData(prev => ({ ...prev, negotiationDate: timestamp }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount) {
      alert('급여 금액은 필수입니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      onUpdate(formData);
    } catch (error) {
      console.error('Error updating salary:', error);
      alert('급여 정보 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600', color: '#333' }}>
        급여 정보 수정
      </h3>
      
      <form onSubmit={handleSubmit}>
        {/* 급여 금액 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            급여 금액 (원) <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount || ''}
            onChange={handleInputChange}
            required
            placeholder="예: 50000000"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
          {formData.amount && (
            <p style={{ 
              marginTop: '4px', 
              fontSize: '12px', 
              color: '#666' 
            }}>
              {formatCurrency(formData.amount)}원
            </p>
          )}
        </div>

        {/* 협상일 */}
        <div style={{ marginBottom: '16px' }}>
          <DatePicker
            label="협상일"
            value={formData.negotiationDate}
            onChange={handleDateChange}
            required={false}
          />
        </div>

        {/* 메모 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            메모
          </label>
          <textarea
            name="memo"
            value={formData.memo || ''}
            onChange={handleInputChange}
            rows={3}
            placeholder="급여 협상 내용, 복지 혜택 등을 기록하세요."
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

        {/* 공개 여부 */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="isVisible"
              checked={formData.isVisible || false}
              onChange={handleInputChange}
              style={{ marginRight: '8px', width: '16px', height: '16px' }}
            />
            <span style={{ fontSize: '14px' }}>이력서에 표시</span>
          </label>
        </div>

        {/* 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            type="button"
            onClick={onCancel}
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
            {isSubmitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalaryEdit;
