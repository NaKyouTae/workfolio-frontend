import React from 'react';
import { Attachment, Attachment_AttachmentCategory } from '@/generated/common';
import EmptyState from '@/components/ui/EmptyState';
import styles from './AttachmentView.module.css';

interface AttachmentViewProps {
  attachments: Attachment[];
}

const AttachmentView: React.FC<AttachmentViewProps> = ({ attachments }) => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>첨부</h2>
      </div>
      <div className={styles.sectionContent}>
        {attachments && attachments.length > 0 ? (
          <div className={styles.attachmentList}>
            {attachments.map((attachment, index) => (
              <div className={styles.attachmentItem} key={attachment.id || index}>
                <div className={styles.attachmentInfo}>
                  <div className={styles.attachmentType}>
                    {attachment.category === Attachment_AttachmentCategory.FILE && (
                      <span className={styles.typeLabel}>파일</span>
                    )}
                    {attachment.category === Attachment_AttachmentCategory.URL && (
                      <span className={styles.typeLabel}>URL</span>
                    )}
                    {attachment.fileName && (
                      <span className={styles.fileName}>{attachment.fileName}</span>
                    )}
                  </div>
                  <div className={styles.attachmentLink}>
                    {attachment.category === Attachment_AttachmentCategory.FILE && attachment.fileUrl && (
                      <a
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        {attachment.fileUrl}
                      </a>
                    )}
                    {attachment.category === Attachment_AttachmentCategory.URL && attachment.url && (
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        {attachment.url}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState text="등록된 첨부파일이 없습니다." />
        )}
      </div>
    </div>
  );
};

export default AttachmentView;

