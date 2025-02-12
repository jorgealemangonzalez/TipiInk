/** @type {import('tailwindcss').Config} */
import * as colors from 'tailwindcss/colors'

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
        colors: {
            ...colors,
            
            // Custom colors
            'background': 'hsl(240 10% 3.9%)',
            'foreground': 'hsl(0 0% 98%)',
            'card': 'hsl(240 10% 3.9%)',
            'card-foreground': 'hsl(0 0% 98%)',
            'popover': 'hsl(240 10% 3.9%)',
            'popover-foreground': 'hsl(0 0% 98%)',
            'primary': 'hsl(0 0% 98%)',
            'primary-foreground': 'hsl(240 5.9% 10%)',
            'secondary': 'hsl(240 3.7% 15.9%)',
            'secondary-foreground': 'hsl(0 0% 98%)',
            'muted': 'hsl(240 3.7% 15.9%)',
            'muted-foreground': 'hsl(240 5% 64.9%)',
            'accent': 'hsl(240 3.7% 15.9%)',
            'accent-foreground': 'hsl(0 0% 98%)',
            'destructive': 'hsl(0 62.8% 70.6%)',
            'destructive-foreground': 'hsl(0 0% 98%)',
            'border': 'hsl(240 3.7% 15.9%)',
            'input': 'hsl(240 3.7% 15.9%)',
            'ring': 'hsl(240 4.9% 83.9%)',
            'chart-1': 'hsl(220 70% 50%)',
            'chart-2': 'hsl(160 60% 45%)',
            'chart-3': 'hsl(30 80% 55%)',
            'chart-4': 'hsl(280 65% 60%)',
            'chart-5': 'hsl(340 75% 55%)',
        
        // Para algún estado de entrega (puedes ajustar)
        'delivered': '#FF6D4E',

        'green-vegetables': '#007d5a',
        'red-meat': '#7d0000',
        'blue-fish': '#001d7d',
        }
    },
    plugins: [
    ],
}
