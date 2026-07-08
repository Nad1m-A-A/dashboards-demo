import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { toUrl } from '@/lib/utils';
import type { NavGroup, NavItem } from '@/types';

function isExactUrl(
    href: NonNullable<NavItem['href']>,
    currentUrl: string,
): boolean {
    return toUrl(href) === currentUrl;
}

function NavCollapsibleItem({
    item,
    currentUrl,
}: {
    item: Extract<NavItem, { items: NavItem['items'] }>;
    currentUrl: string;
}) {
    const isChildActive = item.items.some((subItem) =>
        isExactUrl(subItem.href, currentUrl),
    );
    const [open, setOpen] = useState(isChildActive);

    useEffect(() => {
        if (isChildActive) {
            setOpen(true);
        }
    }, [isChildActive]);

    return (
        <Collapsible
            open={open}
            onOpenChange={setOpen}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        tooltip={{ children: item.title }}
                        isActive={isChildActive}
                    >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={isExactUrl(
                                        subItem.href,
                                        currentUrl,
                                    )}
                                >
                                    <Link href={subItem.href}>
                                        <span>{subItem.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}

export function NavMain({ groups = [] }: { groups: NavGroup[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const page = usePage();
    const currentUrl = page.url;

    return (
        <SidebarGroup className="px-2 py-0">
            {groups.map((group) => (
                <Fragment key={group.name}>
                    <SidebarGroupLabel>{group.name}</SidebarGroupLabel>
                    <SidebarMenu>
                        {group.items.map((item) =>
                            item.items ? (
                                <NavCollapsibleItem
                                    key={item.title}
                                    item={item}
                                    currentUrl={currentUrl}
                                />
                            ) : (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isCurrentUrl(item.href)}
                                        tooltip={{ children: item.title }}
                                    >
                                        <Link href={item.href}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ),
                        )}
                    </SidebarMenu>
                </Fragment>
            ))}
        </SidebarGroup>
    );
}
