'use client';

import React, { useState } from 'react';
import CustomerServiceSidebar from './CustomerServiceSidebar';
import CustomerServiceContent from './CustomerServiceContent';
import styles from './CustomerServicePage.module.css';

type MenuType = 'notices' | 'faq';

const CustomerServicePage: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState<MenuType>('notices');

  const handleMenuClick = (menu: MenuType) => {
    setSelectedMenu(menu);
  };

  return (
    <main className={styles.container}>
      <CustomerServiceSidebar 
        selectedMenu={selectedMenu}
        onMenuClick={handleMenuClick}
      />
      <section className={styles.content}>
        <CustomerServiceContent selectedMenu={selectedMenu} />
      </section>
    </main>
  );
};

export default CustomerServicePage;

