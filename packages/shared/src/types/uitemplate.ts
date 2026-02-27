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

export enum UITemplateImageType {
    THUMBNAIL = 'THUMBNAIL',
    DETAIL = 'DETAIL',
}

export interface UITemplateImage {
    id: string;
    imageType: UITemplateImageType | string;
    imageUrl: string;
    displayOrder: number;
    createdAt: number;
    updatedAt: number;
}

export interface UITemplate {
    id: string;
    name: string;
    description?: string;
    type: UITemplateType | string;
    label?: string;
    urlPath?: string;
    previewImageUrl?: string;
    thumbnailUrl?: string;
    isActive: boolean;
    displayOrder: number;
    plans?: UiTemplatePlan[];
    images?: UITemplateImage[];
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

// Admin Plan CRUD request types
export interface AdminUiTemplatePlanCreateRequest {
    durationDays: number;
    price: number;
    displayOrder: number;
}

export interface AdminUiTemplatePlanUpdateRequest {
    id: string;
    durationDays: number;
    price: number;
    displayOrder: number;
}

// Admin API types
export interface AdminUITemplateCreateRequest {
    name: string;
    description?: string;
    type: string;
    label?: string;
    urlPath?: string;
    isActive: boolean;
    displayOrder: number;
}

export interface AdminUITemplateUpdateRequest extends AdminUITemplateCreateRequest {
    id: string;
}

export interface AdminUITemplateImageListResponse {
    images: UITemplateImage[];
}

// Helper functions
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
