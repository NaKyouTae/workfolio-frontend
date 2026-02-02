import React, { useEffect, useRef } from 'react';
import { AttachmentRequest } from '@/generated/attachment';
import { Attachment_AttachmentCategory, Attachment_AttachmentType } from '@/generated/common';
import Input from '@/components/portal/ui/Input';
import Dropdown from '@/components/portal/ui/Dropdown';
import { normalizeEnumValue } from '@/utils/commonUtils';
import DraggableList from '@/components/portal/ui/DraggableList';
import DraggableItem from '@/components/portal/ui/DraggableItem';
import CardActions from '@/components/portal/ui/CardActions';
import EmptyState from '@/components/portal/ui/EmptyState';
import '@/styles/component-edit.css';

// 모드 정보를 포함한 확장된 Attachment 타입
type AttachmentWithMode = AttachmentRequest & {
  _file?: File; // 선택된 파일 객체 (UI 표시용)
};

const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

interface AttachmentEditProps {
  attachments: AttachmentRequest[];
  onUpdate: (attachments: AttachmentRequest[]) => void;
}

interface AttachmentItemProps {
  attachment: AttachmentWithMode;
  index: number;
  handleAttachmentChange: (index: number, field: keyof AttachmentRequest, value: string | number | boolean | undefined) => void;
  toggleVisible: (index: number) => void;
  handleDeleteAttachment: (index: number) => void;
  handleFileUpload: (index: number, file: File) => Promise<void>;
}

const AttachmentItem: React.FC<AttachmentItemProps> = ({
  attachment,
  index,
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
    >
        <div className="card">
            <ul className="edit-cont">
                <li>
                    <p>구분</p>
                    <Dropdown
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
                </li>
                {normalizeEnumValue(attachment.category, Attachment_AttachmentCategory) === Attachment_AttachmentCategory.FILE && (
                <li>
                    <p>파일 첨부</p>
                    <label className="file">
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={onFileChange}
                        />
                        <Input 
                            type="text"
                            label="파일 이름"
                            placeholder="파일을 선택해 주세요."
                            readOnly
                            value={attachment.fileName || ''}
                            onChange={(e) => handleAttachmentChange(index, 'fileName', e.target.value)}
                        />
                        <button type="button" onClick={() => fileInputRef.current?.click()}>파일 찾기</button>
                    </label>
                </li>
                )}
                {(normalizeEnumValue(attachment.category, Attachment_AttachmentCategory) === Attachment_AttachmentCategory.URL ||
                  normalizeEnumValue(attachment.category, Attachment_AttachmentCategory) !== Attachment_AttachmentCategory.FILE) && (
                <li>
                    <p>URL</p>
                    <Input 
                        type="url"
                        label="URL"
                        placeholder="URL을 입력해 주세요."
                        value={attachment.url || ''}
                        onChange={(e) => handleAttachmentChange(index, 'url', e.target.value)}
                    />
                </li>
                )}
            </ul>
            <CardActions
                isVisible={attachment.isVisible ?? true}
                onToggleVisible={() => toggleVisible(index)}
                onDelete={() => handleDeleteAttachment(index)}
            />
        </div>
    </DraggableItem>
  );
};

/**
 * 첨부 섹션 전체를 관리하는 컴포넌트
 * sectionHeader, 추가 버튼, 개별 첨부 항목 포함
 */
const AttachmentEdit: React.FC<AttachmentEditProps> = ({ attachments, onUpdate }) => {
  const createFileAttachment = (priority: number = 0): AttachmentWithMode => ({
    id: undefined,
    type: undefined,
    category: Attachment_AttachmentCategory.FILE,
    url: '',
    fileName: '',
    fileUrl: '',
    fileData: undefined,
    priority,
    isVisible: true,
  });

  const createUrlAttachment = (priority: number = 0): AttachmentWithMode => ({
    id: undefined,
    type: undefined,
    category: Attachment_AttachmentCategory.URL,
    url: '',    
    fileName: '',
    fileUrl: '',
    fileData: undefined,    
    priority,
    isVisible: true,
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

  const handleAttachmentChange = (index: number, field: keyof AttachmentRequest, value: string | number | boolean | undefined) => {
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

  const handleReorder = (reorderedAttachments: AttachmentRequest[]) => {
    const updatedAttachments = reorderedAttachments.map((attachment, idx) => ({
      ...attachment,
      priority: idx
    }));
    onUpdate(updatedAttachments);
  };

  const handleFileUpload = async (index: number, file: File) => {
    try {
      const newAttachments = [...attachments];
      const attachment = newAttachments[index] as AttachmentWithMode;

      const uint8Array = await new Promise<Uint8Array>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          const bytes = new Uint8Array(arrayBuffer);
          resolve(bytes);
        };
        reader.onerror = () => reject(new Error('파일 읽기 실패'));
        reader.readAsArrayBuffer(file);
      });

      const base64String = uint8ArrayToBase64(uint8Array);
      Object.assign(attachment, { fileData: base64String as unknown as Uint8Array });
      if (!attachment.fileName) {
        attachment.fileName = file.name;
      }
      attachment._file = file;
      onUpdate(newAttachments);
    } catch (error) {
      console.error('파일 읽기 오류:', error);
      alert('파일을 읽는 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
        <div className="cont-tit">
            <div>
                <h3>첨부</h3>
                {/* <p>{attachments.length}개</p> */}
            </div>
            <div>
                <button type="button" onClick={handleAddFileAttachment}><i className="ic-add" />파일 추가</button>
                <button type="button" onClick={handleAddUrlAttachment}><i className="ic-add" />추가</button>
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
                handleAttachmentChange={handleAttachmentChange}
                toggleVisible={toggleVisible}
                handleDeleteAttachment={handleDeleteAttachment}
                handleFileUpload={handleFileUpload}
                />
            );
            }}
        />
        )}
    </>
  );
};

export default AttachmentEdit;
