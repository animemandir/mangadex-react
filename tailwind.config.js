module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      rotate: ['active', 'group-hover'],
    },
    width: ["responsive", "hover", "focus"]
  },
  plugins: [],
}
