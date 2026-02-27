'use client';

import React, { useState, useEffect } from 'react';
import { NoticeUpdateRequest } from '@workfolio/shared/generated/notice';
import { Notice } from '@workfolio/shared/generated/common';
import NoticeForm from './NoticeForm';
import AdminModal from './AdminModal';

interface NoticeUpdateModalProps {
  isOpen: boolean;
  notice: Notice | null;
  onClose: () => void;
  onSubmit: (request: NoticeUpdateRequest) => Promise<boolean>;
}

const NoticeUpdateModal: React.FC<NoticeUpdateModalProps> = ({
  isOpen,
  notice,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isPinned: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (notice) {
      setFormData({
        title: notice.title || '',
        content: notice.content || '',
        isPinned: notice.isPinned || false,
      });
    }
  }, [notice]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notice) return;

    setIsSubmitting(true);

    const request: NoticeUpdateRequest = {
      id: notice.id,
      title: formData.title,
      content: formData.content,
      isPinned: formData.isPinned,
    };

    const success = await onSubmit(request);
    if (success) {
      onClose();
    }
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    if (notice) {
      setFormData({
        title: notice.title || '',
        content: notice.content || '',
        isPinned: notice.isPinned || false,
      });
    }
    onClose();
  };

  if (!notice) return null;

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="공지사항 수정"
      maxWidth="550px"
      maxHeight="90vh"
      footer={
        <>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="line gray"
            style={{
              padding: '8px 16px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.5 : 1,
            }}
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="dark-gray"
            style={{
              padding: '8px 16px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.5 : 1,
            }}
          >
            {isSubmitting ? '처리 중...' : '저장'}
          </button>
        </>
      }
    >
      <NoticeForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        hideButtons
      />
    </AdminModal>
  );
};

export default NoticeUpdateModal;
