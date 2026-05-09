/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
            },
            colors: {
                blue: {
                    50: '#f0f7ff',
                    100: '#e0effe',
                    200: '#bae0fd',
                    300: '#7cc9fb',
                    400: '#36aef7',
                    500: '#0c95e9',
                    600: '#0276c3',
                    700: '#035e9e',
                    800: '#075082',
                    900: '#0c436c',
                    950: '#082b49',
                },
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
        },
    },
    plugins: [],
}
