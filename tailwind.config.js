/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ios: {
          blue: "#007AFF",
          green: "#34C759",
          red: "#FF3B30",
          orange: "#FF9500",
          teal: "#5AC8FA",
          indigo: "#5856D6",
          fill: {
            primary: "#787880",
            secondary: "#787880",
            tertiary: "#7676801F",
          },
          bg: {
            primary: "#FFFFFF",
            secondary: "#F2F2F7",
            grouped: "#F2F2F7",
          },
          separator: "#C6C6C8",
        },
      },
      fontFamily: {
        sf: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          "sans-serif",
        ],
        "sf-rounded": [
          '"SF Pro Rounded"',
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        mono: ['"SF Mono"', "ui-monospace", "Menlo", "monospace"],
      },
      borderRadius: {
        ios: "12px",
        "ios-lg": "16px",
        "ios-xl": "20px",
      },
      boxShadow: {
        "ios-sm": "0 1px 2px rgba(0,0,0,0.04)",
        ios: "0 2px 8px rgba(0,0,0,0.06)",
        "ios-md": "0 4px 16px rgba(0,0,0,0.08)",
        "ios-lg": "0 8px 30px rgba(0,0,0,0.1)",
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease forwards",
        "slide-up": "slideUp 0.32s cubic-bezier(0.32,0.72,0,1) forwards",
        "pop-in": "popIn 0.25s ease forwards",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        slideUp: {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        popIn: {
          "0%": { transform: "scale(0.85)", opacity: 0 },
          "60%": { transform: "scale(1.03)" },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
