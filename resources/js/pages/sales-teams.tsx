import { Head } from '@inertiajs/react';
import SalesTeamsTable from '@/components/custom/Sales-Teams/SalesTeamsTable';
import { dashboardPageClasses } from '@/lib/layout-classes';
import { salesTeams } from '@/routes';

export default function SalesTeams() {
    return (
        <>
            <Head title="Sales Teams" />
            <div className={dashboardPageClasses}>
                <SalesTeamsTable />
            </div>
        </>
    );
}

SalesTeams.layout = {
    breadcrumbs: [
        {
            title: 'Sales Teams',
            href: salesTeams(),
        },
    ],
};
