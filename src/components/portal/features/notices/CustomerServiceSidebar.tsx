'use client';

import React from 'react';
import styles from './CustomerServiceSidebar.module.css';

type MenuType = 'notices' | 'faq';

interface CustomerServiceSidebarProps {
  selectedMenu: MenuType;
  onMenuClick: (menu: MenuType) => void;
}

const CustomerServiceSidebar: React.FC<CustomerServiceSidebarProps> = ({ selectedMenu, onMenuClick }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.asideCont}>
        <div 
          className={`${styles.asideHome} ${selectedMenu === 'notices' ? styles.active : ''}`}
          onClick={() => onMenuClick('notices')}
        >
          공지사항
        </div>
      </div>
    </aside>
  );
};

export default CustomerServiceSidebar;

