import { useState } from 'react';
import {
  FhirQuestionnaire,
  type QuestionnaireResponse,
} from 'react-fhir-forms';
import { TailwindForm, tailwindRenderers } from 'react-fhir-forms/tailwind';
import { ShadcnForm, shadcnRenderers } from 'react-fhir-forms/shadcn';
import { phq9 } from './questionnaires/phq9';
import { intake } from './questionnaires/intake';
import { HeadlessCustomForm, headlessRecipe } from './HeadlessCustomForm';

const examples = {
  intake,
  phq9,
} as const;
type ExampleKey = keyof typeof examples;

type Mode = 'tailwind' | 'shadcn' | 'headless';

export function App() {
  const [example, setExample] = useState<ExampleKey>('intake');
  const [mode, setMode] = useState<Mode>('tailwind');
  const [response, setResponse] = useState<QuestionnaireResponse | null>(null);

  const questionnaire = examples[example];

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              react-fhir-forms
            </h1>
            <p className="text-xs text-slate-500">
              Headless core + opt-in Tailwind, shadcn, or fully-custom recipes.
              {' · '}
              <a
                href={`${import.meta.env.BASE_URL}storybook/`}
                className="text-indigo-600 underline-offset-2 hover:underline"
              >
                View Storybook →
              </a>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <nav className="flex gap-1">
              {(Object.keys(examples) as ExampleKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setExample(key);
                    setResponse(null);
                  }}
                  className={
                    'rounded-md px-3 py-1.5 ' +
                    (example === key
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100')
                  }
                >
                  {examples[key].title}
                </button>
              ))}
            </nav>
            <div className="flex gap-1 rounded-md bg-slate-100 p-1 text-xs">
              {(['tailwind', 'shadcn', 'headless'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setResponse(null);
                  }}
                  className={
                    'rounded px-2 py-1 capitalize ' +
                    (mode === m
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600')
                  }
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-6 py-8 lg:grid-cols-[1fr_minmax(0,420px)]">
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            {questionnaire.title}
          </h2>

          {mode === 'tailwind' && (
            <FhirQuestionnaire
              key={'tw-' + example}
              questionnaire={questionnaire}
              components={tailwindRenderers}
              onSubmit={(r) => setResponse(r)}
            >
              <TailwindForm submitLabel="Submit response" />
            </FhirQuestionnaire>
          )}

          {mode === 'shadcn' && (
            <FhirQuestionnaire
              key={'sc-' + example}
              questionnaire={questionnaire}
              components={shadcnRenderers}
              onSubmit={(r) => setResponse(r)}
            >
              <ShadcnForm submitLabel="Submit response" />
            </FhirQuestionnaire>
          )}

          {mode === 'headless' && (
            <FhirQuestionnaire
              key={'hl-' + example}
              questionnaire={questionnaire}
              components={headlessRecipe}
              onSubmit={(r) => setResponse(r)}
            >
              <HeadlessCustomForm />
            </FhirQuestionnaire>
          )}
        </section>

        <aside className="rounded-lg border border-slate-200 bg-slate-900 p-4 text-slate-100">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            QuestionnaireResponse
          </h2>
          {response ? (
            <pre className="overflow-auto text-xs leading-relaxed">
              {JSON.stringify(response, null, 2)}
            </pre>
          ) : (
            <p className="text-xs text-slate-400">
              Submit the form to see the FHIR QuestionnaireResponse output.
            </p>
          )}
        </aside>
      </main>
    </div>
  );
}
