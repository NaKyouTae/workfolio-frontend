'use client';

import React, { useEffect, useState } from 'react';
import { Plan, PlanSubscription, Plan_PlanType } from '@/generated/common';
import { usePlans } from '@/hooks/usePlans';
import styles from './PlanSelectionModal.module.css';

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (plan: Plan, subscription?: PlanSubscription) => void;
}

const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
}) => {
  const { plans, loading, fetchPlans } = usePlans();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [subscriptions, setSubscriptions] = useState<PlanSubscription[]>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen, fetchPlans]);

  useEffect(() => {
    if (selectedPlan) {
      fetchPlanSubscriptions(selectedPlan.id);
    } else {
      setSubscriptions([]);
    }
  }, [selectedPlan]);

  const fetchPlanSubscriptions = async (planId: string) => {
    setLoadingSubscriptions(true);
    try {
      const response = await fetch(`/api/plan-subscriptions?planId=${planId}`);
      if (response.ok) {
        const data = await response.json();
        const subscriptionsData = data.planSubscriptions || data.plan_subscriptions || [];
        setSubscriptions(subscriptionsData);
      } else {
        setSubscriptions([]);
      }
    } catch (error) {
      console.error('Error fetching plan subscriptions:', error);
      setSubscriptions([]);
    } finally {
      setLoadingSubscriptions(false);
    }
  };

  const handlePlanClick = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleSubscriptionSelect = (subscription: PlanSubscription) => {
    if (onSelectPlan && selectedPlan) {
      onSelectPlan(selectedPlan, subscription);
    }
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getPlanTypeLabel = (type: Plan_PlanType) => {
    switch (type) {
      case Plan_PlanType.FREE:
        return 'FREE';
      case Plan_PlanType.PREMIUM:
        return 'PREMIUM';
      default:
        return 'UNKNOWN';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  return (
    <div className={styles.modal} onClick={handleOverlayClick}>
      <div className={styles.modalWrap}>
        <div className={styles.modalHeader}>
          <h2>플랜 선택</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <i className="ic-close" />
          </button>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.container}>
            {/* 좌측: 플랜 목록 */}
            <div className={styles.planList}>
              <h3>플랜 목록</h3>
              {loading ? (
                <div className={styles.loading}>로딩 중...</div>
              ) : plans.length === 0 ? (
                <div className={styles.empty}>등록된 플랜이 없습니다.</div>
              ) : (
                <div className={styles.planItems}>
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`${styles.planItem} ${selectedPlan?.id === plan.id ? styles.selected : ''}`}
                      onClick={() => handlePlanClick(plan)}
                    >
                      <div className={styles.planItemHeader}>
                        <h4>{plan.name}</h4>
                        <span className={styles.planType}>
                          {getPlanTypeLabel(plan.type)}
                        </span>
                      </div>
                      <div className={styles.planItemPrice}>
                        {formatPrice(plan.price, plan.currency)}
                      </div>
                      {plan.description && (
                        <p className={styles.planItemDescription}>{plan.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 우측: 구독 옵션 */}
            <div className={styles.subscriptionList}>
              <h3>
                구독 옵션
                {selectedPlan && ` - ${selectedPlan.name}`}
              </h3>
              {!selectedPlan ? (
                <div className={styles.empty}>좌측에서 플랜을 선택하세요.</div>
              ) : loadingSubscriptions ? (
                <div className={styles.loading}>로딩 중...</div>
              ) : subscriptions.length === 0 ? (
                <div className={styles.empty}>등록된 구독 옵션이 없습니다.</div>
              ) : (
                <div className={styles.subscriptionItems}>
                  {subscriptions.map((subscription) => {
                    const totalPrice = typeof subscription.totalPrice === 'number' 
                      ? subscription.totalPrice 
                      : parseInt(subscription.totalPrice) || 0;
                    const monthlyEquivalent = typeof subscription.monthlyEquivalent === 'number'
                      ? subscription.monthlyEquivalent
                      : parseInt(subscription.monthlyEquivalent) || 0;
                    const savingsAmount = typeof subscription.savingsAmount === 'number'
                      ? subscription.savingsAmount
                      : parseInt(subscription.savingsAmount) || 0;
                    const discountRate = typeof subscription.discountRate === 'number'
                      ? subscription.discountRate
                      : parseInt(subscription.discountRate) || 0;
                    const currency = subscription.plan?.currency || selectedPlan?.currency || 'KRW';

                    return (
                      <div
                        key={subscription.id}
                        className={styles.subscriptionItem}
                        onClick={() => handleSubscriptionSelect(subscription)}
                      >
                        <div className={styles.subscriptionHeader}>
                          <h4>{subscription.durationMonths}개월</h4>
                          {discountRate > 0 && (
                            <span className={styles.discountBadge}>{discountRate}% 할인</span>
                          )}
                        </div>
                        <div className={styles.subscriptionPrice}>
                          <div className={styles.totalPrice}>
                            {formatPrice(totalPrice, currency)}
                          </div>
                          {monthlyEquivalent > 0 && (
                            <div className={styles.monthlyPrice}>
                              월 {formatPrice(monthlyEquivalent, currency)}
                            </div>
                          )}
                        </div>
                        {savingsAmount > 0 && (
                          <div className={styles.savings}>
                            {formatPrice(savingsAmount, currency)} 절약
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionModal;

