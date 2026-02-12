// src/models/DateModel.ts
export interface DateModel {
    id: string;
    year: number;
    month: number; // 0부터 11까지 (0 = 1월, 11 = 12월)
    day: number; // 1부터 31까지
    isCurrentMonth: boolean;
}

export const createDateModel = (year: number, month: number, day: number, isCurrentMonth: boolean): DateModel => {
    const id = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`
    return { id, year, month, day, isCurrentMonth };
};
