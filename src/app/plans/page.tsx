'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/portal/layouts/Header';
import PlanInfoModal from '@/components/portal/features/plans/PlanInfoModal';

export default function PlansPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 모달 자동으로 열기
    setIsModalOpen(true);
  }, []);

  const handlePlanSelect = (durationMonths: number, totalPrice: number) => {
    console.log('Selected plan:', { durationMonths, totalPrice });
    // TODO: 플랜 선택 및 구독 처리 로직 구현
    // 예: 결제 페이지로 이동, 구독 생성 등
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // 모달 닫을 때 이전 페이지로 이동하거나 홈으로 이동
    router.back();
  };

  return (
    <>
      <Header />
      <PlanInfoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectPlan={handlePlanSelect}
      />
    </>
  );
}

