import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'tailwind/index': 'src/tailwind/index.ts',
    'shadcn/index': 'src/shadcn/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', /^@radix-ui\//],
  target: 'es2020',
});
