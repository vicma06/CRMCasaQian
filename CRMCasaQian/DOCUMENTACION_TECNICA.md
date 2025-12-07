# Documentación Técnica Completa - CRM Casa Qian

## 1. Visión General del Proyecto
**CRM Casa Qian** es una solución integral de gestión empresarial diseñada a medida para un restaurante de Hotpot de alta gama. El objetivo del sistema es digitalizar y centralizar la relación con los clientes, la gestión de reservas, el control del menú y la administración de usuarios.

El sistema se ha construido bajo una arquitectura de **Single Page Application (SPA)** utilizando Angular, priorizando la experiencia de usuario (UX), la velocidad de carga y una estética visual lujosa y coherente con la marca.

---

## 2. Stack Tecnológico Detallado

### Frontend (Cliente)
*   **Framework Principal:** Angular 17+
    *   **Arquitectura:** Standalone Components (eliminación de `app.module.ts` para reducir boilerplate).
    *   **Enrutamiento:** `Lazy Loading` implícito en la estructura de componentes standalone.
    *   **Formularios:** `ReactiveFormsModule` para un control estricto y validaciones síncronas en el lado del cliente.
*   **Lenguaje:** TypeScript 5.x (Tipado estático fuerte).
*   **Estilos y Diseño:**
    *   **Tailwind CSS 3.x:** Framework de utilidad para maquetación rápida.
    *   **CSS Personalizado:** Para componentes específicos y animaciones complejas.
    *   **Fuentes Web:** Google Fonts (*Cinzel* y *Playfair Display*).
*   **Gestión de Estado:** Servicios inyectables (`@Injectable`) con `BehaviorSubject` de RxJS para manejo de estado reactivo (ej. sesión de usuario).

### Backend (Servidor)
*   **Framework:** Spring Boot 3.x (Java 17/21).
*   **API:** RESTful API estándar.
*   **Base de Datos:** (Asumido: MySQL/PostgreSQL según configuración JPA).

---

## 3. Sistema de Diseño y Marca (Brand Identity)

Se ha realizado un trabajo exhaustivo para que la interfaz refleje la identidad "Premium" del restaurante.

### 3.1. Paleta de Colores (`tailwind.config.js`)
Se definieron variables semánticas para asegurar consistencia en toda la app:
*   **Brand Blue (`#0f172a` - Slate 900):** Color primario. Utilizado en fondos de navegación, textos principales y bordes. Transmite profesionalidad y elegancia nocturna.
*   **Brand Red (`#991b1b` - Red 800):** Color de acción. Utilizado en botones principales (Login, Reservar), alertas y precios. Evoca la cultura china y estimula el apetito.
*   **Brand Gold (`#d4af37` - Metallic Gold):** Color de acento. Utilizado en bordes, iconos, estados activos y detalles de lujo. Aporta el toque "Premium".
*   **Brand Light (`#f8fafc` - Slate 50):** Fondos generales para evitar el blanco puro y reducir la fatiga visual.

### 3.2. Tipografía
Se reemplazaron las fuentes del sistema por fuentes con personalidad:
*   **Títulos (`Cinzel`):** Una fuente inspirada en inscripciones romanas clásicas. Se usa en `h1`, `h2` y encabezados de tarjetas.
*   **Cuerpo (`Playfair Display`):** Una fuente con serifa de alto contraste, muy legible y elegante, usada en párrafos y formularios.

### 3.3. Elementos Globales (`styles.css`)
*   **Scrollbar Personalizado:** Se ocultó la barra nativa del navegador y se creó una barra fina (`10px`) con el carril (`track`) claro y el pulgar (`thumb`) dorado, para que no rompa la estética de la web.
*   **Botones Unificados:** Se crearon clases `.btn-primary`, `.btn-secondary` y `.btn-accent` que aplican automáticamente los colores de la marca, sombras (`shadow-md`) y transiciones (`hover:transform`).

---

## 4. Análisis Detallado de Componentes

