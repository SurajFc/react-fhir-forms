import type { FormEvent, ReactNode } from 'react';
import { ItemRenderer } from '../ItemRenderer';
import { useQuestionnaireCtx } from '../context';
import { useFhirForm } from '../hooks';
import { Button } from './components/button';

export function ShadcnForm({
  submitLabel = 'Submit',
  showSubmit = true,
  children,
}: {
  submitLabel?: string;
  showSubmit?: boolean;
  children?: ReactNode;
}) {
  const { questionnaire } = useQuestionnaireCtx();
  const { submit } = useFhirForm();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {questionnaire.item.map((item) => (
        <ItemRenderer key={item.linkId} item={item} />
      ))}
      {children}
      {showSubmit && (
        <div className="flex justify-end">
          <Button type="submit">{submitLabel}</Button>
        </div>
      )}
    </form>
  );
}
