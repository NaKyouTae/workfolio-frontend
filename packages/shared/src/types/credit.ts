// Credit-related types based on proto definitions

export enum CreditTxType {
    UNKNOWN = 0,
    CHARGE = 1,
    BONUS = 2,
    USE = 3,
    REFUND = 4,
    ADMIN_ADD = 5,
    ADMIN_DEDUCT = 6,
}

export interface CreditHistoryWorker {
    id: string;
    nickName: string;
    email: string;
}

export interface CreditHistory {
    id: string;
    txType: CreditTxType;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    referenceType?: string;
    referenceId?: string;
    description?: string;
    worker?: CreditHistoryWorker;
    createdAt: number;
}

export interface CreditBalanceResponse {
    balance: number;
}

export interface CreditHistoryListResponse {
    creditHistories: CreditHistory[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
}

export interface CreditUseRequest {
    amount: number;
    referenceType?: string;
    referenceId?: string;
    description?: string;
}

export interface CreditUseResponse {
    balanceBefore: number;
    balanceAfter: number;
    amountUsed: number;
    creditHistory: CreditHistory;
}

export interface CreditPlan {
    id: string;
    name: string;
    description?: string;
    price: number;
    baseCredits: number;
    bonusCredits: number;
    totalCredits: number;
    isActive: boolean;
    displayOrder: number;
    isPopular: boolean;
    createdAt: number;
    updatedAt: number;
}

export interface CreditPlanListResponse {
    creditPlans: CreditPlan[];
}

// Helper function to convert txType to Korean label
export function getTxTypeLabel(txType: CreditTxType | string): string {
    const type = typeof txType === 'string' ? txType : CreditTxType[txType];
    switch (type) {
        case 'CHARGE':
            return '충전';
        case 'BONUS':
            return '보너스';
        case 'USE':
            return '사용';
        case 'REFUND':
            return '환불';
        case 'ADMIN_ADD':
            return '관리자 지급';
        case 'ADMIN_DEDUCT':
            return '관리자 차감';
        default:
            return '알 수 없음';
    }
}

// Helper function to determine if txType is positive (add credits)
export function isCreditAddition(txType: CreditTxType | string): boolean {
    const type = typeof txType === 'string' ? txType : CreditTxType[txType];
    return type === 'CHARGE' || type === 'BONUS' || type === 'REFUND' || type === 'ADMIN_ADD';
}