### 4.1. Estructura Raíz (`AppComponent`)
*   **Navbar Inteligente:**
    *   Contiene la lógica de visibilidad basada en roles. Utiliza `*ngIf="authService.currentUser$ | async as user"` para suscribirse a los cambios de sesión.
    *   **Menú Móvil:** Implementa un menú hamburguesa que se despliega verticalmente en pantallas pequeñas.
    *   **Seguridad:** Oculta enlaces administrativos (Usuarios, Clientes, Gestionar Menú) a usuarios con rol 'CLIENTE'.
*   **Footer:** Pie de página estático con borde dorado superior.

### 4.2. Módulo de Autenticación (`Login` / `Register`)
*   **Diseño:** Tarjetas centradas vertical y horizontalmente (`flex items-center justify-center min-h-screen`).
*   **Feedback Visual:**
    *   Bordes de inputs cambian a dorado (`ring-brand-gold`) al recibir foco.
    *   Mensajes de error en rojo claro si las credenciales fallan.
*   **Lógica:** Al hacer submit, llama a `AuthService`. Si es exitoso, redirige al Dashboard; si falla, muestra error sin recargar la página.

### 4.3. Dashboard (`DashboardComponent`)
Este es el centro de control y cambia drásticamente según el usuario.
*   **Vista Admin:**
    *   **KPIs:** Tarjetas superiores con iconos grandes (👥, ⭐, 💰) que muestran métricas en tiempo real (Total Clientes, Ventas Hoy).
    *   **Listas Recientes:** Dos columnas mostrando las últimas reservas y pedidos, con "Badges" de estado (colores verde/amarillo/rojo según el estado).
*   **Vista Cliente:**
    *   Bienvenida personalizada y accesos directos simples.
*   **Acciones Rápidas (Refactorizado):**
    *   Se rediseñó esta sección usando `Flexbox` (`flex-wrap justify-center`) en lugar de Grid.
    *   **Objetivo:** Que los botones estén siempre perfectamente centrados y tengan el mismo tamaño (`w-64`, `p-6`), independientemente de la resolución de pantalla.
    *   **Seguridad:** El botón "Gestionar Menú" se oculta dinámicamente si el usuario no es Admin.

### 4.4. Gestión de Productos (`ProductosComponent`)
El módulo más complejo y recientemente actualizado.
*   **Visualización (Grid):**
    *   Tarjetas de producto con imagen (opcional), precio destacado y etiquetas (Picante, Disponible).
    *   **Filtrado:** Botones de categoría en la parte superior. Al hacer clic, se filtra la lista (`this.productos.filter(...)` o llamada a API).
*   **Gestión (CRUD - Solo Admin):**
    *   **Modal Personalizado:** Se creó un modal desde cero (HTML/CSS) con fondo desenfocado (`backdrop-filter: blur`) y animación de entrada.
    *   **Formulario Reactivo:**
        *   Campos: Nombre, Categoría, Precio, Descripción.
        *   **Sistema de Alérgenos (Chips):**
            *   *Antes:* Un input de texto simple.
            *   *Ahora:* Un array visual de botones ("Gluten", "Soja", etc.).
            *   *Lógica:* Al hacer clic en un chip, se ejecuta `toggleAlergeno()`. Si el alérgeno ya está en el array del formulario, se elimina (filter); si no, se agrega (push). Visualmente se marca en dorado (`.selected`).
    *   **Disponibilidad:** Un botón interruptor en la tarjeta permite marcar un plato como "Agotado" sin borrarlo de la base de datos.

### 4.5. Reservas (`ReservasComponent`)
*   **Listado:** Tabla o lista de tarjetas con la información de la reserva.
*   **Formulario (`ReservaFormComponent`):**
    *   Validación de fechas (no permitir fechas pasadas).
    *   Selección de número de personas y turno (Comida/Cena).
    *   Estilos corregidos recientemente para asegurar que los botones de envío coincidan con la paleta roja/dorada.

