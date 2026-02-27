'use client';

import React, { useState, useEffect } from 'react';
import { NoticeCreateRequest } from '@workfolio/shared/generated/notice';
import NoticeForm from './NoticeForm';
import AdminModal from './AdminModal';

interface NoticeCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: NoticeCreateRequest) => Promise<boolean>;
}

const NoticeCreateModal: React.FC<NoticeCreateModalProps> = ({
  isOpen,
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
    if (!isOpen) {
      setFormData({ title: '', content: '', isPinned: false });
    }
  }, [isOpen]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const request: NoticeCreateRequest = {
      title: formData.title,
      content: formData.content,
      isPinned: formData.isPinned,
    };

    const success = await onSubmit(request);
    if (success) {
      setFormData({ title: '', content: '', isPinned: false });
      onClose();
    }
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setFormData({ title: '', content: '', isPinned: false });
    onClose();
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="새 공지사항 추가"
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

export default NoticeCreateModal;
