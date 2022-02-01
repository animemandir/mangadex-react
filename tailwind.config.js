const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    {pattern: /text-(red|blue|yellow|green|cyan|purple|pink)-(100|200|300|400|500|600|700|800|900)/},
    {pattern: /bg-(red|blue|yellow|green|cyan|purple|pink)-(100|200|300|400|500|600|700|800|900)/},
    {pattern: /border-(red|blue|yellow|green|cyan|purple|pink)-(100|200|300|400|500|600|700|800|900)/},
    {pattern: /accent-(red|blue|yellow|green|cyan|purple|pink)-(100|200|300|400|500|600|700|800|900)/},
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        gray: colors.slate,
        green: colors.emerald,
        purple: colors.fuchsia,
      }
    },
  },
  plugins: [],
}
