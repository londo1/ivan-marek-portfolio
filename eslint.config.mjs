// Flat config — replaces .eslintrc.json. Next 16 removed the `next lint`
// command, so `npm run lint` invokes eslint directly and ESLint 9+ resolves
// this file instead of the old .eslintrc.json.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
  ...nextCoreWebVitals,
];

export default config;
