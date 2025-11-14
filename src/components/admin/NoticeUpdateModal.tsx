'use client';

import React, { useState, useEffect } from 'react';
import { NoticeUpdateRequest } from '@/generated/notice';
import { Notice } from '@/generated/common';
import NoticeForm from './NoticeForm';

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
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  if (!isOpen || !notice) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '32px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>
          공지사항 수정
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

export default NoticeUpdateModal;

