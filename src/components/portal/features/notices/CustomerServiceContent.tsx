'use client';

import React from 'react';
import Notices from './Notices';

type MenuType = 'notices' | 'faq';

interface CustomerServiceContentProps {
  selectedMenu: MenuType;
}

const CustomerServiceContent: React.FC<CustomerServiceContentProps> = ({ selectedMenu }) => {
  return (
    <div>
      {selectedMenu === 'notices' && <Notices />}
      {selectedMenu === 'faq' && (
        <div style={{ padding: '24px' }}>
          <h2>자주 묻는 질문</h2>
          <p>자주 묻는 질문 내용이 여기에 표시됩니다.</p>
        </div>
      )}
    </div>
  );
};

export default CustomerServiceContent;

