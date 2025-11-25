'use client';

import React from 'react';
import { MenuType } from '@/models/MenuType';

interface ServiceGuidesSidebarProps {
  selectedMenu: MenuType;
  onMenuClick: (menu: MenuType) => void;
}

const ServiceGuidesSidebar: React.FC<ServiceGuidesSidebarProps> = ({ selectedMenu, onMenuClick }) => {
  return (
    <aside>
        <div className="aside-cont">
            <ul className="aside-menu">
              <li className={`${selectedMenu === 'info' ? 'active' : ''}`} onClick={() => onMenuClick('info')}>소개하기</li>
                <li className={`${selectedMenu === 'notices' ? 'active' : ''}`} onClick={() => onMenuClick('notices')}>공지사항</li>
                <li className={`${selectedMenu === 'terms' ? 'active' : ''}`} onClick={() => onMenuClick('terms')}>이용약관</li>
                <li className={`${selectedMenu === 'privacy' ? 'active' : ''}`} onClick={() => onMenuClick('privacy')}>개인정보 처리방침</li>
            </ul>
        </div>
    </aside>
  );
};

export default ServiceGuidesSidebar;

