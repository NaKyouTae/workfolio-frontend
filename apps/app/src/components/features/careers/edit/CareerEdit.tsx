import React, { useEffect } from 'react';
import { ResumeUpdateRequest_CareerRequest, ResumeUpdateRequest_CareerRequest_Salary } from '@workfolio/shared/generated/resume';
import { Career_EmploymentType } from '@workfolio/shared/generated/common';
import Input from '@workfolio/shared/ui/Input';
import Dropdown from '@workfolio/shared/ui/Dropdown';
import DatePicker from '@workfolio/shared/ui/DatePicker';
import { DateTime } from 'luxon';
import { normalizeEnumValue } from '@workfolio/shared/utils/commonUtils';
import DraggableList from '@workfolio/shared/ui/DraggableList';
import DraggableItem from '@workfolio/shared/ui/DraggableItem';
import CardActions from '@workfolio/shared/ui/CardActions';
import EmptyState from '@workfolio/shared/ui/EmptyState';
import SalaryEdit from './SalaryEdit';

interface CareerEditProps {
  careers: ResumeUpdateRequest_CareerRequest[];
  onUpdate: (careers: ResumeUpdateRequest_CareerRequest[]) => void;
}

interface CareerItemProps {
  careerRequest: ResumeUpdateRequest_CareerRequest;
  index: number;
  careers: ResumeUpdateRequest_CareerRequest[];
  onUpdate: (careers: ResumeUpdateRequest_CareerRequest[]) => void;
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
  careers,
  onUpdate,
  handleCareerChange,
  toggleVisible,
  handleDeleteCareer,
  handleAddSalary,
  handleSalaryChange,
  handleDeleteSalary,
  handleSalaryReorder,
}) => {
  const handleIsWorkingChange = (checked: boolean) => {
    const newCareers = [...careers];
    if (newCareers[index].career) {
      newCareers[index].career = {
        ...newCareers[index].career!,
        isWorking: checked,
        endedAt: checked ? undefined : newCareers[index].career!.endedAt
      };
    }
    const updatedCareers = newCareers.map((career, idx) => ({
      ...career,
      career: career.career ? { ...career.career, priority: idx } : undefined
    }));
    onUpdate(updatedCareers);
  };

  return (
    <DraggableItem 
        id={careerRequest.career?.id || `career-${index}`}
    >
        <div className="card-wrap">
            <div className="card">
                {careerRequest.career && (
                    <ul className="edit-cont">
                        <li>
                            <p>회사명</p>
                            <Input 
                                type="text"
                                label="회사명"
                                placeholder="회사명을 입력해 주세요."
                                value={careerRequest.career.name || ''}
                                onChange={(e) => handleCareerChange(index, 'name', e.target.value)}
                            />
                        </li>
                        <li>
                            <p>최종 연봉(만 원)</p>
                            <div className="input-desc">
                                <Input 
                                    type="text"
                                    label="최종 연봉(만 원)"
                                    placeholder="최종 연봉을 입력해 주세요."
                                    value={careerRequest.career.salary?.toString() || ''}
                                    onChange={(e) => handleCareerChange(index, 'salary', Number(e.target.value))}
                                />
                                <span>만 원</span>
                            </div>
                        </li>
                        <li>
                            <p>입사년월 - 퇴사년월</p>
                            <div>
                                <DatePicker
                                  value={careerRequest.career.startedAt}
                                  onChange={(date) => handleCareerChange(index, 'startedAt', DateTime.fromISO(date).toMillis())}
                                  required={false}
                                />
                                <span>-</span>
                                <DatePicker
                                  value={careerRequest.career.endedAt}
                                  readOnly={careerRequest.career.isWorking}
                                  onChange={(date) => handleCareerChange(index, 'endedAt', DateTime.fromISO(date).toMillis())}
                                  required={false}
                                />
                                <input
                                    type="checkbox"
                                    id={`isWorking-${index}`}
                                    checked={careerRequest.career.isWorking || false}
                                    onChange={(e) => handleIsWorkingChange(e.target.checked)}
                                />
                                <label htmlFor={`isWorking-${index}`}>재직 중</label>
                            </div>
                        </li>
                        <li>
                            <p>재직 형태</p>
                            <Dropdown
                                selectedOption={normalizeEnumValue(careerRequest.career.employmentType, Career_EmploymentType)}
                                options={[
                                    { value: Career_EmploymentType.FULL_TIME, label: '정규직' },
                                    { value: Career_EmploymentType.CONTRACT, label: '계약직' },
                                    { value: Career_EmploymentType.INTERN, label: '인턴' },
                                    { value: Career_EmploymentType.FREELANCER, label: '프리랜서' },
                                ]}
                                setValue={(value) => handleCareerChange(index, 'employmentType', normalizeEnumValue(value, Career_EmploymentType))}
                            />
                        </li>
                        <li>
                            <p>부서</p>
                            <Input
                                type="text"
                                label="부서"
                                placeholder="부서를 입력해 주세요."
                                value={careerRequest.career.department || ''}
                                onChange={(e) => handleCareerChange(index, 'department', e.target.value)}
                            />
                        </li>
                        <li>
                            <p>직무</p>
                            <Input
                                type="text"
                                label="직무"
                                placeholder="직무를 입력해 주세요."
                                value={careerRequest.career.jobTitle || ''}
                                onChange={(e) => handleCareerChange(index, 'jobTitle', e.target.value)}
                            />
                        </li>
                        <li>
                            <p>직책</p>
                            <Input
                                type="text"
                                label="직책"
                                placeholder="예) 파트장, 팀장, 본부장 등"
                                value={careerRequest.career.position || ''}
                                onChange={(e) => handleCareerChange(index, 'position', e.target.value)}
                            />
                        </li>
                        <li>
                            <p>직급</p>
                            <Input
                                type="text"
                                label="직급"
                                placeholder="예) 사원, 대리, 과장 등"
                                value={careerRequest.career.rank || ''}
                                onChange={(e) => handleCareerChange(index, 'rank', e.target.value)}
                            />
                        </li>
                        <li className="full">
                            <p>내용</p>
                            {/* <Input
                                type="text"
                                label="내용"
                                placeholder=""내용을 입력해 주세요."
                                value={careerRequest.career.description || ''}
                                onChange={(e) => handleCareerChange(index, 'description', e.target.value)}
                            /> */}
                            <textarea 
                              placeholder="내용을 입력해 주세요."
                              value={careerRequest.career.description || ''}
                              onChange={(e) => handleCareerChange(index, 'description', e.target.value)}                            
                            ></textarea>
                        </li>
                    </ul>
                )}
                <CardActions
                isVisible={careerRequest.career?.isVisible ?? true}
                onToggleVisible={() => toggleVisible(index)}
                onDelete={() => handleDeleteCareer(index)}
                />
            </div>
            <SalaryEdit
              salaries={careerRequest.salaries || []}
              careerIndex={index}
              handleAddSalary={handleAddSalary}
              handleSalaryChange={handleSalaryChange}
              handleDeleteSalary={handleDeleteSalary}
              handleSalaryReorder={handleSalaryReorder}
            />
        </div>
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
      jobTitle: '',
      rank: '',
      description: '',
      salary: 0,
      isVisible: true,
      priority,
    },
    salaries: [
      {
        amount: 0,
        memo: '',
        negotiationDate: undefined,
        isVisible: true,
        priority: 0,
      },
    ],
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
    <>
        <div className="cont-tit">
            <div>
                <h3>경력</h3>
                <p>{careers.length}개</p>
            </div>
            <button onClick={handleAddCareer}><i className="ic-add" />추가</button>
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
                    careers={careers}
                    onUpdate={onUpdate}
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
    </>
  );
};

export default CareerEdit;
