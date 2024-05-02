/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_ID: string;
    readonly APP_CERTIFICATE?: string;
    readonly RTC_TOKEN?: string;
    readonly VITE_X_AUTH_TOKEN?: string;
    readonly VITE_X_AUTH_USER?: string;
    // ... any other custom environment variables you have ...
}
