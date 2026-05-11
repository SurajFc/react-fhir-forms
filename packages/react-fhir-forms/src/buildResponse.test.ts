import { describe, expect, it } from 'vitest';
import { buildResponse } from './buildResponse';
import type { Questionnaire } from './types';

describe('buildResponse', () => {
  it('emits coding answers and skips display items', () => {
    const q: Questionnaire = {
      resourceType: 'Questionnaire',
      url: 'http://example.org/q1',
      item: [
        { linkId: 'note', type: 'display', text: 'hello' },
        {
          linkId: 'fav',
          type: 'choice',
          answerOption: [{ valueCoding: { code: 'red' } }],
        },
      ],
    };
    const r = buildResponse(
      q,
      { fav: [{ kind: 'coding', value: { code: 'red' } }] },
      'completed',
    );
    expect(r.status).toBe('completed');
    expect(r.questionnaire).toBe('http://example.org/q1');
    expect(r.item).toEqual([
      {
        linkId: 'fav',
        text: undefined,
        answer: [{ valueCoding: { code: 'red' } }],
      },
    ]);
  });

  it('omits items disabled by enableWhen', () => {
    const q: Questionnaire = {
      resourceType: 'Questionnaire',
      item: [
        { linkId: 'gate', type: 'boolean' },
        {
          linkId: 'detail',
          type: 'string',
          enableWhen: [{ question: 'gate', operator: '=', answerBoolean: true }],
        },
      ],
    };
    const r = buildResponse(q, {
      gate: [{ kind: 'boolean', value: false }],
      detail: [{ kind: 'string', value: 'should be dropped' }],
    });
    expect(r.item.find((i) => i.linkId === 'detail')).toBeUndefined();
  });

  it('preserves nested group structure', () => {
    const q: Questionnaire = {
      resourceType: 'Questionnaire',
      item: [
        {
          linkId: 'g',
          type: 'group',
          text: 'Group',
          item: [{ linkId: 'inner', type: 'string' }],
        },
      ],
    };
    const r = buildResponse(q, {
      inner: [{ kind: 'string', value: 'hi' }],
    });
    expect(r.item[0]?.linkId).toBe('g');
    expect(r.item[0]?.item?.[0]?.answer).toEqual([{ valueString: 'hi' }]);
  });

  it('serializes multiple answers for repeats', () => {
    const q: Questionnaire = {
      resourceType: 'Questionnaire',
      item: [{ linkId: 'tags', type: 'choice', repeats: true }],
    };
    const r = buildResponse(q, {
      tags: [
        { kind: 'coding', value: { code: 'a' } },
        { kind: 'coding', value: { code: 'b' } },
      ],
    });
    expect(r.item[0]?.answer).toHaveLength(2);
  });
});
