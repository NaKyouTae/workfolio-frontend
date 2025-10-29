import React, { useEffect, useRef } from 'react';
import { ResumeUpdateRequest_AttachmentRequest } from '@/generated/resume';
import { Attachment_AttachmentCategory, Attachment_AttachmentType } from '@/generated/common';
import Input from '@/components/ui/Input';
import Dropdown from '@/components/ui/Dropdown';
import styles from '../CareerContentEdit.module.css';
import { normalizeEnumValue } from '@/utils/commonUtils';
import DraggableList from '@/components/ui/DraggableList';
import DraggableItem from '@/components/ui/DraggableItem';
import CardActions from '@/components/ui/CardActions';
import EmptyState from '@/components/ui/EmptyState';

// 모드 정보를 포함한 확장된 Attachment 타입
type AttachmentWithMode = ResumeUpdateRequest_AttachmentRequest & {
  _isFileDownloadMode?: boolean; // 파일 모드 여부를 추적하는 임시 속성
  _file?: File; // 선택된 파일 객체 (UI 표시용)
};

// Uint8Array를 base64 문자열로 변환
const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
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
  handleFileUpload: (index: number, file: File) => Promise<void>;
}

const AttachmentItem: React.FC<AttachmentItemProps> = ({
  attachment,
  index,
  isFileDownloadMode, // props로 받은 모드 사용
  handleAttachmentChange,
  toggleVisible,
  handleDeleteAttachment,
  handleFileUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(index, file);
    }
  };

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

        {/* 파일 업로드 (파일 모드일 때) */}
        {isFileDownloadMode && (
          <>
            <div className={styles.formField}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                파일 선택
              </label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={onFileChange}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
              {attachment._file && (
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  선택된 파일: {attachment._file.name} ({(attachment._file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <div className={styles.formField}>
              <Input 
                type="text"
                label="파일 이름"
                placeholder="portfolio.pdf"
                value={attachment.fileName || ''}
                onChange={(e) => handleAttachmentChange(index, 'fileName', e.target.value)}
              />
            </div>
            {attachment.fileUrl && (
              <div className={styles.formField}>
                <Input 
                  type="text"
                  label="파일 URL (자동 생성)"
                  value={attachment.fileUrl}
                  readOnly={true}
                />
              </div>
            )}
          </>
        )}

        {/* 파일 URL (URL 모드일 때만) */}
        {!isFileDownloadMode && (
          <div className={styles.formField}>
            <Input 
              type="url"
              label="URL"
              placeholder="https://example.com"
              value={attachment.url || ''}
              onChange={(e) => handleAttachmentChange(index, 'url', e.target.value)}
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
    category: Attachment_AttachmentCategory.FILE,
    url: '',
    fileName: '',
    fileUrl: '',
    fileData: undefined,
    isVisible: false,
    priority,
    _isFileDownloadMode: true, // 파일 모드 표시
  });

  // URL 모드로 attachment 생성 (fileUrl 필드 사용)
  const createUrlAttachment = (priority: number = 0): AttachmentWithMode => ({
    type: undefined,
    category: Attachment_AttachmentCategory.URL,
    url: '',
    fileName: '',
    fileUrl: '',
    fileData: undefined,
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

  const handleFileUpload = async (index: number, file: File) => {
    try {
      // 파일을 attachments에 포함
      const newAttachments = [...attachments];
      const attachment = newAttachments[index] as AttachmentWithMode;
      
      // 파일 데이터를 Uint8Array로 변환
      const uint8Array = await new Promise<Uint8Array>((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          const bytes = new Uint8Array(arrayBuffer);
          resolve(bytes);
        };
        
        reader.onerror = () => {
          reject(new Error('파일 읽기 실패'));
        };
        
        // ArrayBuffer로 읽기
        reader.readAsArrayBuffer(file);
      });
      
      // Uint8Array를 base64로 변환하여 저장 (JSON 직렬화 가능)
      const base64String = uint8ArrayToBase64(uint8Array);
      
      // fileData를 base64 문자열로 저장 (proto bytes 타입은 JSON에서 base64로 직렬화됨)
      Object.assign(attachment, { fileData: base64String });
      
      // 파일명이 비어있으면 자동으로 설정
      if (!attachment.fileName) {
        attachment.fileName = file.name;
      }
      
      // UI 표시를 위해 파일 객체도 임시로 저장
      attachment._file = file;
      
      onUpdate(newAttachments);
    } catch (error) {
      console.error('파일 읽기 오류:', error);
      alert('파일을 읽는 중 오류가 발생했습니다.');
    }
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

      {attachments.length === 0 ? (
        <EmptyState text="등록된 첨부 정보가 없습니다." />
      ) : (
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
                handleFileUpload={handleFileUpload}
              />
            );
          }}
        />
      )}
    </div>
  );
};

export default AttachmentEdit;
