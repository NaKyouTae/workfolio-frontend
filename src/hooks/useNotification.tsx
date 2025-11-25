import { create } from 'zustand';

export type NotificationType = 'success' | 'warning' | 'error' | 'info';

interface NotificationState {
  isOpen: boolean;
  text: string;
  color: string;
  showNotification: (text: string, type?: NotificationType) => void;
  hideNotification: () => void;
}

// 타입에 따른 색상 매핑
const getColorByType = (type: NotificationType): string => {
  const colorMap: Record<NotificationType, string> = {
    success: '#4caf50', // 녹색
    warning: '#ff9800', // 주황색
    error: '#f44336',   // 빨간색
    info: '#2196f3',    // 파란색
  };
  return colorMap[type];
};

const useNotificationStoreInternal = create<NotificationState>((set) => ({
  isOpen: false,
  text: '',
  color: '#4caf50', // 기본 색상 (녹색)

  showNotification: (text, type = 'success') => {
    const color = getColorByType(type);
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

