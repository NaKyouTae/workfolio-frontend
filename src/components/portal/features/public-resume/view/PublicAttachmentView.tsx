import React from 'react';
import { Attachment, Attachment_AttachmentType, Attachment_AttachmentCategory } from '@/generated/common';
import { normalizeEnumValue } from '@/utils/commonUtils';
import styles from './PublicView.module.css';

interface PublicAttachmentViewProps {
  attachments: Attachment[];
}

const PublicAttachmentView: React.FC<PublicAttachmentViewProps> = ({ attachments }) => {
  const getAttachmentTypeLabel = (type?: Attachment_AttachmentType) => {
    const normalizedType = normalizeEnumValue(type, Attachment_AttachmentType);
    switch (normalizedType) {
      case Attachment_AttachmentType.RESUME:
        return '이력서';
      case Attachment_AttachmentType.PORTFOLIO:
        return '포트폴리오';
      case Attachment_AttachmentType.CERTIFICATE:
        return '자격증';
      case Attachment_AttachmentType.CAREER_STATEMENT:
        return '경력기술서';
      case Attachment_AttachmentType.ETC:
        return '기타';
      default:
        return '첨부파일';
    }
  };

  const isUrlCategory = (category?: Attachment_AttachmentCategory) => {
    const normalizedCategory = normalizeEnumValue(category, Attachment_AttachmentCategory);
    return normalizedCategory === Attachment_AttachmentCategory.URL;
  };

  return (
    <div className={styles.viewContainer}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>첨부파일</h2>
      </div>

      <ul className={styles.attachmentList}>
        {attachments.map((attachment) => (
          <li key={attachment.id} className={styles.attachmentItem}>
            <div className={styles.attachmentIcon}>
              {isUrlCategory(attachment.category) ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill="currentColor"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" fill="currentColor"/>
                </svg>
              )}
            </div>
            <div className={styles.attachmentInfo}>
              <span className={styles.attachmentName}>
                {attachment.fileName || attachment.url || '첨부파일'}
              </span>
              {attachment.type && (
                <span className={styles.attachmentType}>
                  {getAttachmentTypeLabel(attachment.type)}
                </span>
              )}
            </div>
            <a
              href={isUrlCategory(attachment.category) ? attachment.url : attachment.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.attachmentLink}
            >
              {isUrlCategory(attachment.category) ? '열기' : '다운로드'}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PublicAttachmentView;
