import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'chat',
        pathMatch: 'full',
    },
    {
        path: 'chat',
        loadComponent: () => import('@chat-bhp/chat/chat-feature').then(m => m.Chat),
    }
];
