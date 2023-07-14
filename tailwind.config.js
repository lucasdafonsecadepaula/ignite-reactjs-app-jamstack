/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gray-100': '#e1e1e6',
        'gray-300': '#a8a8b3',
        'gray-700': '#323238',
        'gray-800': '#29292e',
        'gray-850': '#1f2729',
        'gray-900': '#121214',

        'cyan-500': '#61dafb',
        'yellow-500': '#eba417'
      }
    },
  },
  plugins: [],
}
