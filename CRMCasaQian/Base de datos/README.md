# Backend CRM Casa Qian

Este proyecto es una API REST construida con Spring Boot para el CRM de Casa Qian.

## Requisitos

- Java 17 o superior
- Maven

## Ejecución

Para ejecutar el servidor backend:

1. Abre una terminal en esta carpeta (`Base de datos/demo`).
2. Ejecuta el comando:
   ```bash
   mvn spring-boot:run
   ```
3. El servidor se iniciará en `http://localhost:8080`.

## Base de Datos

El proyecto utiliza una base de datos H2 en memoria.
- Consola H2: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:crmdb`
- Usuario: `sa`
- Contraseña: (vacía)

## Endpoints Principales

- `/api/clientes`
- `/api/productos`
- `/api/reservas`
- `/api/pedidos`
