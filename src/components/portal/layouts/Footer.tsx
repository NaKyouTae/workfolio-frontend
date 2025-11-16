'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PlanInfoModal from '@/components/portal/features/plans/PlanInfoModal';

const Footer = () => {
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // const handlePlanClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  //   e.preventDefault();
  //   setIsPlanModalOpen(true);
  // };

  const handlePlanSelect = (durationMonths: number, totalPrice: number) => {
    console.log(`Selected plan: ${durationMonths} months, total: ${totalPrice}원`);
    // TODO: 결제 로직 구현
    setIsPlanModalOpen(false);
  };

  return (
    <>
      <footer>
        <ul>
        <li><a href="https://forms.gle/ntxm9NVwbFLQmUbg6" target="_blank">고객문의</a></li>
          <li><Link href="/service-guides/notices">공지사항</Link></li>
          <li><Link href="/service-guides/terms-services">이용약관</Link></li>
          <li><Link href="/service-guides/privacy-policies">개인정보처리방침</Link></li>
          {/* <li>
            <a href="#" onClick={handlePlanClick}>
              플랜구성
            </a>
          </li> */}
        </ul>

        <p>Ⓒ 2025 Spectrum. All rights reserved.</p>
      </footer>

      <PlanInfoModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSelectPlan={handlePlanSelect}
      />
    </>
  );
};

export default Footer;
