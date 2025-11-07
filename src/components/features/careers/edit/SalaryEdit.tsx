import React from 'react';
import { ResumeUpdateRequest_CareerRequest_Salary } from '@/generated/resume';
import Input from '@/components/ui/Input';
import DatePicker from '@/components/ui/DatePicker';
import { DateTime } from 'luxon';
import DraggableList from '@/components/ui/DraggableList';
import DraggableItem from '@/components/ui/DraggableItem';
import CardActions from '@/components/ui/CardActions';
import EmptyState from '@/components/ui/EmptyState';

interface SalaryEditProps {
  salaries: ResumeUpdateRequest_CareerRequest_Salary[];
  careerIndex: number;
  handleAddSalary: (careerIndex: number) => void;
  handleSalaryChange: (careerIndex: number, salaryIndex: number, field: keyof ResumeUpdateRequest_CareerRequest_Salary, value: string | number | boolean | undefined) => void;
  handleDeleteSalary: (careerIndex: number, salaryIndex: number) => void;
  handleSalaryReorder: (careerIndex: number, reorderedSalaries: ResumeUpdateRequest_CareerRequest_Salary[]) => void;
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
  return (
    <DraggableItem 
        id={salary.id || `salary-${careerIndex}-${salaryIndex}`}
    >
        <div className="card">
            <ul className="edit-cont">
                <li>
                    <p>연봉(만 원)</p>
                    <div className="input-desc">
                        <Input
                            type="number"
                            label="연봉(만 원)"
                            placeholder="연봉을 입력해 주세요."
                            value={salary.amount?.toString() || ''}
                            onChange={(e) => handleSalaryChange(careerIndex, salaryIndex, 'amount', Number(e.target.value))}
                        />
                        <span>만 원</span>
                    </div>
                </li>
                <li>
                    <p>협상 일자</p>
                    <DatePicker
                        value={salary.negotiationDate}
                        onChange={(date) => handleSalaryChange(careerIndex, salaryIndex, 'negotiationDate', DateTime.fromISO(date).toMillis())}
                        required={false}
                    />
                </li>
                <li className="full">
                    <p>내용</p>
                    <textarea 
                      placeholder="내용을 입력해 주세요." 
                      value={salary.memo || ''}
                      onChange={(e) => handleSalaryChange(careerIndex, salaryIndex, 'memo', e.target.value)}
                    ></textarea>
                </li>
            </ul>
            <CardActions
                isVisible={salary.isVisible ?? true}
                onToggleVisible={() => handleSalaryChange(careerIndex, salaryIndex, 'isVisible', !salary.isVisible)}
                onDelete={() => handleDeleteSalary(careerIndex, salaryIndex)}
            />
        </div>
    </DraggableItem>
  );
};

const SalaryEdit: React.FC<SalaryEditProps> = ({
  salaries,
  careerIndex,
  handleAddSalary,
  handleSalaryChange,
  handleDeleteSalary,
  handleSalaryReorder,
}) => {
  return (
    <div className="card-sub">
      <div className="cont-sub-tit">
        <div>
          <h4>연봉</h4>
        </div>
        <button onClick={() => handleAddSalary(careerIndex)}>
          <i className="ic-add" />추가
        </button>
      </div>
      {salaries.length === 0 ? (
        <EmptyState text="등록된 연봉 정보가 없습니다." />
      ) : (
        <DraggableList
          items={salaries}
          onReorder={(reorderedSalaries) => handleSalaryReorder(careerIndex, reorderedSalaries)}
          getItemId={(sal, idx) => sal.id || `salary-${careerIndex}-${idx}`}
          renderItem={(salary, salaryIndex) => (
            <SalaryItem
              key={salary.id || `salary-${careerIndex}-${salaryIndex}`}
              salary={salary}
              salaryIndex={salaryIndex}
              careerIndex={careerIndex}
              handleSalaryChange={handleSalaryChange}
              handleDeleteSalary={handleDeleteSalary}
            />
          )}
        />
      )}
    </div>
  );
};

export default SalaryEdit;
