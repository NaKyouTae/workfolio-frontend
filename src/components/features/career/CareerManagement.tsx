import React, { useState, useEffect } from 'react';
import { WorkerCareerListResponse, WorkerCareerUpdateRequest_WorkerCertifications, WorkerCareerUpdateRequest_WorkerCompany, WorkerCareerUpdateRequest_WorkerCompany_WorkerCompanyPosition, WorkerCareerUpdateRequest_WorkerCompany_WorkerCompanySalary, WorkerCareerUpdateRequest_WorkerDegrees, WorkerCareerUpdateRequest_WorkerEducation } from '../../../generated/worker_career';
import { Certifications, Company, Degrees, Education, Position, Salary } from '@/generated/common';
import { DateUtil } from '../../../utils/DateUtil';


const CareerManagement: React.FC = () => {
  // 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 서버에서 가져온 데이터 (조회 모드용)
  const [careerData, setCareerData] = useState<WorkerCareerListResponse>({
    companies: [],
    certifications: [],
    degrees: [],
    educations: []
  });

  // Company 상태 (수정 모드용)
  const [companies, setCompanies] = useState<WorkerCareerUpdateRequest_WorkerCompany[]>([]);
  const [newCompany, setNewCompany] = useState<WorkerCareerUpdateRequest_WorkerCompany>({
    name: '',
    startedAt: 0,
    endedAt: 0,
    isWorking: false,
    positions: [],
    salaries: []
  });

  // Position 상태 (수정 모드용)
  const [positions, setPositions] = useState<WorkerCareerUpdateRequest_WorkerCompany_WorkerCompanyPosition[]>([]);
  const [newPosition, setNewPosition] = useState<WorkerCareerUpdateRequest_WorkerCompany_WorkerCompanyPosition>({
    name: '',
    startedAt: 0,
    endedAt: 0,
  });

  // Salary 상태 (수정 모드용)
  const [salaries, setSalaries] = useState<WorkerCareerUpdateRequest_WorkerCompany_WorkerCompanySalary[]>([]);
  const [newSalary, setNewSalary] = useState<WorkerCareerUpdateRequest_WorkerCompany_WorkerCompanySalary>({
    amount: 0,
    startedAt: 0,
    endedAt: 0,
  });

  // Certifications 상태 (수정 모드용)
  const [certifications, setCertifications] = useState<WorkerCareerUpdateRequest_WorkerCertifications[]>([]);
  const [newCertification, setNewCertification] = useState<WorkerCareerUpdateRequest_WorkerCertifications>({
    name: '',
    number: '',
    issuer: '',
    issuedAt: 0,
    expirationPeriod: 0
  });

  // Degrees 상태 (수정 모드용)
  const [degrees, setDegrees] = useState<WorkerCareerUpdateRequest_WorkerDegrees[]>([]);
  const [newDegree, setNewDegree] = useState<WorkerCareerUpdateRequest_WorkerDegrees>({
    name: '',
    major: '',
    startedAt: 0,
    endedAt: 0
  });

  // Education 상태 (수정 모드용)
  const [educations, setEducations] = useState<WorkerCareerUpdateRequest_WorkerEducation[]>([]);
  const [newEducation, setNewEducation] = useState<WorkerCareerUpdateRequest_WorkerEducation>({
    name: '',
    startedAt: 0,
    endedAt: 0,
    agency: ''
  });

  // 데이터 로딩 함수
  const fetchCareerData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/workers/careers');
      if (response.ok) {
        const data: WorkerCareerListResponse = await response.json();
        setCareerData(data);
      } else {
        console.error('Failed to fetch career data');
      }
    } catch (error) {
      console.error('Error fetching career data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    fetchCareerData();
  }, []);

  // 수정 모드 진입 함수
  const enterEditMode = () => {
    // 서버 데이터를 수정용 폼 데이터로 변환
    const companiesForm: WorkerCareerUpdateRequest_WorkerCompany[] = careerData.companies.map((company: Company) => ({
      name: company.name,
      startedAt: company.startedAt,
      endedAt: company.endedAt,
      isWorking: company.isWorking,
      positions: company.positions,
      salaries: company.salaries
    }));

    const positionsForm: WorkerCareerUpdateRequest_WorkerCompany_WorkerCompanyPosition[] = careerData.companies.flatMap((company: Company) => 
      company.positions.map((position: Position) => ({
        name: position.name,
        startedAt: position.startedAt,
        endedAt: position.endedAt,
      }))
    );

    const salariesForm: WorkerCareerUpdateRequest_WorkerCompany_WorkerCompanySalary[] = careerData.companies.flatMap((company: Company) => 
      company.salaries.map((salary: Salary) => ({
        amount: salary.amount,
        startedAt: salary.startedAt,
        endedAt: salary.endedAt,
      }))
    );

    const certificationsForm: WorkerCareerUpdateRequest_WorkerCertifications[] = careerData.certifications.map((cert: Certifications) => ({
      name: cert.name,
      number: cert.number,
      issuer: cert.issuer,
      issuedAt: cert.issuedAt,
      expirationPeriod: cert.expirationPeriod
    }));

    const degreesForm: WorkerCareerUpdateRequest_WorkerDegrees[] = careerData.degrees.map((degree: Degrees) => ({
      name: degree.name,
      major: degree.major,
      startedAt: degree.startedAt,
      endedAt: degree.endedAt
    }));

    const educationsForm: WorkerCareerUpdateRequest_WorkerEducation[] = careerData.educations.map((education: Education) => ({
      name: education.name,
      startedAt: education.startedAt,
      endedAt: education.endedAt,
      agency: education.agency
    }));

    setCompanies(companiesForm);
    setPositions(positionsForm);
    setSalaries(salariesForm);
    setCertifications(certificationsForm);
    setDegrees(degreesForm);
    setEducations(educationsForm);
    setIsEditMode(true);
  };

  // 수정 모드 종료 함수
  const exitEditMode = () => {
    setIsEditMode(false);
    fetchCareerData(); // 데이터 새로고침
  };

  // Company 관련 함수들
  const addCompany = () => {
    if (newCompany.name && newCompany.startedAt && newCompany.endedAt) {
      setCompanies([...companies, { ...newCompany }]);
      setNewCompany({
        name: '',
        startedAt: 0,
        endedAt: 0,
        isWorking: false,
        positions: [],
        salaries: []
      });
    }
  };

  const removeCompany = (index: number) => {
    setCompanies(companies.filter((_, i) => i !== index));
  };

  // Position 관련 함수들
  const addPosition = () => {
    if (newPosition.name && newPosition.startedAt && newPosition.endedAt) {
      setPositions([...positions, { ...newPosition }]);
      setNewPosition({
        name: '',
        startedAt: 0,
        endedAt: 0,
      });
    }
  };

  const removePosition = (index: number) => {
    setPositions(positions.filter((_, i) => i !== index));
  };

  // Salary 관련 함수들
  const addSalary = () => {
    if (newSalary.amount > 0 && newSalary.startedAt && newSalary.endedAt) {
      setSalaries([...salaries, { ...newSalary }]);
      setNewSalary({
        amount: 0,
        startedAt: 0,
        endedAt: 0,
      });
    }
  };

  const removeSalary = (index: number) => {
    setSalaries(salaries.filter((_, i) => i !== index));
  };

  // Certifications 관련 함수들
  const addCertification = () => {
    if (newCertification.name && newCertification.issuer && newCertification.issuedAt && newCertification.expirationPeriod) {
      setCertifications([...certifications, { ...newCertification }]);
      setNewCertification({
        name: '',
        number: '',
        issuer: '',
        issuedAt: 0,
        expirationPeriod: 0
      });
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  // Degrees 관련 함수들
  const addDegree = () => {
    if (newDegree.name && newDegree.major && newDegree.startedAt && newDegree.endedAt) {
      setDegrees([...degrees, { ...newDegree }]);
      setNewDegree({
        name: '',
        major: '',
        startedAt: 0,
        endedAt: 0
      });
    }
  };

  const removeDegree = (index: number) => {
    setDegrees(degrees.filter((_, i) => i !== index));
  };

  // Education 관련 함수들
  const addEducation = () => {
    if (newEducation.name && newEducation.agency && newEducation.startedAt && newEducation.endedAt) {
      setEducations([...educations, { ...newEducation }]);
      setNewEducation({
        name: '',
        startedAt: 0,
        endedAt: 0,
        agency: ''
      });
    }
  };

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  // 저장 함수
  const saveCareerData = async () => {
    try {
      const careerData = {
        companies,
        positions,
        salaries,
        certifications,
        degrees,
        educations
      };

      const response = await fetch('/api/career', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(careerData),
      });

      if (response.ok) {
        alert('커리어 정보가 저장되었습니다.');
        exitEditMode(); // 저장 후 조회 모드로 전환
      } else {
        alert('저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error saving career data:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  // 조회 모드용 렌더링 함수들
  const renderCompanyView = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>회사 이력</h3>
      <div>
        {careerData.companies.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>등록된 회사 이력이 없습니다.</p>
        ) : (
          careerData.companies.map((company: Company, index: number) => (
            <div key={index} style={{ padding: '15px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div><strong style={{ fontSize: '16px' }}>{company.name}</strong> {company.isWorking && <span style={{ color: '#28a745', fontSize: '12px' }}>(재직중)</span>}</div>
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                <div>근무기간: {DateUtil.formatDateRange(company.startedAt, company.endedAt)}</div>
                {company.positions.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>직책:</strong>
                    <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
                      {company.positions.map((position: Position, posIndex: number) => (
                        <li key={posIndex} style={{ marginBottom: '2px' }}>
                          {position.name} ({DateUtil.formatDateRange(position.startedAt, position.endedAt)})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {company.salaries.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>급여:</strong>
                    <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
                      {company.salaries.map((salary: Salary, salIndex: number) => {
                        console.log('Salary amount:', salary.amount, 'Type:', typeof salary.amount);
                        return (
                          <li key={salIndex} style={{ marginBottom: '2px' }}>
                            {Number(salary.amount).toLocaleString('ko-KR')}원 ({DateUtil.formatDateRange(salary.startedAt, salary.endedAt)})
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderCertificationsView = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>자격증</h3>
      <div>
        {careerData.certifications.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>등록된 자격증이 없습니다.</p>
        ) : (
          careerData.certifications.map((cert: Certifications, index: number) => (
            <div key={index} style={{ padding: '15px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
              <div><strong style={{ fontSize: '16px' }}>{cert.name}</strong></div>
              <div style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
                <div>발급기관: {cert.issuer}</div>
                <div>발급일: {DateUtil.formatTimestamp(cert.issuedAt)}</div>
                {cert.number && <div>자격증 번호: {cert.number}</div>}
                {cert.expirationPeriod > 0 && <div>유효기간: {DateUtil.formatTimestamp(cert.expirationPeriod)}</div>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderDegreesView = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>학위</h3>
      <div>
        {careerData.degrees.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>등록된 학위가 없습니다.</p>
        ) : (
          careerData.degrees.map((degree: Degrees, index: number) => (
            <div key={index} style={{ padding: '15px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
              <div><strong style={{ fontSize: '16px' }}>{degree.name}</strong></div>
              <div style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
                <div>전공: {degree.major}</div>
                <div>재학기간: {DateUtil.formatDateRange(degree.startedAt, degree.endedAt, 'YYYY-MM-DD')}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderEducationView = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>교육 이력</h3>
      <div>
        {careerData.educations.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>등록된 교육 이력이 없습니다.</p>
        ) : (
          careerData.educations.map((education: Education, index: number) => (
            <div key={index} style={{ padding: '15px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
              <div><strong style={{ fontSize: '16px' }}>{education.name}</strong></div>
              <div style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
                <div>교육기관: {education.agency}</div>
                <div>수강기간: {DateUtil.formatDateRange(education.startedAt, education.endedAt, 'YYYY-MM-DD')}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // 수정 모드용 렌더링 함수들
  const renderCompanyTab = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>회사 이력</h3>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="회사명"
            value={newCompany.name}
            onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="text"
            placeholder="회사명"
            value={newCompany.name}
            onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="date"
            placeholder="시작일"
            value={newCompany.startedAt ? DateUtil.formatTimestamp(newCompany.startedAt) : ''}
            onChange={(e) => setNewCompany({ ...newCompany, startedAt: DateUtil.parseToTimestamp(e.target.value) })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="date"
            placeholder="종료일"
            value={newCompany.endedAt ? DateUtil.formatTimestamp(newCompany.endedAt) : ''}
            onChange={(e) => setNewCompany({ ...newCompany, endedAt: DateUtil.parseToTimestamp(e.target.value) })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <label>
            <input
              type="checkbox"
              checked={newCompany.isWorking}
              onChange={(e) => setNewCompany({ ...newCompany, isWorking: e.target.checked })}
            />
            재직중
          </label>
          <button onClick={addCompany} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            추가
          </button>
        </div>
      </div>
      <div>
        {companies.map((company, index) => (
          <div key={index} style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px' }}>
            <div><strong>{company.name}</strong> {company.isWorking ? '(재직중)' : ''}</div>
            <div>{company.startedAt} ~ {company.endedAt || '현재'}</div>
            <button onClick={() => removeCompany(index)} style={{ marginTop: '5px', padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPositionTab = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>직책 이력</h3>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="직책명"
            value={newPosition.name}
            onChange={(e) => setNewPosition({ ...newPosition, name: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
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
          <select
            value={newPosition.name}
            onChange={(e) => setNewPosition({ ...newPosition, name: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="">회사 선택</option>
            {companies.map((company, index) => (
              <option key={index} value={index.toString()}>{company.name}</option>
            ))}
          </select>
          <button onClick={addPosition} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            추가
          </button>
        </div>
      </div>
      <div>
        {positions.map((position, index) => (
          <div key={index} style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px' }}>
            <div><strong>{position.name}</strong></div>
            <div>{position.startedAt} ~ {position.endedAt || '현재'}</div>
            <button onClick={() => removePosition(index)} style={{ marginTop: '5px', padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSalaryTab = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>급여 이력</h3>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="급여 (원)"
            value={newSalary.amount ? newSalary.amount.toLocaleString('ko-KR') : ''}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 추출
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
          <select
            value={newSalary.amount}
            onChange={(e) => setNewSalary({ ...newSalary, amount: parseInt(e.target.value) || 0 })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="">회사 선택</option>
            {companies.map((company, index) => (
              <option key={index} value={index.toString()}>{company.name}</option>
            ))}
          </select>
          <button onClick={addSalary} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            추가
          </button>
        </div>
      </div>
      <div>
        {salaries.map((salary, index) => {
          console.log('Salary amount in edit mode:', salary.amount, 'Type:', typeof salary.amount);
          return (
            <div key={index} style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px' }}>
              <div><strong>{Number(salary.amount).toLocaleString('ko-KR')}원</strong></div>
              <div>{DateUtil.formatDateRange(salary.startedAt, salary.endedAt)}</div>
              <button onClick={() => removeSalary(index)} style={{ marginTop: '5px', padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
                삭제
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCertificationsTab = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>자격증</h3>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="자격증명"
            value={newCertification.name}
            onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="text"
            placeholder="자격증 번호"
            value={newCertification.number}
            onChange={(e) => setNewCertification({ ...newCertification, number: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="text"
            placeholder="발급기관"
            value={newCertification.issuer}
            onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="date"
            placeholder="발급일"
            value={newCertification.issuedAt ? DateUtil.formatTimestamp(newCertification.issuedAt) : ''}
            onChange={(e) => setNewCertification({ ...newCertification, issuedAt: DateUtil.parseToTimestamp(e.target.value) })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="number"
            placeholder="유효기간"
            value={newCertification.expirationPeriod}
            onChange={(e) => setNewCertification({ ...newCertification, expirationPeriod: parseInt(e.target.value) || 0 })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <button onClick={addCertification} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            추가
          </button>
        </div>
      </div>
      <div>
        {certifications.map((cert, index) => (
          <div key={index} style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px' }}>
            <div><strong>{cert.name}</strong></div>
            <div>발급기관: {cert.issuer}</div>
            <div>발급일: {cert.issuedAt ? DateUtil.formatTimestamp(cert.issuedAt) : ''}</div>
            <div>유효기간: {cert.expirationPeriod ? DateUtil.formatTimestamp(cert.expirationPeriod) : ''}</div>
            <button onClick={() => removeCertification(index)} style={{ marginTop: '5px', padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDegreesTab = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>학위</h3>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="학교명"
            value={newDegree.name}
            onChange={(e) => setNewDegree({ ...newDegree, name: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="text"
            placeholder="전공"
            value={newDegree.major}
            onChange={(e) => setNewDegree({ ...newDegree, major: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="date"
            placeholder="입학일"
            value={newDegree.startedAt ? DateUtil.formatTimestamp(newDegree.startedAt) : ''}
            onChange={(e) => setNewDegree({ ...newDegree, startedAt: DateUtil.parseToTimestamp(e.target.value) })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="date"
            placeholder="졸업일"
            value={newDegree.endedAt ? DateUtil.formatTimestamp(newDegree.endedAt) : ''}
            onChange={(e) => setNewDegree({ ...newDegree, endedAt: DateUtil.parseToTimestamp(e.target.value) })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <button onClick={addDegree} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            추가
          </button>
        </div>
      </div>
      <div>
        {degrees.map((degree, index) => (
          <div key={index} style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px' }}>
            <div><strong>{degree.name}</strong></div>
            <div>전공: {degree.major}</div>
            <div>입학일: {degree.startedAt ? DateUtil.formatTimestamp(degree.startedAt) : ''}</div>
            <div>졸업일: {degree.endedAt ? DateUtil.formatTimestamp(degree.endedAt) : ''}</div>
            <div>{degree.startedAt} ~ {degree.endedAt || '재학중'}</div>
            <button onClick={() => removeDegree(index)} style={{ marginTop: '5px', padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEducationTab = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>교육 이력</h3>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="교육명"
            value={newEducation.name}
            onChange={(e) => setNewEducation({ ...newEducation, name: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="text"
            placeholder="교육기관"
            value={newEducation.agency}
            onChange={(e) => setNewEducation({ ...newEducation, agency: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="date"
            placeholder="시작일"
            value={newEducation.startedAt ? DateUtil.formatTimestamp(newEducation.startedAt) : ''}
            onChange={(e) => setNewEducation({ ...newEducation, startedAt: DateUtil.parseToTimestamp(e.target.value) })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="date"
            placeholder="종료일"
            value={newEducation.endedAt ? DateUtil.formatTimestamp(newEducation.endedAt) : ''}
            onChange={(e) => setNewEducation({ ...newEducation, endedAt: DateUtil.parseToTimestamp(e.target.value) })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <button onClick={addEducation} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            추가
          </button>
        </div>
      </div>
      <div>
        {educations.map((education, index) => (
          <div key={index} style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px' }}>
            <div><strong>{education.name}</strong></div>
            <div>교육기관: {education.agency}</div>
            <div>시작일: {education.startedAt ? DateUtil.formatTimestamp(education.startedAt) : ''}</div>
            <div>종료일: {education.endedAt ? DateUtil.formatTimestamp(education.endedAt) : ''}</div>
            <div>{education.startedAt} ~ {education.endedAt || '수강중'}</div>
            <button onClick={() => removeEducation(index)} style={{ marginTop: '5px', padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '30px', fontSize: '24px', fontWeight: 'bold' }}>커리어 관리</h2>
        <div style={{ fontSize: '16px', color: '#666' }}>데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>커리어 관리</h2>
        {!isEditMode && (
          <button
            onClick={enterEditMode}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            수정하기
          </button>
        )}
      </div>
      
      {/* 모든 섹션을 세로로 나열 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', overflow: 'auto' }}>
        {/* 회사 이력 섹션 */}
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#fafafa'
        }}>
          {isEditMode ? renderCompanyTab() : renderCompanyView()}
        </div>

        {/* 직책 이력 섹션 (수정 모드에서만 표시) */}
        {isEditMode && (
          <div style={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: '8px', 
            padding: '20px',
            backgroundColor: '#fafafa'
          }}>
            {renderPositionTab()}
          </div>
        )}

        {/* 급여 이력 섹션 (수정 모드에서만 표시) */}
        {isEditMode && (
          <div style={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: '8px', 
            padding: '20px',
            backgroundColor: '#fafafa'
          }}>
            {renderSalaryTab()}
          </div>
        )}

        {/* 자격증 섹션 */}
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#fafafa'
        }}>
          {isEditMode ? renderCertificationsTab() : renderCertificationsView()}
        </div>

        {/* 학위 섹션 */}
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#fafafa'
        }}>
          {isEditMode ? renderDegreesTab() : renderDegreesView()}
        </div>

        {/* 교육 이력 섹션 */}
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#fafafa'
        }}>
          {isEditMode ? renderEducationTab() : renderEducationView()}
        </div>
      </div>

      {/* 수정 모드에서만 저장/취소 버튼 표시 */}
      {isEditMode && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
          <button
            onClick={exitEditMode}
            style={{
              padding: '15px 30px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            취소
          </button>
          <button
            onClick={saveCareerData}
            style={{
              padding: '15px 30px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            저장하기
          </button>
        </div>
      )}
    </div>
  );
};

export default CareerManagement;