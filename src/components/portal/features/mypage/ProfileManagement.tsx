"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { Worker_Gender } from '@/generated/common';
import DateUtil from '@/utils/DateUtil';
import { normalizeEnumValue, formatPhoneNumber } from '@/utils/commonUtils';
import Dropdown from '../../ui/Dropdown';
import DatePicker from '../../ui/DatePicker';
import { DateTime } from 'luxon';
import { WorkerUpdateRequest, WorkerCheckNickNameResponse } from '@/generated/worker';
import FloatingNavigation from '../../ui/FloatingNavigation';

const ProfileManagement: React.FC = () => {
  const { user, isLoggedIn, refreshUser } = useUser();

  const [nickName, setNickName] = useState<string>('');
  const [originalNickName, setOriginalNickName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [birthDate, setBirthDate] = useState<number | undefined>(undefined);
  const [gender, setGender] = useState<Worker_Gender | undefined>(undefined);
  const [isCheckingNickName, setIsCheckingNickName] = useState(false);
  const [isNickNameChecked, setIsNickNameChecked] = useState(false);
  const [isNickNameAvailable, setIsNickNameAvailable] = useState<boolean | null>(null);
  const [hasCheckedNickName, setHasCheckedNickName] = useState(false); // 실제로 중복 확인을 수행했는지 여부

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  // 사용자 정보 로드
  useEffect(() => {
    if (user) {
      const userNickName = user.nickName || '';
      setNickName(userNickName);
      setOriginalNickName(userNickName);
      setPhone(formatPhoneNumber(user.phone || ''));
      setEmail(user.email || '');
      setBirthDate(user.birthDate ? DateUtil.normalizeTimestamp(user.birthDate) : undefined);
      setGender(normalizeEnumValue<Worker_Gender>(user.gender, Worker_Gender) ?? undefined);
      // 원래 닉네임과 동일하면 중복 확인 완료로 간주 (하지만 메시지는 표시하지 않음)
      setIsNickNameChecked(true);
      setIsNickNameAvailable(true);
      setHasCheckedNickName(false); // 최초 로드 시에는 중복 확인을 수행하지 않았으므로 false
    } else if (!isLoggedIn) {
      // 샘플 데이터
      setNickName('샘플 사용자');
      setOriginalNickName('샘플 사용자');
      setPhone('010-1234-5678');
      setEmail('sample@example.com');
      setBirthDate(new Date('1990-01-01').getTime());
      setGender(Worker_Gender.MALE);
      setIsNickNameChecked(true);
      setIsNickNameAvailable(true);
      setHasCheckedNickName(false); // 샘플 데이터도 마찬가지
    }
  }, [user, isLoggedIn]);

  // 닉네임이 변경되면 중복 확인 상태 초기화
  useEffect(() => {
    if (nickName !== originalNickName) {
      setIsNickNameChecked(false);
      setIsNickNameAvailable(null);
      setHasCheckedNickName(false); // 닉네임이 변경되면 중복 확인 상태 초기화
    } else {
      setIsNickNameChecked(true);
      setIsNickNameAvailable(true);
      setHasCheckedNickName(false); // 원래 닉네임으로 돌아가면 중복 확인 상태 초기화
    }
  }, [nickName, originalNickName]);

  const handleCheckNickName = async () => {
    if (!nickName.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      setIsCheckingNickName(true);
      const response = await fetch(`/api/workers/check/${encodeURIComponent(nickName.trim())}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('닉네임 중복 확인에 실패했습니다.');
      }

      const data: WorkerCheckNickNameResponse = await response.json();
      setIsNickNameAvailable(data.isAvailable);
      setIsNickNameChecked(true);
      setHasCheckedNickName(true); // 중복 확인을 수행했음을 표시
    } catch (error) {
      console.error('닉네임 중복 확인 오류:', error);
      alert('닉네임 중복 확인 중 오류가 발생했습니다.');
    } finally {
      setIsCheckingNickName(false);
    }
  };

  const validateForm = () => {
    if (!nickName.trim()) {
      return '닉네임을 입력해주세요.';
    }

    // 닉네임이 변경되었는데 중복 확인을 하지 않은 경우
    if (nickName !== originalNickName && !isNickNameChecked) {
      return '닉네임 중복 확인을 완료해주세요.';
    }

    // 닉네임이 중복된 경우
    if (isNickNameChecked && isNickNameAvailable === false) {
      return '이미 사용 중인 닉네임입니다.';
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }

    const validationResult = validateForm();
    if (validationResult !== true) {
      alert(validationResult);
      return;
    }

    try {
      const birthDateTimestamp = birthDate ? new Date(birthDate).getTime() : undefined;
      const genderValue = gender ? normalizeEnumValue(gender, Worker_Gender) : undefined;

      const requestBody: WorkerUpdateRequest = {
        id: user?.id ?? '',
        nickName: nickName,
        phone: phone.replace(/-/g, ''),
        email: email,
        birthDate: birthDateTimestamp,
        gender: genderValue,
      };

      const response = await fetch('/api/workers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('프로필 업데이트에 실패했습니다.');
      }

      // 프로필 업데이트 성공 시 user 정보 새로고침
      await refreshUser();
      
      // 원래 닉네임 업데이트 (중복 확인 상태 유지)
      setOriginalNickName(nickName);
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      alert('프로필 업데이트 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
        <article>
            <div className="cont-box">
                <div className="cont-tit">
                    <div>
                        <h3>프로필 관리</h3>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <ul className="setting-list grid-2">
                        <li className="full">
                            <p>닉네임<span>*</span></p>
                            <div>
                                <input 
                                    type="text" 
                                    name="nickName" 
                                    value={nickName} 
                                    onChange={(e) => setNickName(e.target.value)} 
                                    placeholder="닉네임을 입력해주세요" 
                                />
                                <button 
                                    type="button"
                                    onClick={handleCheckNickName}
                                    disabled={!isLoggedIn || isCheckingNickName || !nickName.trim() || nickName === originalNickName}
                                >중복 확인</button>
                                {nickName !== originalNickName && !hasCheckedNickName && (
                                    <span>닉네임 중복 여부를 확인해 주세요.</span>
                                )}
                                {hasCheckedNickName && isNickNameChecked && (
                                    <>
                                        {isNickNameAvailable === false && (
                                            <span className="font-red">이미 사용하고 있는 닉네임이에요.</span>
                                        )}
                                        {isNickNameAvailable === true && (
                                            <span className="font-blue">사용 가능한 닉네임이에요!</span>
                                        )}
                                    </>
                                )}
                            </div>
                        </li>
                        <li>
                            <p>전화번호</p>
                            <input type="tel" name="phone" value={phone} onChange={handlePhoneChange} disabled={!isLoggedIn} placeholder="010-1234-5678" />
                        </li>
                        <li>
                            <p>이메일</p>
                            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isLoggedIn} />
                        </li>
                        <li>
                            <p>생년월일</p>
                            <DatePicker
                                value={birthDate}
                                onChange={(date) => setBirthDate(DateTime.fromISO(date).toMillis())}
                                required={false}
                            />
                        </li>
                        <li>
                            <p>성별</p>
                            <Dropdown
                                selectedOption={normalizeEnumValue(gender, Worker_Gender)}
                                options={[
                                    { value: Worker_Gender.MALE, label: '남성' },
                                    { value: Worker_Gender.FEMALE, label: '여성' },
                                ]}
                                setValue={(value) => setGender(normalizeEnumValue(value, Worker_Gender))}
                            />
                        </li>
                    </ul>
                    <div className="btn-wrap">
                    </div>
                </form>
            </div>
        </article>
        <FloatingNavigation
            navigationItems={[
                { id: 'profile', label: '프로필 관리' },
            ]}
            onSave={(e: React.FormEvent) => handleSubmit(e)}
        />
    </>
  );
};

export default ProfileManagement;

