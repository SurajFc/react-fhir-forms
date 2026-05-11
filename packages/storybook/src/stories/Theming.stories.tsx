import type { Meta, StoryObj } from '@storybook/react';
import {
  FhirQuestionnaire,
  useFhirIntegerAnswer,
  type Questionnaire,
  type RendererProps,
} from 'react-fhir-forms';
import { TailwindForm, tailwindRenderers } from 'react-fhir-forms/tailwind';

const meta: Meta<typeof FhirQuestionnaire> = {
  title: 'Customization/Renderer override',
  component: FhirQuestionnaire,
};
export default meta;
type Story = StoryObj<typeof FhirQuestionnaire>;

const q: Questionnaire = {
  resourceType: 'Questionnaire',
  item: [
    { linkId: 'name', type: 'string', text: 'Name', required: true },
    { linkId: 'rating', type: 'integer', text: 'Rate your visit (1–5)' },
  ],
};

function StarRating({ item }: RendererProps) {
  const { value, setValue } = useFhirIntegerAnswer(item.linkId);
  return (
    <div className="space-y-1">
      <div className="text-sm font-medium text-slate-800">{item.text}</div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setValue(value === n ? null : n)}
            className={
              'text-2xl ' +
              (value && value >= n ? 'text-amber-500' : 'text-slate-300')
            }
            aria-label={`${n} of 5`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export const StarRatingForInteger: Story = {
  render: () => (
    <FhirQuestionnaire
      questionnaire={q}
      components={{ ...tailwindRenderers, integer: StarRating }}
    >
      <TailwindForm />
    </FhirQuestionnaire>
  ),
};
