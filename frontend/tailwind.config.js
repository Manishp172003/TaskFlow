/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1d4ed8',
        },
        page: '#F8FAFC',
        sidebar: {
          DEFAULT: '#0F172A',
          hover: '#1E293B',
          active: '#334155',
          border: '#1E293B',
        },
        card: '#FFFFFF',
        textPrimary: '#0F172A',
        textSecondary: '#64748B',
        borderSubtle: '#E2E8F0',
        status: {
          success: '#16A34A',
          warning: '#F59E0B',
          danger: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 1px 3px rgba(15, 23, 42, 0.08)',
      }
    },
  },
  plugins: [],
}
