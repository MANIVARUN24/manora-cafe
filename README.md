# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# MANORA Café — role/account setup

## What is included
- `App.jsx`: owner-only Staff Management, role-based account creation, and last login/logout timestamps.
- `supabase/functions/create-user/index.ts`: owner-only account creation using Supabase Auth Admin API.
- `manora_roles_rls.sql`: fixes the recursive `staff_profiles` RLS problem and adds safe account/activity policies.

## Apply in this order
1. Run `manora_roles_rls.sql` in Supabase SQL Editor.
2. Open Edge Functions > `create-user` > Code. Replace `index.ts` with the supplied file and deploy/update the function.
3. Replace your project's `src/App.jsx` with the supplied `App.jsx`.
4. Keep the frontend Supabase client on the publishable/anon key only. Never put a service-role/secret key in browser code.
5. In VS Code, run `npm run dev` from the project folder.
6. Open the local Vite URL, go to Owner Login, and sign in with the existing owner account.
7. Open Owner Dashboard > Staff Management > + Add User.
8. Create a Staff account and test `/login`.
9. Create an Owner account and test `/owner-login`.
10. Login/logout timestamps will appear in Staff Management.

## Important
The existing MANORA ordering/menu/business-day code still uses localStorage for much of its application data. This update focuses on the Supabase Auth + role + staff-management system requested here; it does not silently migrate those existing features to database tables.
