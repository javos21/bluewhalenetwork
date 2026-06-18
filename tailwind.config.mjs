/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Core palette (from inspiration design system)
        blue:  { DEFAULT: '#5E78EE', dark: '#4A63D6', light: '#EEF1FE' },
        ink:   { DEFAULT: '#0A1236', soft: '#3A4060', mute: '#6B7090' },
        cloud: { DEFAULT: '#F6F6F6', card: '#FFFFFF' },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // role         size       line-height
        h1:      ['5rem',    { lineHeight: '5.625rem', fontWeight: '900' }], // 80 / 90
        h2:      ['3.75rem', { lineHeight: '4.5rem',   fontWeight: '900' }], // 60 / 72
        h3:      ['3.125rem',{ lineHeight: '3.5rem',   fontWeight: '900' }], // 50 / 56
        h4:      ['2rem',    { lineHeight: '2.5rem',   fontWeight: '900' }], // 32 / 40
        h5:      ['1.5rem',  { lineHeight: '1.75rem',  fontWeight: '900' }], // 24 / 28
        body1:   ['1rem',    { lineHeight: '1.5rem' }],                       // 16 / 24
        body2:   ['0.875rem',{ lineHeight: '1.125rem' }],                     // 14 / 18
        caption: ['0.875rem',{ lineHeight: '1.125rem', fontWeight: '700' }],  // 14 / 18 bold
      },
      maxWidth: {
        content: '1200px',
      },
      borderRadius: {
        card: '24px',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 12px 40px rgba(10,18,54,0.08)',
        card: '0 8px 30px rgba(10,18,54,0.06)',
        pill: '0 8px 20px rgba(94,120,238,0.35)',
      },
      backgroundImage: {
        'lavender-glow': 'radial-gradient(ellipse 80% 60% at 70% 10%, rgba(94,120,238,0.16), rgba(246,246,246,0) 70%)',
      },
    },
  },
  plugins: [],
};
