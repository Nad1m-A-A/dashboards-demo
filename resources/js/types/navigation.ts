import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

export type NavGroup = {
    name: string;
    items: NavItem[];
};

export type NavSubItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

type NavItemBase = {
    title: string;
    icon?: LucideIcon | null;
    permission?: string;
};

export type NavItem =
    | (NavItemBase & {
          href: NonNullable<InertiaLinkProps['href']>;
          items?: never;
      })
    | (NavItemBase & {
          items: NavSubItem[];
          href?: never;
      });