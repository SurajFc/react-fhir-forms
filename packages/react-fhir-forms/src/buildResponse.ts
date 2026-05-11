import { isEnabled } from './enableWhen';
import type {
  AnswerState,
  AnswerValue,
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireResponse,
  QuestionnaireResponseAnswer,
  QuestionnaireResponseItem,
} from './types';

function answerToFhir(a: AnswerValue): QuestionnaireResponseAnswer {
  switch (a.kind) {
    case 'string':
      return { valueString: a.value };
    case 'integer':
      return { valueInteger: a.value };
    case 'decimal':
      return { valueDecimal: a.value };
    case 'boolean':
      return { valueBoolean: a.value };
    case 'date':
      return { valueDate: a.value };
    case 'dateTime':
      return { valueDateTime: a.value };
    case 'coding':
      return { valueCoding: a.value };
  }
}

function buildItems(
  items: QuestionnaireItem[],
  answers: AnswerState,
): QuestionnaireResponseItem[] {
  const out: QuestionnaireResponseItem[] = [];
  for (const item of items) {
    if (!isEnabled(item, answers)) continue;
    if (item.type === 'display') continue;

    if (item.type === 'group') {
      const children = item.item ? buildItems(item.item, answers) : [];
      if (children.length === 0 && !item.text) continue;
      out.push({ linkId: item.linkId, text: item.text, item: children });
      continue;
    }

    const values = answers[item.linkId] ?? [];
    if (values.length === 0) continue;
    out.push({
      linkId: item.linkId,
      text: item.text,
      answer: values.map(answerToFhir),
    });
  }
  return out;
}

export function buildResponse(
  questionnaire: Questionnaire,
  answers: AnswerState,
  status: 'in-progress' | 'completed' = 'completed',
): QuestionnaireResponse {
  return {
    resourceType: 'QuestionnaireResponse',
    questionnaire: questionnaire.url,
    status,
    authored: new Date().toISOString(),
    item: buildItems(questionnaire.item, answers),
  };
}
