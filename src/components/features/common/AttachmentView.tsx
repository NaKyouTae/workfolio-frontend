import React from 'react';
import Image from 'next/image';
import { Attachment, Attachment_AttachmentCategory, Attachment_AttachmentType } from '@/generated/common';
import { normalizeEnumValue } from '@/utils/commonUtils';
import EmptyState from '@/components/ui/EmptyState';
import styles from './AttachmentView.module.css';

interface AttachmentViewProps {
  attachments: Attachment[];
  showHidden?: boolean;
}

/**
 * 첨부파일 정보 읽기 전용 컴포넌트
 */
const AttachmentView: React.FC<AttachmentViewProps> = ({ attachments, showHidden = false }) => {
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

  /**
   * 파일 다운로드 핸들러
   * Supabase Storage에서 파일을 다운로드합니다.
   * 브라우저 새 탭 없이 바로 다운로드만 실행됩니다.
   */
  const handleFileDownload = async (fileUrl: string, fileName: string) => {
    try {
      // fileUrl에서 파일 가져오기
      const response = await fetch(fileUrl, {
        method: 'GET',
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error('파일 다운로드 실패');
      }

      // Blob으로 변환
      const blob = await response.blob();
      
      // Blob URL 생성
      const blobUrl = URL.createObjectURL(blob);
      
      // 임시 a 태그 생성 (새 탭 절대 열리지 않음)
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName; // download 속성으로 다운로드 강제
      link.style.display = 'none';
      // target 속성을 설정하지 않음 (기본값이 현재 페이지)
      
      document.body.appendChild(link);
      
      // 클릭 이벤트 직접 생성 및 디스패치
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      link.dispatchEvent(clickEvent);
      
      // 정리 (다운로드가 시작된 후)
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error('파일 다운로드 오류:', error);
      alert('파일 다운로드에 실패했습니다.');
    }
  };

  const getAttachmentTypeIcon = (attachment: Attachment) => {
    const normalizedCategory = normalizeEnumValue(attachment.category, Attachment_AttachmentCategory);
    
    if(normalizedCategory == Attachment_AttachmentCategory.FILE) {
      return (
        <div 
          className={styles.iconWrapper}
          onClick={() => handleFileDownload(attachment.fileUrl, attachment.fileName)}
        >
          <Image src="/assets/img/ico/ic-download.png" alt="download" width={16} height={16} />
          {attachment.fileName && <span>{attachment.fileName}</span>}
        </div>
      );
    }

    if(normalizedCategory == Attachment_AttachmentCategory.URL) {
      return (
        <div 
          className={styles.iconWrapper}
          onClick={() => {
            window.open(attachment.url, '_blank');
          }}
        >
          <Image src="/assets/img/ico/ic-open.png" alt="etc" width={16} height={16} />
          {attachment.url && <span>{attachment.url}</span>}
        </div>
      );
    }
  };

  // 필터링된 첨부파일 목록 (한 번만 필터링)
  const filteredAttachments = attachments.filter(a => showHidden ? true : a.isVisible !== false);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        첨부
      </h3>
      
      {(!attachments || filteredAttachments.length === 0) ? (
        <EmptyState text="등록된 첨부 정보가 없습니다." />
      ) : (
        <div className={styles.listContainer}>
          {filteredAttachments.map((attachment) => (
            <div className={styles.item} key={attachment.id}>
              <div className={styles.itemContent}>
                <a
                  href={attachment.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  <span className={styles.iconContainer}>
                    {getAttachmentTypeIcon(attachment)}
                  </span>
                </a>
              </div>
              <div>
                {attachment.type && (
                  <span className={styles.typeLabel}>
                    {getAttachmentTypeLabel(attachment.type)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentView;

