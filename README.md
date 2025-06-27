This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```
metamarc-backoffice
├─ components.json
├─ eslint.config.mjs
├─ middleware.ts
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ fonts
│  │  └─ Gilroy
│  │     ├─ Gilroy-ExtraBold.otf
│  │     └─ Gilroy-Light.otf
│  ├─ globe.svg
│  ├─ images
│  │  └─ unimarc-hero.png
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ admin
│  │  │  ├─ chats
│  │  │  │  └─ page.tsx
│  │  │  ├─ health
│  │  │  │  └─ page.tsx
│  │  │  ├─ logs
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ users
│  │  │     ├─ page.tsx
│  │  │     └─ [id]
│  │  │        ├─ not-found.tsx
│  │  │        └─ page.tsx
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  ├─ login
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ register
│  │  │  │     └─ route.ts
│  │  │  ├─ subscription
│  │  │  │  ├─ status
│  │  │  │  │  └─ route.ts
│  │  │  │  └─ subscribe
│  │  │  │     └─ route.ts
│  │  │  └─ user
│  │  │     └─ renew-api-key
│  │  │        └─ route.ts
│  │  ├─ dashboard
│  │  │  └─ page.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ hooks
│  │  │  └─ use-auth.ts
│  │  ├─ landing
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ login
│  │  │  └─ page.tsx
│  │  ├─ page.tsx
│  │  ├─ register
│  │  │  └─ page.tsx
│  │  └─ subscription
│  │     ├─ canceled
│  │     │  └─ page.tsx
│  │     ├─ page.tsx
│  │     ├─ plans
│  │     │  └─ page.tsx
│  │     └─ success
│  │        └─ page.tsx
│  ├─ components
│  │  ├─ admin
│  │  │  ├─ admin-dashboard.tsx
│  │  │  ├─ create-user-dialog.tsx
│  │  │  ├─ edit-user-dialog.tsx
│  │  │  ├─ system-logs.tsx
│  │  │  ├─ system-status.tsx
│  │  │  ├─ user-profile.tsx
│  │  │  ├─ user-stripe-profile.tsx
│  │  │  └─ users-management.tsx
│  │  ├─ auth
│  │  │  ├─ auth-guard.tsx
│  │  │  ├─ login-form.tsx
│  │  │  ├─ register-form.tsx
│  │  │  ├─ role-guard.tsx
│  │  │  └─ unauthorized.tsx
│  │  ├─ chat
│  │  │  ├─ chat-box.tsx
│  │  │  └─ chat-panel.tsx
│  │  ├─ dashboard
│  │  │  ├─ dashboard-footer.tsx
│  │  │  └─ user-dashboard.tsx
│  │  ├─ landing
│  │  │  ├─ landing-page.tsx
│  │  │  └─ sections
│  │  │     ├─ api-preview.tsx
│  │  │     ├─ faq.tsx
│  │  │     ├─ features.tsx
│  │  │     ├─ footer.tsx
│  │  │     ├─ hero.tsx
│  │  │     ├─ navigation.tsx
│  │  │     ├─ PricingTiers.tsx
│  │  │     ├─ waitlist.tsx
│  │  │     └─ who-needs-this.tsx
│  │  ├─ layout
│  │  │  ├─ dashboard-layout.tsx
│  │  │  ├─ loading-spinner.tsx
│  │  │  └─ navigation.tsx
│  │  ├─ subscription
│  │  │  ├─ subscription-details.tsx
│  │  │  └─ subscription-plans.tsx
│  │  └─ ui
│  │     ├─ alert.tsx
│  │     ├─ badge.tsx
│  │     ├─ button.tsx
│  │     ├─ card.tsx
│  │     ├─ dialog.tsx
│  │     ├─ dropdown-menu.tsx
│  │     ├─ input.tsx
│  │     ├─ label.tsx
│  │     ├─ select.tsx
│  │     └─ table.tsx
│  └─ lib
│     └─ utils.ts
├─ tailwind.config.js
└─ tsconfig.json

```