/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // === CkStock Brand Palette ===
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        muted: "var(--color-muted)",
        "muted-foreground": "var(--color-muted-foreground)",

        // Primary (Blue)
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
          light: "var(--color-primary-light)",
          dark: "var(--color-primary-dark)",
        },

        // Success (Emerald)
        success: {
          DEFAULT: "var(--color-success)",
          foreground: "var(--color-success-foreground)",
          light: "var(--color-success-light)",
        },

        // Warning (Amber)
        warning: {
          DEFAULT: "var(--color-warning)",
          foreground: "var(--color-warning-foreground)",
          light: "var(--color-warning-light)",
        },

        // Danger (Rose)
        danger: {
          DEFAULT: "var(--color-danger)",
          foreground: "var(--color-danger-foreground)",
          light: "var(--color-danger-light)",
        },

        accent: {
          purple: "var(--color-accent-purple)",
          cyan: "var(--color-accent-cyan)",
          pink: "var(--color-accent-pink)",
        },

        border: "var(--color-border)",
        "border-light": "var(--color-border-light)",
        ring: "var(--color-ring)",

        // Glass / Surface
        glass: {
          DEFAULT: "var(--glass-bg)",
          stroke: "var(--glass-stroke)",
          highlight: "var(--glass-highlight)",
        },
      },

      boxShadow: {
        // Neumorphism (light mode)
        'neu-sm': '3px 3px 6px #d9d9d9, -3px -3px 6px #ffffff',
        'neu': '5px 5px 12px #d1d1d1, -5px -5px 12px #ffffff',
        'neu-lg': '8px 8px 20px #c8c8c8, -8px -8px 20px #ffffff',
        'neu-inset': 'inset 3px 3px 6px #d9d9d9, inset -3px -3px 6px #ffffff',

        // Neumorphism (dark mode)
        'neu-sm-dark': '3px 3px 6px #1a1a1a, -3px -3px 6px #2a2a2a',
        'neu-dark': '5px 5px 12px #151515, -5px -5px 12px #2d2d2d',
        'neu-lg-dark': '8px 8px 20px #111111, -8px -8px 20px #313131',
        'neu-inset-dark': 'inset 3px 3px 6px #1a1a1a, inset -3px -3px 6px #2a2a2a',

        // Glass shadows
        'glass-sm': '0 2px 8px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.5)',
        'glass': '0 4px 16px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.6)',
        'glass-lg': '0 8px 32px rgba(0, 0, 0, 0.10), 0 0 0 1px rgba(255, 255, 255, 0.7)',
        'glass-dark-sm': '0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'glass-dark': '0 4px 16px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'glass-dark-lg': '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.12)',
      },

      backdropBlur: {
        xs: '2px',
      },

      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        hebrew: ['"Noto Sans Hebrew"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },

      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(37, 99, 235, 0.3), 0 0 10px rgba(37, 99, 235, 0.1)' },
          '100%': { boxShadow: '0 0 10px rgba(37, 99, 235, 0.5), 0 0 20px rgba(37, 99, 235, 0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}