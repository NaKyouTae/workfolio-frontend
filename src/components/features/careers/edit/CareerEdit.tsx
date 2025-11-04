import React, { useEffect } from 'react';
import { ResumeUpdateRequest_CareerRequest, ResumeUpdateRequest_CareerRequest_Salary } from '@/generated/resume';
import { Career_EmploymentType } from '@/generated/common';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import DatePicker from '@/components/ui/DatePicker';
import { DateTime } from 'luxon';
import styles from '../CareerContentEdit.module.css';
import { normalizeEnumValue } from '@/utils/commonUtils';
import DraggableList from '@/components/ui/DraggableList';
import DraggableItem from '@/components/ui/DraggableItem';
import CardActions from '@/components/ui/CardActions';
import EmptyState from '@/components/ui/EmptyState';

interface CareerEditProps {
  careers: ResumeUpdateRequest_CareerRequest[];
  onUpdate: (careers: ResumeUpdateRequest_CareerRequest[]) => void;
}

interface SalaryItemProps {
  salary: ResumeUpdateRequest_CareerRequest_Salary;
  salaryIndex: number;
  careerIndex: number;
  handleSalaryChange: (careerIndex: number, salaryIndex: number, field: keyof ResumeUpdateRequest_CareerRequest_Salary, value: string | number | boolean | undefined) => void;
  handleDeleteSalary: (careerIndex: number, salaryIndex: number) => void;
}

const SalaryItem: React.FC<SalaryItemProps> = ({
  salary,
  salaryIndex,
  careerIndex,
  handleSalaryChange,
  handleDeleteSalary,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  return (
    <DraggableItem 
      id={salary.id || `salary-${careerIndex}-${salaryIndex}`}
      className={styles.cardWrapper}
      dragButtonSize={20}
    >
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
              onChange={(e) => handleSalaryChange(careerIndex, salaryIndex, 'amount', Number(e.target.value))}
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
              onChange={(date) => handleSalaryChange(careerIndex, salaryIndex, 'negotiationDate', DateTime.fromISO(date).toMillis())}
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
            onChange={(e) => handleSalaryChange(careerIndex, salaryIndex, 'memo', e.target.value)}
          />
        </div>
      </div>
      
      <CardActions
        isVisible={salary.isVisible ?? true}
        onToggleVisible={() => handleSalaryChange(careerIndex, salaryIndex, 'isVisible', !salary.isVisible)}
        onDelete={() => handleDeleteSalary(careerIndex, salaryIndex)}
      />
    </DraggableItem>
  );
};

interface CareerItemProps {
  careerRequest: ResumeUpdateRequest_CareerRequest;
  index: number;
  handleCareerChange: (index: number, field: string, value: string | number | boolean | undefined) => void;
  toggleVisible: (index: number) => void;
  handleDeleteCareer: (index: number) => void;
  handleAddSalary: (careerIndex: number) => void;
  handleSalaryChange: (careerIndex: number, salaryIndex: number, field: keyof ResumeUpdateRequest_CareerRequest_Salary, value: string | number | boolean | undefined) => void;
  handleDeleteSalary: (careerIndex: number, salaryIndex: number) => void;
  handleSalaryReorder: (careerIndex: number, reorderedSalaries: ResumeUpdateRequest_CareerRequest_Salary[]) => void;
}

const CareerItem: React.FC<CareerItemProps> = ({
  careerRequest,
  index,
  handleCareerChange,
  toggleVisible,
  handleDeleteCareer,
  handleAddSalary,
  handleSalaryChange,
  handleDeleteSalary,
  handleSalaryReorder,
}) => {
  return (
    <DraggableItem 
      id={careerRequest.career?.id || `career-${index}`}
      className={styles.cardWrapper}
    >
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
                selectedOption={normalizeEnumValue(careerRequest.career.employmentType, Career_EmploymentType)}
                options={[
                  { value: Career_EmploymentType.FULL_TIME, label: '정규직' },
                  { value: Career_EmploymentType.CONTRACT, label: '계약직' },
                  { value: Career_EmploymentType.INTERN, label: '인턴' },
                  { value: Career_EmploymentType.FREELANCER, label: '프리랜서' },
                ]}
                setValue={(value) => handleCareerChange(index, 'employmentType', normalizeEnumValue(value, Career_EmploymentType))}
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
              <DraggableList
                items={careerRequest.salaries}
                onReorder={(reorderedSalaries) => handleSalaryReorder(index, reorderedSalaries)}
                getItemId={(sal, idx) => sal.id || `salary-${index}-${idx}`}
                renderItem={(salary, salaryIndex) => (
                  <SalaryItem
                    key={salary.id || `salary-${index}-${salaryIndex}`}
                    salary={salary}
                    salaryIndex={salaryIndex}
                    careerIndex={index}
                    handleSalaryChange={handleSalaryChange}
                    handleDeleteSalary={handleDeleteSalary}
                  />
                )}
              />
            )}
          </div>
        </>
      )}
      </div>
      
      <CardActions
        isVisible={careerRequest.career?.isVisible ?? true}
        onToggleVisible={() => toggleVisible(index)}
        onDelete={() => handleDeleteCareer(index)}
      />
    </DraggableItem>
  );
};

/**
 * 경력 섹션 전체를 관리하는 컴포넌트
 * sectionHeader, 추가 버튼, 개별 경력 항목 포함
 */
