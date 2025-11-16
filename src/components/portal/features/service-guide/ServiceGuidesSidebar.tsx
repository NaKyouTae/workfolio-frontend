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
    <aside>
        <div className="aside-cont">
            <ul className="aside-menu">
                <li className={`${selectedMenu === 'notices' ? 'active' : ''}`} onClick={() => onMenuClick('notices')}>공지사항</li>
                <li className={`${selectedMenu === 'terms' ? 'active' : ''}`} onClick={() => onMenuClick('terms')}>이용약관</li>
                <li className={`${selectedMenu === 'privacy' ? 'active' : ''}`} onClick={() => onMenuClick('privacy')}>개인정보 처리방침</li>
            </ul>
        </div>
    </aside>
  );
};

export default ServiceGuidesSidebar;

