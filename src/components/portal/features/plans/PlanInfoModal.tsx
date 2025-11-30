'use client';

import React, { useEffect, useState } from 'react';
import styles from './PlanInfoModal.module.css';
import { ReleasePlanListResponse, ReleasePlanSubscription } from '@/generated/release';
import { Plan_PlanType } from '@/generated/common';
import { compareEnumValue } from '@/utils/commonUtils';
import LoadingScreen from '../../ui/LoadingScreen';

interface PlanInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (durationMonths: number, totalPrice: number) => void;
}

const PlanInfoModal: React.FC<PlanInfoModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  const [membershipOptions, setMembershipOptions] = useState<ReleasePlanSubscription[]>([]);
  const [premiumPlanPrice, setPremiumPlanPrice] = useState<number>(9900); // 기본값
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchPlanSubscriptions();
    }
  }, [isOpen]);

  const fetchPlanSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/release/plans');
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      const data: ReleasePlanListResponse = await response.json();

      // 완성 플랜(PREMIUM) 찾기
      const completePlan = data.plans?.find(plan => compareEnumValue(plan.type, Plan_PlanType.PREMIUM, Plan_PlanType));
      
      if (completePlan) {
        // PREMIUM 플랜의 가격 저장 (원래 월 가격)
        const price = typeof completePlan.price === 'string' 
          ? parseInt(completePlan.price) || 9900 
          : completePlan.price || 9900;
        setPremiumPlanPrice(price);
        
        if (completePlan.planSubscriptions && completePlan.planSubscriptions.length > 0) {
          // durationMonths 역순으로 정렬 (12개월, 6개월, 3개월, 1개월)
          const sortedSubscriptions = [...completePlan.planSubscriptions].sort(
            (a, b) => {
              const aDuration = parseInt(a.durationMonths) || 0;
              const bDuration = parseInt(b.durationMonths) || 0;
              return bDuration - aDuration; // 큰 숫자부터
            }
          );
          setMembershipOptions(sortedSubscriptions);
        } else {
          setMembershipOptions([]);
        }
      } else {
        setMembershipOptions([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching plan subscriptions:', err);
      setMembershipOptions([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePayment = (subscription: ReleasePlanSubscription) => {
    const durationMonths = parseInt(subscription.durationMonths) || 0;
    const totalPrice = typeof subscription.totalPrice === 'string'
      ? parseInt(subscription.totalPrice) || 0
      : subscription.totalPrice || 0;
    if (onSelectPlan) {
      onSelectPlan(durationMonths, totalPrice);
    }
    // TODO: 결제 로직 구현
  };

  const formatMembershipOption = (subscription: ReleasePlanSubscription) => {
    const duration = parseInt(subscription.durationMonths) || 1;
    // 원래 월 가격은 PREMIUM 플랜의 price 사용
    const originalMonthly = premiumPlanPrice;
    // 할인된 월 가격
    const monthlyEquivalent = typeof subscription.monthlyEquivalent === 'string'
      ? parseInt(subscription.monthlyEquivalent) || 0
      : subscription.monthlyEquivalent || 0;
    const discountedMonthly = monthlyEquivalent > 0 ? monthlyEquivalent : originalMonthly;
    // 총 가격
    const totalPrice = typeof subscription.totalPrice === 'string'
      ? parseInt(subscription.totalPrice) || 0
      : subscription.totalPrice || 0;
    // 할인율
    const discountRate = typeof subscription.discountRate === 'string'
      ? parseInt(subscription.discountRate) || 0
      : subscription.discountRate || 0;

    return {
      duration,
      originalMonthly,
      discountedMonthly,
      totalPrice,
      discountRate,
      subscription,
    };
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>플랜 안내</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          {/* 플랜 비교 섹션 */}
          <div className={styles.planComparison}>
            <div className={styles.planCard}>
              <div className={styles.planHeader}>
                <span className={styles.planIcon}>⚡</span>
                <h3 className={styles.planName}>시작 플랜</h3>
              </div>
              <p className={styles.planIntro}>
                가볍게 시작해보세요. 나만의 기록과 이력을 간단히 관리할 수 있어요.
              </p>
              <div className={styles.featureSection}>
                <div className={styles.featureItem}>
                  <h4 className={styles.featureTitle}>기록 관리</h4>
                  <p className={styles.featureDescription}>
                    개인 기록과 공유 기록을 각각 2개씩 만들어 가볍게 시작할 수 있어요.
                  </p>
                </div>
                <div className={styles.featureItem}>
                  <h4 className={styles.featureTitle}>이력/이직 관리</h4>
                  <p className={styles.featureDescription}>
                    이력과 이직은 한 개만 등록 가능하지만 기본 관리 기능으로 나의 커리어를 정리할 수 있어요.
                  </p>
                </div>
                <div className={styles.featureItem}>
                  <h4 className={styles.featureTitle}>이력서 공유</h4>
                  <p className={styles.featureDescription}>
                    PDF 변환과 URL 공유는 자유롭지만 워터마크가 함께 표시돼요.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.planCard}>
              <div className={styles.planHeader}>
                <span className={styles.planIcon}>❤️</span>
                <h3 className={styles.planName}>완성 플랜</h3>
              </div>
              <p className={styles.planIntro}>
                가볍게 시작해보세요. 나만의 기록과 이력을 간단히 관리할 수 있어요.
              </p>
              <div className={styles.featureSection}>
                <div className={styles.featureItem}>
                  <h4 className={styles.featureTitle}>기록 관리</h4>
                  <p className={styles.featureDescription}>
                    개인 기록도, 공유 기록도 제한없이 마음껏 쌓을 수 있어요.
                  </p>
                </div>
                <div className={styles.featureItem}>
                  <h4 className={styles.featureTitle}>이력/이직 관리</h4>
                  <p className={styles.featureDescription}>
                    이력과 이직 기록을 무제한으로 자유롭게 관리하면서 다양한 커리어를 정리해 보세요.
                  </p>
                </div>
                <div className={styles.featureItem}>
                  <h4 className={styles.featureTitle}>이력서 공유</h4>
                  <p className={styles.featureDescription}>
                    워터마크가 사라져 더욱 완성도 있는 내 이력서를 공유할 수 있어요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 멤버십 옵션 섹션 */}
          <div className={styles.membershipSection}>
            <h3 className={styles.membershipTitle}>완성 플랜 멤버십</h3>
            <p className={styles.membershipIntro}>나에게 딱 맞는 플랜을 선택해 보세요.</p>
            {loading ? (
              <div className={styles.loading}>
                <LoadingScreen />
              </div>
            ) : error ? (
              <div className={styles.error}>플랜 정보를 불러오는 중 오류가 발생했습니다.</div>
            ) : membershipOptions.length === 0 ? (
              <div className={styles.empty}>등록된 멤버십 옵션이 없습니다.</div>
            ) : (
              <div className={styles.membershipOptions}>
                {membershipOptions.map((subscription) => {
                  const option = formatMembershipOption(subscription);
                  return (
                    <div key={subscription.id} className={styles.membershipCard}>
                      <div className={styles.membershipHeader}>
                        <h4 className={styles.membershipDuration}>{option.duration}개월 이용권</h4>
                      </div>
                      <div className={styles.priceInfo}>
                        <div className={styles.priceRow}>
                          {option.discountRate > 0 ? (
                            <>
                              <span className={styles.crossedPrice}>월 {option.originalMonthly.toLocaleString()}원</span>
                            </>
                          ) : (
                            <span className={styles.originalMonthlyPrice}>월 {option.originalMonthly.toLocaleString()}원</span>
                          )}
                        </div>
                        {option.discountRate > 0 && (
                          <div className={styles.priceRow}>
                            <span className={styles.monthlyPrice}>
                              {option.discountedMonthly.toLocaleString()}원
                            </span>
                            <span className={styles.discountBadge}>약 {option.discountRate}% 할인</span>
                          </div>
                        )}
                      </div>
                      <button
                        className={styles.paymentButton}
                        onClick={() => handlePayment(subscription)}
                      >
                        {option.totalPrice.toLocaleString()}원 결제
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanInfoModal;

