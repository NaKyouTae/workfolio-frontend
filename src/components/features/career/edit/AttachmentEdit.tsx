import React, { useEffect } from 'react';
import { ResumeUpdateRequest_AttachmentRequest } from '@/generated/resume';
import { Attachment_AttachmentType } from '@/generated/common';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import styles from '../CareerContentEdit.module.css';
import { normalizeEnumValue } from '@/utils/commonUtils';

interface AttachmentEditProps {
  attachments: ResumeUpdateRequest_AttachmentRequest[];
  onUpdate: (attachments: ResumeUpdateRequest_AttachmentRequest[]) => void;
}

/**
 * 첨부 섹션 전체를 관리하는 컴포넌트
 * sectionHeader, 추가 버튼, 개별 첨부 항목 포함
 */
const AttachmentEdit: React.FC<AttachmentEditProps> = ({ attachments, onUpdate }) => {
  const createEmptyAttachment = (priority: number = 0): ResumeUpdateRequest_AttachmentRequest => ({
    type: Attachment_AttachmentType.PORTFOLIO,
    fileName: '',
    fileUrl: '',
    isVisible: true,
    priority,
  });

  // 빈 배열일 때 자동으로 항목 하나 추가
  useEffect(() => {
    if (attachments.length === 0) {
      onUpdate([createEmptyAttachment()]);
    }
  }, []);

  // priority를 배열 인덱스와 동기화
  useEffect(() => {
    const needsUpdate = attachments.some((attachment, idx) => attachment.priority !== idx);
    if (needsUpdate && attachments.length > 0) {
      const updated = attachments.map((attachment, idx) => ({
        ...attachment,
        priority: idx
      }));
      onUpdate(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachments.length]);

  const handleAddAttachment = () => {
    const newAttachment = createEmptyAttachment(attachments.length);
    onUpdate([...attachments, newAttachment]);
  };

  const handleDeleteAttachment = (index: number) => {
    const filtered = attachments.filter((_, i) => i !== index);
    // priority를 인덱스로 재설정
    const updated = filtered.map((attachment, idx) => ({
      ...attachment,
      priority: idx
    }));
    onUpdate(updated);
  };

  const handleAttachmentChange = (index: number, field: keyof ResumeUpdateRequest_AttachmentRequest, value: string | number | boolean | undefined) => {
    const newAttachments = [...attachments];
    newAttachments[index] = {
      ...newAttachments[index],
      [field]: value
    };
    
    // priority를 인덱스로 설정
    const updatedAttachments = newAttachments.map((attachment, idx) => ({
      ...attachment,
      priority: idx
    }));
    
    onUpdate(updatedAttachments);
  };

  const toggleVisible = (index: number) => {
    handleAttachmentChange(index, 'isVisible', !attachments[index].isVisible);
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
        <div key={attachment.id || index} className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.gridContainer2}>
            {/* 종류 */}
            <div className={styles.formField}>
              <Dropdown
                label="종류"
                selectedOption={normalizeEnumValue(attachment.type, Attachment_AttachmentType)}
                options={[
                  { value: Attachment_AttachmentType.RESUME, label: '이력서' },
                  { value: Attachment_AttachmentType.PORTFOLIO, label: '포트폴리오' },
                  { value: Attachment_AttachmentType.CAREER_STATEMENT, label: '경력기술서' },
                  { value: Attachment_AttachmentType.CERTIFICATE, label: '증명서' },
                  { value: Attachment_AttachmentType.ETC, label: '기타' },
                ]}
                setValue={(value) => handleAttachmentChange(index, 'type', normalizeEnumValue(value, Attachment_AttachmentType))}
              />
            </div>

            {/* 파일 URL */}
            <div className={styles.formField}>
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
          
          <div className={styles.cardActions}>
            <button
              onClick={() => toggleVisible(index)}
              className={`${styles.visibleButton} ${attachment.isVisible ? styles.visible : ''}`}
            >
              {attachment.isVisible ? '보임' : '안보임'}
            </button>
            <button
              onClick={() => handleDeleteAttachment(index)}
              className={styles.cardDeleteButton}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttachmentEdit;
