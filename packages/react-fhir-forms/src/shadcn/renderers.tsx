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
import { Checkbox } from './components/checkbox';
import { Input } from './components/input';
import { Label } from './components/label';
import { RadioGroup, RadioGroupItem } from './components/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/select';
import { Textarea } from './components/textarea';
import { Field, fieldId } from './Field';

export function StringInput({ item }: RendererProps) {
  const { value, setValue } = useFhirStringAnswer(item.linkId);
  const id = fieldId(item.linkId);
  return (
    <Field item={item} htmlFor={id}>
      <Input
        id={id}
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
      <Textarea
        id={id}
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
      <Input
        id={id}
        type="number"
        step={1}
        value={value ?? ''}
        readOnly={item.readOnly}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === '') return setValue(null);
          const n = Number(raw);
          if (!Number.isNaN(n)) setValue(Math.trunc(n));
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
      <Input
        id={id}
        type="number"
        step="any"
        value={value ?? ''}
        readOnly={item.readOnly}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === '') return setValue(null);
          const n = Number(raw);
          if (!Number.isNaN(n)) setValue(n);
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
      <div className="flex items-center gap-2">
        <Checkbox
          id={id}
          checked={value ?? false}
          disabled={item.readOnly}
          onCheckedChange={(checked) => setValue(checked === true)}
        />
        <Label htmlFor={id} className="text-sm font-normal">
          Yes
        </Label>
      </div>
    </Field>
  );
}

export function DateInput({ item }: RendererProps) {
  const { value, setValue } = useFhirDateAnswer(item.linkId);
  const id = fieldId(item.linkId);
  return (
    <Field item={item} htmlFor={id}>
      <Input
        id={id}
        type="date"
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
      <Input
        id={id}
        type="datetime-local"
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
        <div className="space-y-2">
          {options.map((opt, idx) => {
            const coding = codingFromOption(opt);
            if (!coding) return null;
            const id = fieldId(item.linkId, idx);
            return (
              <div key={optionKey(opt)} className="flex items-center gap-2">
                <Checkbox
                  id={id}
                  checked={has(coding)}
                  disabled={item.readOnly}
                  onCheckedChange={() => toggle(coding)}
                />
                <Label htmlFor={id} className="text-sm font-normal">
                  {optionLabel(opt)}
                </Label>
              </div>
            );
          })}
        </div>
      </Field>
    );
  }

  if (options.length <= 5) {
    const currentKey = value ? `${value.system ?? ''}|${value.code}` : '';
    return (
      <Field item={item}>
        <RadioGroup
          value={currentKey}
          onValueChange={(v) => {
            const opt = options.find((o) => optionKey(o) === v);
            setValue(opt ? codingFromOption(opt) : null);
          }}
          disabled={item.readOnly}
        >
          {options.map((opt, idx) => {
            const coding = codingFromOption(opt);
            if (!coding) return null;
            const id = fieldId(item.linkId, idx);
            return (
              <div key={optionKey(opt)} className="flex items-center gap-2">
                <RadioGroupItem value={optionKey(opt)} id={id} />
                <Label htmlFor={id} className="text-sm font-normal">
                  {optionLabel(opt)}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </Field>
    );
  }

  const currentKey = value ? `${value.system ?? ''}|${value.code}` : '';
  const id = fieldId(item.linkId);
  return (
    <Field item={item} htmlFor={id}>
      <Select
        value={currentKey || undefined}
        onValueChange={(v) => {
          const opt = options.find((o) => optionKey(o) === v);
          setValue(opt ? codingFromOption(opt) : null);
        }}
        disabled={item.readOnly}
      >
        <SelectTrigger id={id}>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={optionKey(opt)} value={optionKey(opt)}>
              {optionLabel(opt)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
        <Input
          id={id}
          placeholder="Other (please specify)"
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
  return <p className="text-sm text-muted-foreground">{item.text}</p>;
}

export function Group({ item }: RendererProps) {
  return (
    <fieldset className="space-y-4 rounded-lg border bg-card p-4 text-card-foreground">
      {item.text && (
        <legend className="text-base font-semibold text-foreground">
          {item.text}
        </legend>
      )}
      {(item.item ?? []).map((child) => (
        <ItemRenderer key={child.linkId} item={child} />
      ))}
    </fieldset>
  );
}
