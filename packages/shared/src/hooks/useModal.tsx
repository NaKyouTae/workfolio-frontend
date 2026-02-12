import { useState } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const openModal = (modalContent: string, modalTitle?: string) => {
    setContent(modalContent);
    setTitle(modalTitle || '');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContent('');
    setTitle('');
  };

  return {
    isOpen,
    content,
    title,
    openModal,
    closeModal,
  };
};

