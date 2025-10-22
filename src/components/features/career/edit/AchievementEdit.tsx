import React, { useState, useEffect } from 'react';
import { ResumeUpdateRequest_CareerRequest_Achievement } from '@/generated/resume';
import DatePicker from '@/components/ui/DatePicker';
import { DateTime } from 'luxon';

interface AchievementEditProps {
  achievement: ResumeUpdateRequest_CareerRequest_Achievement;
  onUpdate: (updatedAchievement: ResumeUpdateRequest_CareerRequest_Achievement) => void;
  onCancel: () => void;
}

/**
 * 성과/프로젝트 정보 편집 컴포넌트
 * ResumeUpdateRequest_CareerRequest_Achievement 타입에 맞춰 설계
 */
const AchievementEdit: React.FC<AchievementEditProps> = ({ achievement, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState<ResumeUpdateRequest_CareerRequest_Achievement>({
    title: achievement.title,
    role: achievement.role,
    description: achievement.description,
    startedAt: achievement.startedAt,
    endedAt: achievement.endedAt,
    isVisible: achievement.isVisible !== undefined ? achievement.isVisible : true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      id: achievement.id,
      title: achievement.title,
      role: achievement.role,
      description: achievement.description,
      startedAt: achievement.startedAt,
      endedAt: achievement.endedAt,
      isVisible: achievement.isVisible !== undefined ? achievement.isVisible : true,
    });
  }, [achievement]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (field: 'startedAt' | 'endedAt', dateString: string) => {
    const timestamp = DateTime.fromISO(dateString).toMillis();
    setFormData(prev => ({ ...prev, [field]: timestamp }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      alert('프로젝트/성과 제목은 필수입니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      onUpdate(formData);
    } catch (error) {
      console.error('Error updating achievement:', error);
      alert('성과 정보 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
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
        프로젝트/성과 정보 수정
      </h3>
      
      <form onSubmit={handleSubmit}>
        {/* 제목 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            제목 <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            required
            placeholder="예: 전사 ERP 시스템 구축"
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

        {/* 역할 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            역할
          </label>
          <input
            type="text"
            name="role"
            value={formData.role || ''}
            onChange={handleInputChange}
            placeholder="예: 백엔드 개발 리드"
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

        {/* 설명 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            상세 설명
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows={5}
            placeholder="프로젝트에 대한 상세한 설명, 사용한 기술, 성과 등을 기록하세요."
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

        {/* 시작일 & 종료일 */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <DatePicker
              label="시작일"
              value={formData.startedAt ? DateTime.fromMillis(formData.startedAt).toISO() || undefined : undefined}
              onChange={(date) => handleDateChange('startedAt', date)}
              required={false}
            />
          </div>
          <div style={{ flex: 1 }}>
            <DatePicker
              label="종료일"
              value={formData.endedAt ? DateTime.fromMillis(formData.endedAt).toISO() || undefined : undefined}
              onChange={(date) => handleDateChange('endedAt', date)}
              required={false}
            />
          </div>
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

export default AchievementEdit;

