import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types/navigation';
import type { Auth, Permission, Role, Session } from './auth';

export type PermissionGroupKey = 'views' | 'actions' | 'businesses';

export type PermissionGroups = Record<PermissionGroupKey, Permission[]>;

export type AppLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export type AppVariant = 'header' | 'sidebar';

export type FlashToast = {
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
};

export type AuthLayoutProps = {
    children?: ReactNode;
    name?: string;
    title?: string;
    description?: string;
};

export type PageProps = {
    auth: Auth;
    flash: { store_success: string; store_error: string; update_success: string; update_error: string; delete_success: string; delete_error: string };
    permissionGroups: PermissionGroups;
    roles: Role[];
    sessions: Session[];
};