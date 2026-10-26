interface ImportMetaEnv {
  readonly VITE_NEON_AUTH_URL?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
