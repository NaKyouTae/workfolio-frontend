'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { WorkerUITemplate, getRemainingDays } from '@workfolio/shared/types/uitemplate';
import HttpMethod from '@workfolio/shared/enums/HttpMethod';
import styles from './TemplateSelectModal.module.css';

interface TemplateSelectModalProps {
  isOpen: boolean;
  type: 'URL' | 'PDF';
  onSelect: (template: WorkerUITemplate) => void;
  onClose: () => void;
}

/** Backend proto JSON → camelCase normalize (minimal) */
function normalizeWorkerTemplate(raw: Record<string, unknown>): WorkerUITemplate {
  const rawUiTemplate = (raw.ui_template ?? raw.uiTemplate) as Record<string, unknown> | undefined;
  return {
    id: String(raw.id ?? ''),
    purchasedAt: Number(raw.purchased_at ?? raw.purchasedAt ?? 0),
    expiredAt: Number(raw.expired_at ?? raw.expiredAt ?? 0),
    creditsUsed: Number(raw.credits_used ?? raw.creditsUsed ?? 0),
    status: String(raw.status ?? 'ACTIVE'),
    isExpired: Boolean(raw.is_expired ?? raw.isExpired ?? false),
    isValid: Boolean(raw.is_valid ?? raw.isValid ?? false),
    isDefault: Boolean(raw.is_default ?? raw.isDefault ?? false),
    templateType: String(raw.template_type ?? raw.templateType ?? ''),
    worker: { id: '', nickName: '', phone: '', email: '', status: 0, createdAt: 0, updatedAt: 0 },
    uiTemplate: rawUiTemplate
      ? {
          id: String(rawUiTemplate.id ?? ''),
          name: String(rawUiTemplate.name ?? ''),
          description: rawUiTemplate.description != null ? String(rawUiTemplate.description) : undefined,
          type: (rawUiTemplate.type as string) ?? '',
          label: rawUiTemplate.label != null ? String(rawUiTemplate.label) : undefined,
          urlPath: rawUiTemplate.url_path != null ? String(rawUiTemplate.url_path) : rawUiTemplate.urlPath != null ? String(rawUiTemplate.urlPath) : undefined,
          thumbnailUrl: rawUiTemplate.thumbnail_url != null ? String(rawUiTemplate.thumbnail_url) : rawUiTemplate.thumbnailUrl != null ? String(rawUiTemplate.thumbnailUrl) : undefined,
          previewImageUrl: rawUiTemplate.preview_image_url != null ? String(rawUiTemplate.preview_image_url) : rawUiTemplate.previewImageUrl != null ? String(rawUiTemplate.previewImageUrl) : undefined,
          isActive: Boolean(rawUiTemplate.is_active ?? rawUiTemplate.isActive ?? true),
          displayOrder: Number(rawUiTemplate.display_order ?? rawUiTemplate.displayOrder ?? 0),
          createdAt: Number(rawUiTemplate.created_at ?? rawUiTemplate.createdAt ?? 0),
          updatedAt: Number(rawUiTemplate.updated_at ?? rawUiTemplate.updatedAt ?? 0),
        }
      : { id: '', name: '', type: '', isActive: false, displayOrder: 0, createdAt: 0, updatedAt: 0 },
    createdAt: Number(raw.created_at ?? raw.createdAt ?? 0),
    updatedAt: Number(raw.updated_at ?? raw.updatedAt ?? 0),
  };
}

const TemplateSelectModal: React.FC<TemplateSelectModalProps> = ({
  isOpen,
  type,
  onSelect,
  onClose,
}) => {
  const [templates, setTemplates] = useState<WorkerUITemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/ui-templates/my/active?type=${type}`, {
        method: HttpMethod.GET,
      });
      if (response.ok) {
        const data = await response.json();
        const rawList = data.worker_ui_templates ?? data.workerUiTemplates ?? [];
        setTemplates(Array.isArray(rawList) ? rawList.map(normalizeWorkerTemplate) : []);
      }
    } catch (err) {
      console.error('Error fetching active templates:', err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    if (isOpen) {
      setSelectedId(null);
      fetchTemplates();
    }
  }, [isOpen, fetchTemplates]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const title = type === 'PDF' ? 'PDF 템플릿 선택' : 'URL 템플릿 선택';
  const description = '기본 템플릿으로 설정하고 사용합니다.';

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.body}>
          {loading ? (
            <div className={styles.loading}>불러오는 중...</div>
          ) : templates.length === 0 ? (
            <div className={styles.empty}>사용 가능한 템플릿이 없습니다.</div>
          ) : (
            <ul className={styles.list}>
              {templates.map((wt) => (
                <li key={wt.id}>
                  <label
                    className={`${styles.templateItem} ${selectedId === wt.id ? styles.templateItemSelected : ''}`}
                  >
                    <input
                      type="radio"
                      name="template"
                      className={styles.radio}
                      checked={selectedId === wt.id}
                      onChange={() => setSelectedId(wt.id)}
                    />
                    <div className={styles.templateInfo}>
                      <div className={styles.templateRow}>
                        <span className={styles.templateName}>
                          {wt.uiTemplate.label || wt.uiTemplate.name}
                        </span>
                        <span className={styles.templateRemaining}>
                          {getRemainingDays(wt.expiredAt)}일 남음
                        </span>
                      </div>
                      {wt.uiTemplate.description && (
                        <p className={styles.templateDescription}>
                          {wt.uiTemplate.description}
                        </p>
                      )}
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            취소
          </button>
          <button
            type="button"
            className={styles.selectButton}
            disabled={!selectedId}
            onClick={() => {
              const selected = templates.find((wt) => wt.id === selectedId);
              if (selected) onSelect(selected);
            }}
          >
            선택
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectModal;
