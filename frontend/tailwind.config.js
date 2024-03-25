/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors:{
        'me' : "#121212"
      },
      backgroundImage: {
        'my-bg': "url('/src/assets/background.jpg')",
        'chat-dark': "url('/src/assets/whatsappbg.png')",
        'chat-light': "url('/src/assets/whatsappbglight.png')",
      }
    },
  },
  plugins: [],
  darkMode: 'class',
};
