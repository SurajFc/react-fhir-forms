import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  FhirQuestionnaire,
  type AnswerState,
  type Questionnaire,
} from 'react-fhir-forms';
import { TailwindForm, tailwindRenderers } from 'react-fhir-forms/tailwind';

const meta: Meta<typeof FhirQuestionnaire> = {
  title: 'Behavior/enableWhen',
  component: FhirQuestionnaire,
};
export default meta;
type Story = StoryObj<typeof FhirQuestionnaire>;

function Live({ questionnaire }: { questionnaire: Questionnaire }) {
  const [answers, setAnswers] = useState<AnswerState>({});
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <FhirQuestionnaire
        questionnaire={questionnaire}
        components={tailwindRenderers}
        onChange={setAnswers}
      >
        <TailwindForm showSubmit={false} />
      </FhirQuestionnaire>
      <pre className="overflow-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
        {JSON.stringify(answers, null, 2)}
      </pre>
    </div>
  );
}

export const BooleanGate: Story = {
  render: () => (
    <Live
      questionnaire={{
        resourceType: 'Questionnaire',
        item: [
          { linkId: 'any', type: 'boolean', text: 'Currently on meds?' },
          {
            linkId: 'list',
            type: 'text',
            text: 'List your meds',
            required: true,
            enableWhen: [
              { question: 'any', operator: '=', answerBoolean: true },
            ],
          },
        ],
      }}
    />
  ),
};

export const CodingGate: Story = {
  render: () => (
    <Live
      questionnaire={{
        resourceType: 'Questionnaire',
        item: [
          {
            linkId: 'sym',
            type: 'choice',
            text: 'Pick one',
            answerOption: [
              { valueCoding: { code: 'pain', display: 'Pain' } },
              { valueCoding: { code: 'fatigue', display: 'Fatigue' } },
            ],
          },
          {
            linkId: 'severity',
            type: 'integer',
            text: 'Pain severity (0–10)',
            enableWhen: [
              {
                question: 'sym',
                operator: '=',
                answerCoding: { code: 'pain' },
              },
            ],
          },
        ],
      }}
    />
  ),
};

export const BehaviorAny: Story = {
  render: () => (
    <Live
      questionnaire={{
        resourceType: 'Questionnaire',
        item: [
          { linkId: 'a', type: 'boolean', text: 'Condition A?' },
          { linkId: 'b', type: 'boolean', text: 'Condition B?' },
          {
            linkId: 'followup',
            type: 'string',
            text: 'Shown if EITHER A or B is true',
            enableBehavior: 'any',
            enableWhen: [
              { question: 'a', operator: '=', answerBoolean: true },
              { question: 'b', operator: '=', answerBoolean: true },
            ],
          },
        ],
      }}
    />
  ),
};
