import { useQuery } from '@tanstack/react-query';
import BackgroundFetchingIndicator from '@/components/custom/BackgroundFetchingIndicator';
import { businesses } from '@/data/businesses';
import type { ExternalPropertyServices } from '@/types/external-api/property-services';
import { columns } from './Columns';
import { DataTable } from './DataTable';

function PropertyServicesTable() {
    const { data = [], isPending, isError, isFetching, refetch } =
        useQuery<ExternalPropertyServices>({
            queryKey: ['property-services'],
            queryFn: async () => {
                const res = await fetch(`/api/external/zeta/property-services`);

                if (!res.ok) {
                    throw new Error('Failed to load property services');
                }

                return res.json();
            },
        });
    const business = businesses.find((item) => item.name === 'zeta');
    const businessColor = business?.primary_color ?? '#222222';

    return (
        <div className="flex flex-1 flex-col overflow-hidden rounded-md">
            <BackgroundFetchingIndicator
                results={[{ isFetching, isPending }]}
            />
            <DataTable
                error={isError}
                refetch={refetch}
                loading={isPending}
                columns={columns}
                data={data}
                businessColor={businessColor}
            />
        </div>
    );
}

export default PropertyServicesTable;
