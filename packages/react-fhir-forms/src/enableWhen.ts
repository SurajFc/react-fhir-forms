import type {
  AnswerState,
  AnswerValue,
  EnableWhen,
  QuestionnaireItem,
} from './types';

function answerToScalar(a: AnswerValue): string | number | boolean {
  switch (a.kind) {
    case 'coding':
      return a.value.code;
    default:
      return a.value;
  }
}

function expectedFromEnableWhen(ew: EnableWhen): string | number | boolean | undefined {
  if (ew.answerString !== undefined) return ew.answerString;
  if (ew.answerInteger !== undefined) return ew.answerInteger;
  if (ew.answerDecimal !== undefined) return ew.answerDecimal;
  if (ew.answerBoolean !== undefined) return ew.answerBoolean;
  if (ew.answerDate !== undefined) return ew.answerDate;
  if (ew.answerDateTime !== undefined) return ew.answerDateTime;
  if (ew.answerCoding !== undefined) return ew.answerCoding.code;
  return undefined;
}

function matches(actualList: AnswerValue[] | undefined, ew: EnableWhen): boolean {
  const present = !!actualList && actualList.length > 0;

  if (ew.operator === 'exists') {
    const expected = ew.answerBoolean ?? true;
    return present === expected;
  }

  if (!present) return false;
  const expected = expectedFromEnableWhen(ew);
  if (expected === undefined) return false;

  // For multi-answer questions, treat as match-any.
  return (actualList ?? []).some((a) => {
    const actual = answerToScalar(a);
    switch (ew.operator) {
      case '=':
        return actual === expected;
      case '!=':
        return actual !== expected;
      case '>':
        return compare(actual, expected) > 0;
      case '<':
        return compare(actual, expected) < 0;
      case '>=':
        return compare(actual, expected) >= 0;
      case '<=':
        return compare(actual, expected) <= 0;
    }
  });
}

function compare(
  a: string | number | boolean,
  b: string | number | boolean,
): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  const sa = String(a);
  const sb = String(b);
  if (sa < sb) return -1;
  if (sa > sb) return 1;
  return 0;
}

export function isEnabled(item: QuestionnaireItem, answers: AnswerState): boolean {
  if (!item.enableWhen || item.enableWhen.length === 0) return true;
  const behavior = item.enableBehavior ?? 'all';
  const results = item.enableWhen.map((ew) => matches(answers[ew.question], ew));
  return behavior === 'all' ? results.every(Boolean) : results.some(Boolean);
}
