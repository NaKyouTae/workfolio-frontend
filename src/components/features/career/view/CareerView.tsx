import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Career, Career_EmploymentType, Salary } from '@/generated/common';
import { DateUtil } from '@/utils/DateUtil';
import HttpMethod from '@/enums/HttpMethod';
import { CareerUpdateRequest } from '@/generated/career';
import { SalaryCreateRequest, SalaryUpdateRequest } from '@/generated/salary';
import dayjs from 'dayjs';
import { CareerCreateRequest } from '@/generated/career';

interface CareerViewProps {
  careers?: Career[];
  onDataChange?: (data: Career[]) => void;
}

const CareerView: React.FC<CareerViewProps> = ({ 
  careers = [],
  onDataChange
}) => {
  const [newCareer, setNewCareer] = useState<CareerCreateRequest>({
    name: '',
    startedAt: 0,
    endedAt: 0,
    isWorking: false,
    resumeId: '',
    position: '',
    employmentType: Career_EmploymentType.FULL_TIME,
    department: '',
    jobGrade: '',
    job: '',
    salary: 0,
    isVisible: false,
  });

  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [newSalary, setNewSalary] = useState<SalaryCreateRequest>({
    careerId: '',
    amount: 0,
    negotiationDate: 0,
    memo: '',
    isVisible: false,
  });

  // Input 표시 상태
  const [showCompanyInput, setShowCompanyInput] = useState(false);
  const [showPositionInputs, setShowPositionInputs] = useState<{ [companyId: string]: boolean }>({});
  const [showSalaryInputs, setShowSalaryInputs] = useState<{ [companyId: string]: boolean }>({});
  
  // 초기 로드 여부를 추적하는 ref
  const isInitialLoad = useRef(true);


  // 모든 회사의 Salary 조회
  const fetchAllSalaries = useCallback(async (companiesIds: string) => {
    try {
      const response = await fetch(`/api/salaries?companiesIds=${companiesIds}`);
      if (response.ok) {
        const result = await response.json();
        
        if (result && result.salaries) {
          setSalaries(result.salaries);
        }
      } else {
        console.error('Failed to fetch all salaries:', response.status);
      }
    } catch (error) {
      console.error('Error fetching all salaries:', error);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    if (isInitialLoad.current && careers && careers.length > 0) {
      isInitialLoad.current = false; // 초기 로드 완료 표시
    }
  }, [careers]); // eslint-disable-line react-hooks/exhaustive-deps

  // 데이터 변경 핸들러
  const handleDataChange = (newCompanies: Career[]) => {
    if (onDataChange) {
      onDataChange(newCompanies);
    }
  };

  // 회사 추가
  const addCompany = async () => {
    if (newCareer.name && newCareer.startedAt) {
      try {
        const response = await fetch('/api/careers', {
          method: HttpMethod.POST,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCareer),
        });

        if (response.ok) {
          const result = await response.json();
          if (result) {

            console.log("result", result);

            const newCompanyData = result.career;
            const updatedCompanies = [...careers, newCompanyData];
            handleDataChange(updatedCompanies);

            console.log("updatedCompanies", updatedCompanies);
            
            // 모든 회사의 position과 salary를 다시 조회
            const companyIds = updatedCompanies.map(company => company.id).join(',');
            fetchAllSalaries(companyIds);
            
            setNewCareer({
              name: '',
              startedAt: 0,
              endedAt: 0,
              isWorking: false,
              resumeId: '',
              position: '',
              employmentType: Career_EmploymentType.FULL_TIME,
              department: '',
              jobGrade: '',
              job: '',
              salary: 0,
              isVisible: false,
            });
          } else {
            console.error('Failed to add company');
          }
        } else {
          console.error('Failed to add company');
        }
      } catch (error) {
        console.error('Error adding company:', error);
      }
    }
  };

  // 회사 수정
  const updateCompany = async (index: number) => {
    try {
      const selectedCompany = careers[index];
      const updatedCompanyRequest: CareerUpdateRequest = {
        id: selectedCompany.id,
        name: selectedCompany.name,
        startedAt: selectedCompany.startedAt,
        endedAt: selectedCompany.endedAt,
        isWorking: selectedCompany.isWorking,
        position: selectedCompany.position,
        employmentType: selectedCompany.employmentType,
        department: selectedCompany.department,
        jobGrade: selectedCompany.jobGrade,
        job: selectedCompany.job,
        salary: selectedCompany.salary,
        isVisible: selectedCompany.isVisible,
      };
      const response = await fetch('/api/careers', {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCompanyRequest),
      });

      if (response.ok) {
        const result = await response.json();
        if (result) {
          const updatedData = [...careers];
          updatedData[index] = result.company;
          handleDataChange(updatedData);
        } else {
          console.error('Failed to update company');
        }
      } else {
        console.error('Failed to update company');
      }
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  // 회사 삭제
  const removeCompany = async (index: number) => {
    try {
      const response = await fetch(`/api/careers/${index}`, {
        method: HttpMethod.DELETE,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        handleDataChange(careers.filter((_, i) => i !== index));
      } else {
        console.error('Failed to delete company');
      }
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  // Position 관련 함수들
  const addPosition = async (companyId: string) => {
    if (newSalary.amount && newSalary.negotiationDate) {
      try {
        const salaryData = {
          ...newSalary,
          careerId: companyId
        };
        
        const response = await fetch(`/api/salaries`, {
          method: HttpMethod.POST,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(salaryData),
        });

        if (response.ok) {
          const result = await response.json();
          if (result) {
            // 성공 시 모든 회사의 position 데이터 다시 조회
            const companyIds = careers.map(company => company.id).join(',');
            fetchAllSalaries(companyIds);
            setNewSalary({
              careerId: companyId,
              amount: 0,
              negotiationDate: 0,
              memo: '',
              isVisible: false,
            });
            // 성공 시 해당 회사의 급여 input 숨기기
            setShowSalaryInputs(prev => ({ ...prev, [companyId]: false }));
          } else {
            console.error('Failed to add salary');
          }
        } else {
          console.error('Failed to add salary');
        }
      } catch (error) {
        console.error('Error adding salary:', error);
      }
    }
  };



  // Salary 관련 함수들
  const addSalary = async (companyId: string) => {
    if (newSalary.amount && newSalary.negotiationDate) {
      try {
        const salaryData = {
          ...newSalary,
          careerId: companyId
        };
        
        const response = await fetch(`/api/salaries`, {
          method: HttpMethod.POST,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(salaryData),
        });

        if (response.ok) {
          const result = await response.json();
          if (result) {
            // 성공 시 모든 회사의 salary 데이터 다시 조회
            const companyIds = careers.map(company => company.id).join(',');
            fetchAllSalaries(companyIds);
            setNewSalary({
              careerId: companyId,
              amount: 0,
              negotiationDate: 0,
              memo: '',
              isVisible: false,
            });
            // 성공 시 해당 회사의 급여 input 숨기기
            setShowSalaryInputs(prev => ({ ...prev, [companyId]: false }));
          } else {
            console.error('Failed to add salary');
          }
        } else {
          console.error('Failed to add salary');
        }
      } catch (error) {
        console.error('Error adding salary:', error);
      }
    }
  };

  const updateSalary = async (index: number) => {
    try {
      const selectedSalary = salaries[index];
      const updatedSalaryRequest: SalaryUpdateRequest = {
        id: selectedSalary.id,
        amount: selectedSalary.amount,
        negotiationDate: selectedSalary.negotiationDate,
        memo: selectedSalary.memo,
        isVisible: selectedSalary.isVisible || false,
      };
      const response = await fetch(`/api/salaries/${selectedSalary.career?.id}`, {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSalaryRequest),
      });

      if (response.ok) {
        const result = await response.json();
        if (result) {
          // 성공 시 모든 회사의 salary 데이터 다시 조회
          const companyIds = careers.map(company => company.id).join(',');
          fetchAllSalaries(companyIds);
        } else {
          console.error('Failed to update salary');
        }
      } else {
        console.error('Failed to update salary');
      }
    } catch (error) {
      console.error('Error updating salary:', error);
    }
  };

  const removeSalary = async (index: number) => {
    try {
      const selectedSalary = salaries[index];
      const response = await fetch(`/api/salaries/${selectedSalary.career?.id}`, {
        method: HttpMethod.DELETE,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // 성공 시 모든 회사의 salary 데이터 다시 조회
        const companyIds = careers.map(company => company.id).join(',');
        fetchAllSalaries(companyIds);
      } else {
        console.error('Failed to delete salary');
      }
    } catch (error) {
      console.error('Error deleting salary:', error);
    }
  };

  // 공통 추가 버튼 렌더링 함수
  // 총 경력 계산 함수
  const calculateTotalExperience = () => {
    if (careers.length === 0) {
      return '0년 0개월';
    }

    // 입사일 기준으로 정렬 (가장 오래된 것부터)
    const sortedCompanies = [...careers].sort((a, b) => (a.startedAt || 0) - (b.startedAt || 0));
    const firstCompany = sortedCompanies[0];
    const firstStartDate = dayjs(new Date(DateUtil.formatTimestamp(firstCompany.startedAt || 0)));
    const now = dayjs();

    return `${firstStartDate.diff(now, 'month')}개월`;
  };

  const renderAddButton = (title: string, backgroundColor: string = "#007bff", onClick: () => void) => (
    <div style={{ display: 'inline-block' }}>
      <button
        onClick={onClick}
        style={{
          backgroundColor: backgroundColor,
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '50px',
          height: '30px',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          whiteSpace: 'nowrap'
        }}
        title={title}
      >
        {title}
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '24px', marginRight: '12px' }}>🏢</span>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: '0 0 4px 0' }}>
            회사 이력
          </h2>
        </div>
        {renderAddButton('추가', '#007bff', () => setShowCompanyInput(!showCompanyInput))}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#666', margin: '0 0 10px 0' }}>
          총 경력: {calculateTotalExperience()}
        </h4>
      </div>
      
      {/* 회사 추가 입력 폼 */}
      {showCompanyInput && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#495057' }}>회사 추가</h4>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="회사명"
              value={newCareer.name}
              onChange={(e) => setNewCareer({ ...newCareer, name: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
            <input
              type="date"
              placeholder="시작일"
              value={newCareer.startedAt ? DateUtil.formatTimestamp(newCareer.startedAt) : ''}
              onChange={(e) => setNewCareer({ ...newCareer, startedAt: DateUtil.parseToTimestamp(e.target.value) })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
            <input
              type="date"
              placeholder="종료일"
              value={newCareer.endedAt ? DateUtil.formatTimestamp(newCareer.endedAt) : ''}
              onChange={(e) => setNewCareer({ ...newCareer, endedAt: DateUtil.parseToTimestamp(e.target.value) })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: '100px' }}>
              <input
                type="checkbox"
                checked={newCareer.isWorking}
                onChange={(e) => setNewCareer({ ...newCareer, isWorking: e.target.checked })}
              />
              재직중
            </label>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={addCompany}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer'
              }}
            >
              추가
            </button>
            <button 
              onClick={() => setShowCompanyInput(false)}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#6c757d', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer'
              }}
            >
              취소
            </button>
          </div>
        </div>
      )}
      

      {/* 회사 목록 */}
      <div>
        {careers?.map((company, index) => (
          <div 
            key={index} 
            style={{ 
              border: '1px solid #ddd', 
              marginBottom: '20px', 
              borderRadius: '8px',
              backgroundColor: '#f0f8ff',
              overflow: 'hidden'
            }}
          >
            {/* 회사 기본 정보 */}
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              justifyContent: 'space-between', 
              padding: '15px', 
              backgroundColor: '#e3f2fd',
              borderBottom: '1px solid #ddd'
            }}>
              <div style={{ flex: 1 }}>
                <div><strong style={{ fontSize: '18px' }}>{company.name}</strong></div>
                <div>{DateUtil.formatDateRange(company.startedAt || 0, company.endedAt || 0)}</div>
                <div>재직중: {company.isWorking ? '예' : '아니오'}</div>
              </div>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                {renderAddButton('수정', '#28a745', () => updateCompany(index))}
                {renderAddButton('삭제', '#dc3545', () => removeCompany(index))}
              </div>
            </div>

            {/* 직책 및 급여 이력 섹션 - 좌우 배치 */}
            <div style={{ display: 'flex', gap: '20px', padding: '15px' }}>
              {/* 직책 이력 섹션 */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', gap: '10px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', margin: 0 }}>직책 이력</h4>
                  {renderAddButton('추가', '#007bff', () => setShowPositionInputs(prev => ({ ...prev, [company.id]: !prev[company.id] })))}
                </div>
                
                {/* 직책 추가 입력 폼 */}
                {showPositionInputs[company.id] && (
                  <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '15px', 
                    borderRadius: '6px', 
                    marginBottom: '15px',
                    border: '1px solid #dee2e6'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
                      <input
                        type="text"
                        placeholder="직책명"
                        value={newSalary.amount ? newSalary.amount.toLocaleString('ko-KR') : ''}
                        onChange={(e) => setNewSalary({ ...newSalary, amount: parseInt(e.target.value) || 0 })}
                        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setShowPositionInputs(prev => ({ ...prev, [company.id]: false }))}
                        style={{
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '8px 16px',
                          cursor: 'pointer',
                        }}
                      >
                        취소
                      </button>
                      <button
                        onClick={() => addPosition(company.id)}
                        style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '8px 16px',
                          cursor: 'pointer',
                        }}
                      >
                        저장
                      </button>
                    </div>
                  </div>
                )}
                <div>
                  {salaries?.filter(sal => sal.career?.id === company.id).map((salary, salIndex) => (
                    <div 
                      key={salary.id} 
                      style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        justifyContent: 'space-between', 
                        padding: '10px', 
                        border: '1px solid #eee', 
                        marginBottom: '8px', 
                        borderRadius: '4px', 
                        alignItems: 'center',
                        backgroundColor: '#fafafa'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div><strong>{salary.amount?.toLocaleString('ko-KR') || '0'}원</strong></div>
                        <div>{DateUtil.formatTimestamp(salary.negotiationDate || 0)}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <button 
                          onClick={() => updateSalary(salIndex)}
                          style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                          }}
                        >
                          수정
                        </button>
                        {renderAddButton('삭제', '#dc3545', () => removeSalary(salIndex))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 급여 이력 섹션 */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', gap: '10px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', margin: 0 }}>급여 이력</h4>
                  {renderAddButton('추가', '#007bff', () => setShowSalaryInputs(prev => ({ ...prev, [company.id]: !prev[company.id] })))}
                </div>
                
                {/* 급여 추가 입력 폼 */}
                {showSalaryInputs[company.id] && (
                  <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '15px', 
                    borderRadius: '6px', 
                    marginBottom: '15px',
                    border: '1px solid #dee2e6'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
                      <input
                        type="text"
                        placeholder="급여 (원)"
                        value={newSalary.amount ? newSalary.amount?.toLocaleString('ko-KR') || '0' : ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setNewSalary({ ...newSalary, amount: parseInt(value) || 0 });
                        }}
                        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <input
                        type="date"
                        placeholder="시작일"
                        value={newSalary.negotiationDate ? DateUtil.formatTimestamp(newSalary.negotiationDate || 0) : ''}
                        onChange={(e) => setNewSalary({ ...newSalary, negotiationDate: DateUtil.parseToTimestamp(e.target.value) })}
                        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setShowSalaryInputs(prev => ({ ...prev, [company.id]: false }))}
                        style={{
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '8px 16px',
                          cursor: 'pointer',
                        }}
                      >
                        취소
                      </button>
                      <button
                        onClick={() => addSalary(company.id)}
                        style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '8px 16px',
                          cursor: 'pointer',
                        }}
                      >
                        저장
                      </button>
                    </div>
                  </div>
                )}
                <div>
                  {salaries?.filter(sal => sal.career?.id === company.id).map((salary, salIndex) => (
                    <div 
                      key={salary.id} 
                      style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        justifyContent: 'space-between',
                        padding: '10px',
                        border: '1px solid #eee',
                        marginBottom: '8px',
                        borderRadius: '4px',
                        alignItems: 'center',
                        backgroundColor: '#fafafa',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div><strong>{Number(salary.amount).toLocaleString('ko-KR')}원</strong></div>
                        <div>{DateUtil.formatTimestamp(salary.negotiationDate || 0)}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <button 
                          onClick={() => updateSalary(salIndex)}
                          style={{ 
                            width: '50px', 
                            height: '30px', 
                            backgroundColor: '#28a745', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          수정
                        </button>
                        {renderAddButton('삭제', '#dc3545', () => removeSalary(salIndex))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CareerView;
