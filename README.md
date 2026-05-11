# react-fhir-forms

Headless React core for rendering FHIR R4 `Questionnaire` → working form → typed `QuestionnaireResponse`. Bring your own UI (or use the optional Tailwind recipe).

- **~3.7 KB gzipped** headless core (state, `enableWhen`, validation, response builder, registry, hooks)
- **No styling opinions** in the core — every renderer is user-supplied via the `components` prop
- **Optional Tailwind recipe** at `react-fhir-forms/tailwind` gives you a working themed form in one import

## Repo layout

```
packages/
  react-fhir-forms/   the library (core + tailwind recipe sub-entry)
  demo/               Vite + Tailwind playground (intake + PHQ-9, tailwind vs headless modes)
  storybook/          Storybook 8 with renderer + behavior stories
```

## Scripts

```bash
pnpm install
pnpm dev          # demo at http://localhost:5173
pnpm storybook    # storybook at http://localhost:6006
pnpm test         # vitest, library only
pnpm typecheck    # all packages
pnpm build        # build the library
```

## Headless usage

```tsx
import {
  FhirQuestionnaire,
  ItemRenderer,
  useFhirForm,
  useFhirStringAnswer,
  useFhirIssues,
  type RendererProps,
  type RendererRegistry,
} from 'react-fhir-forms';

function MyStringInput({ item }: RendererProps) {
  const { value, setValue } = useFhirStringAnswer(item.linkId);
  const issues = useFhirIssues(item.linkId);
  return (
    <label>
      {item.text}
      <input value={value ?? ''} onChange={(e) => setValue(e.target.value || null)} />
      {issues.map((i, idx) => <p key={idx}>{i.message}</p>)}
    </label>
  );
}

const myRecipe: RendererRegistry = { string: MyStringInput /* ... */ };

function MyForm() {
  const { questionnaire, submit } = useFhirForm();
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }}>
      {questionnaire.item.map((item) => <ItemRenderer key={item.linkId} item={item} />)}
      <button type="submit">Submit</button>
    </form>
  );
}

<FhirQuestionnaire
  questionnaire={q}
  components={myRecipe}
  onSubmit={(response) => console.log(response)}
>
  <MyForm />
</FhirQuestionnaire>
```

### Available hooks

| Hook | Returns |
| --- | --- |
| `useFhirAnswer(linkId)` | `{ values, setValues, addValue, removeAt, clear }` — generic |
| `useFhirStringAnswer(linkId)` | `{ value: string \| null, setValue }` |
| `useFhirIntegerAnswer(linkId)` | `{ value: number \| null, setValue }` |
| `useFhirDecimalAnswer(linkId)` | `{ value: number \| null, setValue }` |
| `useFhirBooleanAnswer(linkId)` | `{ value: boolean \| null, setValue }` |
| `useFhirDateAnswer(linkId)` | `{ value: string \| null, setValue }` |
| `useFhirDateTimeAnswer(linkId)` | `{ value: string \| null, setValue }` |
| `useFhirCodingAnswer(linkId)` | `{ value, values, setValue, toggle, has }` for choice / open-choice |
| `useFhirEnabled(linkId)` | `boolean` — current `enableWhen` result |
| `useFhirIssues(linkId)` | `ValidationIssue[]` for this item, after first submit attempt |
| `useFhirForm()` | `{ questionnaire, visibleItems, answers, issues, submit, reset }` |

## Recipes

If you don't want to write renderers, import a recipe.

### Tailwind

```tsx
import { FhirQuestionnaire } from 'react-fhir-forms';
import { TailwindForm, tailwindRenderers } from 'react-fhir-forms/tailwind';

<FhirQuestionnaire questionnaire={q} components={tailwindRenderers} onSubmit={fn}>
  <TailwindForm submitLabel="Submit response" />
</FhirQuestionnaire>
```

### shadcn/ui

Same shape; built on Radix primitives + cva. Requires the standard shadcn CSS variables (`--background`, `--foreground`, `--primary`, etc.) and these peer deps in your app:

```bash
pnpm add @radix-ui/react-checkbox @radix-ui/react-label \
         @radix-ui/react-radio-group @radix-ui/react-select \
         class-variance-authority clsx tailwind-merge
```

```tsx
import { FhirQuestionnaire } from 'react-fhir-forms';
import { ShadcnForm, shadcnRenderers } from 'react-fhir-forms/shadcn';

<FhirQuestionnaire questionnaire={q} components={shadcnRenderers} onSubmit={fn}>
  <ShadcnForm submitLabel="Submit response" />
</FhirQuestionnaire>
```

The recipe also re-exports its underlying `Button`, `Input`, `Checkbox`, `Select`, etc. — mix and match with your existing shadcn components.

### Tailwind config

For either recipe, add the library path to your Tailwind `content` so its classes are emitted:

```js
// tailwind.config.js
content: [
  './src/**/*.{ts,tsx}',
  './node_modules/react-fhir-forms/dist/**/*.js',
]
```

## v1 scope

- Types: `group`, `display`, `string`, `text`, `integer`, `decimal`, `boolean`, `date`, `dateTime`, `choice`, `open-choice`
- `enableWhen` with `enableBehavior: all | any` and operators `=`, `!=`, `exists`, `>`, `<`, `>=`, `<=`
- `required`, `repeats`, nested groups, inline errors
- Typed `QuestionnaireResponse` output

## Out of scope (v2)

- `attachment`, `reference`, `quantity` types
- FHIRPath-based `enableWhen`
- Server roundtrip / persistence
- i18n
