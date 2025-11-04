import React from 'react';
import { Attachment_AttachmentCategory } from '@/generated/common';
import { AttachmentRequest } from '@/generated/attachment';
import styles from './AttachmentEdit.module.css';

interface AttachmentEditProps {
  attachments: AttachmentRequest[];
  onAttachmentsChange: (attachments: AttachmentRequest[]) => void;
}

const AttachmentEdit: React.FC<AttachmentEditProps> = ({ attachments, onAttachmentsChange }) => {
  const addAttachment = (category: Attachment_AttachmentCategory) => {
    onAttachmentsChange([
      ...attachments,
      {
        category,
        url: '',
        fileName: '',
        fileUrl: '',
        isVisible: true,
        priority: 0,
      },
    ]);
  };

  const removeAttachment = (index: number) => {
    onAttachmentsChange(attachments.filter((_, i) => i !== index));
  };

  const updateAttachment = (
    index: number,
    field: keyof AttachmentRequest,
    value: string | boolean
  ) => {
    const updated = [...attachments];
    (updated[index] as AttachmentRequest)[field] = value as unknown as never;
    onAttachmentsChange(updated);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>첨부</h2>
        <div className={styles.attachButtons}>
          <button
            className={styles.addButton}
            onClick={() => addAttachment(Attachment_AttachmentCategory.FILE)}
          >
            + 파일 추가
          </button>
          <button
            className={styles.addButton}
            onClick={() => addAttachment(Attachment_AttachmentCategory.URL)}
          >
            + URL 추가
          </button>
        </div>
      </div>
      <div className={styles.sectionContent}>
        {attachments.length === 0 ? (
          <div className={styles.emptyContent}>
            <p>첨부 파일 또는 URL을 추가해 주세요.</p>
          </div>
        ) : (
          attachments.map((item, index) => (
            <React.Fragment key={index}>
              {item.category === Attachment_AttachmentCategory.URL && (
                <div className={styles.attachmentItem}>
                  <div className={styles.dragHandle}>⋮⋮</div>
                  <div className={styles.attachmentInputs}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>구분</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="예: 이력서, 자기소개서 등"
                        value={item.fileName}
                        onChange={(e) => updateAttachment(index, 'fileName', e.target.value)}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>URL</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="URL을 입력해 주세요."
                        value={item.url}
                        onChange={(e) => updateAttachment(index, 'url', e.target.value)}
                      />
                    </div>
                  </div>
                  <button className={styles.deleteButton} onClick={() => removeAttachment(index)}>
                    −
                  </button>
                </div>
              )}
              {item.category === Attachment_AttachmentCategory.FILE && (
                <div className={styles.attachmentItem}>
                  <div className={styles.dragHandle}>⋮⋮</div>
                  <div className={styles.attachmentInputs}>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>구분</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="예: 이력서, 자기소개서 등"
                        value={item.fileName}
                        onChange={(e) => updateAttachment(index, 'fileName', e.target.value)}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>파일 첨부</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="파일을 선택해 주세요."
                        value={item.fileUrl}
                        onChange={(e) => updateAttachment(index, 'fileUrl', e.target.value)}
                      />
                      <button className={styles.fileButton}>파일 찾기</button>
                    </div>
                  </div>
                  <button className={styles.deleteButton} onClick={() => removeAttachment(index)}>
                    −
                  </button>
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default AttachmentEdit;

