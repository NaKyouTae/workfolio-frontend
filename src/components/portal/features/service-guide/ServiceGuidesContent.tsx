'use client';

import React from 'react';
import Notices from './contents/Notices';
import TermsOfService from './contents/TermsOfService';
import PrivacyPolicy from './contents/PrivacyPolicy';
import { MenuType } from '@/models/MenuType';

interface ServiceGuidesContentProps {
  selectedMenu: MenuType;
}

const ServiceGuidesContent: React.FC<ServiceGuidesContentProps> = ({ selectedMenu }) => {
  return (
    <div className="contents">
        {selectedMenu === 'notices' && <Notices />}
        {selectedMenu === 'terms' && <TermsOfService />}
        {selectedMenu === 'privacy' && <PrivacyPolicy />}
    </div>
  );
};

export default ServiceGuidesContent;

