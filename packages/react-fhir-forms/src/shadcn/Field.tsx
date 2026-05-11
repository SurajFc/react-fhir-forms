import type { ReactNode } from 'react';
import { useFhirIssues } from '../hooks';
import type { QuestionnaireItem } from '../types';
import { Label } from './components/label';
import { cn } from './lib/cn';

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
    <div className="space-y-2">
      {item.text && (
        <Label htmlFor={htmlFor}>
          {item.text}
          {item.required && (
            <span className="ml-1 text-destructive">*</span>
          )}
        </Label>
      )}
      {children}
      {issues.map((i, idx) => (
        <p key={idx} className={cn('text-xs text-destructive')}>
          {i.message}
        </p>
      ))}
    </div>
  );
}

export function fieldId(linkId: string, index = 0): string {
  return `fhir-q-${linkId}-${index}`;
}
