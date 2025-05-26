# LTI - Sistema de Seguimiento de Talento

Este proyecto es una aplicación full-stack con un frontend en React y un backend en Express usando Prisma como ORM. El frontend se inicia con Create React App y el backend está escrito en TypeScript.

## Main Features
- Role-based authentication for Candidates and Recruiters
- Candidate dashboard: view/apply to offers, update profile, upload CV
- Recruiter dashboard: review candidates, manage offers, update profile
- Secure file upload for candidate CVs
- Responsive, modern UI with Material UI
- Protected routes and JWT-based authentication
- PostgreSQL database with Prisma ORM
- Docker support for easy setup

## Documentation
- **Frontend:** React + TypeScript, located in `/frontend`
- **Backend:** Express + TypeScript, located in `/backend`
- **Database:** PostgreSQL, managed with Prisma
- **Authentication:** JWT tokens, role-based access
- **File Uploads:** Candidates can upload CVs (PDF)
- **API Docs:** Swagger available at `/api-docs` on the backend server
- **Environment:** Configure variables in `.env` files for both frontend and backend

## Screenshots

### Demo Credentials
![Captura de pantalla 2025-05-26 012557](https://github.com/user-attachments/assets/63c86dde-02f0-4fdd-9582-e82c540aa653)

### Login

![Captura de pantalla 2025-05-26 111143](https://github.com/user-attachments/assets/981a8d4b-ac7e-4f0c-8240-f11fa8754383)


### Candidate Dashboard
![Captura de pantalla 2025-05-26 025702](https://github.com/user-attachments/assets/ef5b59dc-2ccb-4ed0-a1a8-52254a853180)

### Apply to offers
![Captura de pantalla 2025-05-26 112119](https://github.com/user-attachments/assets/083cc599-e633-44c5-8b7b-ecb2f015db28)


### Recruiter Dashboard
![Captura de pantalla 2025-05-26 025609](https://github.com/user-attachments/assets/c7e72de9-dc1e-4604-a980-6db44d3955d8)

### Upload profile info
![image](https://github.com/user-attachments/assets/e72648f4-9a1a-49b7-9f8f-6f7f70d8f029)




### Swagger - Api docs
![Captura de pantalla 2025-05-26 031447](https://github.com/user-attachments/assets/d81b7d11-e419-4a29-8238-6c9618d823bf)


---

## Explicación de Directorios y Archivos

- `backend/`: Contiene el código del lado del servidor escrito en Node.js.
  - `src/`: Contiene el código fuente para el backend.
    - `index.ts`: El punto de entrada para el servidor backend.
  - `prisma/`: Contiene el archivo de esquema de Prisma para ORM.
  - `tsconfig.json`: Archivo de configuración de TypeScript.
  - `.env`: Contiene las variables de entorno.
- `frontend/`: Contiene el código del lado del cliente escrito en React.
  - `src/`: Contiene el código fuente para el frontend.
  - `public/`: Contiene archivos estáticos como el archivo HTML e imágenes.
  - `build/`: Contiene la construcción lista para producción del frontend.
- `docker-compose.yml`: Contiene la configuración de Docker Compose para gestionar los servicios de tu aplicación.
- `README.md`: Este archivo contiene información sobre el proyecto e instrucciones sobre cómo ejecutarlo.

## Estructura del Proyecto

El proyecto está dividido en dos directorios principales: `frontend` y `backend`.

### Frontend

El frontend es una aplicación React y sus archivos principales están ubicados en el directorio `src`. El directorio `public` contiene activos estáticos y el directorio `build` contiene la construcción de producción de la aplicación.

### Backend

El backend es una aplicación Express escrita en TypeScript.
- El directorio `src` contiene el código fuente
- El directorio `prisma` contiene el esquema de Prisma.

## Primeros Pasos

Para comenzar con este proyecto, sigue estos pasos:

1. Clona el repositorio.
2. Instala las dependencias para el frontend y el backend:
```sh
cd frontend
npm install

cd ../backend
npm install
```
3. Construye el servidor backend:
```
cd backend
npm run build
```
4. Inicia el servidor backend:
```
cd backend
npm run dev 
```

5. En una nueva ventana de terminal, construye el servidor frontend:
```
cd frontend
npm run build
```
6. Inicia el servidor frontend:
```
cd frontend
npm start
```

El servidor backend estará corriendo en http://localhost:3010 y el frontend estará disponible en http://localhost:3000.

## Docker y PostgreSQL

Este proyecto usa Docker para ejecutar una base de datos PostgreSQL. Así es cómo ponerlo en marcha:

Instala Docker en tu máquina si aún no lo has hecho. Puedes descargarlo desde aquí.
Navega al directorio raíz del proyecto en tu terminal.
Ejecuta el siguiente comando para iniciar el contenedor Docker:
```
docker-compose up -d
```
Esto iniciará una base de datos PostgreSQL en un contenedor Docker. La bandera -d corre el contenedor en modo separado, lo que significa que se ejecuta en segundo plano.

Para acceder a la base de datos PostgreSQL, puedes usar cualquier cliente PostgreSQL con los siguientes detalles de conexión:
 - Host: localhost
 - Port: 5432
 - User: postgres
 - Password: password
 - Database: mydatabase

Por favor, reemplaza User, Password y Database con el usuario, la contraseña y el nombre de la base de datos reales especificados en tu archivo .env.

Para detener el contenedor Docker, ejecuta el siguiente comando:
```
docker-compose down
```
