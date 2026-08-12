# Qwerty Build Hub — E-commerce de Teclados Mecânicos

E-commerce full-stack para teclados mecânicos customizáveis.

## Stack

- **Backend**: Node.js + TypeScript + Express + Prisma + PostgreSQL
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Infra**: Redis + BullMQ + Docker + Nginx
- **Pagamentos**: Mercado Pago (PIX Sandbox)

## Quick Start

### Pré-requisitos

- Node.js 20+
- PostgreSQL 16+
- Redis 7+

### Backend

```bash
cd backend
npm install
cp .env.example .env  # Configure as variáveis
npx prisma migrate deploy --schema=src/prisma/schema.prisma
npx prisma db seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env  # Configure VITE_API_URL
npm run dev
```

### Docker Compose

```bash
docker compose up -d
docker compose --profile migration run --rm migrate
# Seed (optional — populates categories, products, admin user):
docker compose exec backend node dist/prisma/seed.js
```

### Portas do ambiente local

| Serviço    | Porta externa | Porta interna |
|------------|--------------|---------------|
| PostgreSQL | 55432        | 5432          |
| Redis      | 56379        | 6379          |
| Backend    | 3000         | 3000          |
| Frontend   | 8080         | 80            |

## Testes

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Variáveis de Ambiente

Ver `backend/.env.example` e `frontend/.env.example`.

## Documentação

- `docs/OPERATIONS-RUNBOOK.md` — Guia operacional
- `docs/PHASE-0-STEP-*-REPORT.md` — Relatórios de implementação

## Status

FASE 0 completa (Etapas 1–13):
- ✅ Auth + RBAC
- ✅ Produtos + Categorias + Variantes
- ✅ Carrinho + Estoque transacional
- ✅ Checkout + Pedidos
- ✅ Pagamentos (Mercado Pago PIX)
- ✅ Frete + Tracking
- ✅ Notificações (BullMQ)
- ✅ Admin
- ✅ Segurança + LGPD
- ✅ 162 testes backend + 15 frontend
- ✅ Docker + CI/CD + Backup