const CareerEdit: React.FC<CareerEditProps> = ({ careers, onUpdate }) => {
  const createEmptyCareer = (priority: number = 0): ResumeUpdateRequest_CareerRequest => ({
    career: {
      name: '',
      startedAt: undefined,
      endedAt: undefined,
      isWorking: true,
      position: '',
      employmentType: undefined,
      department: '',
      jobGrade: '',
      job: '',
      description: '',
      salary: 0,
      isVisible: true,
      priority,
    },
    salaries: [],
  });

  // priority를 배열 인덱스와 동기화 (career와 salaries 모두)
  useEffect(() => {
    let needsUpdate = false;
    
    // career priority 체크
    const careerNeedsUpdate = careers.some((career, idx) => career.career?.priority !== idx);
    
    // salaries priority 체크
    const salariesNeedUpdate = careers.some(career => 
      career.salaries?.some((salary, idx) => salary.priority !== idx)
    );
    
    needsUpdate = careerNeedsUpdate || salariesNeedUpdate;
    
    if (needsUpdate && careers.length > 0) {
      const updated = careers.map((career, idx) => ({
        ...career,
        career: career.career ? { ...career.career, priority: idx } : undefined,
        salaries: (career.salaries || []).map((salary, salaryIdx) => ({
          ...salary,
          priority: salaryIdx
        }))
      }));
      onUpdate(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [careers.length, careers.reduce((sum, c) => sum + (c.salaries?.length || 0), 0)]);

  const handleAddCareer = () => {
    const newCareer = createEmptyCareer(careers.length);
    onUpdate([...careers, newCareer]);
  };

  const handleDeleteCareer = (index: number) => {
    const filtered = careers.filter((_, i) => i !== index);
    // priority를 인덱스로 재설정
    const updated = filtered.map((career, idx) => ({
      ...career,
      career: career.career ? { ...career.career, priority: idx } : undefined
    }));
    onUpdate(updated);
  };

  const handleCareerChange = (index: number, field: string, value: string | number | boolean | undefined) => {
    const newCareers = [...careers];
    if (newCareers[index].career) {
      newCareers[index].career = {
        ...newCareers[index].career!,
        [field]: value
      };
    }
    
    // priority를 인덱스로 설정
    const updatedCareers = newCareers.map((career, idx) => ({
      ...career,
      career: career.career ? { ...career.career, priority: idx } : undefined
    }));
    
    onUpdate(updatedCareers);
  };

  const toggleVisible = (index: number) => {
    handleCareerChange(index, 'isVisible', !careers[index].career?.isVisible);
  };

  const handleCareerReorder = (reorderedCareers: ResumeUpdateRequest_CareerRequest[]) => {
    const updatedCareers = reorderedCareers.map((career, idx) => ({
      ...career,
      career: career.career ? { ...career.career, priority: idx } : undefined
    }));
    onUpdate(updatedCareers);
  };

  const handleSalaryReorder = (careerIndex: number, reorderedSalaries: ResumeUpdateRequest_CareerRequest_Salary[]) => {
    const updatedSalaries = reorderedSalaries.map((salary, idx) => ({
      ...salary,
      priority: idx
    }));
    
    const newCareers = [...careers];
    newCareers[careerIndex].salaries = updatedSalaries;
    onUpdate(newCareers);
  };

  // Salary 추가
  const handleAddSalary = (careerIndex: number) => {
    const newCareers = [...careers];
    const currentSalaries = newCareers[careerIndex].salaries || [];
    const newSalary: ResumeUpdateRequest_CareerRequest_Salary = {
      amount: 0,
      memo: '',
      negotiationDate: DateTime.now().toMillis(),
      isVisible: false,
      priority: currentSalaries.length
    };
    newCareers[careerIndex].salaries = [...currentSalaries, newSalary];
    // 전체 careers의 priority도 인덱스로 재설정
    const updatedCareers = newCareers.map((career, idx) => ({
      ...career,
      career: career.career ? { ...career.career, priority: idx } : undefined
    }));
    onUpdate(updatedCareers);
  };

  // Salary 삭제
  const handleDeleteSalary = (careerIndex: number, salaryIndex: number) => {
    const newCareers = [...careers];
    const filtered = newCareers[careerIndex].salaries.filter((_, i) => i !== salaryIndex);
    // priority를 인덱스로 재설정
    const updated = filtered.map((salary, idx) => ({
      ...salary,
      priority: idx
    }));
    newCareers[careerIndex].salaries = updated;
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
    
    // priority를 인덱스로 설정
    const updatedSalaries = newSalaries.map((salary, idx) => ({
      ...salary,
      priority: idx
    }));
    
    newCareers[careerIndex].salaries = updatedSalaries;
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

      {careers.length === 0 ? (
        <EmptyState text="등록된 경력 정보가 없습니다." />
      ) : (
        <DraggableList
          items={careers}
          onReorder={handleCareerReorder}
          getItemId={(car, idx) => car.career?.id || `career-${idx}`}
          renderItem={(careerRequest, index) => (
            <CareerItem
              key={careerRequest.career?.id || `career-${index}`}
              careerRequest={careerRequest}
              index={index}
              handleCareerChange={handleCareerChange}
              toggleVisible={toggleVisible}
              handleDeleteCareer={handleDeleteCareer}
              handleAddSalary={handleAddSalary}
              handleSalaryChange={handleSalaryChange}
              handleDeleteSalary={handleDeleteSalary}
              handleSalaryReorder={handleSalaryReorder}
            />
          )}
        />
      )}
    </div>
  );
};

export default CareerEdit;
