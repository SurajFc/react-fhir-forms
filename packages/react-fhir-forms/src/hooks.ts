import { useCallback, useMemo } from 'react';
import { useQuestionnaireCtx } from './context';
import type { AnswerValue, Coding, ValidationIssue } from './types';
import { isEnabled } from './enableWhen';

export function useFhirEnabled(linkId: string): boolean {
  const { answers, itemsByLinkId } = useQuestionnaireCtx();
  const item = itemsByLinkId[linkId];
  if (!item) return true;
  return isEnabled(item, answers);
}

export function useFhirIssues(linkId: string): ValidationIssue[] {
  const { issues, showErrors } = useQuestionnaireCtx();
  if (!showErrors) return [];
  return issues.filter((i) => i.linkId === linkId);
}

export interface FhirAnswerHandle {
  values: AnswerValue[];
  setValues: (values: AnswerValue[]) => void;
  addValue: (value: AnswerValue) => void;
  removeAt: (index: number) => void;
  clear: () => void;
}

export function useFhirAnswer(linkId: string): FhirAnswerHandle {
  const { answers, dispatch } = useQuestionnaireCtx();
  const values = answers[linkId] ?? [];

  const setValues = useCallback(
    (next: AnswerValue[]) => dispatch({ type: 'set', linkId, values: next }),
    [dispatch, linkId],
  );
  const addValue = useCallback(
    (value: AnswerValue) => dispatch({ type: 'add', linkId, value }),
    [dispatch, linkId],
  );
  const removeAt = useCallback(
    (index: number) => dispatch({ type: 'removeAt', linkId, index }),
    [dispatch, linkId],
  );
  const clear = useCallback(
    () => dispatch({ type: 'clear', linkId }),
    [dispatch, linkId],
  );

  return { values, setValues, addValue, removeAt, clear };
}

// Typed single-value helpers — covers the common case of one-answer items.

function typedScalar<K extends AnswerValue['kind'], T>(
  kind: K,
  read: (a: Extract<AnswerValue, { kind: K }>) => T,
  build: (value: T) => Extract<AnswerValue, { kind: K }>,
) {
  return function useTyped(linkId: string): {
    value: T | null;
    setValue: (v: T | null) => void;
  } {
    const { values, setValues } = useFhirAnswer(linkId);
    const first = values[0];
    const value =
      first && first.kind === kind ? read(first as Extract<AnswerValue, { kind: K }>) : null;
    const setValue = useCallback(
      (v: T | null) => setValues(v === null || v === undefined ? [] : [build(v)]),
      [setValues],
    );
    return { value, setValue };
  };
}

export const useFhirStringAnswer = typedScalar(
  'string',
  (a) => a.value,
  (value: string) => ({ kind: 'string', value }),
);
export const useFhirIntegerAnswer = typedScalar(
  'integer',
  (a) => a.value,
  (value: number) => ({ kind: 'integer', value }),
);
export const useFhirDecimalAnswer = typedScalar(
  'decimal',
  (a) => a.value,
  (value: number) => ({ kind: 'decimal', value }),
);
export const useFhirBooleanAnswer = typedScalar(
  'boolean',
  (a) => a.value,
  (value: boolean) => ({ kind: 'boolean', value }),
);
export const useFhirDateAnswer = typedScalar(
  'date',
  (a) => a.value,
  (value: string) => ({ kind: 'date', value }),
);
export const useFhirDateTimeAnswer = typedScalar(
  'dateTime',
  (a) => a.value,
  (value: string) => ({ kind: 'dateTime', value }),
);

function codingKey(c: Coding): string {
  return `${c.system ?? ''}|${c.code}`;
}

export function useFhirCodingAnswer(linkId: string): {
  value: Coding | null;
  setValue: (v: Coding | null) => void;
  values: Coding[];
  toggle: (v: Coding) => void;
  has: (v: Coding) => boolean;
} {
  const { values, setValues } = useFhirAnswer(linkId);
  const codings = useMemo(
    () =>
      values
        .filter((a): a is Extract<AnswerValue, { kind: 'coding' }> => a.kind === 'coding')
        .map((a) => a.value),
    [values],
  );

  const setValue = useCallback(
    (v: Coding | null) =>
      setValues(v ? [{ kind: 'coding', value: v }] : []),
    [setValues],
  );

  const toggle = useCallback(
    (v: Coding) => {
      const key = codingKey(v);
      const without = values.filter(
        (a) => !(a.kind === 'coding' && codingKey(a.value) === key),
      );
      const wasPresent = without.length !== values.length;
      setValues(wasPresent ? without : [...values, { kind: 'coding', value: v }]);
    },
    [setValues, values],
  );

  const has = useCallback(
    (v: Coding) => codings.some((c) => codingKey(c) === codingKey(v)),
    [codings],
  );

  return { value: codings[0] ?? null, setValue, values: codings, toggle, has };
}

// Top-level form handle for consumers writing their own form wrapper.
export function useFhirForm() {
  const ctx = useQuestionnaireCtx();
  return {
    answers: ctx.answers,
    issues: ctx.issues,
    showErrors: ctx.showErrors,
    visibleItems: ctx.questionnaire.item.filter((item) => isEnabled(item, ctx.answers)),
    questionnaire: ctx.questionnaire,
    submit: ctx.submit,
    reset: ctx.reset,
  };
}
