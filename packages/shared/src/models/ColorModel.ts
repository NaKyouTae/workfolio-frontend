import { RecordGroupColor } from '../enums/RecordGroupColor';

export interface ColorOption {
    value: RecordGroupColor;
    label: string;
    hex: string;
}

export const recordGroupColors: ColorOption[] = [
    { value: RecordGroupColor.RED, label: '빨강', hex: '#FF3B30' },
    { value: RecordGroupColor.ORANGE, label: '주황', hex: '#FF9500' },
    { value: RecordGroupColor.YELLOW, label: '노랑', hex: '#FFCC00' },
    { value: RecordGroupColor.GREEN, label: '초록', hex: '#34C759' },
    { value: RecordGroupColor.MINT, label: '민트', hex: '#00C7BE' },
    { value: RecordGroupColor.TEAL, label: '청록', hex: '#30B0C7' },
    { value: RecordGroupColor.CYAN, label: '시안', hex: '#32ADE6' },
    { value: RecordGroupColor.BLUE, label: '파랑', hex: '#007AFF' },
    { value: RecordGroupColor.INDIGO, label: '남색', hex: '#5856D6' },
    { value: RecordGroupColor.PURPLE, label: '보라', hex: '#AF52DE' },
    { value: RecordGroupColor.PINK, label: '분홍', hex: '#FF2D55' },
    { value: RecordGroupColor.BROWN, label: '갈색', hex: '#A2845E' }
];

