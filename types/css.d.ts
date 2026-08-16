// Next.js only ships ambient types for CSS Modules (`*.module.css`), so a plain
// side-effect import like `import "./globals.css"` has no declaration to resolve
// against. TypeScript 5.9+ reports that as error 2882.
declare module "*.css";
