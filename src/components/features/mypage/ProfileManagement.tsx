"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { Worker_Gender } from '@/generated/common';
import DateUtil from '@/utils/DateUtil';
import { normalizeEnumValue } from '@/utils/commonUtils';

const ProfileManagement: React.FC = () => {
  const { user, isLoading, isLoggedIn, refreshUser } = useUser();
  const [formData, setFormData] = useState({
    nickName: '',
    phone: '',
    email: '',
    birthDate: '',
    gender: Worker_Gender.MALE,
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // 사용자 정보 로드
  useEffect(() => {
    if (user) {
      setFormData({
        nickName: user.nickName || '',
        phone: user.phone || '',
        email: user.email || '',
        birthDate: user.birthDate ? DateUtil.formatTimestamp(user.birthDate, 'YYYY-MM-DD') : '',
        gender: normalizeEnumValue<Worker_Gender>(user.gender, Worker_Gender) ?? Worker_Gender.MALE,
      });
    } else if (!isLoggedIn) {
      // 샘플 데이터
      setFormData({
        nickName: '샘플 사용자',
        phone: '010-1234-5678',
        email: 'sample@example.com',
        birthDate: '1990-01-01',
        gender: Worker_Gender.MALE,
      });
    }
  }, [user, isLoggedIn]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'gender' ? parseInt(value) : value,
    }));
    
    // 입력 시 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // 성공 메시지 제거
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.nickName.trim()) {
      newErrors.nickName = '닉네임을 입력해주세요.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^[0-9-]+$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다.';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = '생년월일을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsUpdating(true);
      setErrors({});
      setSuccessMessage('');

      // 날짜를 timestamp로 변환
      const birthDateTimestamp = new Date(formData.birthDate).getTime();

      const response = await fetch('/api/workers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user?.id,
          nickName: formData.nickName,
          phone: formData.phone,
          email: formData.email,
          birthDate: birthDateTimestamp,
          gender: formData.gender,
        }),
      });

      if (!response.ok) {
        throw new Error('프로필 업데이트에 실패했습니다.');
      }

      // 프로필 업데이트 성공 시 user 정보 새로고침
      await refreshUser();

      setSuccessMessage('프로필이 성공적으로 업데이트되었습니다.');
      
      // 3초 후 성공 메시지 제거
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      setErrors({ submit: '프로필 업데이트 중 오류가 발생했습니다.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '30px',
        color: '#000000'
      }}>
        프로필 관리
      </h2>
      
      {!isLoggedIn && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          padding: '15px',
          marginBottom: '30px',
          color: '#856404'
        }}>
          📋 샘플 데이터를 표시하고 있습니다. 로그인하면 실제 프로필을 관리할 수 있습니다.
        </div>
      )}

      {successMessage && (
        <div style={{
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          padding: '15px',
          marginBottom: '20px',
          color: '#155724'
        }}>
          ✓ {successMessage}
        </div>
      )}

      {errors.submit && (
        <div style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          padding: '15px',
          marginBottom: '20px',
          color: '#721c24'
        }}>
          ✕ {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* 닉네임 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#000000'
          }}>
            닉네임 <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <input
            type="text"
            name="nickName"
            value={formData.nickName}
            onChange={handleInputChange}
            disabled={!isLoggedIn}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: errors.nickName ? '1px solid #dc3545' : '1px solid #e9ecef',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: !isLoggedIn ? '#f8f9fa' : '#ffffff',
              color: !isLoggedIn ? '#6c757d' : '#000000'
            }}
            placeholder="닉네임을 입력해주세요"
          />
          {errors.nickName && (
            <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
              {errors.nickName}
            </div>
          )}
        </div>

        {/* 전화번호 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#000000'
          }}>
            전화번호 <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isLoggedIn}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: errors.phone ? '1px solid #dc3545' : '1px solid #e9ecef',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: !isLoggedIn ? '#f8f9fa' : '#ffffff',
              color: !isLoggedIn ? '#6c757d' : '#000000'
            }}
            placeholder="010-1234-5678"
          />
          {errors.phone && (
            <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
              {errors.phone}
            </div>
          )}
        </div>

        {/* 이메일 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#000000'
          }}>
            이메일 <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isLoggedIn}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: errors.email ? '1px solid #dc3545' : '1px solid #e9ecef',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: !isLoggedIn ? '#f8f9fa' : '#ffffff',
              color: !isLoggedIn ? '#6c757d' : '#000000'
            }}
            placeholder="email@example.com"
          />
          {errors.email && (
            <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
              {errors.email}
            </div>
          )}
        </div>

        {/* 생년월일 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#000000'
          }}>
            생년월일 <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleInputChange}
            disabled={!isLoggedIn}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: errors.birthDate ? '1px solid #dc3545' : '1px solid #e9ecef',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: !isLoggedIn ? '#f8f9fa' : '#ffffff',
              color: !isLoggedIn ? '#6c757d' : '#000000'
            }}
          />
          {errors.birthDate && (
            <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
              {errors.birthDate}
            </div>
          )}
        </div>

        {/* 성별 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#000000'
          }}>
            성별 <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            disabled={!isLoggedIn}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #e9ecef',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: !isLoggedIn ? '#f8f9fa' : '#ffffff',
              color: !isLoggedIn ? '#6c757d' : '#000000',
              cursor: !isLoggedIn ? 'not-allowed' : 'pointer'
            }}
          >
            <option value={Worker_Gender.MALE}>남성</option>
            <option value={Worker_Gender.FEMALE}>여성</option>
          </select>
        </div>

        {/* 저장 버튼 */}
        <div style={{ marginTop: '30px' }}>
          <button
            type="submit"
            disabled={!isLoggedIn || isUpdating || isLoading}
            style={{
              padding: '12px 24px',
              backgroundColor: (!isLoggedIn || isUpdating || isLoading) ? '#6c757d' : '#007bff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: (!isLoggedIn || isUpdating || isLoading) ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (isLoggedIn && !isUpdating && !isLoading) {
                e.currentTarget.style.backgroundColor = '#0056b3';
              }
            }}
            onMouseLeave={(e) => {
              if (isLoggedIn && !isUpdating && !isLoading) {
                e.currentTarget.style.backgroundColor = '#007bff';
              }
            }}
          >
            {isUpdating ? '저장 중...' : '프로필 저장'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileManagement;

