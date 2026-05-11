import { ItemRenderer } from '../ItemRenderer';
import {
  useFhirAnswer,
  useFhirBooleanAnswer,
  useFhirCodingAnswer,
  useFhirDateAnswer,
  useFhirDateTimeAnswer,
  useFhirDecimalAnswer,
  useFhirIntegerAnswer,
  useFhirStringAnswer,
} from '../hooks';
import type { RendererProps } from '../registry';
import type { AnswerOption, AnswerValue, Coding } from '../types';
import { Field, fieldId } from './Field';
import { tailwindClassNames as cn } from './theme';

export function StringInput({ item }: RendererProps) {
  const { value, setValue } = useFhirStringAnswer(item.linkId);
  const id = fieldId(item.linkId);
  return (
    <Field item={item} htmlFor={id}>
      <input
        id={id}
        type="text"
        className={cn.input}
        value={value ?? ''}
        readOnly={item.readOnly}
        maxLength={item.maxLength}
        onChange={(e) => setValue(e.target.value || null)}
      />
    </Field>
  );
}

export function TextInput({ item }: RendererProps) {
  const { value, setValue } = useFhirStringAnswer(item.linkId);
  const id = fieldId(item.linkId);
  return (
    <Field item={item} htmlFor={id}>
      <textarea
        id={id}
        className={cn.textarea}
        value={value ?? ''}
        readOnly={item.readOnly}
        maxLength={item.maxLength}
        onChange={(e) => setValue(e.target.value || null)}
      />
    </Field>
  );
}

export function IntegerInput({ item }: RendererProps) {
  const { value, setValue } = useFhirIntegerAnswer(item.linkId);
  const id = fieldId(item.linkId);
  return (
    <Field item={item} htmlFor={id}>
      <input
        id={id}
        type="number"
        step={1}
        className={cn.input}
        value={value ?? ''}
        readOnly={item.readOnly}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === '') return setValue(null);
          const n = Number(raw);
          if (Number.isNaN(n)) return;
          setValue(Math.trunc(n));
        }}
      />
    </Field>
  );
}

export function DecimalInput({ item }: RendererProps) {
  const { value, setValue } = useFhirDecimalAnswer(item.linkId);
  const id = fieldId(item.linkId);
  return (
    <Field item={item} htmlFor={id}>
      <input
        id={id}
        type="number"
        step="any"
        className={cn.input}
        value={value ?? ''}
        readOnly={item.readOnly}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === '') return setValue(null);
          const n = Number(raw);
          if (Number.isNaN(n)) return;
          setValue(n);
        }}
      />
    </Field>
  );
}

export function BooleanInput({ item }: RendererProps) {
  const { value, setValue } = useFhirBooleanAnswer(item.linkId);
  const id = fieldId(item.linkId);
  return (
    <Field item={item}>
      <label className="inline-flex items-center" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          className={cn.checkbox}
          checked={value ?? false}
          disabled={item.readOnly}
          onChange={(e) => setValue(e.target.checked)}
        />
        <span className={cn.optionLabel}>Yes</span>
      </label>
    </Field>
  );
}

export function DateInput({ item }: RendererProps) {
  const { value, setValue } = useFhirDateAnswer(item.linkId);
  const id = fieldId(item.linkId);
  return (
    <Field item={item} htmlFor={id}>
      <input
        id={id}
        type="date"
        className={cn.input}
        value={value ?? ''}
        readOnly={item.readOnly}
        onChange={(e) => setValue(e.target.value || null)}
      />
    </Field>
  );
}

export function DateTimeInput({ item }: RendererProps) {
  const { value, setValue } = useFhirDateTimeAnswer(item.linkId);
  const id = fieldId(item.linkId);
  return (
    <Field item={item} htmlFor={id}>
      <input
        id={id}
        type="datetime-local"
        className={cn.input}
        value={value ?? ''}
        readOnly={item.readOnly}
        onChange={(e) => setValue(e.target.value || null)}
      />
    </Field>
  );
}

