import type { ReactNode } from 'react';
import { useFhirIssues } from '../hooks';
import type { QuestionnaireItem } from '../types';
import { tailwindClassNames as cn } from './theme';

export function Field({
  item,
  htmlFor,
  children,
}: {
  item: QuestionnaireItem;
  htmlFor?: string;
  children: ReactNode;
}) {
  const issues = useFhirIssues(item.linkId);
  return (
    <div className={cn.field}>
      {item.text && (
        <label htmlFor={htmlFor} className={cn.label}>
          {item.text}
          {item.required && <span className={cn.required}>*</span>}
        </label>
      )}
      {children}
      {issues.map((i, idx) => (
        <p key={idx} className={cn.error}>
          {i.message}
        </p>
      ))}
    </div>
  );
}

export function fieldId(linkId: string, index = 0): string {
  return `fhir-q-${linkId}-${index}`;
}
