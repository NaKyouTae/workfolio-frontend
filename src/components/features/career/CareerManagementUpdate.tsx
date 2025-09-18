import React, { useState, useEffect } from 'react';
import { WorkerCareerUpdateRequest_WorkerCertifications, WorkerCareerUpdateRequest_WorkerCompany, WorkerCareerUpdateRequest_WorkerCompany_WorkerCompanyPosition, WorkerCareerUpdateRequest_WorkerCompany_WorkerCompanySalary, WorkerCareerUpdateRequest_WorkerDegrees, WorkerCareerUpdateRequest_WorkerEducation } from '../../../generated/worker_career';
import { WorkerCareerListResponse } from '../../../generated/worker_career';
import { Company, Certifications, Degrees, Education } from '@/generated/common';
import { DateUtil } from '../../../utils/DateUtil';
import HttpMethod from '@/enums/HttpMethod';

interface CareerManagementUpdateProps {
  careerData: WorkerCareerListResponse;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const CareerManagementUpdate: React.FC<CareerManagementUpdateProps> = ({ careerData, onSave, onCancel }) => {
  // Company 상태
  const [companies, setCompanies] = useState<WorkerCareerUpdateRequest_WorkerCompany[]>([]);
  const [newCompany, setNewCompany] = useState<WorkerCareerUpdateRequest_WorkerCompany>({
    name: '',
    startedAt: 0,
    endedAt: 0,
    isWorking: false,
    positions: [],
    salaries: []
  });

  // Position 상태
  const [positions, setPositions] = useState<WorkerCareerUpdateRequest_WorkerCompany_WorkerCompanyPosition[]>([]);
  const [newPosition, setNewPosition] = useState<WorkerCareerUpdateRequest_WorkerCompany_WorkerCompanyPosition>({
    name: '',
    startedAt: 0,
    endedAt: 0,
  });

  // Salary 상태
  const [salaries, setSalaries] = useState<WorkerCareerUpdateRequest_WorkerCompany_WorkerCompanySalary[]>([]);
  const [newSalary, setNewSalary] = useState<WorkerCareerUpdateRequest_WorkerCompany_WorkerCompanySalary>({
    amount: 0,
    startedAt: 0,
    endedAt: 0,
  });

  // Certifications 상태
  const [certifications, setCertifications] = useState<WorkerCareerUpdateRequest_WorkerCertifications[]>([]);
  const [newCertification, setNewCertification] = useState<WorkerCareerUpdateRequest_WorkerCertifications>({
    name: '',
    issuer: '',
    issuedAt: 0,
    number: '',
    expirationPeriod: 0
  });

  // Degrees 상태
  const [degrees, setDegrees] = useState<WorkerCareerUpdateRequest_WorkerDegrees[]>([]);
  const [newDegree, setNewDegree] = useState<WorkerCareerUpdateRequest_WorkerDegrees>({
    name: '',
    major: '',
    startedAt: 0,
    endedAt: 0
  });

  // Education 상태
  const [educations, setEducations] = useState<WorkerCareerUpdateRequest_WorkerEducation[]>([]);
  const [newEducation, setNewEducation] = useState<WorkerCareerUpdateRequest_WorkerEducation>({
    name: '',
    agency: '',
    startedAt: 0,
    endedAt: 0
  });

  // Company 관련 함수들
  const addCompany = () => {
    if (newCompany.name && newCompany.startedAt) {
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
    if (newPosition.name && newPosition.startedAt) {
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
    if (newSalary.amount > 0 && newSalary.startedAt) {
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
    if (newCertification.name && newCertification.issuer && newCertification.issuedAt) {
      setCertifications([...certifications, { ...newCertification }]);
      setNewCertification({
        name: '',
        issuer: '',
        issuedAt: 0,
        number: '',
        expirationPeriod: 0
      });
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  // Degrees 관련 함수들
  const addDegree = () => {
    if (newDegree.name && newDegree.major && newDegree.startedAt) {
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
    if (newEducation.name && newEducation.agency && newEducation.startedAt) {
      setEducations([...educations, { ...newEducation }]);
      setNewEducation({
        name: '',
        agency: '',
        startedAt: 0,
        endedAt: 0
      });
    }
  };

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  // 기존 데이터를 수정용 폼 데이터로 변환하는 함수
  const initializeFormData = () => {
    // Company 데이터 변환
    const companiesForm: WorkerCareerUpdateRequest_WorkerCompany[] = careerData.companies.map((company: Company) => ({
      name: company.name,
      startedAt: company.startedAt,
      endedAt: company.endedAt,
      isWorking: company.isWorking,
      positions: company.positions || [],
      salaries: company.salaries || []
    }));
    setCompanies(companiesForm);

    // Certifications 데이터 변환
    const certificationsForm: WorkerCareerUpdateRequest_WorkerCertifications[] = careerData.certifications.map((cert: Certifications) => ({
      name: cert.name,
      issuer: cert.issuer,
      issuedAt: cert.issuedAt,
      number: cert.number || '',
      expirationPeriod: cert.expirationPeriod || 0
    }));
    setCertifications(certificationsForm);

    // Degrees 데이터 변환
    const degreesForm: WorkerCareerUpdateRequest_WorkerDegrees[] = careerData.degrees.map((degree: Degrees) => ({
      name: degree.name,
      major: degree.major,
      startedAt: degree.startedAt,
      endedAt: degree.endedAt
    }));
    setDegrees(degreesForm);

    // Education 데이터 변환
    const educationsForm: WorkerCareerUpdateRequest_WorkerEducation[] = careerData.educations.map((education: Education) => ({
      name: education.name,
      agency: education.agency,
      startedAt: education.startedAt,
      endedAt: education.endedAt
    }));
    setEducations(educationsForm);
  };

  // 컴포넌트 마운트 시 기존 데이터로 초기화
  useEffect(() => {
    initializeFormData();
  }, [careerData]);

  // 공통 추가 버튼 렌더링 함수
  const renderAddButton = (title: string, backgroundColor: string = "#007bff", onClick: () => void) => (
    <div>
      <button onClick={onClick} style={{ width: '70px', height: '30px', backgroundColor: backgroundColor, color: 'white', border: 'none', borderRadius: '4px' }}>
        {title}
      </button>
    </div>
  );

  // 저장 함수
  const handleSave = async () => {
    const careerData = {
      companies,
      certifications,
      degrees,
      educations
    };

    try {
      const response = await fetch('/api/workers/careers', {
        method: HttpMethod.PUT,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(careerData),
      });

      if (response.ok) {
        onSave(careerData);
      } else {
        console.error('Failed to save career data');
      }
    } catch (error) {
      console.error('Error saving career data:', error);
    }
  };


  // 탭 렌더링 함수들
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
          />
          <input
            type="date"
            placeholder="시작일"
            value={newCompany.startedAt ? DateUtil.formatTimestamp(newCompany.startedAt) : ''}
            onChange={(e) => setNewCompany({ ...newCompany, startedAt: DateUtil.parseToTimestamp(e.target.value) })}
          />
          <input
            type="date"
            placeholder="종료일"
            value={newCompany.endedAt ? DateUtil.formatTimestamp(newCompany.endedAt) : ''}
            onChange={(e) => setNewCompany({ ...newCompany, endedAt: DateUtil.parseToTimestamp(e.target.value) })}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="checkbox"
              checked={newCompany.isWorking}
              onChange={(e) => setNewCompany({ ...newCompany, isWorking: e.target.checked })}
            />
            재직중
          </label>
          {renderAddButton('추가', '#007bff', addCompany)}
        </div>
      </div>
      <div>
        {companies.map((company, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', padding: '10px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px' }}>
            <div>
            <div><strong>{company.name}</strong></div>
            <div>{DateUtil.formatDateRange(company.startedAt, company.endedAt)}</div>
            <div>재직중: {company.isWorking ? '예' : '아니오'}</div>
            </div>
            {renderAddButton('삭제', '#dc3545', () => removeCompany(index))}
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
          />
          <input
            type="date"
            placeholder="시작일"
            value={newPosition.startedAt ? DateUtil.formatTimestamp(newPosition.startedAt) : ''}
            onChange={(e) => setNewPosition({ ...newPosition, startedAt: DateUtil.parseToTimestamp(e.target.value) })}
          />
          <input
            type="date"
            placeholder="종료일"
            value={newPosition.endedAt ? DateUtil.formatTimestamp(newPosition.endedAt) : ''}
            onChange={(e) => setNewPosition({ ...newPosition, endedAt: DateUtil.parseToTimestamp(e.target.value) })}
          />
          {renderAddButton('추가', '#007bff', addPosition)}
        </div>
      </div>
      <div>
        {positions.map((position, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', padding: '10px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px' }}>
            <div>
            <div><strong>{position.name}</strong></div>
            <div>{DateUtil.formatDateRange(position.startedAt, position.endedAt)}</div>
            </div>
            {renderAddButton('삭제', '#dc3545', () => removePosition(index))}
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
          />
          <input
            type="date"
            placeholder="시작일"
            value={newSalary.startedAt ? DateUtil.formatTimestamp(newSalary.startedAt) : ''}
            onChange={(e) => setNewSalary({ ...newSalary, startedAt: DateUtil.parseToTimestamp(e.target.value) })}
          />
          <input
            type="date"
            placeholder="종료일"
            value={newSalary.endedAt ? DateUtil.formatTimestamp(newSalary.endedAt) : ''}
            onChange={(e) => setNewSalary({ ...newSalary, endedAt: DateUtil.parseToTimestamp(e.target.value) })}
          />
          {renderAddButton('추가', '#007bff', addSalary)}
        </div>
      </div>
      <div>
        {salaries.map((salary, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', padding: '10px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px' }}>
            <div>
            <div><strong>{Number(salary.amount).toLocaleString('ko-KR')}원</strong></div>
            <div>{DateUtil.formatDateRange(salary.startedAt, salary.endedAt)}</div>
            </div>
            {renderAddButton('삭제', '#dc3545', () => removeSalary(index))}    
          </div>
        ))}
      </div>
    </div>
  );

  const renderCertificationsTab = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>자격증</h3>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="자격증명"
            value={newCertification.name}
            onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="발급기관"
            value={newCertification.issuer}
            onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
          />
          <input
            type="date"
            placeholder="발급일"
            value={newCertification.issuedAt ? DateUtil.formatTimestamp(newCertification.issuedAt) : ''}
            onChange={(e) => setNewCertification({ ...newCertification, issuedAt: DateUtil.parseToTimestamp(e.target.value) })}
          />
          <input
            type="text"
            placeholder="자격증 번호"
            value={newCertification.number}
            onChange={(e) => setNewCertification({ ...newCertification, number: e.target.value })}
          />
          <input
            type="number"
            placeholder="유효기간"
            value={newCertification.expirationPeriod}
            onChange={(e) => setNewCertification({ ...newCertification, expirationPeriod: parseInt(e.target.value) || 0 })}
          />
          {renderAddButton('추가', '#007bff', addCertification)}
        </div>
      </div>
      <div>
        {certifications.map((cert, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', padding: '10px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px' }}>
            <div>
            <div><strong>{cert.name}</strong></div>
            <div>발급기관: {cert.issuer}</div>
            <div>발급일: {cert.issuedAt ? DateUtil.formatTimestamp(cert.issuedAt) : ''}</div>
            <div>유효기간: {cert.expirationPeriod ? DateUtil.formatTimestamp(cert.expirationPeriod) : ''}</div>
            </div>
            {renderAddButton('삭제', '#dc3545', () => removeCertification(index))}
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
            placeholder="학위명"
            value={newDegree.name}
            onChange={(e) => setNewDegree({ ...newDegree, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="전공"
            value={newDegree.major}
            onChange={(e) => setNewDegree({ ...newDegree, major: e.target.value })}
          />
          <input
            type="date"
            placeholder="입학일"
            value={newDegree.startedAt ? DateUtil.formatTimestamp(newDegree.startedAt) : ''}
            onChange={(e) => setNewDegree({ ...newDegree, startedAt: DateUtil.parseToTimestamp(e.target.value) })}
          />
          <input
            type="date"
            placeholder="졸업일"
            value={newDegree.endedAt ? DateUtil.formatTimestamp(newDegree.endedAt) : ''}
            onChange={(e) => setNewDegree({ ...newDegree, endedAt: DateUtil.parseToTimestamp(e.target.value) })}
          />
          {renderAddButton('추가', '#007bff', addDegree)}
        </div>
      </div>
      <div>
        {degrees.map((degree, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', padding: '10px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px' }}>
            <div>
            <div><strong>{degree.name}</strong></div>
            <div>전공: {degree.major}</div>
            <div>입학일: {degree.startedAt ? DateUtil.formatTimestamp(degree.startedAt) : ''}</div>
            <div>졸업일: {degree.endedAt ? DateUtil.formatTimestamp(degree.endedAt) : ''}</div>
            <div>{DateUtil.formatTimestamp(degree.startedAt)} ~ {DateUtil.formatTimestamp(degree.endedAt || 0)}</div>
            </div>
            {renderAddButton('삭제', '#dc3545', () => removeDegree(index))}
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
          />
          <input
            type="text"
            placeholder="교육기관"
            value={newEducation.agency}
            onChange={(e) => setNewEducation({ ...newEducation, agency: e.target.value })}
          />
          <input
            type="date"
            placeholder="시작일"
            value={newEducation.startedAt ? DateUtil.formatTimestamp(newEducation.startedAt) : ''}
            onChange={(e) => setNewEducation({ ...newEducation, startedAt: DateUtil.parseToTimestamp(e.target.value) })}
          />
          <input
            type="date"
            placeholder="종료일"
            value={newEducation.endedAt ? DateUtil.formatTimestamp(newEducation.endedAt) : ''}
            onChange={(e) => setNewEducation({ ...newEducation, endedAt: DateUtil.parseToTimestamp(e.target.value) })}
          />
          {renderAddButton('추가', '#007bff', addEducation)}
        </div>
      </div>
      <div>
        {educations.map((education, index) => (
          <div key={index} style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', padding: '10px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px' }}>
            <div>
                <div><strong>{education.name}</strong></div>
                <div>교육기관: {education.agency}</div>
                <div>시작일: {education.startedAt ? DateUtil.formatTimestamp(education.startedAt) : ''}</div>
                <div>종료일: {education.endedAt ? DateUtil.formatTimestamp(education.endedAt) : ''}</div>
                <div>{DateUtil.formatTimestamp(education.startedAt)} ~ {DateUtil.formatTimestamp(education.endedAt || 0)}</div>
            </div>
            {renderAddButton('삭제', '#dc3545', () => removeEducation(index))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      {/* 헤더 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        paddingBottom: '15px',
        borderBottom: '2px solid #e0e0e0'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>커리어 관리 - 수정</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ width: '70px', height: '30px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }} onClick={onCancel}>취소</button>
          <button style={{ width: '70px', height: '30px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }} onClick={handleSave}>저장</button>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {renderCompanyTab()}
        {renderPositionTab()}
        {renderSalaryTab()}
        {renderCertificationsTab()}
        {renderDegreesTab()}
        {renderEducationTab()}
      </div>
    </div>
  );
};

export default CareerManagementUpdate;
