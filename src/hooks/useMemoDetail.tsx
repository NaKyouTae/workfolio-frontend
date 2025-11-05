import { useState } from 'react';

export const useMemoDetail = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [memo, setMemo] = useState('');

  const openMemoDetail = (memoContent: string) => {
    setMemo(memoContent);
    setIsOpen(true);
  };

  const closeMemoDetail = () => {
    setIsOpen(false);
    setMemo('');
  };

  return {
    isOpen,
    memo,
    openMemoDetail,
    closeMemoDetail,
  };
};

