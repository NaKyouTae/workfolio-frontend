import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Company, Position, Salary } from '@/generated/common';
import { DateUtil } from '../../../utils/DateUtil';
import HttpMethod from '@/enums/HttpMethod';
import { CompanyCreateRequest, CompanyUpdateRequest } from '@/generated/company';
import { SalaryCreateRequest, SalaryUpdateRequest } from '@/generated/salary';
import { PositionCreateRequest, PositionUpdateRequest } from '@/generated/position';  
import dayjs from 'dayjs';

interface CompanyManagementProps {
  initialData?: Company[];
  onDataChange?: (data: Company[]) => void;
}

const CompanyManagement: React.FC<CompanyManagementProps> = ({ 
  initialData = [],
  onDataChange
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newCompany, setNewCompany] = useState<CompanyCreateRequest>({
    name: '',
    startedAt: 0,
    endedAt: 0,
    isWorking: false,
  });

  // Position 상태 (companyId를 포함한 확장 타입)
  const [positions, setPositions] = useState<Position[]>([]);
  const [newPosition, setNewPosition] = useState<PositionCreateRequest>({
    companyId: '',
    name: '',
    startedAt: 0,
    endedAt: 0,
  });

  // Salary 상태 (companyId를 포함한 확장 타입)
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [newSalary, setNewSalary] = useState<SalaryCreateRequest>({
    companyId: '',
    amount: 0,
    startedAt: 0,
    endedAt: 0,
  });

  // Input 표시 상태
  const [showCompanyInput, setShowCompanyInput] = useState(false);
  const [showPositionInputs, setShowPositionInputs] = useState<{ [companyId: string]: boolean }>({});
  const [showSalaryInputs, setShowSalaryInputs] = useState<{ [companyId: string]: boolean }>({});
  
  // 초기 로드 여부를 추적하는 ref
  const isInitialLoad = useRef(true);

  // 모든 회사의 Position 조회
  const fetchAllPositions = useCallback(async (companiesIds: string) => {
    try {
      const response = await fetch(`/api/workers/positions?companiesIds=${companiesIds}`);
      if (response.ok) {
        const result = await response.json();
        
        if (result && result.positions) {
          setPositions(result.positions);
        }
      } else {
        console.error('Failed to fetch all positions:', response.status);
      }
    } catch (error) {
      console.error('Error fetching all positions:', error);
    }
  }, []);

  // 모든 회사의 Salary 조회
  const fetchAllSalaries = useCallback(async (companiesIds: string) => {
    try {
      const response = await fetch(`/api/workers/salaries?companiesIds=${companiesIds}`);
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
    if (isInitialLoad.current && initialData && initialData.length > 0) {
      const companiesForm: Company[] = initialData.map((company: Company) => ({
        id: company.id,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
        name: company.name,
        startedAt: company.startedAt,
        endedAt: company.endedAt,
        isWorking: company.isWorking,
      }));
      
      setCompanies(companiesForm);
      isInitialLoad.current = false; // 초기 로드 완료 표시
      
      // 모든 회사의 position과 salary를 한 번에 조회
      const companyIds = companiesForm.map(company => company.id).join(',');
      fetchAllPositions(companyIds);
      fetchAllSalaries(companyIds);
    }
  }, [initialData]);

  // 데이터 변경 핸들러
  const handleDataChange = (newCompanies: Company[]) => {
    setCompanies(newCompanies);
    if (onDataChange) {
      onDataChange(newCompanies);
    }
  };

  // 회사 추가
  const addCompany = async () => {
    if (newCompany.name && newCompany.startedAt) {
      try {
        const response = await fetch('/api/workers/companies', {
          method: HttpMethod.POST,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCompany),
        });

        if (response.ok) {
          const result = await response.json();
          if (result) {

            console.log("result", result);

            const newCompanyData = result.company;
            const updatedCompanies = [...companies, newCompanyData];
            handleDataChange(updatedCompanies);

            console.log("updatedCompanies", updatedCompanies);
            
            // 모든 회사의 position과 salary를 다시 조회
            const companyIds = updatedCompanies.map(company => company.id).join(',');
            fetchAllPositions(companyIds);
            fetchAllSalaries(companyIds);
            
            setNewCompany({
              name: '',
              startedAt: 0,
              endedAt: 0,
              isWorking: false,
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
      const selectedCompany = companies[index];
      const updatedCompanyRequest: CompanyUpdateRequest = {
        id: selectedCompany.id,
        name: selectedCompany.name,
        startedAt: selectedCompany.startedAt,
        endedAt: selectedCompany.endedAt,
        isWorking: selectedCompany.isWorking,
      };
      const response = await fetch('/api/workers/companies', {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCompanyRequest),
      });

      if (response.ok) {
        const result = await response.json();
        if (result) {
          const updatedData = [...companies];
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
      const response = await fetch(`/api/workers/companies/${index}`, {
        method: HttpMethod.DELETE,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        handleDataChange(companies.filter((_, i) => i !== index));
      } else {
        console.error('Failed to delete company');
      }
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  // Position 관련 함수들
  const addPosition = async (companyId: string) => {
    if (newPosition.name && newPosition.startedAt) {
      try {
        const positionData = {
          ...newPosition,
          companyId: companyId
        };
        
        const response = await fetch(`/api/workers/positions/${companyId}`, {
          method: HttpMethod.POST,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(positionData),
        });

        if (response.ok) {
          const result = await response.json();
          if (result) {
            // 성공 시 모든 회사의 position 데이터 다시 조회
            const companyIds = companies.map(company => company.id).join(',');
            fetchAllPositions(companyIds);
            setNewPosition({
              companyId: companyId,
              name: '',
              startedAt: 0,
              endedAt: 0,
            });
            // 성공 시 해당 회사의 직책 input 숨기기
            setShowPositionInputs(prev => ({ ...prev, [companyId]: false }));
          } else {
            console.error('Failed to add position');
          }
        } else {
          console.error('Failed to add position');
        }
      } catch (error) {
        console.error('Error adding position:', error);
      }
    }
  };

  const updatePosition = async (index: number) => {
    try {
      const selectedPosition = positions[index];
      const updatedPositionRequest: PositionUpdateRequest = {
        id: selectedPosition.id,
        name: selectedPosition.name,
        startedAt: selectedPosition.startedAt,
        endedAt: selectedPosition.endedAt,
      };
      const response = await fetch('/api/workers/positions', {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPositionRequest),
      });

      if (response.ok) {
        const result = await response.json();
        if (result) {
          // 성공 시 모든 회사의 position 데이터 다시 조회
          const companyIds = companies.map(company => company.id).join(',');
          fetchAllPositions(companyIds);
        } else {
          console.error('Failed to update position');
        }
      } else {
        console.error('Failed to update position');
      }
    } catch (error) {
      console.error('Error updating position:', error);
    }
  };

  const removePosition = async (index: number) => {
    try {
      const selectedPosition = positions[index];
      const response = await fetch(`/api/workers/positions/${selectedPosition.id}`, {
        method: HttpMethod.DELETE,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // 성공 시 모든 회사의 position 데이터 다시 조회
        const companyIds = companies.map(company => company.id).join(',');
        fetchAllPositions(companyIds);
      } else {
        console.error('Failed to delete position');
      }
    } catch (error) {
      console.error('Error deleting position:', error);
    }
  };

  // Salary 관련 함수들
  const addSalary = async (companyId: string) => {
    if (newSalary.amount > 0 && newSalary.startedAt) {
      try {
        const salaryData = {
          ...newSalary,
          companyId: companyId
        };
        
        const response = await fetch(`/api/workers/salaries/${companyId}`, {
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
            const companyIds = companies.map(company => company.id).join(',');
            fetchAllSalaries(companyIds);
            setNewSalary({
              companyId: companyId,
              amount: 0,
              startedAt: 0,
              endedAt: 0,
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
        startedAt: selectedSalary.startedAt,
        endedAt: selectedSalary.endedAt,
      };
      const response = await fetch(`/api/workers/salaries/${selectedSalary.company?.id}`, {
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
          const companyIds = companies.map(company => company.id).join(',');
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
      const response = await fetch(`/api/workers/salaries/${selectedSalary.company?.id}`, {
        method: HttpMethod.DELETE,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // 성공 시 모든 회사의 salary 데이터 다시 조회
        const companyIds = companies.map(company => company.id).join(',');
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
    if (companies.length === 0) {
      return '0년 0개월';
    }

    // 입사일 기준으로 정렬 (가장 오래된 것부터)
    const sortedCompanies = [...companies].sort((a, b) => a.startedAt - b.startedAt);
    const firstCompany = sortedCompanies[0];
    const firstStartDate = dayjs(new Date(DateUtil.formatTimestamp(firstCompany.startedAt)));
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: '0 0 4px 0' }}>
            총 경력: {calculateTotalExperience()}
          </h3>
        </div>
        {renderAddButton('추가', '#007bff', () => setShowCompanyInput(!showCompanyInput))}
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
              value={newCompany.name}
              onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
            <input
              type="date"
              placeholder="시작일"
              value={newCompany.startedAt ? DateUtil.formatTimestamp(newCompany.startedAt) : ''}
              onChange={(e) => setNewCompany({ ...newCompany, startedAt: DateUtil.parseToTimestamp(e.target.value) })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
            <input
              type="date"
              placeholder="종료일"
              value={newCompany.endedAt ? DateUtil.formatTimestamp(newCompany.endedAt) : ''}
              onChange={(e) => setNewCompany({ ...newCompany, endedAt: DateUtil.parseToTimestamp(e.target.value) })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: '100px' }}>
              <input
                type="checkbox"
                checked={newCompany.isWorking}
                onChange={(e) => setNewCompany({ ...newCompany, isWorking: e.target.checked })}
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
        {companies?.map((company, index) => (
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
                <div>{DateUtil.formatDateRange(company.startedAt, company.endedAt)}</div>
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
                        value={newPosition.name}
                        onChange={(e) => setNewPosition({ ...newPosition, name: e.target.value })}
                        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <input
                        type="date"
                        placeholder="시작일"
                        value={newPosition.startedAt ? DateUtil.formatTimestamp(newPosition.startedAt) : ''}
                        onChange={(e) => setNewPosition({ ...newPosition, startedAt: DateUtil.parseToTimestamp(e.target.value) })}
                        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <input
                        type="date"
                        placeholder="종료일"
                        value={newPosition.endedAt ? DateUtil.formatTimestamp(newPosition.endedAt) : ''}
                        onChange={(e) => setNewPosition({ ...newPosition, endedAt: DateUtil.parseToTimestamp(e.target.value) })}
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
                  {positions?.filter(pos => pos.company?.id === company.id).map((position, posIndex) => (
                    <div 
                      key={posIndex} 
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
                        <div><strong>{position.name}</strong></div>
                        <div>{DateUtil.formatDateRange(position.startedAt, position.endedAt)}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <button 
                          onClick={() => updatePosition(posIndex)}
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
                        {renderAddButton('삭제', '#dc3545', () => removePosition(posIndex))}
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
                        value={newSalary.amount ? newSalary.amount.toLocaleString('ko-KR') : ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          setNewSalary({ ...newSalary, amount: parseInt(value) || 0 });
                        }}
                        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <input
                        type="date"
                        placeholder="시작일"
                        value={newSalary.startedAt ? DateUtil.formatTimestamp(newSalary.startedAt) : ''}
                        onChange={(e) => setNewSalary({ ...newSalary, startedAt: DateUtil.parseToTimestamp(e.target.value) })}
                        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <input
                        type="date"
                        placeholder="종료일"
                        value={newSalary.endedAt ? DateUtil.formatTimestamp(newSalary.endedAt) : ''}
                        onChange={(e) => setNewSalary({ ...newSalary, endedAt: DateUtil.parseToTimestamp(e.target.value) })}
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
                  {salaries?.filter(sal => sal.company?.id === company.id).map((salary, salIndex) => (
                    <div 
                      key={salIndex} 
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
                        <div><strong>{Number(salary.amount).toLocaleString('ko-KR')}원</strong></div>
                        <div>{DateUtil.formatDateRange(salary.startedAt, salary.endedAt)}</div>
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

export default CompanyManagement;
