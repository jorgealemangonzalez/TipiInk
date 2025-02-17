import * as colors from 'tailwindcss/colors'
import animate from "tailwindcss-animate"

const config = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
        colors: {
            ...colors,
            "border": "hsl(var(--border))",
            "input": "hsl(var(--input))",
            "ring": "hsl(var(--ring))",
            "background": "hsl(var(--background))",
            "foreground": "hsl(var(--foreground))",
            "primary": {
                "DEFAULT": "hsl(var(--primary))",
                "foreground": "hsl(var(--primary-foreground))"
            },
            "secondary": {
                "DEFAULT": "hsl(var(--secondary))",
                "foreground": "hsl(var(--secondary-foreground))"
            },
            "destructive": {
                "DEFAULT": "hsl(var(--destructive))",
                "foreground": "hsl(var(--destructive-foreground))"
            },
            "muted": {
                "DEFAULT": "hsl(var(--muted))",
                "foreground": "hsl(var(--muted-foreground))"
            },
            "accent": {
                "DEFAULT": "hsl(var(--accent))",
                "foreground": "hsl(var(--accent-foreground))"
            },
            "popover": {
                "DEFAULT": "hsl(var(--popover))",
                "foreground": "hsl(var(--popover-foreground))"
            },
            "card": {
                "DEFAULT": "hsl(var(--card))",
                "foreground": "hsl(var(--card-foreground))"
            },
            "neutral": "#12323a",
            "base-100": "#effcfc",
            "info": "#b7f0fe",
            "success": "#00aa6f",
            "warning": "#ffc000",
            "error": "#ff6569",
        },
        keyframes: {
            "accordion-down": {
                "from": {
                    "height": "0"
                },
                "to": {
                    "height": "var(--radix-accordion-content-height)"
                }
            },
            "accordion-up": {
                "from": {
                    "height": "var(--radix-accordion-content-height)"
                },
                "to": {
                    "height": "0"
                }
            }
        }
    },
    plugins: [animate],
}
export default config
