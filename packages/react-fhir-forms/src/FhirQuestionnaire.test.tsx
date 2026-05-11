import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FhirQuestionnaire } from './FhirQuestionnaire';
import { TailwindForm, tailwindRenderers } from './tailwind';
import type { Questionnaire, QuestionnaireResponse } from './types';

afterEach(cleanup);

const questionnaire: Questionnaire = {
  resourceType: 'Questionnaire',
  url: 'http://example.org/test',
  item: [
    { linkId: 'name', type: 'string', text: 'Full name', required: true },
    { linkId: 'meds.any', type: 'boolean', text: 'Currently on meds?' },
    {
      linkId: 'meds.list',
      type: 'text',
      text: 'List your meds',
      enableWhen: [{ question: 'meds.any', operator: '=', answerBoolean: true }],
    },
  ],
};

function renderForm(onSubmit: (r: QuestionnaireResponse) => void) {
  return render(
    <FhirQuestionnaire
      questionnaire={questionnaire}
      components={tailwindRenderers}
      onSubmit={onSubmit}
    >
      <TailwindForm submitLabel="Submit" />
    </FhirQuestionnaire>,
  );
}

describe('FhirQuestionnaire — end-to-end flow', () => {
  it('gates fields with enableWhen, blocks submit on required, then emits a QuestionnaireResponse', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    renderForm(onSubmit);

    // The gated text field is hidden initially.
    expect(screen.queryByLabelText('List your meds')).toBeNull();

    // Submitting with nothing filled should NOT fire onSubmit, and should
    // surface the required-field error.
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('This field is required.')).not.toBeNull();

    // Fill the required name.
    await user.type(screen.getByLabelText(/Full name/), 'Jane Doe');

    // Tick the boolean — the gated text field should appear.
    await user.click(screen.getByLabelText('Yes'));
    expect(screen.queryByLabelText('List your meds')).not.toBeNull();

    // Fill the now-visible text field.
    await user.type(screen.getByLabelText('List your meds'), 'aspirin 81mg');

    // Submit for real.
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const response = onSubmit.mock.calls[0]?.[0] as QuestionnaireResponse;
    expect(response.resourceType).toBe('QuestionnaireResponse');
    expect(response.status).toBe('completed');
    expect(response.questionnaire).toBe('http://example.org/test');
    expect(response.item).toEqual([
      { linkId: 'name', text: 'Full name', answer: [{ valueString: 'Jane Doe' }] },
      {
        linkId: 'meds.any',
        text: 'Currently on meds?',
        answer: [{ valueBoolean: true }],
      },
      {
        linkId: 'meds.list',
        text: 'List your meds',
        answer: [{ valueString: 'aspirin 81mg' }],
      },
    ]);
  });

  it('does not leak answers from items that were disabled before submit', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    renderForm(onSubmit);

    await user.type(screen.getByLabelText(/Full name/), 'X');

    // Enable the gate and fill the dependent field…
    await user.click(screen.getByLabelText('Yes'));
    await user.type(screen.getByLabelText('List your meds'), 'aspirin');

    // …then flip the gate back to false. The field disappears, but the
    // answer is still in internal state — buildResponse must exclude it.
    await user.click(screen.getByLabelText('Yes'));
    expect(screen.queryByLabelText('List your meds')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const response = onSubmit.mock.calls[0]?.[0] as QuestionnaireResponse;
    const linkIds = response.item.map((i) => i.linkId);
    expect(linkIds).toContain('name');
    expect(linkIds).toContain('meds.any');
    expect(linkIds).not.toContain('meds.list');
  });
});
