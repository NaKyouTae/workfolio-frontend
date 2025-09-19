import React, { useState, useEffect, useRef } from 'react';
import { Certifications } from '@/generated/common';
import { DateUtil } from '../../../utils/DateUtil';
import HttpMethod from '@/enums/HttpMethod';
import { CertificationsCreateRequest } from '@/generated/certifications';

interface CertificationManagementProps {
  initialData?: Certifications[];
  onDataChange?: (data: Certifications[]) => void;
}

const CertificationManagement: React.FC<CertificationManagementProps> = ({ 
  initialData = [], 
  onDataChange
}) => {
  const [certifications, setCertifications] = useState<Certifications[]>([]);
  const [newCertification, setNewCertification] = useState<CertificationsCreateRequest>({
    name: '',
    issuer: '',
    issuedAt: 0,
    number: '',
    expirationPeriod: 0
  });

  // Input 표시 상태
  const [showCertificationInput, setShowCertificationInput] = useState(false);
  
  // 초기 로드 여부를 추적하는 ref
  const isInitialLoad = useRef(true);

  // 초기 데이터 로드
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      const certificationsForm: Certifications[] = initialData.map((cert: Certifications) => ({
        id: cert.id,
        createdAt: cert.createdAt,
        updatedAt: cert.updatedAt,
        name: cert.name,
        issuer: cert.issuer,
        issuedAt: cert.issuedAt,
        number: cert.number || '',
        expirationPeriod: cert.expirationPeriod || 0
      }));
      setCertifications(certificationsForm);
      isInitialLoad.current = false;
    }
  }, [initialData]);

  // 데이터 변경 시 부모에게 알림 (초기 로드 제외)
  useEffect(() => {
    if (!isInitialLoad.current && certifications.length >= 0 && onDataChange) {
      onDataChange(certifications);
    }
  }, [certifications, onDataChange]);

  // 데이터 변경 핸들러
  const handleDataChange = (newCertifications: Certifications[]) => {
    setCertifications(newCertifications);
    if (onDataChange) {
      onDataChange(newCertifications as Certifications[]);
    }
  };


  // 자격증 추가
  const addCertification = async () => {
    if (newCertification.name && newCertification.issuer && newCertification.issuedAt) {
      try {
        const response = await fetch('/api/workers/certifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCertification),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            handleDataChange([...certifications, result.data]);
            setNewCertification({
              name: '',
              issuer: '',
              issuedAt: 0,
              number: '',
              expirationPeriod: 0
            });
          } else {
            console.error('Failed to add certification');
          }
        } else {
          console.error('Failed to add certification');
        }
      } catch (error) {
        console.error('Error adding certification:', error);
      }
    }
  };

  // 자격증 수정
  const updateCertification = async (index: number, updatedCertification: Certifications) => {
    try {
      const response = await fetch('/api/workers/certifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCertification),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const updatedData = [...certifications];
          updatedData[index] = result.data;
          handleDataChange(updatedData);
        } else {
          console.error('Failed to update certification');
        }
      } else {
        console.error('Failed to update certification');
      }
    } catch (error) {
      console.error('Error updating certification:', error);
    }
  };

  // 자격증 삭제
  const removeCertification = async (index: number) => {
    try {
      const response = await fetch(`/api/workers/certifications/${index}`, {
        method: HttpMethod.DELETE,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        handleDataChange(certifications.filter((_, i) => i !== index));
      } else {
        console.error('Failed to delete certification');
      }
    } catch (error) {
      console.error('Error deleting certification:', error);
    }
  };

  // 공통 추가 버튼 렌더링 함수
  const renderAddButton = (title: string, backgroundColor: string = "#007bff", onClick: () => void) => (
    <div>
      <button 
        onClick={onClick} 
        style={{ 
          width: '70px', 
          height: '30px', 
          backgroundColor: backgroundColor, 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {title}
      </button>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', margin: 0 }}>자격증</h3>
        <button 
          onClick={() => setShowCertificationInput(!showCertificationInput)}
          style={{ 
            width: '30px', 
            height: '30px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '50%', 
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="자격증 추가"
        >
          +
        </button>
      </div>
      
      {/* 자격증 추가 입력 폼 */}
      {showCertificationInput && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#495057' }}>자격증 추가</h4>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="자격증명"
              value={newCertification.name}
              onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
            <input
              type="text"
              placeholder="발급기관"
              value={newCertification.issuer}
              onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
            <input
              type="date"
              placeholder="발급일"
              value={newCertification.issuedAt ? DateUtil.formatTimestamp(newCertification.issuedAt) : ''}
              onChange={(e) => setNewCertification({ ...newCertification, issuedAt: DateUtil.parseToTimestamp(e.target.value) })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
            <input
              type="text"
              placeholder="자격증 번호"
              value={newCertification.number}
              onChange={(e) => setNewCertification({ ...newCertification, number: e.target.value })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
            <input
              type="number"
              placeholder="유효기간"
              value={newCertification.expirationPeriod}
              onChange={(e) => setNewCertification({ ...newCertification, expirationPeriod: parseInt(e.target.value) || 0 })}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1, minWidth: '150px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={addCertification}
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
              onClick={() => setShowCertificationInput(false)}
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
      

      {/* 자격증 목록 */}
      <div>
        {certifications?.map((cert, index) => (
          <div 
            key={index} 
            style={{ 
              display: 'flex', 
              gap: '10px', 
              justifyContent: 'space-between', 
              padding: '10px', 
              border: '1px solid #ddd', 
              marginBottom: '10px', 
              borderRadius: '4px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <div style={{ flex: 1 }}>
              <div><strong>{cert.name}</strong></div>
              <div>발급기관: {cert.issuer}</div>
              <div>발급일: {cert.issuedAt ? DateUtil.formatTimestamp(cert.issuedAt) : ''}</div>
              <div>자격증 번호: {cert.number}</div>
              <div>유효기간: {cert.expirationPeriod ? `${cert.expirationPeriod}일` : '무제한'}</div>
            </div>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <button 
                onClick={() => updateCertification(index, cert)}
                style={{ 
                  width: '60px', 
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
              {renderAddButton('삭제', '#dc3545', () => removeCertification(index))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationManagement;
