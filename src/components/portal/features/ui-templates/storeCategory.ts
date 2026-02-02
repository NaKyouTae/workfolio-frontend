/** 스토어 좌측 메뉴 카테고리 */
export type StoreCategory = 'all' | 'URL' | 'PDF';

export const STORE_MENU: { id: StoreCategory; label: string }[] = [
    { id: 'all', label: '전체' },
    { id: 'URL', label: 'URL 템플릿' },
    { id: 'PDF', label: 'PDF 템플릿' },
];
