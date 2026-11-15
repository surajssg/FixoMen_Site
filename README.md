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

The configured Gmail account sends both enquiries and order requests to `CONTACT_EMAIL`. Start the site and API together with `npm run dev`. For production, build with `npm run build`, set the same environment variables in the hosting provider's secret settings, and run `npm start`.

The contact form sends the customer's name, email, and message. Place Order sends a request containing the product, quantity, and customer delivery details. It does not take payment; the owner must confirm price and delivery.
