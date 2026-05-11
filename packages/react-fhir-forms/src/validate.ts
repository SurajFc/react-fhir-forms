import { isEnabled } from './enableWhen';
import type {
  AnswerState,
  AnswerValue,
  QuestionnaireItem,
  ValidationIssue,
} from './types';

function validateOne(
  item: QuestionnaireItem,
  answers: AnswerValue[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (item.required && answers.length === 0) {
    issues.push({ linkId: item.linkId, message: 'This field is required.' });
  }

  for (const a of answers) {
    if ((a.kind === 'string' || a.kind === 'coding') && item.maxLength) {
      const text = a.kind === 'string' ? a.value : (a.value.display ?? a.value.code);
      if (text.length > item.maxLength) {
        issues.push({
          linkId: item.linkId,
          message: `Maximum length is ${item.maxLength} characters.`,
        });
      }
    }
    if (a.kind === 'integer' && !Number.isInteger(a.value)) {
      issues.push({ linkId: item.linkId, message: 'Must be a whole number.' });
    }
  }

  return issues;
}

export function validate(
  items: QuestionnaireItem[],
  answers: AnswerState,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const item of items) {
    if (!isEnabled(item, answers)) continue;
    if (item.type !== 'group' && item.type !== 'display') {
      issues.push(...validateOne(item, answers[item.linkId] ?? []));
    }
    if (item.item) {
      issues.push(...validate(item.item, answers));
    }
  }
  return issues;
}
