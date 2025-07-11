import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
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
                background: "#f3f4f6",
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
                disable: {
                    light: "#e5e7eb",
                    DEFAULT: "#9ca3af",
                    dark: "#6b7280",
                },
                warning: {
                    light: "#fef3c7",
                    DEFAULT: "#facc15",
                    dark: "#eab308",
                },
                danger: {
                    light: "#fee2e2",
                    DEFAULT: "#ef4444",
                    dark: "#b91c1c",
                },
                success: {
                    light: "#d1fae5",
                    DEFAULT: "#22c55e",
                    dark: "#15803d",
                },

                /* accent new = DEFAULT: "#82f9be", */
            },
        },
    },

    plugins: [forms],
};
