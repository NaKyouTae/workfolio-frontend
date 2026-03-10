export type RecordTemplateType = 'weekly_review' | 'project_review' | 'achievement' | 'daily_log' | 'free';

export interface TemplateField {
    key: string;
    label: string;
    placeholder: string;
    type: 'text' | 'textarea';
    required?: boolean;
}

export interface RecordTemplate {
    type: RecordTemplateType;
    label: string;
    description: string;
    defaultTitle: string;
    isAllDay: boolean;
    fields: TemplateField[];
}

export const RECORD_TEMPLATES: RecordTemplate[] = [
    {
        type: 'weekly_review',
        label: '주간 회고',
        description: '매주 업무를 돌아보는 정기 기록',
        defaultTitle: '',
        isAllDay: true,
        fields: [
            { key: 'done', label: '이번 주 한 일', placeholder: '이번 주에 수행한 주요 업무나 활동을 작성해 주세요.', type: 'textarea', required: true },
            { key: 'problem', label: '문제', placeholder: '겪었던 어려움이나 이슈를 작성해 주세요.', type: 'textarea' },
            { key: 'solution', label: '해결', placeholder: '문제를 어떻게 해결했는지 작성해 주세요.', type: 'textarea' },
            { key: 'achievement', label: '성과', placeholder: '달성한 결과를 작성해 주세요.', type: 'textarea' },
            { key: 'lesson', label: '배운 점', placeholder: '이번 주에 배운 인사이트나 교훈을 작성해 주세요.', type: 'textarea' },
        ],
    },
    {
        type: 'project_review',
        label: '프로젝트 회고',
        description: '프로젝트 단위로 정리하는 기록',
        defaultTitle: '',
        isAllDay: true,
        fields: [
            { key: 'goal', label: '프로젝트 목표', placeholder: '프로젝트가 해결하려던 문제나 목표를 작성해 주세요.', type: 'textarea', required: true },
            { key: 'role', label: '내 역할', placeholder: '담당한 포지션이나 업무 범위를 작성해 주세요.', type: 'textarea', required: true },
            { key: 'problem', label: '문제', placeholder: '프로젝트 중 겪은 문제를 작성해 주세요.', type: 'textarea' },
            { key: 'solution', label: '해결', placeholder: '문제 해결 과정을 작성해 주세요.', type: 'textarea' },
            { key: 'achievement', label: '성과', placeholder: '최종 결과나 수치를 작성해 주세요.', type: 'textarea' },
        ],
    },
    {
        type: 'achievement',
        label: '성과 기록',
        description: '이력서에 바로 쓸 수 있는 단건 성과',
        defaultTitle: '',
        isAllDay: false,
        fields: [
            { key: 'problem', label: '문제', placeholder: '어떤 상황이나 문제였는지 작성해 주세요.', type: 'textarea', required: true },
            { key: 'action', label: '내가 한 일', placeholder: '구체적으로 어떤 행동을 했는지 작성해 주세요.', type: 'textarea', required: true },
            { key: 'result', label: '결과', placeholder: '어떤 변화가 생겼는지 작성해 주세요.', type: 'textarea', required: true },
            { key: 'metric', label: '수치 변화', placeholder: '정량적 성과를 작성해 주세요. (예: 응답속도 30% 개선)', type: 'text' },
        ],
    },
    {
        type: 'daily_log',
        label: '일일 업무 기록',
        description: '매일 간단히 남기는 업무 로그',
        defaultTitle: '',
        isAllDay: true,
        fields: [
            { key: 'done', label: '오늘 한 일', placeholder: '오늘 수행한 업무를 작성해 주세요.', type: 'textarea', required: true },
            { key: 'tomorrow', label: '내일 할 일', placeholder: '내일 예정된 업무를 작성해 주세요.', type: 'textarea' },
            { key: 'issue', label: '이슈', placeholder: '공유가 필요한 이슈를 작성해 주세요.', type: 'textarea' },
        ],
    },
    {
        type: 'free',
        label: '빈 기록',
        description: '자유롭게 작성하는 기록',
        defaultTitle: '',
        isAllDay: false,
        fields: [],
    },
];

export function getTemplate(type: RecordTemplateType): RecordTemplate {
    return RECORD_TEMPLATES.find(t => t.type === type) || RECORD_TEMPLATES[RECORD_TEMPLATES.length - 1];
}

export function buildDescriptionFromFields(template: RecordTemplate, fieldValues: Record<string, string>): string {
    if (template.type === 'free') return fieldValues['description'] || '';

    const sections = template.fields
        .filter(field => fieldValues[field.key]?.trim())
        .map(field => `## ${field.label}\n${fieldValues[field.key].trim()}`);

    return sections.join('\n\n');
}

export function parseDescriptionToFields(template: RecordTemplate, description: string): Record<string, string> {
    if (template.type === 'free') return { description };

    const values: Record<string, string> = {};
    const fieldLabels = template.fields.map(f => f.label);

    for (let i = 0; i < fieldLabels.length; i++) {
        const label = fieldLabels[i];
        const regex = new RegExp(`## ${label}\\n([\\s\\S]*?)(?=\\n## |$)`);
        const match = description.match(regex);
        if (match) {
            values[template.fields[i].key] = match[1].trim();
        }
    }

    return values;
}

export function detectTemplateType(description: string): RecordTemplateType {
    if (!description) return 'free';

    for (const template of RECORD_TEMPLATES) {
        if (template.type === 'free') continue;

        const matchCount = template.fields.filter(field =>
            description.includes(`## ${field.label}`)
        ).length;

        if (matchCount >= 2) return template.type;
    }

    return 'free';
}
