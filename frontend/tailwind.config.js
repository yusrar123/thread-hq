/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                script: ['"Great Vibes"', 'cursive'],
            },
            colors: {
                redThread: "#923d34",
                redThreadDark: "#7d2f2a",
                cream: "#f7f4f1",
            },
        },
    },
    plugins: [],
};
