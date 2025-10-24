import React, { useEffect } from 'react';
import { ResumeUpdateRequest_AttachmentRequest } from '@/generated/resume';
import { Attachment_AttachmentType } from '@/generated/common';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import styles from '../CareerContentEdit.module.css';
import { normalizeEnumValue } from '@/utils/commonUtils';
import DraggableList from '@/components/ui/DraggableList';
import DraggableItem from '@/components/ui/DraggableItem';
import CardActions from '@/components/ui/CardActions';

// 모드 정보를 포함한 확장된 Attachment 타입
type AttachmentWithMode = ResumeUpdateRequest_AttachmentRequest & {
  _isFileDownloadMode?: boolean; // 파일 모드 여부를 추적하는 임시 속성
};

interface AttachmentEditProps {
  attachments: ResumeUpdateRequest_AttachmentRequest[];
  onUpdate: (attachments: ResumeUpdateRequest_AttachmentRequest[]) => void;
}

interface AttachmentItemProps {
  attachment: AttachmentWithMode;
  index: number;
  isFileDownloadMode: boolean; // props로 모드를 전달
  handleAttachmentChange: (index: number, field: keyof ResumeUpdateRequest_AttachmentRequest, value: string | number | boolean | undefined) => void;
  toggleVisible: (index: number) => void;
  handleDeleteAttachment: (index: number) => void;
}

const AttachmentItem: React.FC<AttachmentItemProps> = ({
  attachment,
  index,
  isFileDownloadMode, // props로 받은 모드 사용
  handleAttachmentChange,
  toggleVisible,
  handleDeleteAttachment,
}) => {
  return (
    <DraggableItem 
      id={attachment.id || `attachment-${index}`}
      className={styles.cardWrapper}
    >
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

        {/* 파일 이름 (파일 모드일 때만) */}
        {isFileDownloadMode && (
          <div className={styles.formField}>
            <Input 
              type="text"
              label="파일 이름"
              placeholder="portfolio.pdf"
              value={attachment.fileName || ''}
              onChange={(e) => handleAttachmentChange(index, 'fileName', e.target.value)}
            />
          </div>
        )}

        {/* 파일 URL (URL 모드일 때만) */}
        {!isFileDownloadMode && (
          <div className={styles.formField}>
            <Input 
              type="url"
              label="파일 URL"
              placeholder="https://example.com/portfolio.pdf"
              value={attachment.fileUrl || ''}
              onChange={(e) => handleAttachmentChange(index, 'fileUrl', e.target.value)}
            />
          </div>
        )}
      </div>
      </div>
      
      <CardActions
        isVisible={attachment.isVisible ?? true}
        onToggleVisible={() => toggleVisible(index)}
        onDelete={() => handleDeleteAttachment(index)}
      />
    </DraggableItem>
  );
};

/**
 * 첨부 섹션 전체를 관리하는 컴포넌트
 * sectionHeader, 추가 버튼, 개별 첨부 항목 포함
 */
const AttachmentEdit: React.FC<AttachmentEditProps> = ({ attachments, onUpdate }) => {
  // 파일 모드로 attachment 생성 (fileName 필드 사용)
  const createFileAttachment = (priority: number = 0): AttachmentWithMode => ({
    type: undefined,
    fileName: '',
    fileUrl: '',
    isVisible: false,
    priority,
    _isFileDownloadMode: true, // 파일 모드 표시
  });

  // URL 모드로 attachment 생성 (fileUrl 필드 사용)
  const createUrlAttachment = (priority: number = 0): AttachmentWithMode => ({
    type: undefined,
    fileName: '',
    fileUrl: '',
    isVisible: false,
    priority,
    _isFileDownloadMode: false, // URL 모드 표시
  });

  // 빈 배열일 때 자동으로 항목 하나 추가 (URL 모드로 기본 설정)
  useEffect(() => {
    if (attachments.length === 0) {
      onUpdate([createUrlAttachment()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleAddFileAttachment = () => {
    const newAttachment = createFileAttachment(attachments.length);
    onUpdate([...attachments, newAttachment]);
  };

  const handleAddUrlAttachment = () => {
    const newAttachment = createUrlAttachment(attachments.length);
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

  const handleReorder = (reorderedAttachments: ResumeUpdateRequest_AttachmentRequest[]) => {
    const updatedAttachments = reorderedAttachments.map((attachment, idx) => ({
      ...attachment,
      priority: idx
    }));
    onUpdate(updatedAttachments);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitleCounter}>
          첨부 | {attachments.length}개
        </h3>
        <div className={styles.addButtonContainer}>
          <button
            onClick={handleAddFileAttachment}
            className={styles.addButton}
          >
            <span>+ 파일 추가</span>
          </button>
          <button
            onClick={handleAddUrlAttachment}
            className={styles.addButton}
          >
            <span>+ URL 추가</span>
          </button>
        </div>
      </div>

      <DraggableList
        items={attachments}
        onReorder={handleReorder}
        getItemId={(att, idx) => att.id || `attachment-${idx}`}
        renderItem={(attachment, index) => {
          const attachmentWithMode = attachment as AttachmentWithMode;
          return (
            <AttachmentItem
              key={attachment.id || `attachment-${index}`}
              attachment={attachmentWithMode}
              index={index}
              isFileDownloadMode={attachmentWithMode._isFileDownloadMode ?? false} // props로 모드 전달
              handleAttachmentChange={handleAttachmentChange}
              toggleVisible={toggleVisible}
              handleDeleteAttachment={handleDeleteAttachment}
            />
          );
        }}
      />
    </div>
  );
};

export default AttachmentEdit;
