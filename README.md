# NIU-LOCALES - Fullstack Application

Aplicación fullstack para gestión de locales Niu Foods. Sistema de auditoría, visitas y notas para diferentes sucursales.

## 📋 Descripción

**NIU-LOCALES** es una aplicación web completa que permite:
- Gestión de locales (direcciones, contactos, información operativa)
- Sistema de autenticación con roles (Admin, Support, User)
- Registro de visitas a locales
- Sistema de notas y auditoría
- Dashboard administrativo
- Informes de auditoría

## 🏗️ Arquitectura

### Backend
- **Framework**: Express.js + TypeScript
- **Base de datos**: SQLite con Prisma ORM
- **Autenticación**: JWT
- **Validación**: Schemas Zod

### Frontend
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **Estilos**: Tailwind CSS
- **Formularios**: React Hook Form
- **Rutas**: React Router
- **HTTP Client**: Axios

## 🚀 Quick Start

### Requisitos Previos
- Node.js 20+
- npm o pnpm
- Docker & Docker Compose (opcional)

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/niu-locales.git
cd niu-locales
```

2. **Configurar Backend**
```bash
cd backend

# Copiar archivo de ejemplo
cp .env.example .env

# Instalar dependencias
npm install

# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones (si existen)
npm run db:push

# Seedear base de datos (opcional)
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
```

3. **Configurar Frontend**
```bash
cd ../frontend

# Copiar archivo de ejemplo
cp .env.example .env

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Backend estará disponible en: `http://localhost:5000`
Frontend estará disponible en: `http://localhost:5173`

### Usar Docker Compose

```bash
# Construir imágenes
docker-compose build

# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

- Frontend: `http://localhost`
- Backend API: `http://localhost:5000`

## 📁 Estructura del Proyecto

```
niu-locales/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Definición del esquema DB
│   │   └── seed.ts              # Script de seedeo
│   ├── src/
│   │   ├── controllers/         # Lógica de negocio
│   │   ├── middleware/          # Middleware (autenticación)
│   │   ├── routes/              # Rutas API
│   │   ├── utils/               # Utilidades (auditoría)
│   │   └── server.ts            # Entrada principal
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api.ts               # Cliente HTTP
│   │   ├── components/          # Componentes React
│   │   ├── contexts/            # Context API
│   │   ├── pages/               # Páginas
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── package.json
│   └── .env.example
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 🔐 Variables de Entorno

### Backend (.env)
```
DATABASE_URL="file:./dev.db"      # SQLite URL
JWT_SECRET="tu-secret-key"        # Clave JWT para tokens
NODE_ENV="development"            # Entorno
PORT=5000                         # Puerto del servidor
CORS_ORIGIN="http://localhost:5173" # Origen CORS permitido
```

### Frontend (.env)
```
VITE_API_URL="http://localhost:5000"  # URL del backend
VITE_ENV="development"                # Entorno
```

## 📦 Scripts Disponibles

### Backend
```bash
npm run dev          # Iniciar servidor con hot-reload
npm run build        # Compilar TypeScript
npm start            # Iniciar servidor compilado
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Sincronizar schema con BD
npm run db:seed      # Ejecutar script de seedeo
npm run db:studio    # Abrir Prisma Studio
```

### Frontend
```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Construir para producción
npm run preview  # Previsualizar build de producción
```

## 🔑 Credenciales por Defecto

Si ejecutas el seed:
```
Admin:
- Email: admin@niufoods.com
- Password: admin123

Support:
- Email: support@niufoods.com
- Password: support123

User:
- Email: user@niufoods.com
- Password: user123
```

## 📡 Endpoints Principales API

### Autenticación
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro (si habilitado)
- `POST /api/auth/refresh` - Refrescar token

### Locales
- `GET /api/locales` - Obtener todos los locales
- `GET /api/locales/:id` - Obtener local por ID
- `POST /api/locales` - Crear nuevo local
- `PUT /api/locales/:id` - Actualizar local
- `DELETE /api/locales/:id` - Eliminar local

### Visitas
- `GET /api/visitas` - Obtener todas las visitas
- `POST /api/visitas` - Crear nueva visita
- `GET /api/visitas/:id` - Obtener visita por ID

### Notas
- `GET /api/notas/:localId` - Obtener notas de un local
- `POST /api/notas` - Crear nueva nota
- `DELETE /api/notas/:id` - Eliminar nota

## 🛠️ Desarrollo

### Agregar Nueva Dependencia
```bash
# Backend
cd backend && npm install paquete

# Frontend
cd frontend && npm install paquete
```

### Modificar Schema Prisma
```bash
cd backend

# Editar prisma/schema.prisma
nano prisma/schema.prisma

# Sincronizar cambios
npm run db:push
```

### Build para Producción
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

## 🐳 Deployment con Docker

### Build de Imágenes
```bash
# Backend
docker build -t niu-locales-backend:latest ./backend

# Frontend
docker build -t niu-locales-frontend:latest ./frontend
```

### Ejecutar Contenedores
```bash
# Backend
docker run -d \
  --name niu-backend \
  -p 5000:5000 \
  -e DATABASE_URL="file:./dev.db" \
  -e JWT_SECRET="tu-secret-key" \
  niu-locales-backend:latest

# Frontend
docker run -d \
  --name niu-frontend \
  -p 80:80 \
  -e VITE_API_URL="http://localhost:5000" \
  niu-locales-frontend:latest
```

## 📝 Notas Importantes

- **Base de datos**: SQLite se usa para desarrollo. Para producción, considera PostgreSQL o MySQL.
- **Secretos**: Nunca commitear `.env` con valores reales. Usar `.env.example` como referencia.
- **CORS**: Configurar `CORS_ORIGIN` según el dominio del frontend en producción.
- **JWT**: Cambiar `JWT_SECRET` con una clave fuerte y única.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios mayores:

1. Fork el repositorio
2. Crear rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 📧 Contacto

Para preguntas o soporte, contacta al equipo de desarrollo.

---

**Última actualización**: Enero 2026