function codingFromOption(opt: AnswerOption): Coding | null {
  if (opt.valueCoding) return opt.valueCoding;
  if (opt.valueString !== undefined)
    return { code: opt.valueString, display: opt.valueString };
  if (opt.valueInteger !== undefined)
    return { code: String(opt.valueInteger), display: String(opt.valueInteger) };
  return null;
}

function optionKey(opt: AnswerOption): string {
  const c = codingFromOption(opt);
  return c ? `${c.system ?? ''}|${c.code}` : '';
}

function optionLabel(opt: AnswerOption): string {
  const c = codingFromOption(opt);
  return c?.display ?? c?.code ?? '';
}

export function ChoiceInput({ item }: RendererProps) {
  const options = item.answerOption ?? [];
  const { value, setValue, has, toggle } = useFhirCodingAnswer(item.linkId);

  if (item.repeats) {
    return (
      <Field item={item}>
        <div className="space-y-1.5">
          {options.map((opt, idx) => {
            const coding = codingFromOption(opt);
            if (!coding) return null;
            const id = fieldId(item.linkId, idx);
            return (
              <label key={optionKey(opt)} className="flex items-center" htmlFor={id}>
                <input
                  id={id}
                  type="checkbox"
                  className={cn.checkbox}
                  checked={has(coding)}
                  disabled={item.readOnly}
                  onChange={() => toggle(coding)}
                />
                <span className={cn.optionLabel}>{optionLabel(opt)}</span>
              </label>
            );
          })}
        </div>
      </Field>
    );
  }

  if (options.length <= 5) {
    return (
      <Field item={item}>
        <div className="space-y-1.5" role="radiogroup" aria-label={item.text}>
          {options.map((opt, idx) => {
            const coding = codingFromOption(opt);
            if (!coding) return null;
            const id = fieldId(item.linkId, idx);
            const checked = value ? has(coding) : false;
            return (
              <label key={optionKey(opt)} className="flex items-center" htmlFor={id}>
                <input
                  id={id}
                  type="radio"
                  name={item.linkId}
                  className={cn.radio}
                  checked={checked}
                  disabled={item.readOnly}
                  onChange={() => setValue(coding)}
                />
                <span className={cn.optionLabel}>{optionLabel(opt)}</span>
              </label>
            );
          })}
        </div>
      </Field>
    );
  }

  const id = fieldId(item.linkId);
  const currentKey = value ? `${value.system ?? ''}|${value.code}` : '';
  return (
    <Field item={item} htmlFor={id}>
      <select
        id={id}
        className={cn.select}
        value={currentKey}
        disabled={item.readOnly}
        onChange={(e) => {
          const opt = options.find((o) => optionKey(o) === e.target.value);
          setValue(opt ? codingFromOption(opt) : null);
        }}
      >
        <option value="">— Select —</option>
        {options.map((opt) => (
          <option key={optionKey(opt)} value={optionKey(opt)}>
            {optionLabel(opt)}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function OpenChoiceInput({ item }: RendererProps) {
  const { values, setValues } = useFhirAnswer(item.linkId);
  const freeText = values.find((a) => a.kind === 'string');
  const id = fieldId(item.linkId, 999);

  return (
    <>
      <ChoiceInput item={item} />
      <Field item={{ ...item, text: undefined, required: false }} htmlFor={id}>
        <input
          id={id}
          type="text"
          placeholder="Other (please specify)"
          className={cn.input}
          value={freeText && freeText.kind === 'string' ? freeText.value : ''}
          readOnly={item.readOnly}
          onChange={(e) => {
            const withoutText = values.filter((a) => a.kind !== 'string');
            const next: AnswerValue[] = e.target.value
              ? [...withoutText, { kind: 'string', value: e.target.value }]
              : withoutText;
            setValues(next);
          }}
        />
      </Field>
    </>
  );
}

export function Display({ item }: RendererProps) {
  if (!item.text) return null;
  return <p className={cn.display}>{item.text}</p>;
}

export function Group({ item }: RendererProps) {
  return (
    <fieldset className={cn.group}>
      {item.text && <legend className={cn.groupTitle}>{item.text}</legend>}
      {(item.item ?? []).map((child) => (
        <ItemRenderer key={child.linkId} item={child} />
      ))}
    </fieldset>
  );
}
