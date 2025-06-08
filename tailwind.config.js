import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    light: "#e9eff2",
                    DEFAULT: "#365b6d",
                    dark: "#2a4a5a",
                },
                accent: {
                    light: "#5eead4",
                    DEFAULT: "#2dd4bf",
                    dark: "#14b8a6",
                },
            },
        },
    },

    plugins: [forms],
};
