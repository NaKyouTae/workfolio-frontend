'use client';

import { useEffect, useState } from 'react';
import { usePlans } from '@/hooks/usePlans';
import { PlanCreateRequest, PlanUpdateRequest } from '@/generated/plan';
import { Plan_PlanType, Plan, PlanSubscription } from '@/generated/common';
import { normalizeEnumValue } from '@/utils/commonUtils';
import styles from './AdminPlans.module.css';
import LoadingScreen from '../portal/ui/LoadingScreen';

export default function AdminPlans() {
  const { plans, loading, error, fetchPlans, createPlan, updatePlan } = usePlans();
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | undefined>(undefined);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [subscriptions, setSubscriptions] = useState<PlanSubscription[]>([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<PlanSubscription | undefined>(undefined);
  const [subscriptionFormData, setSubscriptionFormData] = useState({
    durationMonths: '',
    totalPrice: 0,
    monthlyEquivalent: 0,
    savingsAmount: 0,
    discountRate: 0,
    priority: 0,
  });
  const [formData, setFormData] = useState({
    name: '',
    type: Plan_PlanType.FREE,
    price: 0,
    currency: 'KRW',
    priority: 0,
    description: '',
  });

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const fetchPlanSubscriptions = async (planId: string) => {
    setLoadingSubscriptions(true);
    try {
      const response = await fetch(`/api/plan-subscriptions?planId=${planId}`);
      if (response.ok) {
        const data = await response.json();
        // 응답 형식 확인: planSubscriptions (camelCase) 또는 plan_subscriptions (snake_case) 또는 subscriptions
        const subscriptionsData = data.planSubscriptions || data.plan_subscriptions || data.subscriptions || [];
        
        // 숫자 필드가 문자열로 온 경우 숫자로 변환
        const normalizedSubscriptions = subscriptionsData.map((sub: PlanSubscription | Record<string, unknown>) => ({
          ...sub,
          totalPrice: typeof sub.totalPrice === 'string' ? parseInt(sub.totalPrice) || 0 : (sub.totalPrice as number) || 0,
          monthlyEquivalent: typeof sub.monthlyEquivalent === 'string' ? parseInt(sub.monthlyEquivalent) || 0 : (sub.monthlyEquivalent as number) || 0,
          savingsAmount: typeof sub.savingsAmount === 'string' ? parseInt(sub.savingsAmount) || 0 : (sub.savingsAmount as number) || 0,
          discountRate: typeof sub.discountRate === 'string' ? parseInt(sub.discountRate) || 0 : (sub.discountRate as number) || 0,
          priority: typeof sub.priority === 'string' ? parseInt(sub.priority) || 0 : (sub.priority as number) || 0,
          createdAt: typeof sub.createdAt === 'string' ? parseInt(sub.createdAt) || 0 : (sub.createdAt as number) || 0,
          updatedAt: typeof sub.updatedAt === 'string' ? parseInt(sub.updatedAt) || 0 : (sub.updatedAt as number) || 0,
        })) as PlanSubscription[];
        
        setSubscriptions(normalizedSubscriptions);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to fetch plan subscriptions:', response.status, errorData);
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
    fetchPlanSubscriptions(plan.id);
  };

  const handleOpenSubscriptionModal = (subscription?: PlanSubscription | undefined) => {
    if (subscription) {
      setEditingSubscription(subscription);
      setSubscriptionFormData({
        durationMonths: subscription.durationMonths,
        totalPrice: subscription.totalPrice,
        monthlyEquivalent: subscription.monthlyEquivalent,
        savingsAmount: subscription.savingsAmount,
        discountRate: subscription.discountRate,
        priority: subscription.priority,
      });
    } else {
      setEditingSubscription(undefined);
      setSubscriptionFormData({
        durationMonths: '',
        totalPrice: 0,
        monthlyEquivalent: 0,
        savingsAmount: 0,
        discountRate: 0,
        priority: 0,
      });
    }
    setShowSubscriptionModal(true);
  };

  const handleCloseSubscriptionModal = () => {
    setShowSubscriptionModal(false);
    setEditingSubscription(undefined);
  };

  const handleSubscriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    try {
      let response;
      if (editingSubscription) {
        // 수정 - PUT /api/plan-subscriptions (id와 plan_id를 body에 포함)
        response = await fetch(`/api/plan-subscriptions`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: editingSubscription.id,
            plan_id: selectedPlan.id,
            ...subscriptionFormData,
          }),
        });
      } else {
        // 생성 - POST /api/plan-subscriptions (plan_id를 body에 포함)
        response = await fetch(`/api/plan-subscriptions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plan_id: selectedPlan.id,
            ...subscriptionFormData,
          }),
        });
      }

      if (response.ok) {
        handleCloseSubscriptionModal();
        // 목록 새로고침
        if (selectedPlan) {
          fetchPlanSubscriptions(selectedPlan.id);
        }
      } else {
        const error = await response.json();
        alert(`오류: ${error.error || '요청 실패'}`);
      }
    } catch (error) {
      console.error('Error saving subscription:', error);
      alert('오류가 발생했습니다.');
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    if (!selectedPlan) return;
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/plan-subscriptions/${subscriptionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // 목록 새로고침
        fetchPlanSubscriptions(selectedPlan.id);
      } else {
        const error = await response.json();
        alert(`오류: ${error.error || '삭제 실패'}`);
      }
    } catch (error) {
      console.error('Error deleting subscription:', error);
      alert('오류가 발생했습니다.');
    }
  };

  const handleOpenModal = (plan?: Plan | undefined) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        type: plan.type,
        price: plan.price,
        currency: plan.currency,
        priority: plan.priority,
        description: plan.description || '',
      });
    } else {
      setEditingPlan(undefined);
      setFormData({
        name: '',
        type: Plan_PlanType.FREE,
        price: 0,
        currency: 'KRW',
        priority: 0,
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;
    if (editingPlan) {
      const request: PlanUpdateRequest = {
        id: editingPlan.id,
        ...formData,
      };
      success = await updatePlan(request);
    } else {
      const request: PlanCreateRequest = formData;
      success = await createPlan(request);
    }

    if (success) {
      handleCloseModal();
    }
  };


  const getPlanTypeLabel = (type: Plan_PlanType) => {
    const normalizedType = normalizeEnumValue(type, Plan_PlanType);
    switch (normalizedType) {
      case Plan_PlanType.FREE:
        return 'FREE';
      case Plan_PlanType.PREMIUM:
        return 'PREMIUM';
      default:
        return 'UNKNOWN';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ko-KR');
  };

  return (
    <div className="contents">
      <div className="page-title">
        <div>
          <h2>플랜 관리</h2>
          <p>서비스 플랜을 생성하고 관리합니다.</p>
        </div>
      </div>

      <div className={styles.container}>
        {/* 좌측: 플랜 목록 */}
        <div className={styles.leftPanel}>
          <div className={styles.leftPanelHeader}>
            <h3>플랜 목록 ({plans.length}개)</h3>
            <button onClick={() => handleOpenModal()} className="dark-gray" 
            style={{ padding: '8px 16px', fontSize: '14px', width: '60px', height: '30px' }}>
              + 추가
            </button>
          </div>
          
          <div className={styles.planList}>
            {loading && <LoadingScreen />}
            {error && <div style={{ padding: '20px', color: 'red' }}>에러: {error}</div>}
            
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`${styles.planRow} ${selectedPlan?.id === plan.id ? styles.selected : ''}`}
                onClick={() => handlePlanClick(plan)}
              >
                <div className={styles.planRowContent}>
                  <div>
                    <div className={styles.planName}>{plan.name ?? ''}</div>
                    <span className={`${styles.planType} ${plan.type === Plan_PlanType.FREE ? styles.free : styles.premium}`}>
                      {getPlanTypeLabel(plan.type)}
                    </span>
                  </div>
                  <div className={styles.planPrice}>
                    {plan.price.toLocaleString()} {plan.currency ?? ''}
                  </div>
                </div>
              </div>
            ))}
            
            {plans.length === 0 && !loading && (
              <div className={styles.emptyState}>
                <p>등록된 플랜이 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* 우측: 플랜 그룹 (PlanSubscription) 테이블 */}
        <div className={styles.rightPanel}>
          <div className={styles.rightPanelHeader}>
            <h3>
              플랜 구독 옵션 
              {selectedPlan && ` - ${selectedPlan.name}`}
              {selectedPlan && ` (${subscriptions.length}개)`}
            </h3>
            {selectedPlan && (
              <button 
                onClick={() => handleOpenSubscriptionModal()} 
                className="dark-gray" 
                style={{ padding: '8px 16px', fontSize: '14px', width: '60px', height: '30px' }}
              >
                + 구독 추가
              </button>
            )}
          </div>
          
          <div className={styles.subscriptionTable}>
            {!selectedPlan ? (
              <div className={styles.emptyState}>
                <p>좌측에서 플랜을 선택하세요.</p>
              </div>
            ) : loadingSubscriptions ? (
              <div className={styles.emptyState}>
                {loading && <LoadingScreen />}
              </div>
            ) : subscriptions.length === 0 ? (
              <div className={styles.emptyState}>
                <p>등록된 플랜 그룹이 없습니다.</p>
                <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                  디버그: subscriptions.length = {subscriptions.length}
                </p>
              </div>
            ) : (
              <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>기간 (개월)</th>
                      <th>총 가격</th>
                      <th>월간 등가</th>
                      <th>절약 금액</th>
                      <th>할인율 (%)</th>
                      <th>우선순위</th>
                      <th>생성일</th>
                      <th>작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((subscription) => {
                      const totalPrice = typeof subscription.totalPrice === 'number' ? subscription.totalPrice : parseInt(subscription.totalPrice) || 0;
                      const monthlyEquivalent = typeof subscription.monthlyEquivalent === 'number' ? subscription.monthlyEquivalent : parseInt(subscription.monthlyEquivalent) || 0;
                      const savingsAmount = typeof subscription.savingsAmount === 'number' ? subscription.savingsAmount : parseInt(subscription.savingsAmount) || 0;
                      const discountRate = typeof subscription.discountRate === 'number' ? subscription.discountRate : parseInt(subscription.discountRate) || 0;
                      const priority = typeof subscription.priority === 'number' ? subscription.priority : parseInt(subscription.priority) || 0;
                      const createdAt = typeof subscription.createdAt === 'number' ? subscription.createdAt : parseInt(subscription.createdAt) || 0;
                      const currency = subscription.plan?.currency || selectedPlan?.currency || 'KRW';
                      
                      return (
                        <tr key={subscription.id || Math.random()}>
                          <td>{subscription.durationMonths || '-'}</td>
                          <td>{totalPrice.toLocaleString()} {currency}</td>
                          <td>{monthlyEquivalent.toLocaleString()} {currency}</td>
                          <td>{savingsAmount.toLocaleString()} {currency}</td>
                          <td>{discountRate}%</td>
                          <td>{priority}</td>
                          <td>{createdAt ? formatDate(createdAt) : '-'}</td>
                          <td>
                            <div className={styles.actionButtons}>
                              <button
                                className={`${styles.button} ${styles.edit}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenSubscriptionModal(subscription);
                                }}
                              >
                                편집
                              </button>
                              <button
                                className={`${styles.button} ${styles.delete}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSubscription(subscription.id);
                                }}
                              >
                                삭제
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingPlan ? '플랜 수정' : '새 플랜 추가'}</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>플랜 이름 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>타입 *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: parseInt(e.target.value) as Plan_PlanType })}
                  required
                >
                  <option value={Plan_PlanType.FREE}>FREE</option>
                  <option value={Plan_PlanType.PREMIUM}>PREMIUM</option>
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>가격 *</label>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      setFormData({ ...formData, price: isNaN(val) ? 0 : val });
                    }}
                    required
                    min="0"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>통화 *</label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>우선순위 *</label>
                <input
                  type="number"
                  value={formData.priority || ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                    setFormData({ ...formData, priority: isNaN(val) ? 0 : val });
                  }}
                  required
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label>설명</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="line gray"
                >
                  취소
                </button>
                <button type="submit" className="dark-gray">
                  {editingPlan ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 플랜 구독 모달 */}
      {showSubscriptionModal && selectedPlan && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{editingSubscription ? '플랜 구독 수정' : '새 플랜 구독 추가'}</h2>
            </div>

            <form onSubmit={handleSubscriptionSubmit}>
              <div className={styles.formGroup}>
                <label>기간 (개월) *</label>
                <input
                  type="text"
                  value={subscriptionFormData.durationMonths}
                  onChange={(e) => setSubscriptionFormData({ ...subscriptionFormData, durationMonths: e.target.value })}
                  required
                  placeholder="예: 1, 3, 6, 12"
                />
              </div>

              <div className={styles.formGroup}>
                <label>총 가격 *</label>
                <input
                  type="number"
                  value={subscriptionFormData.totalPrice || ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                    setSubscriptionFormData({ ...subscriptionFormData, totalPrice: isNaN(val) ? 0 : val });
                  }}
                  required
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label>월간 등가 *</label>
                <input
                  type="number"
                  value={subscriptionFormData.monthlyEquivalent || ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                    setSubscriptionFormData({ ...subscriptionFormData, monthlyEquivalent: isNaN(val) ? 0 : val });
                  }}
                  required
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label>절약 금액 *</label>
                <input
                  type="number"
                  value={subscriptionFormData.savingsAmount || ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                    setSubscriptionFormData({ ...subscriptionFormData, savingsAmount: isNaN(val) ? 0 : val });
                  }}
                  required
                  min="0"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>할인율 (%) *</label>
                  <input
                    type="number"
                    value={subscriptionFormData.discountRate || ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      setSubscriptionFormData({ ...subscriptionFormData, discountRate: isNaN(val) ? 0 : val });
                    }}
                    required
                    min="0"
                    max="100"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>우선순위 *</label>
                  <input
                    type="number"
                    value={subscriptionFormData.priority || ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      setSubscriptionFormData({ ...subscriptionFormData, priority: isNaN(val) ? 0 : val });
                    }}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={handleCloseSubscriptionModal}
                  className="line gray"
                >
                  취소
                </button>
                <button type="submit" className="dark-gray">
                  {editingSubscription ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

