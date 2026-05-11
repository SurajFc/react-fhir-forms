import type { FormEvent, ReactNode } from 'react';
import { ItemRenderer } from '../ItemRenderer';
import { useFhirForm } from '../hooks';
import { useQuestionnaireCtx } from '../context';
import { tailwindClassNames as cn } from './theme';

/**
 * Default `<form>` wrapper paired with the Tailwind renderers. Pass as
 * `<FhirQuestionnaire>`'s child to get a styled form + submit button.
 */
export function TailwindForm({
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
    <form onSubmit={handleSubmit} className={cn.form} noValidate>
      {questionnaire.item.map((item) => (
        <ItemRenderer key={item.linkId} item={item} />
      ))}
      {children}
      {showSubmit && (
        <div className={cn.actions}>
          <button type="submit" className={cn.submit}>
            {submitLabel}
          </button>
        </div>
      )}
    </form>
  );
}
