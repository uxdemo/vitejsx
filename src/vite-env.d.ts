// 自定义声明必须在 vite/client 之前，否则 *.less → string 会先匹配
declare module '*.modules.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
  export = classes;
}

declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
  export = classes;
}

/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.css' {
  const content: unknown;
  export default content;
}

declare module '*.less' {
  const content: unknown;
  export default content;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
