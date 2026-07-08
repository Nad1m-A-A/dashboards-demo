import { Head } from '@inertiajs/react';
import AgentsCardsAndTable from '@/components/custom/Agents/AgentsCardsAndTable';
import { dashboardPageClasses } from '@/lib/layout-classes';
import { agents } from '@/routes';

export default function Agents() {
    return (
        <>
            <Head title="Agents" />
            <div className={dashboardPageClasses}>
                <AgentsCardsAndTable />
            </div>
        </>
    );
}

Agents.layout = {
    breadcrumbs: [
        {
            title: 'Agents',
            href: agents(),
        },
    ],
};
