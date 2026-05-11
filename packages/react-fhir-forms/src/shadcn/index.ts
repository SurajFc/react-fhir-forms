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

export const shadcnRenderers: Required<RendererRegistry> = {
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
export { ShadcnForm } from './ShadcnForm';

// Underlying primitives — exposed so consumers can mix-and-match.
export { Button } from './components/button';
export { Input } from './components/input';
export { Textarea } from './components/textarea';
export { Label } from './components/label';
export { Checkbox } from './components/checkbox';
export { RadioGroup, RadioGroupItem } from './components/radio-group';
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/select';
export { cn } from './lib/cn';
