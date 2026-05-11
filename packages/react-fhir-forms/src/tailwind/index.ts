import type { RendererRegistry } from '../registry';
import {
  BooleanInput,
  ChoiceInput,
  DateInput,
  DateTimeInput,
  DecimalInput,
  Display,
  Group,
  IntegerInput,
  OpenChoiceInput,
  StringInput,
  TextInput,
} from './renderers';

export const tailwindRenderers: Required<RendererRegistry> = {
  group: Group,
  display: Display,
  string: StringInput,
  text: TextInput,
  integer: IntegerInput,
  decimal: DecimalInput,
  boolean: BooleanInput,
  date: DateInput,
  dateTime: DateTimeInput,
  choice: ChoiceInput,
  'open-choice': OpenChoiceInput,
};

export {
  BooleanInput,
  ChoiceInput,
  DateInput,
  DateTimeInput,
  DecimalInput,
  Display,
  Group,
  IntegerInput,
  OpenChoiceInput,
  StringInput,
  TextInput,
};
export { Field, fieldId } from './Field';
export { TailwindForm } from './TailwindForm';
export { tailwindClassNames, type TailwindClassNames } from './theme';
