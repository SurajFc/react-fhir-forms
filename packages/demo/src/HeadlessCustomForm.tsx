import type { FormEvent, ReactNode } from 'react';
import {
  ItemRenderer,
  useFhirBooleanAnswer,
  useFhirCodingAnswer,
  useFhirDateAnswer,
  useFhirDateTimeAnswer,
  useFhirDecimalAnswer,
  useFhirForm,
  useFhirIntegerAnswer,
  useFhirIssues,
  useFhirStringAnswer,
  type QuestionnaireItem,
  type RendererProps,
  type RendererRegistry,
} from 'react-fhir-forms';

// A small, hand-rolled renderer set. No lib styling — only the hooks.
// This is what a consumer would write if they wanted custom UI on top
// of the headless core.

function Row({ item, children }: { item: QuestionnaireItem; children: ReactNode }) {
  const issues = useFhirIssues(item.linkId);
  return (
    <div className="border-b border-dashed border-slate-200 py-3">
      {item.text && (
        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-emerald-700">
          {item.text}
          {item.required && <span className="ml-1 text-rose-600">·required</span>}
        </div>
      )}
      {children}
      {issues.map((i, idx) => (
        <p key={idx} className="mt-1 text-xs text-rose-600">
          {i.message}
        </p>
      ))}
    </div>
  );
}

const inputCls =
  'w-full rounded-sm border-0 border-b-2 border-slate-300 bg-transparent px-0 py-1 text-sm focus:border-emerald-600 focus:outline-none focus:ring-0';

function HString({ item }: RendererProps) {
  const { value, setValue } = useFhirStringAnswer(item.linkId);
  return (
    <Row item={item}>
      <input
        className={inputCls}
        value={value ?? ''}
        maxLength={item.maxLength}
        onChange={(e) => setValue(e.target.value || null)}
      />
    </Row>
  );
}

function HText({ item }: RendererProps) {
  const { value, setValue } = useFhirStringAnswer(item.linkId);
  return (
    <Row item={item}>
      <textarea
        className={inputCls + ' min-h-[64px]'}
        value={value ?? ''}
        maxLength={item.maxLength}
        onChange={(e) => setValue(e.target.value || null)}
      />
    </Row>
  );
}

function HInteger({ item }: RendererProps) {
  const { value, setValue } = useFhirIntegerAnswer(item.linkId);
  return (
    <Row item={item}>
      <input
        type="number"
        step={1}
        className={inputCls}
        value={value ?? ''}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === '') return setValue(null);
          const n = Number(raw);
          if (!Number.isNaN(n)) setValue(Math.trunc(n));
        }}
      />
    </Row>
  );
}

function HDecimal({ item }: RendererProps) {
  const { value, setValue } = useFhirDecimalAnswer(item.linkId);
  return (
    <Row item={item}>
      <input
        type="number"
        step="any"
        className={inputCls}
        value={value ?? ''}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === '') return setValue(null);
          const n = Number(raw);
          if (!Number.isNaN(n)) setValue(n);
        }}
      />
    </Row>
  );
}

function HBoolean({ item }: RendererProps) {
  const { value, setValue } = useFhirBooleanAnswer(item.linkId);
  return (
    <Row item={item}>
      <div className="flex gap-2">
        {[
          { label: 'Yes', v: true },
          { label: 'No', v: false },
        ].map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => setValue(opt.v)}
            className={
              'rounded-full px-3 py-1 text-xs ' +
              ((value ?? null) === opt.v
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200')
            }
          >
            {opt.label}
          </button>
        ))}
      </div>
    </Row>
  );
}

function HDate({ item }: RendererProps) {
  const { value, setValue } = useFhirDateAnswer(item.linkId);
  return (
    <Row item={item}>
      <input
        type="date"
        className={inputCls}
        value={value ?? ''}
        onChange={(e) => setValue(e.target.value || null)}
      />
    </Row>
  );
}

function HDateTime({ item }: RendererProps) {
  const { value, setValue } = useFhirDateTimeAnswer(item.linkId);
  return (
    <Row item={item}>
      <input
        type="datetime-local"
        className={inputCls}
        value={value ?? ''}
        onChange={(e) => setValue(e.target.value || null)}
      />
    </Row>
  );
}

function HChoice({ item }: RendererProps) {
  const options = item.answerOption ?? [];
  const { has, toggle, setValue } = useFhirCodingAnswer(item.linkId);
  return (
    <Row item={item}>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const coding = opt.valueCoding;
          if (!coding) return null;
          const active = has(coding);
          return (
            <button
              key={coding.code}
              type="button"
              onClick={() => (item.repeats ? toggle(coding) : setValue(coding))}
              className={
                'rounded-full border px-3 py-1 text-xs ' +
                (active
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50')
              }
            >
              {coding.display ?? coding.code}
            </button>
          );
        })}
      </div>
    </Row>
  );
}

function HDisplay({ item }: RendererProps) {
  if (!item.text) return null;
  return (
    <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
      {item.text}
    </p>
  );
}

function HGroup({ item }: RendererProps) {
  return (
    <section className="rounded-md border border-emerald-200 bg-white px-4 py-3">
      {item.text && (
        <h3 className="mb-2 text-sm font-semibold text-emerald-800">
          {item.text}
        </h3>
      )}
      {(item.item ?? []).map((child) => (
        <ItemRenderer key={child.linkId} item={child} />
      ))}
    </section>
  );
}

export const headlessRecipe: RendererRegistry = {
  string: HString,
  text: HText,
  integer: HInteger,
  decimal: HDecimal,
  boolean: HBoolean,
  date: HDate,
  dateTime: HDateTime,
  choice: HChoice,
  'open-choice': HChoice,
  display: HDisplay,
  group: HGroup,
};

export function HeadlessCustomForm() {
  const { questionnaire, submit } = useFhirForm();
  const handle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };
  return (
    <form onSubmit={handle} className="space-y-4">
      {questionnaire.item.map((item) => (
        <ItemRenderer key={item.linkId} item={item} />
      ))}
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-full bg-emerald-700 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Submit response
        </button>
      </div>
    </form>
  );
}
