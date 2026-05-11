import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { QuestionnaireProvider, indexItemsByLinkId } from './context';
import { buildResponse } from './buildResponse';
import { reducer } from './reducer';
import { ItemRenderer } from './ItemRenderer';
import type { RendererRegistry } from './registry';
import type {
  AnswerState,
  Questionnaire,
  QuestionnaireResponse,
} from './types';
import { validate } from './validate';

export interface FhirQuestionnaireProps {
  questionnaire: Questionnaire;
  initialAnswers?: AnswerState;
  /** Registry of renderers keyed by item type. Required to render anything — pass a recipe (e.g. `tailwindRenderers`) or your own. */
  components?: RendererRegistry;
  /** Replace the default `<form>` wrapper. Useful for custom layouts. */
  children?: ReactNode;
  onChange?: (answers: AnswerState) => void;
  onSubmit?: (response: QuestionnaireResponse, answers: AnswerState) => void;
}

export function FhirQuestionnaire({
  questionnaire,
  initialAnswers,
  components,
  children,
  onChange,
  onSubmit,
}: FhirQuestionnaireProps) {
  const [answers, dispatch] = useReducer(reducer, initialAnswers ?? {});
  const [showErrors, setShowErrors] = useState(false);

  const issues = useMemo(
    () => validate(questionnaire.item, answers),
    [questionnaire, answers],
  );

  useEffect(() => {
    onChange?.(answers);
  }, [answers, onChange]);

  const itemsByLinkId = useMemo(
    () => indexItemsByLinkId(questionnaire.item),
    [questionnaire],
  );

  const submit = useCallback(() => {
    if (issues.length > 0) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    onSubmit?.(buildResponse(questionnaire, answers, 'completed'), answers);
  }, [issues, onSubmit, questionnaire, answers]);

  const reset = useCallback(() => {
    dispatch({ type: 'reset', state: initialAnswers ?? {} });
    setShowErrors(false);
  }, [initialAnswers]);

  const registry: RendererRegistry = components ?? {};

  const ctxValue = useMemo(
    () => ({
      questionnaire,
      itemsByLinkId,
      answers,
      dispatch,
      issues,
      showErrors,
      registry,
      submit,
      reset,
    }),
    [questionnaire, itemsByLinkId, answers, issues, showErrors, registry, submit, reset],
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  return (
    <QuestionnaireProvider value={ctxValue}>
      {children ?? (
        <form onSubmit={handleSubmit} noValidate>
          {questionnaire.item.map((item) => (
            <ItemRenderer key={item.linkId} item={item} />
          ))}
        </form>
      )}
    </QuestionnaireProvider>
  );
}
