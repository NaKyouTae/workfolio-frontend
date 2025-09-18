import React, { useState } from 'react';

// 커리어 관리용 타입 정의 (id, createdAt, updatedAt 제외)
interface CompanyForm {
  publicId: string;
  name: string;
  startedAt: string;
  endedAt: string;
  isWorking: boolean;
}

interface PositionForm {
  publicId: string;
  name: string;
  startedAt: string;
  endedAt: string;
  companyId: string;
}

interface SalaryForm {
  publicId: string;
  amount: number;
  startedAt: string;
  endedAt: string;
  companyId: string;
}

interface CertificationsForm {
  name: string;
  number: string;
  issuer: string;
  issuedAt: string;
  expirationPeriod: number;
}

interface DegreesForm {
  name: string;
  major: string;
  startedAt: string;
  endedAt: string;
}

interface EducationForm {
  name: string;
  startedAt: string;
  endedAt: string;
  agency: string;
}

const CareerManagement: React.FC = () => {
  // Company 상태
  const [companies, setCompanies] = useState<CompanyForm[]>([]);
  const [newCompany, setNewCompany] = useState<CompanyForm>({
    publicId: '',
    name: '',
    startedAt: '',
    endedAt: '',
    isWorking: false
  });

  // Position 상태
  const [positions, setPositions] = useState<PositionForm[]>([]);
  const [newPosition, setNewPosition] = useState<PositionForm>({
    publicId: '',
    name: '',
    startedAt: '',
    endedAt: '',
    companyId: ''
  });

  // Salary 상태
  const [salaries, setSalaries] = useState<SalaryForm[]>([]);
  const [newSalary, setNewSalary] = useState<SalaryForm>({
    publicId: '',
    amount: 0,
    startedAt: '',
    endedAt: '',
    companyId: ''
  });

  // Certifications 상태
  const [certifications, setCertifications] = useState<CertificationsForm[]>([]);
  const [newCertification, setNewCertification] = useState<CertificationsForm>({
    name: '',
    number: '',
    issuer: '',
    issuedAt: '',
    expirationPeriod: 0
  });

  // Degrees 상태
  const [degrees, setDegrees] = useState<DegreesForm[]>([]);
  const [newDegree, setNewDegree] = useState<DegreesForm>({
    name: '',
    major: '',
    startedAt: '',
    endedAt: ''
  });

  // Education 상태
  const [educations, setEducations] = useState<EducationForm[]>([]);
  const [newEducation, setNewEducation] = useState<EducationForm>({
    name: '',
    startedAt: '',
    endedAt: '',
    agency: ''
  });

  // Company 관련 함수들
  const addCompany = () => {
    if (newCompany.name && newCompany.startedAt) {
      setCompanies([...companies, { ...newCompany }]);
      setNewCompany({
        publicId: '',
        name: '',
        startedAt: '',
        endedAt: '',
        isWorking: false
      });
    }
  };

  const removeCompany = (index: number) => {
    setCompanies(companies.filter((_, i) => i !== index));
  };

  // Position 관련 함수들
  const addPosition = () => {
    if (newPosition.name && newPosition.startedAt && newPosition.companyId) {
      setPositions([...positions, { ...newPosition }]);
      setNewPosition({
        publicId: '',
        name: '',
        startedAt: '',
        endedAt: '',
        companyId: ''
      });
    }
  };

  const removePosition = (index: number) => {
    setPositions(positions.filter((_, i) => i !== index));
  };

  // Salary 관련 함수들
  const addSalary = () => {
    if (newSalary.amount > 0 && newSalary.startedAt && newSalary.companyId) {
      setSalaries([...salaries, { ...newSalary }]);
      setNewSalary({
        publicId: '',
        amount: 0,
        startedAt: '',
        endedAt: '',
        companyId: ''
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
        number: '',
        issuer: '',
        issuedAt: '',
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
        startedAt: '',
        endedAt: ''
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
        startedAt: '',
        endedAt: '',
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
      } else {
        alert('저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error saving career data:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const renderCompanyTab = () => (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>회사 이력</h3>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Public ID"
            value={newCompany.publicId}
            onChange={(e) => setNewCompany({ ...newCompany, publicId: e.target.value })}
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
            value={newCompany.startedAt}
            onChange={(e) => setNewCompany({ ...newCompany, startedAt: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="date"
            placeholder="종료일"
            value={newCompany.endedAt}
            onChange={(e) => setNewCompany({ ...newCompany, endedAt: e.target.value })}
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
            placeholder="Public ID"
            value={newPosition.publicId}
            onChange={(e) => setNewPosition({ ...newPosition, publicId: e.target.value })}
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
            value={newPosition.startedAt}
            onChange={(e) => setNewPosition({ ...newPosition, startedAt: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="date"
            placeholder="종료일"
            value={newPosition.endedAt}
            onChange={(e) => setNewPosition({ ...newPosition, endedAt: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <select
            value={newPosition.companyId}
            onChange={(e) => setNewPosition({ ...newPosition, companyId: e.target.value })}
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
            placeholder="Public ID"
            value={newSalary.publicId}
            onChange={(e) => setNewSalary({ ...newSalary, publicId: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="number"
            placeholder="급여 (원)"
            value={newSalary.amount}
            onChange={(e) => setNewSalary({ ...newSalary, amount: parseInt(e.target.value) || 0 })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="date"
            placeholder="시작일"
            value={newSalary.startedAt}
            onChange={(e) => setNewSalary({ ...newSalary, startedAt: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="date"
            placeholder="종료일"
            value={newSalary.endedAt}
            onChange={(e) => setNewSalary({ ...newSalary, endedAt: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <select
            value={newSalary.companyId}
            onChange={(e) => setNewSalary({ ...newSalary, companyId: e.target.value })}
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
        {salaries.map((salary, index) => (
          <div key={index} style={{ padding: '10px', border: '1px solid #ddd', marginBottom: '10px', borderRadius: '4px' }}>
            <div><strong>{salary.amount.toLocaleString()}원</strong></div>
            <div>{salary.startedAt} ~ {salary.endedAt || '현재'}</div>
            <button onClick={() => removeSalary(index)} style={{ marginTop: '5px', padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
              삭제
            </button>
          </div>
        ))}
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
            value={newCertification.issuedAt}
            onChange={(e) => setNewCertification({ ...newCertification, issuedAt: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="number"
            placeholder="유효기간 (년)"
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
            <div>발급일: {cert.issuedAt}</div>
            <div>유효기간: {cert.expirationPeriod}년</div>
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
            value={newDegree.startedAt}
            onChange={(e) => setNewDegree({ ...newDegree, startedAt: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="date"
            placeholder="졸업일"
            value={newDegree.endedAt}
            onChange={(e) => setNewDegree({ ...newDegree, endedAt: e.target.value })}
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
            value={newEducation.startedAt}
            onChange={(e) => setNewEducation({ ...newEducation, startedAt: e.target.value })}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <input
            type="date"
            placeholder="종료일"
            value={newEducation.endedAt}
            onChange={(e) => setNewEducation({ ...newEducation, endedAt: e.target.value })}
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
            <div>{education.startedAt} ~ {education.endedAt || '수강중'}</div>
            <button onClick={() => removeEducation(index)} style={{ marginTop: '5px', padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '30px', fontSize: '24px', fontWeight: 'bold' }}>커리어 관리</h2>
      
      {/* 모든 섹션을 세로로 나열 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', overflow: 'auto' }}>
        {/* 회사 이력 섹션 */}
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#fafafa'
        }}>
          {renderCompanyTab()}
        </div>

        {/* 직책 이력 섹션 */}
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#fafafa'
        }}>
          {renderPositionTab()}
        </div>

        {/* 급여 이력 섹션 */}
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#fafafa'
        }}>
          {renderSalaryTab()}
        </div>

        {/* 자격증 섹션 */}
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#fafafa'
        }}>
          {renderCertificationsTab()}
        </div>

        {/* 학위 섹션 */}
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#fafafa'
        }}>
          {renderDegreesTab()}
        </div>

        {/* 교육 이력 섹션 */}
        <div style={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: '8px', 
          padding: '20px',
          backgroundColor: '#fafafa'
        }}>
          {renderEducationTab()}
        </div>
      </div>

      {/* 저장 버튼 */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
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
          전체 저장하기
        </button>
      </div>
    </div>
  );
};

export default CareerManagement;