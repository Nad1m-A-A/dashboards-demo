import { Head } from '@inertiajs/react';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { developerGuide } from '@/routes';

// ─── Types ────────────────────────────────────────────────────────────────────

type DevGuideItem = {
    id: string;
    label: string;
    description: string;
    example?: React.ReactNode;
};

type DevGuideSection = {
    id: string;
    title: string;
    items: DevGuideItem[];
};

// ─── Content ──────────────────────────────────────────────────────────────────

const SECTIONS: DevGuideSection[] = [
    {
        id: 'overview',
        title: 'Overview',
        items: [
            {
                id: 'what-it-is',
                label: 'What it is',
                description:
                    'The dashboard aggregates live data from several standalone ERP systems (one per business) into one place. Laravel acts as an authenticated proxy; React never calls an ERP directly.',
            },
            {
                id: 'why-the-proxy',
                label: 'Why the proxy',
                description:
                    'ERP URLs and API keys stay server-side, and every request is gated by the same permission checks as the rest of the app.',
            },
        ],
    },
    {
        id: 'tech-stack',
        title: 'Tech Stack',
        items: [
            {
                id: 'backend',
                label: 'Backend',
                description:
                    'Laravel 13, Inertia v3, Fortify (auth), Spatie Permission (authorization), Wayfinder (typed routes).',
            },
            {
                id: 'frontend',
                label: 'Frontend',
                description:
                    'React 19, TanStack Query (data fetching) and TanStack Table, Tailwind v4, shadcn/ui, Recharts, React Select.',
            },
        ],
    },
    {
        id: 'authentication',
        title: 'Authentication',
        items: [
            {
                id: 'passcode-login',
                label: 'Passcode login',
                description:
                    "The login form's password field is a passcode. FortifyServiceProvider::authenticateUsing hashes it against every roles.passcode and logs in that role's linked user (app/Providers/FortifyServiceProvider.php).",
            },
            {
                id: 'one-time-passcode',
                label: 'One-time passcode',
                description:
                    'Passcodes are shown once at role creation and stored hashed; there is no email/username.',
            },
        ],
    },
    {
        id: 'roles-permissions',
        title: 'Roles & Permissions',
        items: [
            {
                id: 'three-groups',
                label: 'Three groups',
                description:
                    'config/permission.php app-permissions defines views (page access), actions (role CRUD), and businesses (per-business access).',
            },
            {
                id: 'backend-checks',
                label: 'Backend checks',
                description:
                    'Routes use permission:* middleware; the proxy calls $user->can($businessName) and $user->can($viewPermission).',
            },
            {
                id: 'frontend-checks',
                label: 'Frontend checks',
                description:
                    "usePermissions() (resources/js/hooks/use-permissions.ts) reads auth.user.role.permissions; visibility = business permission AND the business's feature flag.",
            },
        ],
    },
    {
        id: 'routing-landing',
        title: 'Routing & Landing Page',
        items: [
            {
                id: 'universal-landing',
                label: 'Universal landing',
                description:
                    '/ and LoginResponse both redirect to /user-guide, which has no permission middleware, so every authenticated user has a valid destination.',
            },
            {
                id: 'guarded-pages',
                label: 'Guarded pages',
                description:
                    'Dashboard routes in routes/web.php each carry a permission:*.view middleware; /developer-guide needs developer guide.view.',
            },
        ],
    },
    {
        id: 'demo-mode',
        title: 'Demo Mode',
        items: [
            {
                id: 'env-flag',
                label: 'Env flag',
                description:
                    'APP_DEMO -> config(\'app.demo\'). When true, routes/api.php binds DemoExternalAPIs instead of ExternalAPIs.',
            },
            {
                id: 'fake-data',
                label: 'Fake data',
                description:
                    'DemoExternalAPIs returns generated data from app/Services/DemoDataService.php behind the same permission gates.',
            },
        ],
    },
    {
        id: 'business-configuration',
        title: 'Business Configuration',
        items: [
            {
                id: 'frontend-config',
                label: 'Frontend (resources/js/data/businesses.ts)',
                description:
                    'name, label, initials, logo, colors, and features[] that drive sidebar links and which pages/cards a business appears on.',
            },
            {
                id: 'backend-config',
                label: 'Backend (config/businesses/)',
                description:
                    'urls.php (ERP base URL), keys.php (Authorization header), endpoints.php (endpoint name -> path), endpoint-permissions.php (endpoint -> required view permission).',
            },
            {
                id: 'features-vs-permissions',
                label: 'Features vs permissions',
                description:
                    'A feature flag says a business supports something; a permission says a user may see it. Both must be true.',
            },
        ],
    },
    {
        id: 'external-api-proxy',
        title: 'External API Proxy',
        items: [
            {
                id: 'endpoint',
                label: 'Endpoint',
                description:
                    'The frontend loads ERP data from GET /api/external/{business}/{endpoint}. You must be logged in.',
            },
            {
                id: 'flow',
                label: 'Flow',
                description:
                    'ExternalAPIs::retrieve 404s on unknown endpoints, 403s without both business and view permissions, then forwards GET {url}{endpoint} with the Authorization key and returns the ERP JSON (502 on failure).',
            },
        ],
    },
    {
        id: 'response-types',
        title: 'Response Types',
        items: [
            {
                id: 'type-files',
                label: 'One file per endpoint',
                description:
                    'Each proxy endpoint has a TypeScript file in resources/js/types/external-api/ that describes the JSON shape the ERP sends back (Laravel forwards it unchanged) — e.g. target.ts for target, stats.ts for stats, sales-teams.ts for sales-teams.',
            },
            {
                id: 'usage',
                label: 'How components use them',
                description:
                    'Dashboard components import these types (ExternalTarget, ExternalStats, etc.) to type TanStack Query fetch results. When you add a new endpoint, add a matching type file here and in DemoDataService.',
            },
        ],
    },
    {
        id: 'frontend-data-patterns',
        title: 'Frontend Data Patterns',
        items: [
            {
                id: 'accessible-businesses',
                label: 'Accessible businesses',
                description:
                    'Components call getAccessibleBusinessesWithFeature(feature, permissions) to render only businesses the user can see that support the feature.',
            },
            {
                id: 'fetching',
                label: 'Fetching',
                description:
                    'Data is loaded with TanStack Query calling fetch(`/api/external/${business}/${endpoint}`) in the queryFn (see TargetsCards.tsx); each business is its own query key.',
            },
            {
                id: 'query-defaults',
                label: 'Auto-refresh defaults',
                description:
                    'app.tsx sets global TanStack Query defaults: data stays fresh for 5 minutes, then refetches every 5 minutes (even in the background). Refetch on window focus is off.',
            },
        ],
    },
    {
        id: 'dashboard-modules',
        title: 'Dashboard Modules',
        items: [
            {
                id: 'stats',
                label: 'Stats',
                description: 'stats endpoint (/api/company_stats).',
            },
            {
                id: 'targets',
                label: 'Targets',
                description: 'target endpoint.',
            },
            {
                id: 'sub-offices',
                label: 'Sub-offices',
                description: 'sub-offices endpoint.',
            },
            {
                id: 'property-types',
                label: 'Property Types',
                description: 'property-types endpoint.',
            },
            {
                id: 'agents',
                label: 'Agents',
                description: 'agents endpoint.',
            },
            {
                id: 'deals',
                label: 'Deals',
                description: 'deals endpoint.',
            },
            {
                id: 'property-services',
                label: 'Property Services',
                description: 'property-services endpoint.',
            },
            {
                id: 'sales-teams',
                label: 'Sales Teams',
                description: 'sales-teams endpoint.',
            },
        ],
    },
    {
        id: 'extension-checklists',
        title: 'Extension Checklists',
        items: [
            {
                id: 'add-business',
                label: 'Add a business',
                description:
                    'Add business info and features to businesses.ts, add a logo to resources/images/, add brand colors to app.css, add the ERP URL to urls.php, add the API key to keys.php, add the permission name to permission.php, and add demo data to DemoDataService.php when using demo mode.',
            },
            {
                id: 'add-page',
                label: 'Add a page',
                description:
                    'Add the page to resources/js/pages, add a guarded route to web.php, add a view permission to permission.php, and add a sidebar entry to app-sidebar.tsx.',
            },
            {
                id: 'add-endpoint',
                label: 'Add an endpoint',
                description:
                    'Add to endpoints.php and endpoint-permissions.php, then fetch it via /api/external/{business}/{endpoint} (and add demo data in DemoDataService).',
            },
        ],
    },
];

