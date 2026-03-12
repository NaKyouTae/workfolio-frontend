import { Record as RecordProto } from '@workfolio/shared/generated/common';
import { ResumeUpdateRequest_ProjectRequest } from '@workfolio/shared/generated/resume';
import { parseDescriptionToFields, getTemplate, detectTemplateType } from '../../records/templates/recordTemplates';

interface ProjectRecordGroup {
    title: string;
    records: RecordProto[];
}

export function convertRecordsToProject(
    group: ProjectRecordGroup,
    selectedRecordIds: string[],
    priority: number,
): ResumeUpdateRequest_ProjectRequest {
    const selectedRecords = group.records.filter(r => selectedRecordIds.includes(r.id));

    // Find overview record
    const overviewRecord = selectedRecords.find(r => {
        const templateType = r.templateType || detectTemplateType(r.description);
        return templateType === 'project_overview';
    });

    // Find task records
    const taskRecords = selectedRecords.filter(r => {
        const templateType = r.templateType || detectTemplateType(r.description);
        return templateType === 'task';
    });

    // Find review record
    const reviewRecord = selectedRecords.find(r => {
        const templateType = r.templateType || detectTemplateType(r.description);
        return templateType === 'project_review_v2';
    });

    // Extract overview fields
    const overviewFields = overviewRecord
        ? parseDescriptionToFields(getTemplate('project_overview'), overviewRecord.description)
        : {};

    // Build description
    const description = buildProjectDescription(overviewFields, taskRecords, reviewRecord);

    // Calculate date range
    const allDates = selectedRecords.flatMap(r => [r.startedAt, r.endedAt]).filter(d => d > 0);
    const startedAt = allDates.length > 0 ? Math.min(...allDates) : undefined;
    const endedAt = allDates.length > 0 ? Math.max(...allDates) : undefined;

    return {
        title: group.title,
        affiliation: overviewFields.team || '',
        role: overviewFields.role || '',
        description,
        startedAt,
        endedAt,
        isVisible: true,
        priority,
    };
}

function buildProjectDescription(
    overview: Record<string, string>,
    taskRecords: RecordProto[],
    reviewRecord: RecordProto | undefined,
): string {
    const lines: string[] = [];

    // Service description + tech stack
    if (overview.service) lines.push(overview.service);
    if (overview.tech) lines.push(`기술: ${overview.tech}`);
    if (lines.length > 0) lines.push('');

    // Task bullets
    for (const task of taskRecords) {
        const fields = parseDescriptionToFields(getTemplate('task'), task.description);
        let bullet = `• ${task.title}`;
        if (fields.content) bullet += `\n  ${fields.content}`;
        if (fields.process) bullet += `\n  ${fields.process}`;
        if (fields.result) bullet += `\n  성과: ${fields.result}`;
        lines.push(bullet);
    }

    // Final achievement from review
    if (reviewRecord) {
        const reviewFields = parseDescriptionToFields(getTemplate('project_review_v2'), reviewRecord.description);
        if (reviewFields.achievement) {
            lines.push('');
            lines.push(`최종 성과: ${reviewFields.achievement}`);
        }
    }

    return lines.join('\n');
}
