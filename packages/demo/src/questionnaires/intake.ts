import type { Questionnaire } from 'react-fhir-forms';

export const intake: Questionnaire = {
  resourceType: 'Questionnaire',
  url: 'http://example.org/Questionnaire/intake',
  title: 'New Patient Intake',
  status: 'active',
  item: [
    {
      linkId: 'patient',
      type: 'group',
      text: 'Patient details',
      item: [
        {
          linkId: 'patient.name',
          type: 'string',
          text: 'Full name',
          required: true,
          maxLength: 100,
        },
        {
          linkId: 'patient.dob',
          type: 'date',
          text: 'Date of birth',
          required: true,
        },
        {
          linkId: 'patient.sex',
          type: 'choice',
          text: 'Sex assigned at birth',
          required: true,
          answerOption: [
            { valueCoding: { code: 'female', display: 'Female' } },
            { valueCoding: { code: 'male', display: 'Male' } },
            { valueCoding: { code: 'intersex', display: 'Intersex' } },
            { valueCoding: { code: 'unknown', display: 'Prefer not to say' } },
          ],
        },
      ],
    },
    {
      linkId: 'meds',
      type: 'group',
      text: 'Medications',
      item: [
        {
          linkId: 'meds.any',
          type: 'boolean',
          text: 'Are you currently taking any medications?',
        },
        {
          linkId: 'meds.list',
          type: 'text',
          text: 'List your current medications (name and dose)',
          required: true,
          enableWhen: [
            { question: 'meds.any', operator: '=', answerBoolean: true },
          ],
        },
      ],
    },
    {
      linkId: 'symptoms',
      type: 'group',
      text: 'Symptoms',
      item: [
        {
          linkId: 'symptoms.present',
          type: 'choice',
          text: 'Which of the following are you experiencing? (select all)',
          repeats: true,
          answerOption: [
            { valueCoding: { code: 'fatigue', display: 'Fatigue' } },
            { valueCoding: { code: 'pain', display: 'Pain' } },
            { valueCoding: { code: 'anxiety', display: 'Anxiety' } },
            { valueCoding: { code: 'insomnia', display: 'Insomnia' } },
            { valueCoding: { code: 'other', display: 'Other' } },
          ],
        },
        {
          linkId: 'symptoms.pain.severity',
          type: 'integer',
          text: 'Rate your pain (0 = none, 10 = worst imaginable)',
          required: true,
          enableWhen: [
            {
              question: 'symptoms.present',
              operator: '=',
              answerCoding: { code: 'pain' },
            },
          ],
        },
        {
          linkId: 'symptoms.other',
          type: 'string',
          text: 'Describe other symptoms',
          enableWhen: [
            {
              question: 'symptoms.present',
              operator: '=',
              answerCoding: { code: 'other' },
            },
          ],
        },
      ],
    },
    {
      linkId: 'consent',
      type: 'boolean',
      text: 'I consent to my information being used to provide care.',
      required: true,
    },
  ],
};
