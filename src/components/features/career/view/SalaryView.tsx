import React from 'react';
import { Salary } from '@/generated/common';
import { DateTime } from 'luxon';

interface SalaryViewProps {
  salary: Salary;
  onEdit?: () => void;
}

const SalaryView: React.FC<SalaryViewProps> = ({ salary, onEdit }) => {
  const formatDate = (timestamp: number) => {
    return DateTime.fromMillis(timestamp).toFormat('yyyy.MM.dd');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#333',
          flex: 1
        }}>
          급여 정보
        </h3>
        {onEdit && (
          <button
            onClick={onEdit}
            style={{
              padding: '6px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#fff',
              color: '#666',
              fontSize: '12px',
              cursor: 'pointer',
              marginLeft: '12px'
            }}
          >
            편집
          </button>
        )}
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          color: '#2196f3',
          marginBottom: '8px'
        }}>
          {formatCurrency(salary.amount)}
        </div>
        
        {salary.negotiationDate && (
          <div style={{ 
            fontSize: '14px', 
            color: '#666',
            marginBottom: '8px'
          }}>
            협상일: {formatDate(salary.negotiationDate)}
          </div>
        )}

        {!salary.isVisible && (
          <span style={{ 
            fontSize: '12px', 
            color: '#999',
            fontStyle: 'italic'
          }}>
            (비공개)
          </span>
        )}
      </div>

      {salary.memo && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ 
            fontSize: '14px', 
            color: '#555',
            backgroundColor: '#f8f9fa',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #e9ecef'
          }}>
            <strong style={{ color: '#333', marginBottom: '4px', display: 'block' }}>메모:</strong>
            <div style={{ 
              whiteSpace: 'pre-wrap',
              lineHeight: '1.5'
            }}>
              {salary.memo}
            </div>
          </div>
        </div>
      )}

      <div style={{ 
        fontSize: '12px', 
        color: '#999',
        borderTop: '1px solid #eee',
        paddingTop: '8px'
      }}>
        <span>생성일: {formatDate(salary.createdAt)}</span>
        {salary.updatedAt !== salary.createdAt && (
          <span style={{ marginLeft: '12px' }}>
            수정일: {formatDate(salary.updatedAt)}
          </span>
        )}
      </div>
    </div>
  );
};

export default SalaryView;
