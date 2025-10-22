import React, { useEffect } from 'react';
import { ResumeUpdateRequest_CareerRequest, ResumeUpdateRequest_CareerRequest_Career_EmploymentType } from '@/generated/resume';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import DatePicker from '@/components/ui/DatePicker';
import { DateTime } from 'luxon';
import styles from '../CareerContentEdit.module.css';
import DateUtil from '@/utils/DateUtil';

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
      salary: undefined,
      isVisible: true,
    },
    achievements: [],
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
        <div key={careerRequest.career?.id || index} className={styles.card}>
          {careers.length > 1 && (
            <button onClick={() => handleDeleteCareer(index)} className={styles.deleteButton}>×</button>
          )}

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
                      value={careerRequest.career.startedAt ? DateUtil.formatTimestamp(careerRequest.career.startedAt) : undefined}
                      onChange={(date) => handleCareerChange(index, 'startedAt', DateTime.fromISO(date).toMillis())}
                      required={false}
                    />
                    <span className={styles.dateSeparator}>-</span>
                    {!careerRequest.career.isWorking && (
                      <DatePicker
                        value={careerRequest.career.endedAt ? DateTime.fromMillis(careerRequest.career.endedAt).toFormat('yyyy-MM-dd') : undefined}
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
                    selectedOption={careerRequest.career.employmentType?.toString() || String(ResumeUpdateRequest_CareerRequest_Career_EmploymentType.FULL_TIME)}
                    options={[
                      { value: String(ResumeUpdateRequest_CareerRequest_Career_EmploymentType.FULL_TIME), label: '정규직' },
                      { value: String(ResumeUpdateRequest_CareerRequest_Career_EmploymentType.CONTRACT), label: '계약직' },
                      { value: String(ResumeUpdateRequest_CareerRequest_Career_EmploymentType.INTERN), label: '인턴' },
                      { value: String(ResumeUpdateRequest_CareerRequest_Career_EmploymentType.FREELANCER), label: '프리랜서' },
                    ]}
                    setValue={(value) => handleCareerChange(index, 'employmentType', Number(value) as ResumeUpdateRequest_CareerRequest_Career_EmploymentType)}
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
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CareerEdit;
