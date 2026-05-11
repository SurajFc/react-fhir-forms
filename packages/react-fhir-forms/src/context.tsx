import {
  createContext,
  useContext,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { Action } from './reducer';
import type {
  AnswerState,
  Questionnaire,
  QuestionnaireItem,
  ValidationIssue,
} from './types';
import type { RendererRegistry } from './registry';

export interface QuestionnaireCtxValue {
  questionnaire: Questionnaire;
  itemsByLinkId: Record<string, QuestionnaireItem>;
  answers: AnswerState;
  dispatch: Dispatch<Action>;
  issues: ValidationIssue[];
  showErrors: boolean;
  registry: RendererRegistry;
  submit: () => void;
  reset: () => void;
}

const Ctx = createContext<QuestionnaireCtxValue | null>(null);

export function QuestionnaireProvider({
  value,
  children,
}: {
  value: QuestionnaireCtxValue;
  children: ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useQuestionnaireCtx(): QuestionnaireCtxValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error(
      'useQuestionnaire* hooks must be used inside <FhirQuestionnaire> or <FhirProvider>.',
    );
  }
  return ctx;
}

export function indexItemsByLinkId(
  items: QuestionnaireItem[],
): Record<string, QuestionnaireItem> {
  const out: Record<string, QuestionnaireItem> = {};
  const walk = (list: QuestionnaireItem[]) => {
    for (const it of list) {
      out[it.linkId] = it;
      if (it.item) walk(it.item);
    }
  };
  walk(items);
  return out;
}
