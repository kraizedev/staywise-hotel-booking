# Hotel Booking (base)

Next.js 14 (App Router) + Prisma + Neon Postgres + Cloudinary, deployed on Render.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env` and fill it in (Neon URLs, Cloudinary keys, admin login, AUTH_SECRET)
3. `npx prisma migrate dev --name init`  (creates tables and the `prisma/migrations` folder; commit it)
4. `npm run db:seed`  (creates the admin and 3 sample rooms)
5. `npm run dev` → http://localhost:3000 and http://localhost:3000/admin

## Deploy
1. Push to GitHub (include `prisma/migrations`).
2. Render → New → Blueprint → pick the repo (it reads `render.yaml`). Fill in the env vars.
3. Run `npm run db:seed` once (locally against the Neon URL is fine).

## Structure (for reskinning)
- `src/app/globals.css`: all styling. Colors, fonts, radius and spacing are tokens at the top.
- `src/components/*`: SearchForm, RoomCard, BookingForm, AdminPanel (markup uses plain class names).
- `src/app/**/page.tsx`: page layouts.
- Do NOT change: `src/app/api/**`, `src/lib/**`, `prisma/**`, and the input `name` attributes / fetch logic in the components.

## Reskin prompt for ChatGPT
"Restyle this Next.js app. You may edit only globals.css, layout.tsx, and the JSX markup/classNames inside src/components and page.tsx files. Do not touch src/app/api, src/lib, prisma, form field names, or fetch/state logic."
