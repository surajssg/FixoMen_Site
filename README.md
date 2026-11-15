# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Email setup

Email is sent by the Node server, not from the browser. Copy `.env.example` to `.env`, then set `SMTP_PASS` to a newly generated Google App Password. Do not commit `.env` or put mail credentials in `VITE_` variables.

The configured Gmail account sends enquiries, bulk requests, and orders to `CONTACT_EMAIL`. Start the site and local Express API together with `npm run dev`.

For Vercel, the `api/` directory contains serverless routes and `vercel.json` sets the Vite build output. Add `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `CONTACT_EMAIL` under the Vercel project's Environment Variables for Production, then redeploy. Check `/api/health` after deployment; it reports whether SMTP variables are present, but does not test Gmail authentication.

For a traditional Node host, build with `npm run build`, set the same variables in the hosting provider's secret settings, and run `npm start`.

The contact form sends the customer's name, email, and message. Place Order sends a request containing the product, quantity, and customer delivery details. It does not take payment; the owner must confirm price and delivery.
