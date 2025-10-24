# Frontend de Hostreams

Este es el frontend de la plataforma de suscripciones de Hostreams, construido con React, Vite y TailwindCSS.

## Configuración

1.  **Navegar al directorio del frontend:**
    ```bash
    cd hostreams/frontend
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    Esto iniciará la aplicación en `http://localhost:5173` (o un puerto similar).

## Estructura del Proyecto

*   `src/`: Contiene el código fuente de la aplicación.
    *   `components/`: Componentes reutilizables (e.g., Header, Footer).
    *   `context/`: Contextos de React para el manejo de estado global (e.g., CurrencyContext).
    *   `pages/`: Componentes de página (e.g., Home, Plans, Login, Register, MyAccount).
    *   `App.jsx`: Componente principal que configura el enrutamiento.
    *   `main.jsx`: Punto de entrada de la aplicación.
    *   `index.css`: Archivo CSS principal con las directivas de Tailwind.

## Tecnologías Utilizadas

*   **React:** Librería para construir interfaces de usuario.
*   **Vite:** Herramienta de construcción rápida para proyectos web.
*   **TailwindCSS:** Framework CSS de utilidad para un diseño rápido y personalizado.
*   **React Router DOM:** Para el enrutamiento de la aplicación.
*   **Axios:** Cliente HTTP para realizar peticiones a la API del backend.
*   **React Toastify:** Para notificaciones de éxito/error.
*   **Font Awesome:** Para iconos.