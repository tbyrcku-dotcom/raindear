import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AppRouter from './app/router';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 2,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

const container = document.getElementById('app');
if (!container) throw new Error('#app root not found');
createRoot(container).render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    </QueryClientProvider>,
);
