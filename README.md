# CRM Casa Qian

Sistema de gestión de clientes (CRM) para el restaurante Casa Qian.

## Estructura del Proyecto

- **Frontend**: Aplicación Angular en la carpeta `CRMCasaQian`.
- **Backend**: API Spring Boot en la carpeta `CRMCasaQian/Base de datos/demo`.

## Instrucciones de Ejecución

### 1. Iniciar el Backend (Base de Datos y API)

1. Abre una terminal.
2. Navega a la carpeta del backend:
   ```bash
   cd CRMCasaQian/"Base de datos"/demo
   ```
3. Ejecuta el servidor:
   ```bash
   mvn spring-boot:run
   ```
   El servidor escuchará en `http://localhost:8080`.

### 2. Iniciar el Frontend (Angular)

1. Abre una nueva terminal.
2. Navega a la carpeta del proyecto Angular:
   ```bash
   cd CRMCasaQian
   ```
3. Instala las dependencias (si no lo has hecho):
   ```bash
   npm install
   ```
4. Inicia la aplicación:
   ```bash
   ng serve
   ```
5. Abre tu navegador en `http://localhost:4200`.

## Funcionalidades

- Gestión de Clientes (CRUD)
- Gestión de Reservas
- Gestión de Productos
- Gestión de Pedidos
- Dashboard con estadísticas en tiempo real
