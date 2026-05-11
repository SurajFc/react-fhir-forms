import { describe, expect, it } from 'vitest';
import { reducer } from './reducer';

describe('reducer', () => {
  it('set replaces values for a linkId', () => {
    const s = reducer(
      { a: [{ kind: 'string', value: 'old' }] },
      { type: 'set', linkId: 'a', values: [{ kind: 'string', value: 'new' }] },
    );
    expect(s.a).toEqual([{ kind: 'string', value: 'new' }]);
  });

  it('add appends to an existing list', () => {
    const s = reducer(
      { a: [{ kind: 'coding', value: { code: 'x' } }] },
      { type: 'add', linkId: 'a', value: { kind: 'coding', value: { code: 'y' } } },
    );
    expect(s.a).toHaveLength(2);
  });

  it('removeAt drops by index', () => {
    const s = reducer(
      {
        a: [
          { kind: 'string', value: 'a' },
          { kind: 'string', value: 'b' },
          { kind: 'string', value: 'c' },
        ],
      },
      { type: 'removeAt', linkId: 'a', index: 1 },
    );
    expect(s.a?.map((v) => (v.kind === 'string' ? v.value : ''))).toEqual(['a', 'c']);
  });

  it('clear removes the linkId entry', () => {
    const s = reducer(
      { a: [{ kind: 'string', value: 'x' }], b: [{ kind: 'boolean', value: true }] },
      { type: 'clear', linkId: 'a' },
    );
    expect(s.a).toBeUndefined();
    expect(s.b).toBeDefined();
  });
});
