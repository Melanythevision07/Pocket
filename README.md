# 👛 EasyPay — Gestor de Gastos Personales

Aplicación web interactiva para la gestión y control de finanzas personales. Permite registrar movimientos (ingresos y gastos), calcular balances e indicadores estadísticos en tiempo real, manejar múltiples cuentas mediante autenticación basada en diccionarios y personalizar la experiencia visual con modos claro, oscuro y alto contraste (blanco y negro).

---

## 🚀 Características Principales

* **🔐 Sistema de Autenticación Local:**
  * Registro e inicio de sesión de usuarios.
  * Almacenamiento independiente por usuario estructurado mediante **diccionarios en JavaScript** y persistencia en `localStorage`.

* **📊 Tablero y Balance en Tiempo Real:**
  * Tarjetas de **Balance Total**, **Ingresos Totales** y **Gastos Totales**.
  * Recálculo automático instantáneo al agregar o eliminar movimientos.

* **📈 Módulo de Estadísticas Financieras:**
  * Barra de progreso visual para la distribución proporcional de flujo (*% Ingresos vs % Gastos*).
  * Indicadores de **Promedio por Movimiento**, **Gasto Mayor**, **Ingreso Mayor** y **Tasa de Ahorro (%)**.

* **📝 Gestión e Historial de Movimientos:**
  * Formulario para registrar descripción, monto ($) y tipo (*Ingreso / Gasto*).
  * Filtrado dinámico (*Todos, Ingresos, Gastos*).
  * Opción para eliminar registros individuales.

* **🎨 Diseño Adaptativo y Accesibilidad Visual:**
  * Estética inspirada en el sistema de diseño **EasyPay** (minimalista, tonos crema/arena, tipografía *IBM Plex Sans* e ilustraciones vectoriales SVG).
  * **Modo Claro / Modo Oscuro** con un solo clic.
  * **Modo B&W (Blanco y Negro / Alto Contraste)** mediante filtros monocromáticos en CSS.
  * Diseñado 100% responsivo con **Flexbox**.

---

## 📁 Estructura del Proyecto

```text
├── index.html     # Estructura semántica HTML5 y vista única de la app
├── styles.css     # Estilos CSS (Flexbox, variables, temas e ilustraciones)
└── app.js         # Lógica de negocio, autenticación, estado y manipulaciones del DOM
