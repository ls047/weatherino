/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sunny/Clear theme (warm sunset colors)
        sunny: {
          gradient: {
            start: '#f97316', // Warm orange
            middle: '#c2410c', // Deep orange
            end: '#7c2d12'    // Dark orange-brown
          },
          button: '#ea580c',
          accent: '#fb923c',
          text: '#fff7ed',    // Warm white
          mutedText: 'rgba(255, 247, 237, 0.7)',
          highlight: '#fdba74',
          border: '#ea580c80',
          btnBg: '#ea580c',
          accentColor: '#fb923c',
          textColor: '#fff7ed',
          weatherCardClass: 'from-orange-500/20 to-orange-800/20',
          mainTextClass: 'text-white',
          secondaryTextClass: 'text-white/60'
        },
        // Cloudy theme (soft grays)
        cloudy: {
          gradient: {
            start: '#64748b',
            middle: '#475569',
            end: '#334155'
          },
          button: '#94a3b8',
          accent: '#cbd5e1',
          text: '#f8fafc',
          mutedText: 'rgba(248, 250, 252, 0.7)',
          highlight: '#e2e8f0',
          border: '#94a3b880',
          btnBg: '#94a3b8',
          accentColor: '#cbd5e1',
          textColor: '#f8fafc',
          weatherCardClass: 'from-gray-500/20 to-gray-800/20',
          mainTextClass: 'text-white',
          secondaryTextClass: 'text-white/60'
        },
        // Rainy theme (deep blues)
        rainy: {
          gradient: {
            start: '#0ea5e9',
            middle: '#0369a1',
            end: '#075985'
          },
          button: '#0284c7',
          accent: '#38bdf8',
          text: '#f0f9ff',
          mutedText: 'rgba(240, 249, 255, 0.7)',
          highlight: '#7dd3fc',
          border: '#0284c780',
          btnBg: '#0284c7',
          accentColor: '#38bdf8',
          textColor: '#f0f9ff',
          weatherCardClass: 'from-blue-500/20 to-blue-800/20',
          mainTextClass: 'text-white',
          secondaryTextClass: 'text-white/60'
        },
        // Snow theme (pure whites and light blues)
        snow: {
          gradient: {
            start: '#e2e8f0',
            middle: '#cbd5e1',
            end: '#94a3b8'
          },
          button: '#64748b',
          accent: '#f1f5f9',
          text: '#1e293b',
          mutedText: 'rgba(30, 41, 59, 0.7)',
          highlight: '#f8fafc',
          border: '#64748b80',
          btnBg: '#64748b',
          accentColor: '#f1f5f9',
          textColor: '#1e293b',
          weatherCardClass: 'from-gray-200/20 to-gray-400/20',
          mainTextClass: 'text-gray-900',
          secondaryTextClass: 'text-gray-900/60'
        },
        // Thunderstorm theme (dark purples)
        thunder: {
          gradient: {
            start: '#6b21a8',
            middle: '#581c87',
            end: '#3b0764'
          },
          button: '#7e22ce',
          accent: '#a855f7',
          text: '#faf5ff',
          mutedText: 'rgba(250, 245, 255, 0.7)',
          highlight: '#d8b4fe',
          border: '#7e22ce80',
          btnBg: '#7e22ce',
          accentColor: '#a855f7',
          textColor: '#faf5ff',
          weatherCardClass: 'from-purple-500/20 to-purple-800/20',
          mainTextClass: 'text-white',
          secondaryTextClass: 'text-white/60'
        },
        // Mist/Fog theme (soft whites)
        mist: {
          gradient: {
            start: '#9ca3af',
            middle: '#6b7280',
            end: '#4b5563'
          },
          button: '#6b7280',
          accent: '#d1d5db',
          text: '#f9fafb',
          mutedText: 'rgba(249, 250, 251, 0.7)',
          highlight: '#e5e7eb',
          border: '#6b728080',
          btnBg: '#6b7280',
          accentColor: '#d1d5db',
          textColor: '#f9fafb',
          weatherCardClass: 'from-gray-400/20 to-gray-600/20',
          mainTextClass: 'text-white',
          secondaryTextClass: 'text-white/60'
        },
        // Night/Clear night theme (deep blues)
        night: {
          gradient: {
            start: '#1e1b4b',
            middle: '#0f172a',
            end: '#020617'
          },
          button: '#1e293b',
          accent: '#334155',
          text: '#f8fafc',
          mutedText: 'rgba(248, 250, 252, 0.7)',
          highlight: '#94a3b8',
          border: '#1e293b80',
          btnBg: '#1e293b',
          accentColor: '#334155',
          textColor: '#f8fafc',
          weatherCardClass: 'from-gray-800/20 to-gray-900/20',
          mainTextClass: 'text-white',
          secondaryTextClass: 'text-white/60'
        }
      },
      backgroundImage: {
        'sunny-gradient': 'linear-gradient(135deg, var(--tw-gradient-from) 20%, var(--tw-gradient-middle) 50%, var(--tw-gradient-to) 80%)',
        'cloudy-gradient': 'linear-gradient(135deg, var(--tw-gradient-from) 20%, var(--tw-gradient-middle) 50%, var(--tw-gradient-to) 80%)',
        'rainy-gradient': 'linear-gradient(135deg, var(--tw-gradient-from) 20%, var(--tw-gradient-middle) 50%, var(--tw-gradient-to) 80%)',
        'snow-gradient': 'linear-gradient(135deg, var(--tw-gradient-from) 20%, var(--tw-gradient-middle) 50%, var(--tw-gradient-to) 80%)',
        'thunder-gradient': 'linear-gradient(135deg, var(--tw-gradient-from) 20%, var(--tw-gradient-middle) 50%, var(--tw-gradient-to) 80%)',
        'mist-gradient': 'linear-gradient(135deg, var(--tw-gradient-from) 20%, var(--tw-gradient-middle) 50%, var(--tw-gradient-to) 80%)',
        'night-gradient': 'linear-gradient(135deg, var(--tw-gradient-from) 20%, var(--tw-gradient-middle) 50%, var(--tw-gradient-to) 80%)',
      }
    },
  },
  plugins: [],
}