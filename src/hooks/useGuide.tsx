import { useState } from 'react';

export const useGuide = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openGuide = () => {
    setIsOpen(true);
  };

  const closeGuide = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    openGuide,
    closeGuide,
  };
};

