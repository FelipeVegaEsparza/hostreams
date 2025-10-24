import tailwindcss from 'tailwindcss'; // Importar tailwindcss directamente
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss(), // Llamar a tailwindcss como función
    autoprefixer(), // Llamar a autoprefixer como función
  ],
}