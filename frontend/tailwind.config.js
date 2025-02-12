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
            // Fondo principal (muy oscuro)
        'dark-bg': '#121212',
        
        // Fondo de tarjetas / secciones
        'dark-card-bg': '#1E1E1E',
        
        // Texto principal y secundario
        'primary': '#FFFFFF',
        'secondary': '#B3B3B3',
        
        // Colores acento (naranjas)
        'accent': '#FF5C35',
        'accent-light': '#FB6D3A',
        
        // Para algún estado de entrega (puedes ajustar)
        'delivered': '#FF6D4E',

        // Grises de apoyo (opcional)
        'gray-700': '#2C2C2C',
        'gray-500': '#4C4C4C',

        'green-vegetables': '#007d5a',
        'red-meat': '#7d0000',
        'blue-fish': '#001d7d',
        }
    },
    plugins: [
    ],
}

