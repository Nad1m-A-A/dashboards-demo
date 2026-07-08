import { Head } from '@inertiajs/react';
import PropertyTypesCardsAndTable from '@/components/custom/PropertyTypes/PropertyTypesCardsAndTable';
import { dashboardPageClasses } from '@/lib/layout-classes';
import { propertyTypes } from '@/routes';

export default function PropertyTypes() {
    return (
        <>
            <Head title="Property Types" />
            <div className={dashboardPageClasses}>
                <PropertyTypesCardsAndTable />
            </div>
        </>
    );
}

PropertyTypes.layout = {
    breadcrumbs: [
        {
            title: 'Property Types',
            href: propertyTypes(),
        },
    ],
};
