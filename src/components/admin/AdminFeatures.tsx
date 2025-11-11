'use client';

import { useEffect, useState } from 'react';
import { useFeatures } from '@/hooks/useFeatures';
import { FeatureCreateRequest, FeatureUpdateRequest } from '@/generated/feature';
import { Feature } from '@/generated/common';
import styles from '@/app/admin/dashboard/dashboard.module.css';

export default function AdminFeatures() {
  const { features, loading, error, fetchFeatures, createFeature, updateFeature, deleteFeature } = useFeatures();
  const [showModal, setShowModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | undefined>(undefined);
  const [filterDomain, setFilterDomain] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    action: '',
  });

  useEffect(() => {
    fetchFeatures(filterDomain || undefined);
  }, [fetchFeatures, filterDomain]);

  const handleOpenModal = (feature?: Feature | undefined) => {
    if (feature) {
      setEditingFeature(feature);
      setFormData({
        name: feature.name,
        domain: feature.domain,
        action: feature.action,
      });
    } else {
      setEditingFeature(undefined);
      setFormData({
        name: '',
        domain: '',
        action: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFeature(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;
    if (editingFeature) {
      const request: FeatureUpdateRequest = {
        id: editingFeature.id,
        ...formData,
      };
      success = await updateFeature(request);
    } else {
      const request: FeatureCreateRequest = formData;
      success = await createFeature(request);
    }

    if (success) {
      handleCloseModal();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await deleteFeature(id);
    }
  };

  // 도메인 목록 추출
  const domains = Array.from(new Set(features.map(f => f.domain))).filter(Boolean);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1>기능 관리</h1>
        <p>서비스 기능을 생성하고 관리합니다.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2>전체 기능 ({features.length}개)</h2>
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            >
              <option value="">전체 도메인</option>
              {domains.map((domain) => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
          <button className={styles.button} onClick={() => handleOpenModal()}>
            + 새 기능 추가
          </button>
        </div>

        {loading && <div>로딩 중...</div>}
        {error && <div style={{ color: 'red' }}>에러: {error}</div>}

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>기능명</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>도메인</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>액션</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>작업</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{feature.name ?? ''}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: '#e8f5e9',
                    color: '#2e7d32',
                  }}>
                    {feature.domain ?? ''}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{feature.action ?? ''}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button 
                    className={styles.buttonSecondary} 
                    onClick={() => handleOpenModal(feature)}
                    style={{ marginRight: '8px' }}
                  >
                    편집
                  </button>
                  <button 
                    className={styles.buttonDanger} 
                    onClick={() => handleDelete(feature.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {features.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            등록된 기능이 없습니다.
          </div>
        )}
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
              {editingFeature ? '기능 수정' : '새 기능 추가'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  기능명 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="예) 이력서 생성"
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
                  도메인 *
                </label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  required
                  placeholder="예) resume"
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
                  액션 *
                </label>
                <input
                  type="text"
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                  required
                  placeholder="예) create"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '10px 24px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    background: 'white',
                    cursor: 'pointer',
                  }}
                >
                  취소
                </button>
                <button type="submit" className={styles.button}>
                  {editingFeature ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

