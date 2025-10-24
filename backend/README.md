# Backend de Hostreams

Este es el backend de la plataforma de suscripciones de Hostreams, construido con Node.js, Express y Sequelize (MySQL).

## Configuración

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd hostreams/backend
    ```
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del directorio `backend` y copia el contenido de `.env.example`. Rellena tus credenciales de base de datos y pasarelas de pago.

    ```
    PORT=3000
    JWT_SECRET=supersecretjwtkey
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=password
    DB_NAME=hostreams_db

    PAYPAL_CLIENT_ID=your_paypal_client_id
    PAYPAL_CLIENT_SECRET=your_paypal_client_secret
    PAYPAL_API_BASE=https://api-m.sandbox.paypal.com # O https://api-m.paypal.com para producción

    MERCADOPAGO_ACCESS_TOKEN=your_mercadopago_access_token

    FLOW_API_KEY=your_flow_api_key
    FLOW_SECRET_KEY=your_flow_secret_key
    FLOW_API_URL=https://sandbox.flow.cl/api # O https://api.flow.cl/api para producción
    ```
4.  **Sincronizar base de datos y seeders:**
    Asegúrate de tener un servidor MySQL corriendo y una base de datos llamada `hostreams_db` (o el nombre que hayas configurado en `.env`). Luego, ejecuta:
    ```bash
    node src/config/sync.js
    ```
    Esto creará las tablas y poblará algunos datos de ejemplo para los planes.

5.  **Iniciar el servidor:**
    ```bash
    node src/index.js
    ```

## Endpoints de la API

### Autenticación (`/api/auth`)

*   **POST /api/auth/register**
    *   **Descripción:** Registra un nuevo usuario.
    *   **Acceso:** Público
    *   **Body (JSON):**
        ```json
        {
            "nombre": "John Doe",
            "email": "john.doe@example.com",
            "contrasena": "password123",
            "pais": "Chile",
            "moneda_preferida": "CLP",
            "rol": "cliente"
        }
        ```

*   **POST /api/auth/login**
    *   **Descripción:** Autentica un usuario y devuelve un token JWT.
    *   **Acceso:** Público
    *   **Body (JSON):**
        ```json
        {
            "email": "john.doe@example.com",
            "contrasena": "password123"
        }
        ```
    *   **Respuesta (JSON - Éxito):**
        ```json
        {
            "token": "eyJhbGciOiJIUzI1Ni..."
        }
        ```

### Planes (`/api/plans`)

*   **GET /api/plans**
    *   **Descripción:** Obtiene todos los planes disponibles.
    *   **Acceso:** Público
    *   **Respuesta (JSON - Éxito):**
        ```json
        [
            {
                "id": 1,
                "nombre": "Básico",
                "descripcion": "Plan básico con características esenciales.",
                "precio_clp": "5000.00",
                "precio_usd": "6.00",
                "periodo": "mensual",
                "caracteristicas": "[\"Acceso a contenido estándar\",\"Soporte básico\"]",
                "estado": "activo",
                "fecha_creacion": "2023-10-27T10:00:00.000Z"
            }
        ]
        ```

*   **GET /api/plans/:id**
    *   **Descripción:** Obtiene un plan por su ID.
    *   **Acceso:** Público
    *   **Respuesta (JSON - Éxito):**
        ```json
        {
            "id": 1,
            "nombre": "Básico",
            "descripcion": "Plan básico con características esenciales.",
            "precio_clp": "5000.00",
            "precio_usd": "6.00",
            "periodo": "mensual",
            "caracteristicas": "[\"Acceso a contenido estándar\",\"Soporte básico\"]",
            "estado": "activo",
            "fecha_creacion": "2023-10-27T10:00:00.000Z"
        }
        ```

*   **POST /api/plans**
    *   **Descripción:** Crea un nuevo plan.
    *   **Acceso:** Privado (Admin)
    *   **Headers:** `x-auth-token: <JWT_TOKEN>`
    *   **Body (JSON):**
        ```json
        {
            "nombre": "Nuevo Plan",
            "descripcion": "Descripción del nuevo plan.",
            "precio_clp": 7500,
            "precio_usd": 9.00,
            "periodo": "anual",
            "caracteristicas": ["Característica 1", "Característica 2"],
            "estado": "activo"
        }
        ```

*   **PUT /api/plans/:id**
    *   **Descripción:** Actualiza un plan existente.
    *   **Acceso:** Privado (Admin)
    *   **Headers:** `x-auth-token: <JWT_TOKEN>`
    *   **Body (JSON):** (Mismos campos que POST)

*   **DELETE /api/plans/:id**
    *   **Descripción:** Elimina un plan.
    *   **Acceso:** Privado (Admin)
    *   **Headers:** `x-auth-token: <JWT_TOKEN>`

### Usuarios (`/api/users`)

*   **GET /api/users**
    *   **Descripción:** Obtiene todos los usuarios registrados.
    *   **Acceso:** Privado (Admin)
    *   **Headers:** `x-auth-token: <JWT_TOKEN>`
    *   **Respuesta (JSON - Éxito):**
        ```json
        [
            {
                "id": 1,
                "nombre": "Admin User",
                "email": "admin@example.com",
                "pais": "Chile",
                "moneda_preferida": "CLP",
                "rol": "admin",
                "fecha_registro": "2023-10-27T10:00:00.000Z"
            }
        ]
        ```

### Suscripciones (`/api/subscriptions`)

*   **GET /api/subscriptions**
    *   **Descripción:** Obtiene todas las suscripciones.
    *   **Acceso:** Privado (Admin)
    *   **Headers:** `x-auth-token: <JWT_TOKEN>`
    *   **Respuesta (JSON - Éxito):**
        ```json
        [
            {
                "id": 1,
                "usuario_id": 1,
                "plan_id": 1,
                "metodo_pago": "paypal",
                "monto": "6.00",
                "moneda": "USD",
                "estado": "activa",
                "fecha_inicio": "2023-10-27T10:00:00.000Z",
                "fecha_renovacion": null,
                "User": {
                    "id": 1,
                    "nombre": "Admin User",
                    "email": "admin@example.com"
                },
                "Plan": {
                    "id": 1,
                    "nombre": "Básico",
                    "precio_clp": "5000.00",
                    "precio_usd": "6.00"
                }
            }
        ]
        ```

*   **PUT /api/subscriptions/:id/status**
    *   **Descripción:** Actualiza el estado de una suscripción.
    *   **Acceso:** Privado (Admin)
    *   **Headers:** `x-auth-token: <JWT_TOKEN>`
    *   **Body (JSON):**
        ```json
        {
            "estado": "activa"
        }
        ```

### Pagos Manuales (`/api/manual-payment`)

*   **POST /api/manual-payment/create**
    *   **Descripción:** Registra un pago manual y sube un comprobante.
    *   **Acceso:** Privado (Usuario autenticado)
    *   **Headers:** `x-auth-token: <JWT_TOKEN>`
    *   **Body (multipart/form-data):**
        *   `usuario_id`: ID del usuario
        *   `suscripcion_id`: ID de la suscripción
        *   `monto`: Monto del pago
        *   `moneda`: Moneda (CLP/USD)
        *   `comprobante`: Archivo del comprobante (tipo `file`)

*   **PUT /api/manual-payment/approve/:paymentId**
    *   **Descripción:** Aprueba o rechaza un pago manual.
    *   **Acceso:** Privado (Admin)
    *   **Headers:** `x-auth-token: <JWT_TOKEN>`
    *   **Body (JSON):**
        ```json
        {
            "estado": "aprobado" // o "rechazado"
        }
        ```

### PayPal (`/api/paypal`)

*   **POST /api/paypal/create-order**
    *   **Descripción:** Crea una orden de pago de PayPal.
    *   **Acceso:** Privado (Usuario autenticado)
    *   **Headers:** `x-auth-token: <JWT_TOKEN>`
    *   **Body (JSON):**
        ```json
        {
            "planId": 1,
            "amount": "6.00",
            "currency": "USD"
        }
        ```

*   **POST /api/paypal/capture-order**
    *   **Descripción:** Captura un pago de PayPal.
    *   **Acceso:** Privado (Usuario autenticado)
    *   **Headers:** `x-auth-token: <JWT_TOKEN>`
    *   **Body (JSON):**
        ```json
        {
            "orderID": "YOUR_PAYPAL_ORDER_ID"
        }
        ```

### MercadoPago (`/api/mercadopago`)

*   **POST /api/mercadopago/create-preference**
    *   **Descripción:** Crea una preferencia de pago de MercadoPago.
    *   **Acceso:** Privado (Usuario autenticado)
    *   **Headers:** `x-auth-token: <JWT_TOKEN>`
    *   **Body (JSON):**
        ```json
        {
            "planId": 1,
            "title": "Suscripción Plan Básico",
            "unit_price": 5000,
            "quantity": 1,
            "currency_id": "CLP"
        }
        ```

### Flow.cl (`/api/flow`)

*   **POST /api/flow/create-payment**
    *   **Descripción:** Crea un pago con Flow.cl.
    *   **Acceso:** Privado (Usuario autenticado)
    *   **Headers:** `x-auth-token: <JWT_TOKEN>`
    *   **Body (JSON):**
        ```json
        {
            "planId": 1,
            "amount": 5000,
            "email": "user@example.com",
            "subject": "Pago de suscripción Hostreams - Plan Básico"
        }
        ```

*   **POST /api/flow/payment-status**
    *   **Descripción:** Obtiene el estado de un pago de Flow.cl.
    *   **Acceso:** Privado (Usuario autenticado)
    *   **Headers:** `x-auth-token: <JWT_TOKEN>`
    *   **Body (JSON):**
        ```json
        {
            "token": "YOUR_FLOW_PAYMENT_TOKEN"
        }
        ```