### 4.6. Perfil y Usuarios
*   **Profile:** Permite al usuario logueado cambiar su contraseña y datos personales.
*   **User Management (Admin):** Tabla para ver todos los usuarios registrados, cambiar sus roles (Cliente <-> Admin) o eliminarlos.

---

## 5. Servicios y Comunicación de Datos

### 5.1. `AuthService`
*   Mantiene el token de sesión (JWT o simulado) en `localStorage`.
*   Expone un `currentUser$` (Observable) al que se suscriben los componentes para saber si deben mostrar u ocultar elementos.

### 5.2. `ProductoService`
*   Centraliza todas las llamadas HTTP (`HttpClient`).
*   Métodos: `getProductos()`, `addProducto()`, `updateProducto()`, `deleteProducto()`.
*   Maneja la lógica de transformar los datos si el backend devuelve formatos distintos a los esperados por el frontend.

---

## 6. Flujo de Datos: Base de Datos <-> API <-> Frontend

Este apartado detalla el ciclo de vida de un dato desde que reside en la base de datos hasta que se muestra en la pantalla del usuario.

### 6.1. Capa de Persistencia (Base de Datos)
*   **Tecnología:** MySQL (definido en `application.properties` del backend).
*   **Estructura:** Tablas relacionales (ej. `productos`, `usuarios`, `reservas`).
*   **Conexión:** El backend utiliza **Spring Data JPA** y **Hibernate** para mapear las tablas a objetos Java (Entidades).
    *   El archivo `pom.xml` incluye el driver de MySQL y las dependencias de JPA.
    *   Las entidades (ej. `Producto.java`) usan anotaciones como `@Entity`, `@Table`, `@Id`.

### 6.2. Capa de Backend (API REST con Spring Boot)
*   **Controladores (`@RestController`):** Exponen los endpoints HTTP.
    *   Ejemplo: `ProductoController` recibe `GET /api/productos`.
*   **Servicios (`@Service`):** Contienen la lógica de negocio y llaman a los repositorios.
*   **Repositorios (`JpaRepository`):** Interfaces que ejecutan las consultas a la BD automáticamente.
*   **Intercambio:** La API responde en formato **JSON**.

### 6.3. Capa de Frontend (Angular)
1.  **Petición:** El `ProductoService` usa `HttpClient` para llamar al endpoint (ej. `http://localhost:8080/api/productos`).
2.  **Recepción:** Angular recibe el JSON y lo mapea a interfaces de TypeScript (ej. `interface Producto`).
3.  **Renderizado:** Los componentes usan directivas como `@for` o `*ngFor` para iterar sobre estos datos y generar el HTML.

---

## 7. Historial de Cambios Recientes (Refactorización)

1.  **Globalización de Estilos:** Se migraron estilos inline a clases globales en `styles.css` para facilitar el mantenimiento.
2.  **Corrección de Navegación:** Se solucionó un problema donde los clientes podían ver opciones de administración. Ahora la protección es doble: visual (ocultar botón) y lógica (guards en rutas).
3.  **Mejora de UX en Formularios:**
    *   Implementación de selectores visuales para alérgenos.
    *   Feedback inmediato en validaciones (bordes rojos/verdes).
4.  **Identidad Visual:**
    *   Cambio total de tipografías a *Cinzel* y *Playfair*.
    *   Implementación de scrollbar corporativo.
    *   Alineación y centrado perfecto de elementos del Dashboard.

---

## 8. Guía de Despliegue y Ejecución

### Requisitos Previos
*   Node.js v18+
*   Angular CLI v17+
*   Java JDK 17+ (para el backend)

### Pasos
1.  **Backend:** Iniciar el servidor Spring Boot (`mvn spring-boot:run`).
2.  **Frontend:**
    *   Navegar a la carpeta raíz.
    *   Ejecutar `npm install` para descargar dependencias (Tailwind, Angular, etc.).
    *   Ejecutar `ng serve` para iniciar el servidor de desarrollo.
3.  **Acceso:** Abrir navegador en `http://localhost:4200`.

---

*Documentación generada automáticamente por el Asistente de Desarrollo - 02/12/2025*