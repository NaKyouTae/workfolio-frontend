import React from 'react';
import { RecordTemplateType, getTemplate } from './recordTemplates';

interface TemplateFieldsProps {
    templateType: RecordTemplateType;
    templateFields: Record<string, string>;
    onTemplateFieldsChange: (fields: Record<string, string>) => void;
}

const TemplateFields: React.FC<TemplateFieldsProps> = ({
    templateType,
    templateFields,
    onTemplateFieldsChange,
}) => {
    const template = getTemplate(templateType);

    if (templateType === 'free' || template.fields.length === 0) {
        return null;
    }

    const handleChange = (key: string, value: string) => {
        onTemplateFieldsChange({ ...templateFields, [key]: value });
    };

    return (
        <>
            {template.fields.map((field) => (
                <li key={field.key} className="template-field">
                    <p>{field.label}{field.required && <span className="required">*</span>}</p>
                    {field.type === 'textarea' ? (
                        <textarea
                            value={templateFields[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            rows={3}
                            required={field.required}
                        />
                    ) : (
                        <input
                            type="text"
                            value={templateFields[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                        />
                    )}
                </li>
            ))}
        </>
    );
};

export default TemplateFields;
