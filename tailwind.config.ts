/** @type {import('tailwindcss').Config} */
import tailgridsPlugin from "tailgrids/plugin";
import typography from '@tailwindcss/typography';
import lineClamp from '@tailwindcss/line-clamp';

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/tailgrids/**/*.{js,ts,jsx,tsx}",
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
            }
        }
    },
    plugins: [
        typography,
        lineClamp,
        tailgridsPlugin
    ],
}