// ─── Primitives ───────────────────────────────────────────────────────────────

function GuideSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(true);

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <Card className="gap-0 py-0 overflow-hidden">
                <CollapsibleTrigger asChild>
                    <button className="w-full text-left cursor-pointer">
                        <CardHeader className="py-4 px-6">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">{title}</CardTitle>
                                <ChevronDownIcon
                                    className={cn(
                                        'size-4 text-muted-foreground transition-transform duration-200',
                                        open && 'rotate-180',
                                    )}
                                />
                            </div>
                        </CardHeader>
                    </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <Separator />
                    <CardContent className="py-0 divide-y">{children}</CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}

function GuideItem({
    label,
    description,
    example,
}: {
    label: string;
    description: string;
    example?: React.ReactNode;
}) {
    return (
        <div className="flex items-start justify-between gap-6 py-4">
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2 min-w-[100px] flex-wrap">
                    <p className="text-sm font-medium">{label}</p>
                    {example && <div className="shrink-0 py-4 flex items-center gap-2">{example}</div>}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DeveloperGuide() {
    return (
        <>
            <Head title="Developer Guide" />
            <div className="flex flex-col gap-4 p-4 max-w-4xl mx-auto w-full">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Developer Guide</h1>
                    <p className="text-muted-foreground text-sm">
                        Architecture, data flow, and extension checklists for contributors.
                    </p>
                </div>

                {SECTIONS.map((section) => (
                    <GuideSection key={section.id} title={section.title}>
                        {section.items.map((item) => (
                            <GuideItem
                                key={item.id}
                                label={item.label}
                                description={item.description}
                                example={item.example}
                            />
                        ))}
                    </GuideSection>
                ))}
            </div>
        </>
    );
}

DeveloperGuide.layout = {
    breadcrumbs: [
        {
            title: 'Developer Guide',
            href: developerGuide(),
        },
    ],
};
