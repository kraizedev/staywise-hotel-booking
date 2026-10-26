# Hotel Booking

Next.js 14 (App Router) + Prisma + Neon Postgres + Cloudinary, intended for deployment on Render.

## Run locally
1. Install Node.js 20 or later.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and configure the Neon pooled `DATABASE_URL`, direct `DIRECT_URL`, `AUTH_SECRET`, admin credentials, and Cloudinary credentials.
4. Run `npx prisma migrate deploy` after migrations are present. For a new local development database, use `npx prisma migrate dev`.
5. Run `npm run db:seed` to create the initial admin and sample room types.
6. Run `npm run dev`; open http://localhost:3000. The admin page is at http://localhost:3000/admin.

## Deploy to Render
1. Create a Render Blueprint from this repository.
2. Set `DATABASE_URL` to the Neon pooled connection string and `DIRECT_URL` to the direct connection string.
3. Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` to credentials you control. Use a long, unique admin password.
4. Render generates `AUTH_SECRET`; keep it private. Add the Cloudinary cloud name, API key, and API secret to enable room photos.
5. Render runs Prisma migrations during build. After the first deploy, run `npm run db:seed` once against the production database using a secure environment. Do not commit a real `.env` file or production credentials.

## Structure
- `src/app/globals.css`: visual design tokens and styles.
- `src/components/*`: search, room cards, booking form, admin panel.
- `src/app/**/page.tsx`: page layouts.
- `src/app/api/**`: API routes.
- `src/lib/**`: database, auth, date, availability and Cloudinary helpers.
- `prisma/**`: schema, migrations and seed script.

Do not commit credentials, production database URLs, or Cloudinary secrets.
