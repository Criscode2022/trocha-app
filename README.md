# trocha-app
TROCHA — última milla microflota (L2). Angular + Nest + Prisma + Neon + JWT.

```bash
cp apps/api/.env.example apps/api/.env
# set DATABASE_URL + JWT_SECRET + PORT=3005
npm install --prefix apps/api && npm install --prefix apps/web
npm --prefix apps/api run prisma:migrate -- --name init
npm --prefix apps/api run prisma:seed
npm run api   # :3005
npm run web   # :4200
```

Demo: ops@trocha.log / ruta@trocha.log · password123

### Research → producto (L2)
- **Volumen del día:** `GET /api/stops/stats/day` + KPIs en consola (benchmarks courier 10–20 / flota 20–60).
- **Offline courier:** cache de lista + cola de `PATCH status` con flush al recuperar red (`OfflineQueueService`).
