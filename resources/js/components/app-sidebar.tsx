import {
    Activity,
    BookOpen,
    Building2,
    CalendarDays,
    Code2,
    DollarSign,
    Handshake,
    MoonIcon,
    SunIcon,
    UserRound,
    Users,
    Wrench,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { getBusinessesWithFeature } from '@/data/businesses';
import { useAppearance } from '@/hooks/use-appearance';
import { usePermissions } from '@/hooks/use-permissions';
import {
    activityLog,
    agents,
    deals,
    developerGuide,
    propertyServices,
    propertyTypes,
    rolesAndPermissions,
    salesTeams,
    stats,
    userGuide,
} from '@/routes';
import type { NavGroup } from '@/types';

const mainNavGroups: NavGroup[] = [
    {
        name: 'Dashboards',
        items: [
            {
                title: 'Stats',
                href: stats(),
                icon: CalendarDays,
                permission: 'stats.view',
            },
            {
                title: 'Property Types',
                href: propertyTypes(),
                icon: Building2,
                permission: 'property types.view',
            },
            {
                title: 'Agents',
                href: agents(),
                icon: UserRound,
                permission: 'agents.view',
            },
            {
                title: 'Deals',
                href: deals(),
                icon: Handshake,
                permission: 'deals.view',
            },
            {
                title: 'Property Services',
                href: propertyServices(),
                icon: Wrench,
                permission: 'property services.view',
            },
            {
                title: 'Sales Teams',
                icon: DollarSign,
                permission: 'sales teams.view',
                items: getBusinessesWithFeature('sales-teams').map(
                    (business) => ({
                        title: business.label,
                        href: salesTeams({
                            query: { business: business.name },
                        }),
                    }),
                ),
            },
        ],
    },
    {
        name: 'Settings',
        items: [
            {
                title: 'Roles & Permissions',
                href: rolesAndPermissions(),
                icon: Users,
                permission: 'roles and permissions.view',
            },
            {
                title: 'Activity Log',
                href: activityLog(),
                icon: Activity,
                permission: 'activity log.view',
            },
        ],
    },
    {
        name: 'Information',
        items: [
            {
                title: 'User Guide',
                href: userGuide(),
                icon: BookOpen,
            },
            {
                title: 'Developer Guide',
                href: developerGuide(),
                icon: Code2,
                permission: 'developer guide.view',
            },
        ],
    },
];

export function AppSidebar() {
    const { updateAppearance, resolvedAppearance } = useAppearance();
    const { can } = usePermissions();

    const filteredMainNavGroups: NavGroup[] = mainNavGroups
        .map((group) => ({
            ...group,
            items: group.items.filter(
                (item) => !item.permission || can(item.permission),
            ),
        }))
        .filter((group) => group.items.length > 0);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarContent>
                <SidebarHeader className="flex flex-row items-center justify-between gap-2">
                    <SidebarTrigger />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 group-data-[collapsible=icon]:hidden"
                        onClick={() => {
                            updateAppearance(
                                resolvedAppearance === 'dark'
                                    ? 'light'
                                    : 'dark',
                            );
                        }}
                    >
                        {resolvedAppearance === 'dark' ? (
                            <SunIcon />
                        ) : (
                            <MoonIcon />
                        )}
                    </Button>
                </SidebarHeader>
                <NavMain groups={filteredMainNavGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
