import React, { useState, useEffect } from 'react';
import { Resume, Resume_Gender } from '@/generated/common';
import HttpMethod from '@/enums/HttpMethod';
import { ResumeUpdateRequest } from '@/generated/resume';
import DatePicker from '@/components/ui/DatePicker';
import { DateTime } from 'luxon';

interface CareerUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  resume: Resume;
}

const CareerUpdateModal: React.FC<CareerUpdateModalProps> = ({ isOpen, onClose, onSuccess, resume }) => {
  const [formData, setFormData] = useState<ResumeUpdateRequest>({
    id: resume.id,
    title: resume.title,
    description: resume.description,
    phone: resume.phone,
    email: resume.email,
    birthDate: resume.brithDate, // typo in protobuf
    gender: resume.gender,
    isPublic: resume.isPublic,
    isDefault: resume.isDefault,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // resume prop이 변경될 때 formData 업데이트
  useEffect(() => {
    if (resume) {
      setFormData({
        id: resume.id,
        title: resume.title,
        description: resume.description,
        phone: resume.phone,
        email: resume.email,
        birthDate: resume.brithDate,
        gender: resume.gender,
        isPublic: resume.isPublic,
        isDefault: resume.isDefault,
      });
    }
  }, [resume]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGenderChange = (gender: Resume_Gender) => {
    setFormData(prev => ({ ...prev, gender }));
  };

  const handleBirthDateChange = (newDate: string) => {
    // ISO 문자열을 timestamp로 변환
    const birthDateTime = DateTime.fromISO(newDate);
    const birthDateTimestamp = birthDateTime.toMillis();
    setFormData(prev => ({ ...prev, birthDate: birthDateTimestamp }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.email || !formData.phone || !formData.birthDate) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/resumes', {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('이력서가 성공적으로 수정되었습니다.');
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        alert(`이력서 수정에 실패했습니다: ${error.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error updating resume:', error);
      alert('이력서 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
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
            이력서 수정
          </h2>
          <button
            onClick={onClose}
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
            {/* 기본 정보 */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                기본 정보
              </h3>

              {/* 제목 */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  제목 <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="이력서 제목"
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

              {/* 생년월일과 성별 */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <DatePicker
                    label="생년월일"
                    value={formData.birthDate ? DateTime.fromMillis(formData.birthDate).toISO() || undefined : undefined}
                    onChange={handleBirthDateChange}
                    required={true}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                    성별 <span style={{ color: 'red' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '12px', paddingTop: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="gender"
                        checked={formData.gender === Resume_Gender.MALE}
                        onChange={() => handleGenderChange(Resume_Gender.MALE)}
                        style={{ marginRight: '6px' }}
                      />
                      <span style={{ fontSize: '14px' }}>남자</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="gender"
                        checked={formData.gender === Resume_Gender.FEMALE}
                        onChange={() => handleGenderChange(Resume_Gender.FEMALE)}
                        style={{ marginRight: '6px' }}
                      />
                      <span style={{ fontSize: '14px' }}>여자</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 이메일 */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  이메일 <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="hong@gmail.com"
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

              {/* 전화번호 */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  전화번호 <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="010-1234-5678"
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

              {/* 설명 */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  설명
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="이력서에 대한 간단한 설명을 입력하세요."
                  rows={3}
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
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontSize: '14px' }}>이력서 공개</span>
                </label>
              </div>

              {/* 기본 이력서 설정 */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontSize: '14px' }}>기본 이력서로 설정</span>
                </label>
              </div>
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
              onClick={onClose}
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
              {isSubmitting ? '수정 중...' : '수정'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CareerUpdateModal;

