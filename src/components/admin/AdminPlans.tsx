'use client';

import { useEffect, useState } from 'react';
import { usePlans } from '@/hooks/usePlans';
import { PlanCreateRequest, PlanUpdateRequest } from '@/generated/plan';
import { Plan_PlanType, Plan } from '@/generated/common';
import { normalizeEnumValue } from '@/utils/commonUtils';

export default function AdminPlans() {
  const { plans, loading, error, fetchPlans, createPlan, updatePlan, deletePlan } = usePlans();
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | undefined>(undefined);
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

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await deletePlan(id);
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

  return (
    <div className="contents">
      <div className="page-title">
        <div>
          <h2>플랜 관리</h2>
          <p>서비스 플랜을 생성하고 관리합니다.</p>
        </div>
      </div>

      <div className="page-cont">
        <div className="cont-box">
          <div className="cont-tit">
            <div>
              <h3>전체 플랜 ({plans.length}개)</h3>
            </div>
            <button onClick={() => handleOpenModal()}>
              + 새 플랜 추가
            </button>
          </div>

        {loading && <div>로딩 중...</div>}
        {error && <div style={{ color: 'red' }}>에러: {error}</div>}

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>이름</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>타입</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>가격</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>우선순위</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>설명</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>작업</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{plan.name ?? ''}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: plan.type === Plan_PlanType.FREE ? '#e3f2fd' : '#f3e5f5',
                    color: plan.type === Plan_PlanType.FREE ? '#1976d2' : '#7b1fa2',
                  }}>
                    {getPlanTypeLabel(plan.type)}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  {plan.price.toLocaleString()} {plan.currency ?? ''}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{plan.priority}</td>
                <td style={{ padding: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {plan.description || '-'}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button 
                    className="line gray"
                    onClick={() => handleOpenModal(plan)}
                    style={{ marginRight: '8px' }}
                  >
                    편집
                  </button>
                  <button 
                    className="line red"
                    onClick={() => handleDelete(plan.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {plans.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            등록된 플랜이 없습니다.
          </div>
        )}
        </div>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '90%',
            maxWidth: '500px',
          }}>
            <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: '700' }}>
              {editingPlan ? '플랜 수정' : '새 플랜 추가'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  플랜 이름 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  타입 *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: parseInt(e.target.value) as Plan_PlanType })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                  }}
                >
                  <option value={Plan_PlanType.FREE}>FREE</option>
                  <option value={Plan_PlanType.PREMIUM}>PREMIUM</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    가격 *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    통화 *
                  </label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  우선순위 *
                </label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
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
    </div>
  );
}

