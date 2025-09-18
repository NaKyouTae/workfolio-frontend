import React from 'react';
import { WorkerCareerListResponse } from '../../../generated/worker_career';
import { Company, Certifications, Degrees, Education, Position, Salary } from '@/generated/common';
import { DateUtil } from '../../../utils/DateUtil';

interface CareerManagementViewProps {
  careerData: WorkerCareerListResponse;
  onEditClick: () => void;
}

// 서버 응답 타입 정의
interface ServerCompany extends Company {
  salaries: Salary[];
  positions: Position[];
}

interface ServerCertification extends Certifications {}

interface ServerDegree extends Degrees {}

interface ServerEducation extends Education {}

const CareerManagementView: React.FC<CareerManagementViewProps> = ({ careerData, onEditClick }) => {
  // 회사 이력 렌더링
  const renderCompanyView = (company: ServerCompany) => (
    <div key={company.id} style={{ 
      padding: '20px', 
      border: '1px solid #e0e0e0', 
      marginBottom: '20px', 
      borderRadius: '8px',
      backgroundColor: '#fff'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', margin: 0 }}>
          {company.name}
        </h3>
        {company.isWorking && (
          <span style={{ 
            backgroundColor: '#28a745', 
            color: 'white', 
            padding: '4px 12px', 
            borderRadius: '20px', 
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            재직중
          </span>
        )}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <div>근무기간: {DateUtil.formatDateRange(company.startedAt, company.endedAt)}</div>
      </div>

      {/* 직책 정보 */}
      {company.positions && company.positions.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <strong>직책:</strong>
          <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
            {company.positions.map((position: Position, posIndex: number) => (
              <li key={posIndex} style={{ marginBottom: '4px' }}>
                {position.name} ({DateUtil.formatDateRange(position.startedAt, position.endedAt)})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 급여 정보 */}
      {company.salaries && company.salaries.length > 0 && (
        <div style={{ marginTop: '15px' }}>
          <strong>급여:</strong>
          <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
            {company.salaries.map((salary: Salary, salIndex: number) => (
              <li key={salIndex} style={{ marginBottom: '4px' }}>
                {Number(salary.amount).toLocaleString('ko-KR')}원 ({DateUtil.formatDateRange(salary.startedAt, salary.endedAt)})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  // 자격증 렌더링
  const renderCertificationsView = (cert: ServerCertification) => (
    <div key={cert.id} style={{ 
      padding: '15px', 
      border: '1px solid #e0e0e0', 
      marginBottom: '10px', 
      borderRadius: '6px',
      backgroundColor: '#fff'
    }}>
      <div><strong>{cert.name}</strong></div>
      <div>발급기관: {cert.issuer}</div>
      <div>발급일: {DateUtil.formatTimestamp(cert.issuedAt)}</div>
      {cert.number && <div>자격증 번호: {cert.number}</div>}
      {cert.expirationPeriod > 0 && <div>유효기간: {DateUtil.formatTimestamp(cert.expirationPeriod)}</div>}
    </div>
  );

  // 학위 렌더링
  const renderDegreesView = (degree: ServerDegree) => (
    <div key={degree.id} style={{ 
      padding: '15px', 
      border: '1px solid #e0e0e0', 
      marginBottom: '10px', 
      borderRadius: '6px',
      backgroundColor: '#fff'
    }}>
      <div><strong>{degree.name}</strong></div>
      <div>전공: {degree.major}</div>
      <div>재학기간: {DateUtil.formatDateRange(degree.startedAt, degree.endedAt, 'YYYY-MM-DD')}</div>
    </div>
  );

  // 교육 이력 렌더링
  const renderEducationView = (education: ServerEducation) => (
    <div key={education.id} style={{ 
      padding: '15px', 
      border: '1px solid #e0e0e0', 
      marginBottom: '10px', 
      borderRadius: '6px',
      backgroundColor: '#fff'
    }}>
      <div><strong>{education.name}</strong></div>
      <div>교육기관: {education.agency}</div>
      <div>수강기간: {DateUtil.formatDateRange(education.startedAt, education.endedAt, 'YYYY-MM-DD')}</div>
    </div>
  );

  // 빈 데이터 표시 렌더링
  const renderEmptyData = (message: string) => (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      color: '#666',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px dashed #dee2e6'
    }}>
      <div style={{ fontSize: '16px', marginBottom: '8px' }}>📝</div>
      <div style={{ fontSize: '14px' }}>{message}</div>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '15px', borderBottom: '2px solid #e0e0e0' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>커리어 관리</h2>
        <button style={{ width: '70px', height: '30px' }} onClick={onEditClick}>수정</button>
      </div>

      {/* 회사 이력 */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
          회사 이력
        </h3>
        {careerData.companies && careerData.companies.length > 0 ? (
          careerData.companies.map((company: ServerCompany) => renderCompanyView(company))
        ) : (
          renderEmptyData('등록된 회사 이력이 없습니다.')
        )}
      </div>

      {/* 자격증 */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
          자격증
        </h3>
        {careerData.certifications && careerData.certifications.length > 0 ? (
          careerData.certifications.map((cert: ServerCertification) => renderCertificationsView(cert))
        ) : (
          renderEmptyData('등록된 자격증이 없습니다.')
        )}
      </div>

      {/* 학위 */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
          학위
        </h3>
        {careerData.degrees && careerData.degrees.length > 0 ? (
          careerData.degrees.map((degree: ServerDegree) => renderDegreesView(degree))
        ) : (
          renderEmptyData('등록된 학위가 없습니다.')
        )}
      </div>

      {/* 교육 이력 */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
          교육 이력
        </h3>
        {careerData.educations && careerData.educations.length > 0 ? (
          careerData.educations.map((education: ServerEducation) => renderEducationView(education))
        ) : (
          renderEmptyData('등록된 교육 이력이 없습니다.')
        )}
      </div>
    </div>
  );
};

export default CareerManagementView;
