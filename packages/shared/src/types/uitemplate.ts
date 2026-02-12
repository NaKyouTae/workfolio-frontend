// UITemplate-related types based on proto definitions

export enum UITemplateType {
    UNKNOWN = 0,
    URL = 1,
    PDF = 2,
}

/** 템플릿 이용 기간 옵션 (1/3/6/9/12개월 등) */
export interface UiTemplatePlan {
    id: string;
    durationDays: number;
    price: number;
    displayOrder: number;
}

export interface UITemplate {
    id: string;
    name: string;
    description?: string;
    type: UITemplateType | string;
    price: number;
    durationDays: number;
    urlPath?: string;
    previewImageUrl?: string;
    thumbnailUrl?: string;
    isActive: boolean;
    isPopular: boolean;
    displayOrder: number;
    /** 이용 기간별 가격 (1/3/6/9/12개월). 없으면 template.price/durationDays 사용 */
    plans?: UiTemplatePlan[];
    createdAt: number;
    updatedAt: number;
}

export interface Worker {
    id: string;
    nickName: string;
    phone: string;
    email: string;
    birthDate?: number;
    gender?: number;
    status: number;
    createdAt: number;
    updatedAt: number;
}

export interface WorkerUITemplate {
    id: string;
    purchasedAt: number;
    expiredAt: number;
    creditsUsed: number;
    isActive: boolean;
    isExpired: boolean;
    isValid: boolean;
    worker: Worker;
    uiTemplate: UITemplate;
    createdAt: number;
    updatedAt: number;
}

// API Response types
export interface UITemplateListResponse {
    uiTemplates: UITemplate[];
}

export interface UITemplateGetResponse {
    uiTemplate: UITemplate;
}

export interface WorkerUITemplateListResponse {
    workerUiTemplates: WorkerUITemplate[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
}

export interface WorkerUITemplateGetResponse {
    workerUiTemplate: WorkerUITemplate;
}

export interface UITemplatePurchaseRequest {
    uiTemplateId: string;
    /** 이용 기간 플랜 ID (선택 시 해당 기간·가격으로 결제) */
    planId?: string;
}

export interface UITemplatePurchaseResponse {
    workerUiTemplate: WorkerUITemplate;
    creditsUsed: number;
    balanceAfter: number;
}

export interface UITemplateOwnershipResponse {
    ownsUiTemplate: boolean;
    workerUiTemplate?: WorkerUITemplate;
}

export interface ActiveUITemplatesResponse {
    workerUiTemplates: WorkerUITemplate[];
}

// Helper functions
export function getUITemplateTypeLabel(type: UITemplateType | string): string {
    const typeValue = typeof type === 'string' ? type : UITemplateType[type];
    switch (typeValue) {
        case 'URL':
            return 'URL 템플릿';
        case 'PDF':
            return 'PDF 템플릿';
        default:
            return '알 수 없음';
    }
}

export function getUITemplateTypeValue(type: UITemplateType | string): string {
    if (typeof type === 'string') {
        return type;
    }
    return UITemplateType[type];
}

export function formatDuration(days: number): string {
    if (days >= 365) {
        const years = Math.floor(days / 365);
        return `${years}년`;
    }
    if (days >= 30) {
        const months = Math.floor(days / 30);
        return `${months}개월`;
    }
    return `${days}일`;
}

export function isUITemplateExpired(expiredAt: number): boolean {
    return Date.now() > expiredAt;
}

export function getRemainingDays(expiredAt: number): number {
    const remaining = expiredAt - Date.now();
    if (remaining <= 0) return 0;
    return Math.ceil(remaining / (1000 * 60 * 60 * 24));
}
