# Proyecto Backend II

Este proyecto es una aplicación backend desarrollada en Node.js y Express que implementa una arquitectura basada en capas (Modelos, Servicios, Controladores y/o Rutas) y sigue los siguientes requerimientos:

- **Arquitectura en capas:**  
  - **Modelo:** Se utilizan modelos de Mongoose para representar datos (Usuarios, Productos, Carritos, Tickets).  
  - **Servicio:** La lógica de negocio se encuentra en servicios (por ejemplo, `userService.js`, `cartService.js`, `ticketService.js`).  
  - **Controlador/Rutas:** Se definen rutas en archivos como `session.router.js`, `cartsRouter.js`, etc.

- **DTOs y validación:**  
  - Se utilizan DTOs (Data Transfer Objects) para enviar solo la información necesaria al cliente.  
  - Se implementa validación de datos (por ejemplo, utilizando Joi en los middlewares de validación).

- **Dotenv:**  
  - La configuración se maneja mediante variables de entorno definidas en un archivo `.env`.

- **Autenticación y autorización:**  
  - Se utiliza JWT (JSON Web Token) para autenticar a los usuarios.  
  - Passport se encarga de la estrategia de autenticación y se protegen las rutas sensibles.

- **Mailing:**  
  - Se implementa el envío de correos mediante Nodemailer (con Mailtrap para pruebas).

- **Feature Ticket (Compra y Ticket):**  
  - Se creó el modelo y el servicio para ticket en `models/Ticket.js` y `services/ticketService.js`.  
  - La ruta `POST /api/carts/:cid/purchase` procesa la compra del carrito:
    - Verifica que el stock de cada producto sea suficiente.
    - Si un producto no tiene stock suficiente, se devuelve un error indicando los productos afectados.
    - Si la compra es exitosa, se genera un ticket con la información de la compra.

## Estructura del Proyecto

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd Backend\ I\ 2

2. Instala las dependencias:
    ```bash
   npm install
   

3. Configura el archivo .env con las siguientes variables: 
    ```bash
    PORT=8080
    MONGO_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<nombreDB>?retryWrites=true&w=majority
    JWT_SECRET=secretKey
    NODEMAILER_HOST=sandbox.smtp.mailtrap.io
    NODEMAILER_PORT=2525
    NODEMAILER_USER=28521b86d8a90a
    NODEMAILER_PASSWORD=<tu_contraseña_mailtrap>

4. Inicia el servidor:
    ```bash
   node app.js

# Uso y Endpoints
**Registro de usuario:**
`POST /api/sessions/register`

{
  "first_name": "Carlos",
  "last_name": "López",
  "email": "carlos@example.com",
  "password": "123456",
  "age": 30
}

**Login de usuario:**
`POST /api/sessions/login`

{
  "email": "carlos@example.com",
  "password": "123456"
}

**Obtener usuario actual:**
`GET /api/sessions/current`

**Cerrar sesión**
`GET /api/sessions/logout`

## Carrito y compra 
**Crear carrito:** 
Se puede usar el endpoint `POST /api/carts` o se puede insertar directamente en MongoDB

**Agrear producto al carrito:** `POST /api/carts/:cid/product/:pid`

**Finalizar y generar ticket:** `POST /api/carts/:cid/purchase` Con este endpoint se procesa el carrito, se verifica el stock, se actualiza el stock, se crea un ticker y se actrualiza el carrito. 

Respuesta ejemplo o esperrada:

{
  "message": "Compra realizada con éxito",
  
  "ticket": {

    "code": "03e503e2-7771-4c70-bbe7-859aabc033ae",
    "user": "67bdf1e74c5f83811ab272a8",
    "products": [
      { "product": "674d0155d15b5381fd675c16", "quantity": 2, "_id": "..." }
    ],
    "totalAmount": 784,
    "_id": "67be0c42b0829e4052d91d0b",
    "purchaseDate": "2025-02-25T18:30:26.712Z"
  },
  "failedProducts": null
}

## Mailing
Se envia un correo de bienvenida y agradeciiento al usuario usando Nodemailer y Mailtrap.

## Validación y DTOa
- Se utiliza un middleware de valoración (Joi) para asegurar la integreidad de los datos de registro y login
- Se usan DTOs para enviar al cliente la información necesaria de los usuarios


## Authors

- [@MajoRomero23](https://github.com/MajoRomero23)

