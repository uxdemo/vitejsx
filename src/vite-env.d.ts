/// <reference types="vite/client" />

declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.modules.less" {
  const classes: Record<string, string>;
  export = classes;
}

declare module "*.module.less" {
  const classes: Record<string, string>;
  export = classes;
}

declare module "*.css" {
  const content: unknown;
  export default content;
}
