import { Head } from '@inertiajs/react';
import DealsTable from '@/components/custom/Deals/DealsTable';
import { deals } from '@/routes';

export default function Deals() {
    return (
        <>
            <Head title="Deals" />
            <div className="flex h-[calc(100svh-4rem)] flex-col overflow-hidden p-4 md:h-[calc(100svh-1rem)]">
                <DealsTable />
            </div>
        </>
    );
}

Deals.layout = {
    breadcrumbs: [
        {
            title: 'Deals',
            href: deals(),
        },
    ],
};
