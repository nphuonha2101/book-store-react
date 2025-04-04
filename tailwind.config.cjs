/** @type {import('tailwindcss').Config} */
const typography = require('@tailwindcss/typography');
const lineClamp = require('@tailwindcss/line-clamp');

module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            borderRadius: {
                'custom': '10px',
                '50': '70px',
            },
            backgroundColor: {
                'custom': '#E0F1F0',
            },
            width: {
                'calc-100vw': 'calc(100vw)',
            },
            fontFamily: {
                sans: ['Nunito', 'sans-serif'],
            },
        }
    },
    plugins: [
        typography,
        lineClamp,
    ],
}