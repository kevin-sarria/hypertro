# Hypertro — Fase 1 (Cimientos)

Plataforma de alto rendimiento para entrenamiento hipertrófico y nutrición deportiva. Arquitectura monorepo limpia, mobile-first, diseñada para atletas ("gymrats") y entrenadores ("coaches").

## 1. Estructura del Monorepo

```
hypertro/
├── database/            # Scripts DDL, procedimientos almacenados y semillas SQL
│   ├── schema/          # Tablas numeradas en orden de dependencia
│   ├── procedures/      # Procedimientos almacenados transaccionales (MySQL 8)
│   └── seeds/           # Datos iniciales (roles, factores de actividad, catálogos)
├── backend/             # Node.js 20 + Express + TypeScript (Clean Architecture)
└── frontend/            # React 18 + Vite + TypeScript + Chakra UI + Tailwind
```

## 2. Base de Datos (MySQL 8.0+)

### Orden de ejecución de scripts
1. `database/schema/001_roles_users.sql`
2. `database/schema/002_squads.sql`
3. `database/schema/003_exercises.sql`
4. `database/schema/004_workouts.sql`
5. `database/schema/005_nutrition.sql`
6. `database/schema/006_views.sql`
7. `database/procedures/sp_log_exercise_set.sql`
8. `database/seeds/001_roles_seed.sql`

### Puntos clave del esquema
- Motor **InnoDB**, collation `utf8mb4_0900_ai_ci`.
- Todas las tablas contienen timestamps de alta precisión `created_at` y `updated_at` (`DATETIME(3)`).
- Procedimiento almacenado `sp_log_exercise_set` con transacción atómica, detección pesimista de sesión activa, cálculo de récords personales (PR) y comparación de carga frente a la sesión anterior más reciente.

## 3. Backend (Clean Architecture)

- **Domain**: Entidades puras, Value Objects con invariantes, interfaces de repositorios y servicios de infraestructura, y jerarquía de excepciones de dominio. Cero dependencias externas.
- **Application**: Casos de uso (Auth, Workouts, Squads, Nutrición), DTOs y validación estricta con Zod schemas.
- **Infrastructure**: Implementaciones concretas con MySQL 2 (`mysql2/promise`), JWT (tokens de acceso en memoria/header y refresh rotativo en cookie `HttpOnly`), Argon2id, Nodemailer, Google Auth Library, middlewares de Express y Rate Limiting.
- **Reglas de tipado**: TypeScript `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, sin uso de `any` ni `@ts-ignore`.

## 4. Frontend (Mobile-First)

- Stack: React 18 + Vite + TypeScript + Chakra UI + Tailwind CSS + Zustand.
- Tema visual: Dark mode ultra profundo (`zinc-950`/`black`) con acento flúor neón (`#39FF14`).
- Ergonomía para gimnasio: Botones e inputs con altura táctil mínima de 56px, barra inferior fija para registro rápido con el pulgar, cronómetro de descanso persistente basado en timestamps para continuar en segundo plano.
- Seguridad en cliente: Tokens de acceso almacenados únicamente en memoria y manejados por interceptores de Axios con refresco automático transparente ante respuestas HTTP 401.

## 5. Pruebas Automatizadas

El backend incluye suite de pruebas unitarias con Vitest:
- Verificación de middlewares de autenticación y autorización RBAC (`authenticate`, `authorize`).
- Validación de contratos de entrada con esquemas Zod (`registerSchema`, `logSetSchema`).
- Cálculo matemático del TDEE y reparto de macronutrientes basado en la fórmula Mifflin-St Jeor.
