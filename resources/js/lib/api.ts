import axios, { AxiosError } from 'axios';

export const api = axios.create({
    baseURL: '/api/v1',
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// CSRF for SPA admin routes via Sanctum cookie auth
let csrfRequested = false;
export async function ensureCsrf() {
    if (csrfRequested) return;
    csrfRequested = true;
    try {
        await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
    } catch {
        csrfRequested = false;
    }
}

api.interceptors.request.use((config) => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    if (meta) {
        config.headers['X-CSRF-TOKEN'] = (meta as HTMLMetaElement).content;
    }
    return config;
});

export type ValidationErrors = Record<string, string[]>;

export function getValidationErrors(err: unknown): ValidationErrors | null {
    if (axios.isAxiosError(err)) {
        const e = err as AxiosError<{ errors?: ValidationErrors }>;
        if (e.response?.status === 422) {
            return e.response.data?.errors ?? {};
        }
    }
    return null;
}
