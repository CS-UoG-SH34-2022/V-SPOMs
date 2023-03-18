/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    minHeight:{
      '750' : '750px'
    },
    minWidth:{
      '1300' : '1300px'
    },
    screens: {
      'desktop' : '1920px',
    },
    extend: {
      colors: {
        'dark-blue': "#00355F",
        'main-blue': "#0084ED",
        'light-blue' : "#CCE6FB",
        'hover-blue': "#005192",
        'button-delete': "#FF4343",
        'button-edit': "#E7DF27",
        'button-new':"#3DD9A1",
        // 'primary': "#0084ED",
        //secondary: "#00355F",
      },
      fontFamily:{
        display: ["Poppins", "sans-serif"],
      }
    },
  },
  plugins: [require("daisyui")],
};
