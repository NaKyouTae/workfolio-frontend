'use client';

import { useEffect, useState } from 'react';
import { usePlanFeatures } from '@workfolio/shared/hooks/usePlanFeatures';
import { usePlans } from '@workfolio/shared/hooks/usePlans';
import { useFeatures } from '@workfolio/shared/hooks/useFeatures';
import { PlanFeatureCreateRequest, PlanFeatureUpdateRequest } from '@workfolio/shared/generated/plan_feature';
import { Plan_PlanType, PlanFeature } from '@workfolio/shared/generated/common';
import { normalizeEnumValue } from '@workfolio/shared/utils/commonUtils';
import LoadingScreen from '@workfolio/shared/ui/LoadingScreen';

export default function AdminPlanFeatures() {
  const { planFeatures, loading, error, fetchPlanFeatures, createPlanFeature, updatePlanFeature, deletePlanFeature } = usePlanFeatures();
  const { plans, fetchPlans } = usePlans();
  const { features, fetchFeatures } = useFeatures();
  const [showModal, setShowModal] = useState(false);
  const [editingPlanFeature, setEditingPlanFeature] = useState<PlanFeature | null>(null);
  const [filterPlanId, setFilterPlanId] = useState<string>('');
  const [filterFeatureId, setFilterFeatureId] = useState<string>('');
  const [formData, setFormData] = useState({
    planId: '',
    featureId: '',
    limitCount: -1,
    description: '',
  });

  useEffect(() => {
    fetchPlans();
    fetchFeatures();
  }, [fetchPlans, fetchFeatures]);

  useEffect(() => {
    fetchPlanFeatures(
      filterPlanId || undefined,
      filterFeatureId || undefined
    );
  }, [fetchPlanFeatures, filterPlanId, filterFeatureId]);

  const handleOpenModal = (planFeature?: PlanFeature) => {
    if (planFeature) {
      setEditingPlanFeature(planFeature);
      setFormData({
        planId: planFeature.plan?.id || '',
        featureId: planFeature.feature?.id ?? '',
        limitCount: planFeature.limitCount,
        description: planFeature.description || '',
      });
    } else {
      setEditingPlanFeature(null);
      setFormData({
        planId: '',
        featureId: '',
        limitCount: -1,
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlanFeature(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success = false;
    if (editingPlanFeature) {
      const request: PlanFeatureUpdateRequest = {
        id: editingPlanFeature.id,
        ...formData,
      };
      success = await updatePlanFeature(request);
    } else {
      const request: PlanFeatureCreateRequest = formData;
      success = await createPlanFeature(request);
    }

    if (success) {
      handleCloseModal();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await deletePlanFeature(id);
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

  const getLimitCountLabel = (limitCount: number) => {
    return limitCount === -1 ? '무제한' : `${limitCount}회`;
  };

  return (
    <div className="contents">
      <div className="page-title">
        <div>
          <h2>플랜-기능 관리</h2>
          <p>플랜에 기능을 연결하고 사용 제한을 설정합니다.</p>
        </div>
      </div>

      <div className="page-cont">
        <div className="cont-box">
          <div className="cont-tit">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h3>플랜-기능 연결 ({planFeatures.length}개)</h3>
              <select
                value={filterPlanId}
                onChange={(e) => setFilterPlanId(e.target.value)}
              >
                <option value="">전체 플랜</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>{plan.name ?? ''}</option>
                ))}
              </select>
              <select
                value={filterFeatureId}
                onChange={(e) => setFilterFeatureId(e.target.value)}
              >
                <option value="">전체 기능</option>
                {features.map((feature) => (
                  <option key={feature.id} value={feature.id}>{feature.name ?? ''}</option>
                ))}
              </select>
            </div>
            <button onClick={() => handleOpenModal()}>
              + 새 연결 추가
            </button>
          </div>

          {loading && <LoadingScreen />}
        {error && <div style={{ color: 'red' }}>에러: {error}</div>}

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>플랜</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>타입</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>기능</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>도메인</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>설명</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>사용 제한</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>작업</th>
            </tr>
          </thead>
          <tbody>
            {planFeatures.map((planFeature) => (
              <tr key={planFeature.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{planFeature.plan?.name ?? ''}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: planFeature.plan?.type === Plan_PlanType.FREE ? '#e3f2fd' : '#f3e5f5',
                    color: planFeature.plan?.type === Plan_PlanType.FREE ? '#1976d2' : '#7b1fa2',
                  }}>
                    {getPlanTypeLabel(planFeature.plan?.type || Plan_PlanType.UNKNOWN)}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{planFeature.feature?.name ?? ''}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: '#e8f5e9',
                    color: '#2e7d32',
                  }}>
                    {planFeature.feature?.domain ?? ''}
                  </span>
                </td>
                <td style={{ padding: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {planFeature.description || '-'}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: planFeature.limitCount === -1 ? '#fff3e0' : '#e1f5fe',
                    color: planFeature.limitCount === -1 ? '#e65100' : '#01579b',
                  }}>
                    {getLimitCountLabel(planFeature.limitCount)}
                  </span>
                </td>
                <td style={{ padding: '4px 8px', textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'right',
                  alignItems: 'center',
                  gap: '8px',
                 }}>
                  <button
                    className="line gray"
                    onClick={() => handleOpenModal(planFeature)}
                    style={{ width: '60px', height: '30px' }}
                  >
                    편집
                  </button>
                  <button
                    className="line red"
                    onClick={() => handleDelete(planFeature.id)}
                    style={{ width: '60px', height: '30px' }}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {planFeatures.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            등록된 플랜-기능 연결이 없습니다.
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
              {editingPlanFeature ? '플랜-기능 연결 수정' : '새 플랜-기능 연결'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  플랜 *
                </label>
                <select
                  value={formData.planId}
                  onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                  required
                  disabled={!!editingPlanFeature}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    background: editingPlanFeature ? '#f5f5f5' : 'white',
                  }}
                >
                  <option value="">플랜 선택</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} ({getPlanTypeLabel(plan.type)})
                    </option>
                  ))}
                </select>
                {editingPlanFeature && (
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    * 수정 시에는 플랜을 변경할 수 없습니다.
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  기능 *
                </label>
                <select
                  value={formData.featureId}
                  onChange={(e) => setFormData({ ...formData, featureId: e.target.value })}
                  required
                  disabled={!!editingPlanFeature}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    background: editingPlanFeature ? '#f5f5f5' : 'white',
                  }}
                >
                  <option value="">기능 선택</option>
                  {features.map((feature) => (
                    <option key={feature.id} value={feature.id}>
                      {feature.name} ({feature.domain})
                    </option>
                  ))}
                </select>
                {editingPlanFeature && (
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                    * 수정 시에는 기능을 변경할 수 없습니다.
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  사용 제한 *
                </label>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="number"
                    value={formData.limitCount}
                    onChange={(e) => setFormData({ ...formData, limitCount: parseInt(e.target.value) })}
                    required
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, limitCount: -1 })}
                    style={{
                      padding: '10px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      background: formData.limitCount === -1 ? '#667eea' : 'white',
                      color: formData.limitCount === -1 ? 'white' : '#333',
                      cursor: 'pointer',
                      fontWeight: '600',
                      width: '100px',
                    }}
                  >
                    무제한
                  </button>
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  * -1은 무제한을 의미합니다.
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="플랜-기능 연결에 대한 설명을 입력하세요"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
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
                  {editingPlanFeature ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
