import type { UseQueryResult } from '@tanstack/react-query';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import BackgroundFetchingIndicator from '@/components/custom/BackgroundFetchingIndicator';
import { getAccessibleBusinessesWithFeature } from '@/data/businesses';
import { usePermissions } from '@/hooks/use-permissions';
import {
    dashboardTableScrollClasses,
    dashboardTableScrollContentClasses,
} from '@/lib/layout-classes';
import type {
    ExternalPropertyType,
    ExternalPropertyTypes,
} from '@/types/external-api/property-types';
import PropertyTypesTable from './PropertyTypesTable';
import PropertyTypesTotalsCards from './PropertyTypesTotalsCards';
import type { PropertyTypeRow } from './types';

function PropertyTypesCardsAndTable() {
    const { permissions } = usePermissions();
    const featuredBusinesses = useMemo(
        () => getAccessibleBusinessesWithFeature('property-types', permissions),
        [permissions],
    );
    const results: UseQueryResult<ExternalPropertyTypes, Error>[] = useQueries({
        queries: featuredBusinesses.map((b) => ({
            queryKey: ['property-types', b.name],
            queryFn: async (): Promise<ExternalPropertyTypes> => {
                const res = await fetch(`/api/external/${b.name}/property-types`);

                if (!res.ok) {
                    throw new Error('Failed to load property types');
                }

                return res.json();
            },
        })),
    });

    const rows: PropertyTypeRow[] = featuredBusinesses.flatMap((business, i) => {
        const result = results[i];

        if (result.isPending || result.isError || !result.data) {
            return [];
        }

        return result.data.map((item: ExternalPropertyType) => ({
            ...item,
            business,
        }));
    });

    const totals = featuredBusinesses.map((business) => {
        const aggregated = rows
            .filter((row) => row.business.name === business.name)
            .reduce(
                (acc, item) => ({
                    new: acc.new + item.new,
                    current: acc.current + item.current,
                    highest: acc.highest + item.highest,
                }),
                { new: 0, current: 0, highest: 0 },
            );

        return {
            business,
            totals: aggregated,
        };
    });

    rows.sort((a, b) => a.property_type.localeCompare(b.property_type));

    const propertyTypesRowCounts = rows.reduce<Record<string, number>>(
        (acc, row) => {
            acc[row.property_type] = (acc[row.property_type] ?? 0) + 1;

            return acc;
        },
        {},
    );

    const pending = featuredBusinesses
        .map((business, i) => ({ business, index: i }))
        .filter(({ index }) => results[index].isPending);
    const errored = featuredBusinesses
        .map((business, i) => ({ business, index: i }))
        .filter(({ index }) => results[index].isError);
    const isEmpty =
        rows.length === 0 && pending.length === 0 && errored.length === 0;

    const queryStates = results.map((result) => ({
        isPending: result.isPending,
        isError: result.isError,
        refetch: result.refetch,
    }));

    return (
        <div className="space-y-4">
            <BackgroundFetchingIndicator results={results} />
            <PropertyTypesTotalsCards totals={totals} queryStates={queryStates} />
            <div className={dashboardTableScrollClasses}>
                <div className={dashboardTableScrollContentClasses}>
                    <PropertyTypesTable
                        rows={rows}
                        propertyTypesRowCounts={propertyTypesRowCounts}
                        pending={pending}
                        errored={errored}
                        isEmpty={isEmpty}
                        onRetry={(index) => results[index].refetch()}
                    />
                </div>
            </div>
        </div>
    );
}

export default PropertyTypesCardsAndTable;
