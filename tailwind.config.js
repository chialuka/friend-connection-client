/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      gentiumBasic: "Gentium Basic"
    },
    extend: {
      colors: {
        primary: "#0866ff"
      },
    },
  },
  plugins: [],
}

