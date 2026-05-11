import type { Meta, StoryObj } from '@storybook/react';
import { FhirQuestionnaire, type Questionnaire } from 'react-fhir-forms';
import { TailwindForm, tailwindRenderers } from 'react-fhir-forms/tailwind';

const meta: Meta<typeof FhirQuestionnaire> = {
  title: 'Renderers/Choice',
  component: FhirQuestionnaire,
  render: (args) => (
    <FhirQuestionnaire {...args} components={tailwindRenderers}>
      <TailwindForm />
    </FhirQuestionnaire>
  ),
};
export default meta;
type Story = StoryObj<typeof FhirQuestionnaire>;

const fewOptions = [
  { valueCoding: { code: 'a', display: 'Apple' } },
  { valueCoding: { code: 'b', display: 'Banana' } },
  { valueCoding: { code: 'c', display: 'Cherry' } },
];

const manyOptions = Array.from({ length: 12 }, (_, i) => ({
  valueCoding: { code: `o${i}`, display: `Option ${i + 1}` },
}));

const wrap = (item: Questionnaire['item']): Questionnaire => ({
  resourceType: 'Questionnaire',
  item,
});

export const RadioSingleSelect: Story = {
  args: {
    questionnaire: wrap([
      {
        linkId: 'fav',
        type: 'choice',
        text: 'Favorite fruit',
        answerOption: fewOptions,
      },
    ]),
  },
};

export const SelectDropdown: Story = {
  args: {
    questionnaire: wrap([
      {
        linkId: 'choice',
        type: 'choice',
        text: 'Pick one',
        answerOption: manyOptions,
      },
    ]),
  },
};

export const MultiSelectRepeats: Story = {
  args: {
    questionnaire: wrap([
      {
        linkId: 'symptoms',
        type: 'choice',
        text: 'Which symptoms apply?',
        repeats: true,
        answerOption: [
          { valueCoding: { code: 'fatigue', display: 'Fatigue' } },
          { valueCoding: { code: 'pain', display: 'Pain' } },
          { valueCoding: { code: 'anxiety', display: 'Anxiety' } },
        ],
      },
    ]),
  },
};

export const OpenChoice: Story = {
  args: {
    questionnaire: wrap([
      {
        linkId: 'pref',
        type: 'open-choice',
        text: 'Preferred contact method',
        answerOption: [
          { valueCoding: { code: 'email', display: 'Email' } },
          { valueCoding: { code: 'phone', display: 'Phone' } },
          { valueCoding: { code: 'sms', display: 'SMS' } },
        ],
      },
    ]),
  },
};
