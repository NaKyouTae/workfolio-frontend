import React from 'react';
import { ResumeUpdateRequest_AttachmentRequest } from '@/generated/resume';
import { Attachment_AttachmentType } from '@/generated/common';

interface AttachmentViewProps {
  attachments: ResumeUpdateRequest_AttachmentRequest[];
}

/**
 * 첨부파일 정보 읽기 전용 컴포넌트
 */
const AttachmentView: React.FC<AttachmentViewProps> = ({ attachments }) => {
  const getAttachmentTypeLabel = (type?: Attachment_AttachmentType) => {
    const labels: Record<Attachment_AttachmentType, string> = {
      [Attachment_AttachmentType.UNKNOWN]: '미분류',
      [Attachment_AttachmentType.PORTFOLIO]: '포트폴리오',
      [Attachment_AttachmentType.CERTIFICATE]: '증명서',
      [Attachment_AttachmentType.RESUME]: '이력서',
      [Attachment_AttachmentType.UNRECOGNIZED]: '미인식',
    };
    return labels[type || Attachment_AttachmentType.UNKNOWN];
  };

  const getAttachmentTypeIcon = (type?: Attachment_AttachmentType) => {
    const icons: Record<Attachment_AttachmentType, string> = {
      [Attachment_AttachmentType.UNKNOWN]: '📎', // 미분류
      [Attachment_AttachmentType.PORTFOLIO]: '📁',
      [Attachment_AttachmentType.CERTIFICATE]: '📜', // 증명서
      [Attachment_AttachmentType.RESUME]: '📄', // 이력서
      [Attachment_AttachmentType.UNRECOGNIZED]: '📎', // 미인식
    };
    return icons[type || Attachment_AttachmentType.UNKNOWN];
  };

  const getFileExtension = (fileName?: string) => {
    if (!fileName) return '';
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : '';
  };

  if (!attachments || attachments.length === 0) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#999'
      }}>
        등록된 첨부파일이 없습니다.
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ 
        marginBottom: '16px', 
        fontSize: '20px', 
        fontWeight: '600', 
        color: '#333' 
      }}>
        첨부파일
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px' 
      }}>
        {attachments.filter(a => a.isVisible !== false).map((attachment) => (
          <a
            key={attachment.id}
            href={attachment.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '20px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0',
              textDecoration: 'none',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <span style={{ 
                fontSize: '32px',
                flexShrink: 0
              }}>
                {getAttachmentTypeIcon(attachment.type)}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    {getAttachmentTypeLabel(attachment.type)}
                  </span>
                  {getFileExtension(attachment.fileName) && (
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: '#f5f5f5',
                      color: '#666',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      {getFileExtension(attachment.fileName)}
                    </span>
                  )}
                </div>
                <h4 style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#333',
                  margin: '0 0 4px 0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {attachment.fileName}
                </h4>
                <p style={{ 
                  fontSize: '12px',
                  color: '#999',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {attachment.fileUrl}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default AttachmentView;

