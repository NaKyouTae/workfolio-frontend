import React from 'react';
import { Project } from '@/generated/common';
import { DateTime } from 'luxon';

interface ProjectViewProps {
  project: Project;
  onEdit?: () => void;
}

const ProjectView: React.FC<ProjectViewProps> = ({ project, onEdit }) => {
  const formatDate = (timestamp: number) => {
    return DateTime.fromMillis(timestamp).toFormat('yyyy.MM.dd');
  };

  const formatDateRange = () => {
    const startDate = formatDate(project.startedAt);
    const endDate = project.endedAt ? formatDate(project.endedAt) : '진행중';
    return `${startDate} ~ ${endDate}`;
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
          {project.title}
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
        <span style={{ 
          fontSize: '14px', 
          color: '#666',
          backgroundColor: '#f5f5f5',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          {formatDateRange()}
        </span>
        {!project.isVisible && (
          <span style={{ 
            fontSize: '12px', 
            color: '#999',
            marginLeft: '8px',
            fontStyle: 'italic'
          }}>
            (비공개)
          </span>
        )}
      </div>

      {project.description && (
        <div style={{ marginBottom: '12px' }}>
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            color: '#555',
            lineHeight: '1.5',
            whiteSpace: 'pre-wrap'
          }}>
            {project.description}
          </p>
        </div>
      )}

      <div style={{ 
        fontSize: '12px', 
        color: '#999',
        borderTop: '1px solid #eee',
        paddingTop: '8px'
      }}>
        <span>생성일: {formatDate(project.createdAt)}</span>
        {project.updatedAt !== project.createdAt && (
          <span style={{ marginLeft: '12px' }}>
            수정일: {formatDate(project.updatedAt)}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProjectView;
