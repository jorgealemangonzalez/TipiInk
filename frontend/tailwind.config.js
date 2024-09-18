/** @type {import('tailwindcss').Config} */
import * as colors from 'tailwindcss/colors'
import * as daisyui from "daisyui"

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
        colors: {
            ...colors,
            'main': {
                '50': '#effcfc',
                '100': '#d7f5f6',
                '200': '#b4ebed',
                '300': '#80dce0',
                '400': '#3fc1c9',
                '500': '#2aa7b0',
                '600': '#258795',
                '700': '#246d7a',
                '800': '#265a64',
                '900': '#234c56',
                '950': '#12323a',
            },

        }
    },
    daisyui: {
        themes: [
            {
                mytheme: {
                    "primary": "#3fc1c9",
                    "secondary": "#3F7CC9",
                    "accent": "#3FC98C",
                    "neutral": "#12323a",
                    "base-100": "#effcfc",
                    "info": "#b7f0fe",
                    "success": "#00aa6f",
                    "warning": "#ffc000",
                    "error": "#FECACA",
                },
            },
        ], // TODO add dark theme
    },
    plugins: [
        daisyui
    ],
}

