'use client';

import React, { useState } from 'react';
import { NoticeCreateRequest } from '@workfolio/shared/generated/notice';
import NoticeForm from './NoticeForm';

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

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
      setFormData({
        title: '',
        content: '',
        isPinned: false,
      });
      onClose();
    }

    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      content: '',
      isPinned: false,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#1c1c1c',
        border: '1px solid #2e2e2e',
        borderRadius: '8px',
        padding: '28px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <h2 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: 600, color: '#ededed' }}>
          새 공지사항 추가
        </h2>

        <NoticeForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default NoticeCreateModal;
