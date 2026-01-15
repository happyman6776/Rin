/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-color-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        'theme': '#2563eb',        // 主蓝（健康信任感）
        'theme-hover': '#1d4ed8',
        'theme-active': '#1e40af',
        'accent': '#10b981',       // 绿色强调（可选健康感）
        'card': {
          'light': '#ffffff',
          'dark': '#1e293b',
        },
        'background': {
          'light': '#f8fafc',
          'dark': '#0f172a',
        },
      },
      transitionProperty: {
        'height': 'height',
        'width': 'width',
        'spacing': 'margin, padding',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: { color: theme('colors.theme'), '&:hover': { color: theme('colors.theme-hover') } },
            h1: { color: theme('colors.gray.900'), fontWeight: '800' },
            h2: { color: theme('colors.gray.900'), fontWeight: '700' },
            code: { color: theme('colors.theme'), background: theme('colors.gray.100'), borderRadius: '0.375rem' },
            pre: { background: theme('colors.gray.100'), borderRadius: '1rem' },
            'dark &': {
              color: theme('colors.gray.300'),
              a: { color: theme('colors.theme') },
              h1: { color: theme('colors.white') },
              h2: { color: theme('colors.white') },
              code: { background: theme('colors.gray.800') },
              pre: { background: theme('colors.gray.900') },
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}