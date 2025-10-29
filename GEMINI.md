# Roadmap de Desarrollo - Plataforma de Suscripciones Hostreams

Este documento detalla el plan de desarrollo para la plataforma de suscripciones Hostreams, dividiendo el proyecto en tareas específicas. Cada tarea será marcada como [COMPLETADO] una vez finalizada.

## 1. Configuración Inicial
- [PENDIENTE] Entender los requisitos del proyecto (ya realizado).
- [COMPLETADO] Configurar el entorno de desarrollo (Node.js, React, MySQL).
- [COMPLETADO] Inicializar proyectos de Backend y Frontend.

## 2. Backend (Node.js + Express + MySQL)

### 2.1. Estructura de la API
- [COMPLETADO] Crear estructura de carpetas para controladores, rutas, modelos.
- [COMPLETADO] Configurar Express.

### 2.2. Base de Datos (MySQL)
- [COMPLETADO] Configurar conexión a MySQL.
- [COMPLETADO] Definir modelos con Sequelize/Prisma para las tablas:
    - [COMPLETADO] `usuarios` (id, nombre, email, contraseña, país, moneda_preferida, rol, fecha_registro).
    - [COMPLETADO] `planes` (id, nombre, descripción, precio_clp, precio_usd, periodo, características, estado, fecha_creacion).
    - [COMPLETADO] `suscripciones` (id, usuario_id, plan_id, método_pago, monto, moneda, estado, fecha_inicio, fecha_renovacion).
    - [COMPLETADO] `pagos` (id, usuario_id, suscripcion_id, método, monto, moneda, estado, comprobante, fecha_pago).
- [COMPLETADO] Realizar migraciones iniciales y seeders (datos de ejemplo).

### 2.3. Autenticación con JWT
- [COMPLETADO] Implementar ruta de registro de usuarios.
- [COMPLETADO] Implementar ruta de login de usuarios.
- [COMPLETADO] Crear middleware de protección de rutas con JWT.

### 2.4. Pasarelas de Pago
- [COMPLETADO] Integrar PayPal (clientes internacionales).
- [COMPLETADO] Integrar MercadoPago / MercadoLibre (clientes de Latinoamérica).
- [COMPLETADO] Integrar Flow.cl (clientes de Chile).
- [COMPLETADO] Implementar lógica para transferencia electrónica manual (subida de comprobante).

### 2.5. Panel Administrativo (solo para rol admin)
- [COMPLETADO] Crear rutas y controladores para la gestión de planes (CRUD).
- [COMPLETADO] Crear rutas y controladores para ver usuarios registrados.
- [COMPLETADO] Crear rutas y controladores para revisar suscripciones.
- [COMPLETADO] Crear rutas y controladores para confirmar pagos manuales.

### 2.6. Soporte Multimoneda (CLP/USD)
- [COMPLETADO] Asegurar que los precios se guarden en ambas monedas en la DB.
- [COMPLETADO] La API debe devolver ambos valores para el frontend.

### 2.7. Variables de Entorno
- [COMPLETADO] Configurar archivo `.env` y `.env.example` para credenciales.

### 2.8. Documentación
- [COMPLETADO] Documentar endpoints de la API en el README del backend.

## 3. Frontend (React + Vite + TailwindCSS)

### 3.1. Diseño y Estilo
- [COMPLETADO] Configurar Vite y TailwindCSS.
- [COMPLETADO] Implementar diseño moderno, responsivo y minimalista (colores azul, blanco, gris, fuente Inter).

### 3.2. Páginas Principales
- [COMPLETADO] **Página de Inicio:** Descripción, botón “Comenzar ahora” y enlaces a registro/login.
- [COMPLETADO] **Página de Planes:**
    - [COMPLETADO] Consultar API `/api/planes` para listar planes activos.
    - [COMPLETADO] Mostrar nombre, descripción, características, precio en CLP y USD.
    - [COMPLETADO] Implementar selector de moneda (toggle/dropdown) para cambiar precios dinámicamente.
    - [COMPLETADO] Botón “Suscribirme” que dirija al flujo de pago.
- [COMPLETADO] **Registro / Login:** Formularios con validaciones y manejo de errores.
- [COMPLETADO] **Mi Cuenta:** Mostrar información de usuario, plan activo, estado de suscripción y pagos realizados.
- [COMPLETADO] **Pago Manual:** Formulario para registrar transferencia electrónica y subir comprobante.

### 3.3. Funcionalidades Específicas
- [COMPLETADO] Selector de moneda global (CLP / USD) en el header.

### 3.4. Manejo de Sesión y Notificaciones
- [COMPLETADO] Manejo de sesión con JWT (guardado en localStorage).
- [COMPLETADO] Notificaciones de éxito/error (modales/toasts).

### 3.5. Footer
- [COMPLETADO] Implementar footer con redes sociales y enlaces de contacto.

## 4. Funcionalidades Adicionales
- [COMPLETADO] Validaciones completas y manejo de errores coherente (frontend y backend).
- [COMPLETADO] Envío de correo de confirmación (registro, pago).

## 5. Despliegue y Calidad
- [COMPLETADO] Crear `README.md` con pasos de instalación, configuración y comandos.
- [COMPLETADO] Asegurar código modular, limpio y documentado (buenas prácticas MVC).
- [COMPLETADO] Preparar proyecto para despliegue (Render, Railway, Vercel).
