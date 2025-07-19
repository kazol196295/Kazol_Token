/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    colors: {
        primary: '#799EFF',
        bgSoft: '#FEFFC4',
        accentLight: '#FFDE63',
        accent: '#FFBC4C',
    }
}
