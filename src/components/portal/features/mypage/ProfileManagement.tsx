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
    <div className="cont-box">
        <div className="cont-tit">
            <div>
                <h3>프로필 관리</h3>
            </div>
        </div>
        <form onSubmit={handleSubmit}>
            <ul className="setting-list">
                <li>
                    <p>닉네임<span>*</span></p>
                    <div>
                        <input type="text" name="nickName" value={formData.nickName} onChange={handleInputChange} placeholder="닉네임을 입력해주세요" />
                        <button>중복 확인</button>
                    </div>
                </li>
                {/* {errors.nickName && (
                    <li>
                        <p></p>
                        <span className="font-red">{errors.nickName}</span>
                    </li>
                )} */}
                <li>
                    <p>전화번호<span>*</span></p>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!isLoggedIn} />
                </li>
                <li>
                    <p>이메일<span>*</span></p>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isLoggedIn} />
                </li>
                <li>
                    <p>생년월일<span>*</span></p>
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} disabled={!isLoggedIn} />
                </li>
                <li>
                    <p>성별<span>*</span></p>
                    <input type="text" name="gender" value={formData.gender} onChange={handleInputChange} disabled={!isLoggedIn} />
                    {/* <option value={Worker_Gender.MALE}>남성</option>
                    <option value={Worker_Gender.FEMALE}>여성</option> */}
                </li>
            </ul>
            <div className="btn-wrap">
                <button>취소</button>
                <button type="submit" disabled={!isLoggedIn || isUpdating || isLoading}>저장</button>
            </div>
        </form>
    </div>
  );
};

export default ProfileManagement;

