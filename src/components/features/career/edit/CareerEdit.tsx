import React, { useEffect } from 'react';
import { ResumeUpdateRequest_CareerRequest, ResumeUpdateRequest_CareerRequest_Career_EmploymentType, ResumeUpdateRequest_CareerRequest_Salary } from '@/generated/resume';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import DatePicker from '@/components/ui/DatePicker';
import { DateTime } from 'luxon';
import styles from '../CareerContentEdit.module.css';
import { normalizeEnumValue } from '@/utils/commonUtils';

interface CareerEditProps {
  careers: ResumeUpdateRequest_CareerRequest[];
  onUpdate: (careers: ResumeUpdateRequest_CareerRequest[]) => void;
}

/**
 * 경력 섹션 전체를 관리하는 컴포넌트
 * sectionHeader, 추가 버튼, 개별 경력 항목 포함
 */
const CareerEdit: React.FC<CareerEditProps> = ({ careers, onUpdate }) => {
  const createEmptyCareer = (): ResumeUpdateRequest_CareerRequest => ({
    career: {
      name: '',
      startedAt: DateTime.now().toMillis(),
      endedAt: undefined,
      isWorking: true,
      position: '',
      employmentType: ResumeUpdateRequest_CareerRequest_Career_EmploymentType.FULL_TIME,
      department: '',
      jobGrade: '',
      job: '',
      description: '',
      salary: 0,
      isVisible: true,
    },
    salaries: [],
  });

  // 빈 배열일 때 자동으로 항목 하나 추가
  useEffect(() => {
    if (careers.length === 0) {
      onUpdate([createEmptyCareer()]);
    }
  }, []);

  const handleAddCareer = () => {
    onUpdate([...careers, createEmptyCareer()]);
  };

  const handleDeleteCareer = (index: number) => {
    onUpdate(careers.filter((_, i) => i !== index));
  };

  const handleCareerChange = (index: number, field: string, value: string | number | boolean | undefined) => {
    const newCareers = [...careers];
    if (newCareers[index].career) {
      newCareers[index].career = {
        ...newCareers[index].career!,
        [field]: value
      };
    }
    onUpdate(newCareers);
  };

  const toggleVisible = (index: number) => {
    handleCareerChange(index, 'isVisible', !careers[index].career?.isVisible);
  };

  // Salary 추가
  const handleAddSalary = (careerIndex: number) => {
    const newCareers = [...careers];
    const newSalary: ResumeUpdateRequest_CareerRequest_Salary = {
      amount: 0,
      memo: '',
      negotiationDate: DateTime.now().toMillis(),
      isVisible: false
    };
    newCareers[careerIndex].salaries = [...(newCareers[careerIndex].salaries || []), newSalary];
    onUpdate(newCareers);
  };

  // Salary 삭제
  const handleDeleteSalary = (careerIndex: number, salaryIndex: number) => {
    const newCareers = [...careers];
    newCareers[careerIndex].salaries = newCareers[careerIndex].salaries.filter((_, i) => i !== salaryIndex);
    onUpdate(newCareers);
  };

  // Salary 수정
  const handleSalaryChange = (careerIndex: number, salaryIndex: number, field: keyof ResumeUpdateRequest_CareerRequest_Salary, value: string | number | boolean | undefined) => {
    const newCareers = [...careers];
    const newSalaries = [...(newCareers[careerIndex].salaries || [])];
    newSalaries[salaryIndex] = {
      ...newSalaries[salaryIndex],
      [field]: value
    };
    newCareers[careerIndex].salaries = newSalaries;
    onUpdate(newCareers);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitleCounter}>경력 | {careers.length}개</h3>
        <div className={styles.addButtonContainer}>
          <button onClick={handleAddCareer} className={styles.addButton}>
            <span>+ 추가</span>
          </button>
        </div>
      </div>

      {careers.map((careerRequest, index) => (
        <div key={careerRequest.career?.id || index} className={styles.cardWrapper}>
          <div className={styles.card}>
            {careerRequest.career && (
            <>
              <div className={styles.gridContainer2}>
                <div className={styles.formField}>
                  <Input 
                    type="text"
                    label="회사명"
                    placeholder="워크폴리오"
                    value={careerRequest.career.name || ''}
                    onChange={(e) => handleCareerChange(index, 'name', e.target.value)}
                  />
                </div>
                <div className={styles.formField}>
                  <Input 
                    type="text"
                    label="최종 연봉(만원)"
                    placeholder="1000"
                    value={careerRequest.career.salary?.toString() || ''}
                    onChange={(e) => handleCareerChange(index, 'salary', Number(e.target.value))}
                  />
                </div>
              </div>
              <div className={styles.gridContainer2}>
                {/* 입사일-퇴사일 */}
                <div className={styles.formFieldSpan2}>
                  <label className={styles.label}>
                    입사년월 - 퇴사년월
                  </label>
                  <div className={styles.dateRangeContainer}>
                    <DatePicker
                      value={careerRequest.career.startedAt}
                      onChange={(date) => handleCareerChange(index, 'startedAt', DateTime.fromISO(date).toMillis())}
                      required={false}
                    />
                    <span className={styles.dateSeparator}>-</span>
                    {!careerRequest.career.isWorking && (
                      <DatePicker
                        value={careerRequest.career.endedAt}
                        onChange={(date) => handleCareerChange(index, 'endedAt', DateTime.fromISO(date).toMillis())}
                        required={false}
                      />
                    )}
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={careerRequest.career.isWorking || false}
                        onChange={(e) => {
                          handleCareerChange(index, 'isWorking', e.target.checked);
                          if (e.target.checked) {
                            handleCareerChange(index, 'endedAt', undefined);
                          }
                        }}
                        className={styles.checkbox}
                      />
                      <span className={styles.checkboxText}>재직 중</span>
                    </label>
                  </div>
                </div>

                {/* 고용 형태 */}
                <div className={styles.formField}>
                  <Dropdown
                    label="재직 형태"
                    selectedOption={normalizeEnumValue(careerRequest.career.employmentType, ResumeUpdateRequest_CareerRequest_Career_EmploymentType)}
                    options={[
                      { value: ResumeUpdateRequest_CareerRequest_Career_EmploymentType.FULL_TIME, label: '정규직' },
                      { value: ResumeUpdateRequest_CareerRequest_Career_EmploymentType.CONTRACT, label: '계약직' },
                      { value: ResumeUpdateRequest_CareerRequest_Career_EmploymentType.INTERN, label: '인턴' },
                      { value: ResumeUpdateRequest_CareerRequest_Career_EmploymentType.FREELANCER, label: '프리랜서' },
                    ]}
                    setValue={(value) => handleCareerChange(index, 'employmentType', normalizeEnumValue(value, ResumeUpdateRequest_CareerRequest_Career_EmploymentType))}
                  />
                </div>
              </div>
              <div className={styles.gridContainer2}>
                <div className={styles.formField}>
                  <Input
                    type="text"
                    label="직책"
                    placeholder="솔루션 아키텍트"
                    value={careerRequest.career.position || ''}
                    onChange={(e) => handleCareerChange(index, 'position', e.target.value)}
                  />
                </div>
                <div className={styles.formField}>
                  <Input
                    type="text"
                    label="직급"
                    placeholder="책임 솔루션 아키텍트"
                    value={careerRequest.career.jobGrade || ''}
                    onChange={(e) => handleCareerChange(index, 'jobGrade', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.gridContainer2}>
                <div className={styles.formField}>
                  <Input
                    type="text"
                    label="부서"
                    placeholder="솔루션 개발팀"
                    value={careerRequest.career.department || ''}
                    onChange={(e) => handleCareerChange(index, 'department', e.target.value)}
                  />
                </div>
                <div className={styles.formField}>
                  <Input
                    type="text"
                    label="직무"
                    placeholder="백엔드 개발자"
                    value={careerRequest.career.job || ''}
                    onChange={(e) => handleCareerChange(index, 'job', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.formField}>
                <Input
                  type="text"
                  label="내용"
                  placeholder="내용"
                  value={careerRequest.career.description || ''}
                  onChange={(e) => handleCareerChange(index, 'description', e.target.value)}
                />
              </div>

              {/* Salary 섹션 */}
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e0e0e0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#333', margin: 0 }}>
                    연봉 협상 내역 | {careerRequest.salaries?.length || 0}개
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleAddSalary(index)}
                    className={styles.addButton}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    <span>+ 연봉 추가</span>
                  </button>
                </div>

                {careerRequest.salaries && careerRequest.salaries.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {careerRequest.salaries.map((salary, salaryIndex) => (
                      <div key={salary.id || salaryIndex} className={styles.cardWrapper}>
                        <div 
                          style={{
                            flex: 1,
                            padding: '16px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '6px',
                            border: '1px solid #e0e0e0',
                            position: 'relative'
                          }}
                        >
                          <div className={styles.gridContainer2}>
                          <div className={styles.formField}>
                            <Input
                              type="number"
                              label="급여 금액 (원)"
                              placeholder="50000000"
                              value={salary.amount?.toString() || ''}
                              onChange={(e) => handleSalaryChange(index, salaryIndex, 'amount', Number(e.target.value))}
                            />
                            {salary.amount > 0 && (
                              <p style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                                {formatCurrency(salary.amount)}원
                              </p>
                            )}
                          </div>
                          <div className={styles.formField}>
                            <DatePicker
                              label="협상일"
                              value={salary.negotiationDate}
                              onChange={(date) => handleSalaryChange(index, salaryIndex, 'negotiationDate', DateTime.fromISO(date).toMillis())}
                              required={false}
                            />
                          </div>
                        </div>

                        <div className={styles.formField}>
                          <Input
                            type="text"
                            label="메모"
                            placeholder="급여 협상 내용, 복지 혜택 등"
                            value={salary.memo || ''}
                            onChange={(e) => handleSalaryChange(index, salaryIndex, 'memo', e.target.value)}
                          />
                        </div>

                        </div>
                        
                        <div className={styles.cardActions}>
                          <button
                            type="button"
                            onClick={() => handleSalaryChange(index, salaryIndex, 'isVisible', !salary.isVisible)}
                            className={`${styles.visibleButton} ${salary.isVisible ? styles.visible : ''}`}
                          >
                            {salary.isVisible ? '보임' : '안보임'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSalary(index, salaryIndex)}
                            className={styles.cardDeleteButton}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          </div>
          
          <div className={styles.cardActions}>
            <button
              onClick={() => toggleVisible(index)}
              className={`${styles.visibleButton} ${careerRequest.career?.isVisible ? styles.visible : ''}`}
            >
              {careerRequest.career?.isVisible ? '보임' : '안보임'}
            </button>
            <button
              onClick={() => handleDeleteCareer(index)}
              className={styles.cardDeleteButton}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CareerEdit;
