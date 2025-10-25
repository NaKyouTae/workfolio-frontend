import React from 'react';
import Image from 'next/image';
import { Attachment, Attachment_AttachmentType } from '@/generated/common';
import { normalizeEnumValue } from '@/utils/commonUtils';
import EmptyState from '@/components/ui/EmptyState';

interface AttachmentViewProps {
  attachments: Attachment[];
}

/**
 * 첨부파일 정보 읽기 전용 컴포넌트
 */
const AttachmentView: React.FC<AttachmentViewProps> = ({ attachments }) => {
  const getAttachmentTypeLabel = (type?: Attachment_AttachmentType) => {
    const normalizedType = normalizeEnumValue(type, Attachment_AttachmentType);
    switch (normalizedType) {
      case Attachment_AttachmentType.RESUME:
        return '이력서';
      case Attachment_AttachmentType.PORTFOLIO:
        return '포트폴리오';
      case Attachment_AttachmentType.CERTIFICATE:
        return '증명서';
      case Attachment_AttachmentType.CAREER_STATEMENT:
        return '경력기술서';
      case Attachment_AttachmentType.ETC:
        return '기타';
      case Attachment_AttachmentType.UNRECOGNIZED:
        return '미인식';
      default:
        return '';
    }
  };

  const getAttachmentTypeIcon = (attachment: Attachment) => {
    if(attachment.fileUrl == "" && attachment.fileName != "") {
      return <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => {
        // TODO: 파일 다운로드
        window.open(attachment.fileUrl, '_blank');
      }}>
        <Image src="/assets/img/ico/ic-download.png" alt="etc" width={16} height={16} />
        <span>{attachment.fileName}</span>
      </div>
    }

    if(attachment.fileUrl != "" && attachment.fileName == "") {
      return <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => {
        window.open(attachment.fileUrl, '_blank');
      }}>
        <Image src="/assets/img/ico/ic-open.png" alt="etc" width={16} height={16} />
        <span>{attachment.fileUrl}</span>
      </div>
    }
  };

  return (
    <div>
      <h3 style={{ 
        fontSize: '16px', 
        fontWeight: '700', 
        color: '#000',
        marginBottom: '20px'
      }}>
        첨부
      </h3>
      
      {(!attachments || attachments.length === 0) ? (
        <EmptyState text="등록된 첨부 정보가 없습니다." />
      ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {attachments.map((attachment) => (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            border: '1px solid #e0e0e0',  
            borderRadius: '4px',
            padding: '16px',
            marginBottom: '16px',
          }} key={attachment.id}>
            <div>
              <a
                href={attachment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#2196f3',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                <span style={{ fontSize: '16px' }}>
                  {getAttachmentTypeIcon(attachment)}
                </span>
              </a>
            </div>
            <div>
              <span style={{ fontSize: '13px', color: '#999' }}>
                {getAttachmentTypeLabel(attachment.type)}
              </span>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default AttachmentView;

