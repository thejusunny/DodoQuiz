/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/*.{html,js}"],
  theme: {
    extend: {
      height:{
        '11/12':'91.66667%',
        '20/21':'95.23809523809524%'

      },
      width:{
        '19/20':'95.23809523809524%',
        '20/21':'97.23809523809524%',
        '2/8':'25%'
      }

    },
    fontFamily:
    {
      'Monteserrat': ['Montserrat','sans-serif'],
    }
  },
  plugins: [
  ],
}

