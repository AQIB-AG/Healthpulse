/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        primaryLight: '#60A5FA',
        accent: '#8B5CF6',
        accentSoft: '#60A5FA',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        text: {
          primary: '#1E293B',
          muted: '#64748B',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        soft: '0 4px 12px rgba(15,23,42,0.06)',
        elevated: '0 12px 40px rgba(15,23,42,0.14)',
        glow: '0 0 40px rgba(37,99,235,0.45)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

