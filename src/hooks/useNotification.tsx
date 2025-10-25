import { create } from 'zustand';

interface NotificationOptions {
  text: string;
  color?: string;
}

interface NotificationState {
  isOpen: boolean;
  text: string;
  color: string;
  showNotification: (text: string, color?: string) => void;
  hideNotification: () => void;
}

const useNotificationStoreInternal = create<NotificationState>((set) => ({
  isOpen: false,
  text: '',
  color: '#4caf50', // 기본 색상 (녹색)

  showNotification: (text, color = '#4caf50') => {
    set({
      isOpen: true,
      text,
      color,
    });

    // 3초 후 자동으로 사라짐
    setTimeout(() => {
      set({ isOpen: false });
    }, 3000);
  },

  hideNotification: () => {
    set({ isOpen: false });
  },
}));

export const useNotificationStore = () => {
  const showNotification = useNotificationStoreInternal((state) => state.showNotification);
  return { showNotification };
};

export const useNotification = () => {
  const showNotification = useNotificationStoreInternal((state) => state.showNotification);
  return { showNotification };
};

export const useNotificationState = () => ({
  isOpen: useNotificationStoreInternal((state) => state.isOpen),
  text: useNotificationStoreInternal((state) => state.text),
  color: useNotificationStoreInternal((state) => state.color),
  hideNotification: useNotificationStoreInternal((state) => state.hideNotification),
});

