/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './.storybook/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../react-fhir-forms/src/**/*.{ts,tsx}',
  ],
  theme: { extend: {} },
  plugins: [],
};
