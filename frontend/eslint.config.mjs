import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/**
 * Flat ESLint config (ESLint v9+/v10). `next lint` was removed in Next 16 and
 * the legacy .eslintrc.json + `--ext` form is unsupported by ESLint 10, so we
 * compose Next's shareable flat configs directly.
 */
const config = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // Build/tooling config files are CommonJS by design.
    ignores: ['.next/**', 'node_modules/**', 'e2e/**', 'playwright.config.ts'],
  },
  {
    files: ['*.config.js', 'postcss.config.js', 'tailwind.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];

export default config;
