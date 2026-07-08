import { Head } from '@inertiajs/react';
import PropertyServicesTable from '@/components/custom/PropertyServices/PropertyServicesTable';
import { propertyServices } from '@/routes';

export default function PropertyServices() {
    return (
        <>
            <Head title="Property Services" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <PropertyServicesTable />
            </div>
        </>
    );
}

PropertyServices.layout = {
    breadcrumbs: [
        {
            title: 'Property Services',
            href: propertyServices(),
        },
    ],
};
