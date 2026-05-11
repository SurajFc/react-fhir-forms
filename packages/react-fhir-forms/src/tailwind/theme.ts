export interface TailwindClassNames {
  form: string;
  group: string;
  groupTitle: string;
  field: string;
  label: string;
  required: string;
  input: string;
  textarea: string;
  select: string;
  checkbox: string;
  radio: string;
  optionLabel: string;
  error: string;
  display: string;
  actions: string;
  submit: string;
}

export const tailwindClassNames: TailwindClassNames = {
  form: 'space-y-6',
  group: 'space-y-4 rounded-lg border border-slate-200 p-4',
  groupTitle: 'text-base font-semibold text-slate-900',
  field: 'space-y-1.5',
  label: 'block text-sm font-medium text-slate-800',
  required: 'text-rose-600 ml-0.5',
  input:
    'block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500',
  textarea:
    'block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[80px]',
  select:
    'block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500',
  checkbox: 'h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500',
  radio: 'h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500',
  optionLabel: 'ml-2 text-sm text-slate-800',
  error: 'text-xs text-rose-600 mt-1',
  display: 'text-sm text-slate-600',
  actions: 'flex items-center justify-end gap-3 pt-2',
  submit:
    'inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
};
