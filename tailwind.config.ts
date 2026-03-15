import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        cell: {
          peer: 'rgb(var(--peer-highlight) / <alpha-value>)',
          selected: 'rgb(var(--selected-highlight) / <alpha-value>)',
          same: 'rgb(var(--same-digit-highlight) / <alpha-value>)'
        }
      }
    }
  },
  plugins: []
} satisfies Config;
