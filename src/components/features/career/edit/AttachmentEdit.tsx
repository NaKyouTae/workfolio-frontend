import React, { useEffect } from 'react';
import { ResumeUpdateRequest_AttachmentRequest } from '@/generated/resume';
import { Attachment_AttachmentType } from '@/generated/common';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import styles from '../CareerContentEdit.module.css';

interface AttachmentEditProps {
  attachments: ResumeUpdateRequest_AttachmentRequest[];
  onUpdate: (attachments: ResumeUpdateRequest_AttachmentRequest[]) => void;
}

/**
 * 첨부 섹션 전체를 관리하는 컴포넌트
 * sectionHeader, 추가 버튼, 개별 첨부 항목 포함
 */
const AttachmentEdit: React.FC<AttachmentEditProps> = ({ attachments, onUpdate }) => {
  const createEmptyAttachment = (): ResumeUpdateRequest_AttachmentRequest => ({
    type: Attachment_AttachmentType.PORTFOLIO,
    fileName: '',
    fileUrl: '',
    isVisible: true,
  });

  // 빈 배열일 때 자동으로 항목 하나 추가
  useEffect(() => {
    if (attachments.length === 0) {
      onUpdate([createEmptyAttachment()]);
    }
  }, []);

  const handleAddAttachment = () => {
    onUpdate([...attachments, createEmptyAttachment()]);
  };

  const handleDeleteAttachment = (index: number) => {
    onUpdate(attachments.filter((_, i) => i !== index));
  };

  const handleAttachmentChange = (index: number, field: keyof ResumeUpdateRequest_AttachmentRequest, value: string) => {
    const newAttachments = [...attachments];
    newAttachments[index] = {
      ...newAttachments[index],
      [field]: value
    };
    onUpdate(newAttachments);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitleCounter}>
          첨부 | {attachments.length}개
        </h3>
        <div className={styles.addButtonContainer}>
          <button
            onClick={handleAddAttachment}
            className={styles.addButton}
          >
            <span>+ 추가</span>
          </button>
        </div>
      </div>

      {attachments.map((attachment, index) => (
        <div key={attachment.id || index} className={styles.card}>
          {attachments.length > 1 && (
            <button
              onClick={() => handleDeleteAttachment(index)}
              className={styles.deleteButton}
            >
              ×
            </button>
          )}

          <div className={styles.gridContainer2}>
            {/* 종류 */}
            <div className={styles.formField}>
              <Dropdown
                label="종류"
                selectedOption={attachment.type?.toString() || String(Attachment_AttachmentType.PORTFOLIO)}
                options={[
                  { value: String(Attachment_AttachmentType.PORTFOLIO), label: '포트폴리오' },
                  { value: String(Attachment_AttachmentType.CERTIFICATE), label: '증명서' },
                  { value: String(Attachment_AttachmentType.RESUME), label: '이력서' },
                ]}
                setValue={(value) => handleAttachmentChange(index, 'type', value)}
              />
            </div>

            {/* 파일 URL */}
            <div className={styles.formFieldSpan2}>
              <Input 
                type="url"
                label="파일 URL"
                placeholder="https://example.com/portfolio.pdf"
                value={attachment.fileUrl || ''}
                onChange={(e) => handleAttachmentChange(index, 'fileUrl', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttachmentEdit;
