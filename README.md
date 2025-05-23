# Sistema de Citas Médicas

## Estructura del Proyecto

```
citasmedicas_db/
├── app/                       # App Router Directory
│   ├── (auth)/               # Auth Route Group
│   │   └── login/           # Login Route
│   │       └── page.tsx     # Login Page (Único punto de entrada)
│   ├── (dashboard)/         # Protected Dashboard Routes
│   │   ├── admin/          # Admin Routes
│   │   │   ├── users/      # Gestión de usuarios
│   │   │   │   └── page.tsx # Crear/Editar usuarios
│   │   │   └── page.tsx    # Admin Dashboard
│   │   ├── doctor/         # Doctor Routes
│   │   │   ├── appointments/
│   │   │   ├── patients/   # Ver lista de pacientes
│   │   │   └── page.tsx    # Doctor Dashboard
│   │   └── patient/        # Patient Routes
│   │       ├── appointments/
│   │       └── page.tsx    # Patient Dashboard
│   ├── api/                 # API Routes
│   │   ├── auth/
│   │   │   └── login/     # API de autenticación
│   │   ├── appointments/   # API de citas
│   │   └── users/         # API de usuarios
│   ├── components/          # Shared Components
│   │   ├── ui/             # UI Components
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │   └── layout/         # Layout Components
│   │       ├── Header.tsx
│   │       └── Sidebar.tsx
│   ├── lib/                # Utility Functions
│   │   ├── auth.ts        # Authentication Utils
│   │   └── db.ts         # Database Utils
│   ├── styles/            # Global Styles
│   │   └── globals.css
│   ├── types/             # TypeScript Types
│   ├── layout.tsx         # Root Layout
│   └── page.tsx           # Redirect to /login
│
├── public/                # Public Assets
│   ├── images/
│   └── icons/
│
├── database/              # Database Files
│   ├── schema.sql        # Database Schema
│   └── seed.sql          # Initial Data
│
├── middleware.ts          # Next.js Middleware (auth & role protection)
├── .env                  # Environment Variables
├── .gitignore
└── package.json
```

## Flujo de Usuario

1. **Login**
   - Usuario ingresa sus credenciales
   - Sistema identifica el rol (admin/doctor/paciente)
   - Redirección automática al dashboard correspondiente

2. **Administrador**
   - Gestión de usuarios (crear/editar médicos y pacientes)
   - Reportes y estadísticas
   - Configuración del sistema

3. **Médico**
   - Ver y gestionar lista de pacientes
   - Gestionar citas médicas
   - Ver historial médico de pacientes

4. **Paciente**
   - Ver sus citas programadas
   - Solicitar nuevas citas
   - Ver su historial médico

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
