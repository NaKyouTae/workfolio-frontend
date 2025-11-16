'use client';

import React from 'react';
import styles from './ServiceGuidesSidebar.module.css';

type MenuType = 'notices' | 'terms' | 'privacy';

interface ServiceGuidesSidebarProps {
  selectedMenu: MenuType;
  onMenuClick: (menu: MenuType) => void;
}

const ServiceGuidesSidebar: React.FC<ServiceGuidesSidebarProps> = ({ selectedMenu, onMenuClick }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.asideCont}>
        <div 
          className={`${styles.asideHome} ${selectedMenu === 'notices' ? styles.active : ''}`}
          onClick={() => onMenuClick('notices')}
        >
          공지사항
        </div>
        <div 
          className={`${styles.asideHome} ${selectedMenu === 'terms' ? styles.active : ''}`}
          onClick={() => onMenuClick('terms')}
        >
          이용약관
        </div>
        <div 
          className={`${styles.asideHome} ${selectedMenu === 'privacy' ? styles.active : ''}`}
          onClick={() => onMenuClick('privacy')}
        >
          개인정보처리방침
        </div>
      </div>
    </aside>
  );
};

export default ServiceGuidesSidebar;

