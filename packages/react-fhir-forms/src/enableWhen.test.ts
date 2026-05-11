import { describe, expect, it } from 'vitest';
import { isEnabled } from './enableWhen';
import type { AnswerState, QuestionnaireItem } from './types';

const item = (overrides: Partial<QuestionnaireItem>): QuestionnaireItem => ({
  linkId: 'x',
  type: 'string',
  ...overrides,
});

describe('isEnabled', () => {
  it('returns true when no enableWhen is set', () => {
    expect(isEnabled(item({}), {})).toBe(true);
  });

  it('handles "exists" with answerBoolean=true', () => {
    const q = item({
      enableWhen: [{ question: 'a', operator: 'exists', answerBoolean: true }],
    });
    expect(isEnabled(q, {})).toBe(false);
    expect(isEnabled(q, { a: [{ kind: 'string', value: 'hi' }] })).toBe(true);
  });

  it('handles "exists" with answerBoolean=false (absent triggers enable)', () => {
    const q = item({
      enableWhen: [{ question: 'a', operator: 'exists', answerBoolean: false }],
    });
    expect(isEnabled(q, {})).toBe(true);
    expect(isEnabled(q, { a: [{ kind: 'string', value: 'hi' }] })).toBe(false);
  });

  it('compares boolean equality', () => {
    const q = item({
      enableWhen: [{ question: 'a', operator: '=', answerBoolean: true }],
    });
    expect(isEnabled(q, { a: [{ kind: 'boolean', value: true }] })).toBe(true);
    expect(isEnabled(q, { a: [{ kind: 'boolean', value: false }] })).toBe(false);
  });

  it('compares coding by code', () => {
    const q = item({
      enableWhen: [
        { question: 'a', operator: '=', answerCoding: { code: 'pain' } },
      ],
    });
    const state: AnswerState = {
      a: [{ kind: 'coding', value: { code: 'pain', display: 'Pain' } }],
    };
    expect(isEnabled(q, state)).toBe(true);
  });

  it('matches multi-answer choice (any match)', () => {
    const q = item({
      enableWhen: [
        { question: 'a', operator: '=', answerCoding: { code: 'pain' } },
      ],
    });
    const state: AnswerState = {
      a: [
        { kind: 'coding', value: { code: 'fatigue' } },
        { kind: 'coding', value: { code: 'pain' } },
      ],
    };
    expect(isEnabled(q, state)).toBe(true);
  });

  it('respects enableBehavior=all (default)', () => {
    const q = item({
      enableWhen: [
        { question: 'a', operator: '=', answerBoolean: true },
        { question: 'b', operator: '=', answerInteger: 5 },
      ],
    });
    expect(
      isEnabled(q, {
        a: [{ kind: 'boolean', value: true }],
        b: [{ kind: 'integer', value: 5 }],
      }),
    ).toBe(true);
    expect(
      isEnabled(q, {
        a: [{ kind: 'boolean', value: true }],
        b: [{ kind: 'integer', value: 4 }],
      }),
    ).toBe(false);
  });

  it('respects enableBehavior=any', () => {
    const q = item({
      enableBehavior: 'any',
      enableWhen: [
        { question: 'a', operator: '=', answerBoolean: true },
        { question: 'b', operator: '=', answerInteger: 5 },
      ],
    });
    expect(
      isEnabled(q, {
        a: [{ kind: 'boolean', value: false }],
        b: [{ kind: 'integer', value: 5 }],
      }),
    ).toBe(true);
    expect(
      isEnabled(q, {
        a: [{ kind: 'boolean', value: false }],
        b: [{ kind: 'integer', value: 4 }],
      }),
    ).toBe(false);
  });

  it('handles numeric > and <', () => {
    const gt = item({
      enableWhen: [{ question: 'a', operator: '>', answerInteger: 3 }],
    });
    expect(isEnabled(gt, { a: [{ kind: 'integer', value: 4 }] })).toBe(true);
    expect(isEnabled(gt, { a: [{ kind: 'integer', value: 3 }] })).toBe(false);
    expect(isEnabled(gt, { a: [{ kind: 'integer', value: 2 }] })).toBe(false);
  });
});
