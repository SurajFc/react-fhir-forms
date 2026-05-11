import type { AnswerState, AnswerValue } from './types';

export type Action =
  | { type: 'set'; linkId: string; values: AnswerValue[] }
  | { type: 'add'; linkId: string; value: AnswerValue }
  | { type: 'removeAt'; linkId: string; index: number }
  | { type: 'clear'; linkId: string }
  | { type: 'reset'; state: AnswerState };

export function reducer(state: AnswerState, action: Action): AnswerState {
  switch (action.type) {
    case 'set':
      return { ...state, [action.linkId]: action.values };
    case 'add': {
      const existing = state[action.linkId] ?? [];
      return { ...state, [action.linkId]: [...existing, action.value] };
    }
    case 'removeAt': {
      const existing = state[action.linkId] ?? [];
      return {
        ...state,
        [action.linkId]: existing.filter((_, i) => i !== action.index),
      };
    }
    case 'clear': {
      const next = { ...state };
      delete next[action.linkId];
      return next;
    }
    case 'reset':
      return action.state;
  }
}
