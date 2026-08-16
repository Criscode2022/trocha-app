module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        bg: '#E8EAED', surface: '#FFFFFF', ink: '#121417', 'ink-muted': '#5C636B',
        primary: { DEFAULT: '#F5A623', soft: '#FFF1D6', strong: '#D4890F' },
        asphalt: '#121417', steel: '#3A4048', border: '#D9D4C8', fog: '#9AA0A6',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
