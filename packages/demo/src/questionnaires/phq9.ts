import type { Questionnaire } from 'react-fhir-forms';

const frequencyOptions = [
  { valueCoding: { code: '0', display: 'Not at all' } },
  { valueCoding: { code: '1', display: 'Several days' } },
  { valueCoding: { code: '2', display: 'More than half the days' } },
  { valueCoding: { code: '3', display: 'Nearly every day' } },
];

const questions = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure',
  'Trouble concentrating on things',
  'Moving or speaking slowly, or being fidgety or restless',
  'Thoughts that you would be better off dead, or of hurting yourself',
];

export const phq9: Questionnaire = {
  resourceType: 'Questionnaire',
  url: 'http://example.org/Questionnaire/phq-9',
  title: 'PHQ-9 — Patient Health Questionnaire',
  status: 'active',
  item: [
    {
      linkId: 'instructions',
      type: 'display',
      text: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
    },
    ...questions.map((text, i) => ({
      linkId: `q${i + 1}`,
      type: 'choice' as const,
      text: `${i + 1}. ${text}`,
      required: true,
      answerOption: frequencyOptions,
    })),
    {
      linkId: 'difficulty',
      type: 'choice',
      text: 'If you checked off any problems, how difficult have these problems made it for you?',
      answerOption: [
        { valueCoding: { code: 'not-difficult', display: 'Not difficult at all' } },
        { valueCoding: { code: 'somewhat', display: 'Somewhat difficult' } },
        { valueCoding: { code: 'very', display: 'Very difficult' } },
        { valueCoding: { code: 'extremely', display: 'Extremely difficult' } },
      ],
    },
  ],
};
