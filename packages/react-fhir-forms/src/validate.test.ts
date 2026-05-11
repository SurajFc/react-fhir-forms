import { describe, expect, it } from 'vitest';
import { validate } from './validate';
import type { QuestionnaireItem } from './types';

describe('validate', () => {
  it('flags missing required fields', () => {
    const items: QuestionnaireItem[] = [
      { linkId: 'name', type: 'string', required: true },
    ];
    expect(validate(items, {})).toEqual([
      { linkId: 'name', message: 'This field is required.' },
    ]);
  });

  it('skips required check when the item is disabled by enableWhen', () => {
    const items: QuestionnaireItem[] = [
      { linkId: 'a', type: 'boolean' },
      {
        linkId: 'b',
        type: 'string',
        required: true,
        enableWhen: [{ question: 'a', operator: '=', answerBoolean: true }],
      },
    ];
    expect(validate(items, {})).toEqual([]);
    expect(
      validate(items, { a: [{ kind: 'boolean', value: true }] }),
    ).toEqual([{ linkId: 'b', message: 'This field is required.' }]);
  });

  it('enforces maxLength on string answers', () => {
    const items: QuestionnaireItem[] = [
      { linkId: 'name', type: 'string', maxLength: 3 },
    ];
    const issues = validate(items, {
      name: [{ kind: 'string', value: 'long' }],
    });
    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toMatch(/Maximum length/);
  });

  it('recurses into groups', () => {
    const items: QuestionnaireItem[] = [
      {
        linkId: 'g',
        type: 'group',
        item: [{ linkId: 'inner', type: 'string', required: true }],
      },
    ];
    expect(validate(items, {})).toEqual([
      { linkId: 'inner', message: 'This field is required.' },
    ]);
  });
});
