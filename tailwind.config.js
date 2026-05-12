/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg: {
          0: '#0c0e12', 1: '#0f1115', 2: '#13161b', 3: '#191d24', 4: '#1f242d',
        },
        surface: {
          0: 'rgba(255,255,255,0.025)',
          1: 'rgba(255,255,255,0.04)',
          2: 'rgba(255,255,255,0.06)',
        },
        ink: {
          0: '#f2f3f5', 1: '#9da3ae', 2: '#5c6370', 3: '#3d4350',
        },
        accent: '#5b6af8',
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px' }],
        xs:  ['11px', { lineHeight: '16px' }],
        sm:  ['13px', { lineHeight: '20px' }],
        base:['14px', { lineHeight: '22px' }],
        md:  ['15px', { lineHeight: '24px' }],
        lg:  ['17px', { lineHeight: '26px' }],
        xl:  ['20px', { lineHeight: '30px' }],
        '2xl':['24px',{ lineHeight: '34px' }],
        '3xl':['30px',{ lineHeight: '40px' }],
      },
    },
  },
  plugins: [],
}
