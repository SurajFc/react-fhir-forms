import type { Meta, StoryObj } from '@storybook/react';
import { FhirQuestionnaire, type Questionnaire } from 'react-fhir-forms';
import { TailwindForm, tailwindRenderers } from 'react-fhir-forms/tailwind';

const meta: Meta<typeof FhirQuestionnaire> = {
  title: 'Renderers/Primitives',
  component: FhirQuestionnaire,
  render: (args) => (
    <FhirQuestionnaire {...args} components={tailwindRenderers}>
      <TailwindForm />
    </FhirQuestionnaire>
  ),
};
export default meta;
type Story = StoryObj<typeof FhirQuestionnaire>;

const q = (item: Questionnaire['item']): Questionnaire => ({
  resourceType: 'Questionnaire',
  item,
});

export const String: Story = {
  args: {
    questionnaire: q([
      { linkId: 'a', type: 'string', text: 'Full name', required: true, maxLength: 80 },
    ]),
  },
};

export const Text: Story = {
  args: {
    questionnaire: q([
      { linkId: 'a', type: 'text', text: 'Chief complaint', maxLength: 500 },
    ]),
  },
};

export const Integer: Story = {
  args: {
    questionnaire: q([
      { linkId: 'a', type: 'integer', text: 'Age in years', required: true },
    ]),
  },
};

export const Decimal: Story = {
  args: {
    questionnaire: q([{ linkId: 'a', type: 'decimal', text: 'Weight (kg)' }]),
  },
};

export const Boolean: Story = {
  args: {
    questionnaire: q([{ linkId: 'a', type: 'boolean', text: 'Do you smoke?' }]),
  },
};

export const Date: Story = {
  args: {
    questionnaire: q([{ linkId: 'a', type: 'date', text: 'Date of birth' }]),
  },
};

export const DateTime: Story = {
  args: {
    questionnaire: q([
      { linkId: 'a', type: 'dateTime', text: 'Appointment time' },
    ]),
  },
};

export const Display: Story = {
  args: {
    questionnaire: q([
      {
        linkId: 'a',
        type: 'display',
        text: 'Please answer all questions as accurately as you can.',
      },
    ]),
  },
};
