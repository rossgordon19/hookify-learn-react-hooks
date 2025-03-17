declare module '@babel/standalone' {
  export function transform(
    code: string,
    options?: {
      presets?: string[];
      plugins?: string[];
      [key: string]: any;
    }
  ): { code: string | null };
} 