import { useQueries, UseQueryResult } from '@tanstack/react-query'
import { useMemo } from 'react';
import { Fragment } from 'react/jsx-runtime';
import BackgroundFetchingIndicator from '@/components/custom/BackgroundFetchingIndicator';
import { getAccessibleBusinessesWithFeature } from '@/data/businesses';
import { usePermissions } from '@/hooks/use-permissions';
import type { ExternalStats } from '@/types/external-api/stats';
import StatsTable from './StatsTable';
import SubOfficesTables from './SubOfficesTables';

// Helper function to prevent displaying 0 in table cells where the value should be empty.
const addOptional = (a: number | undefined, b: number | undefined) =>
    a === undefined && b === undefined ? undefined : (a ?? 0) + (b ?? 0);

function StatsTables() {
    const { permissions } = usePermissions();
    const featuredBusinesses = useMemo(
        () => getAccessibleBusinessesWithFeature('stats', permissions),
        [permissions],
    );
    const results: UseQueryResult<ExternalStats, Error>[] = useQueries({
        queries: featuredBusinesses.map((business) => ({
            queryKey: ["stats", business.name],
            queryFn: async () => {
                const res = await fetch(`/api/external/${business.name}/stats`);

                if (!res.ok) {
                    throw new Error('Failed to load stats');
                }

                return res.json();
            }
        }))
    })
    const featuredBusinessesWithResultsData = featuredBusinesses.map((business, index) => ({
        business,
        data: results[index].data ?? [],
        isPending: results[index].isPending,
        isError: results[index].isError,
        refetch: results[index].refetch,
    }))

    const resultsForTotalsCalculation = featuredBusinessesWithResultsData.length > 1 ? featuredBusinessesWithResultsData.filter(result => result.business.features?.includes("stats-totals")) : []

    const totals: ExternalStats = resultsForTotalsCalculation
        .flatMap(result => result.data as ExternalStats)
        .reduce<ExternalStats>((acc, row) => {
            const existing = acc.find(r => r.period === row.period);

            if (existing) {
                existing.income += row.income ?? 0;
                existing.reservations = addOptional(existing.reservations, row.reservations);
                existing.new = addOptional(existing.new, row.new);
                existing.followup = addOptional(existing.followup, row.followup);
                existing.arrived = addOptional(existing.arrived, row.arrived);
                existing.new_arrived = addOptional(existing.new_arrived, row.new_arrived);
                existing.followup_arrived = addOptional(existing.followup_arrived, row.followup_arrived);
            } else {
                acc.push({ ...row });
            }
            return acc;
        }, []);

    const businessesSortedByHighestIncome = featuredBusinessesWithResultsData.sort((a, b) => {
        if (!a.business.features?.includes("stats-totals")) return 0;
        return (b.data.find(item => item.period === "today")?.income ?? 0) - (a.data.find(item => item.period === "today")?.income ?? 0);
    })
    return (
        <div className="overflow-x-auto">
            <BackgroundFetchingIndicator results={results} />
            <div className="flex flex-col gap-4 min-w-[1200px]">
                {businessesSortedByHighestIncome.map(({ business, data, isPending, isError, refetch }, i) => (
                    <Fragment key={business.name + i}>
                        <StatsTable
                            business={business}
                            data={data}
                            isPending={isPending}
                            isError={isError}
                            refetch={refetch}
                        />
                        {business.features?.includes('sub-offices') && (
                            <SubOfficesTables business={business} />
                        )}
                    </Fragment>
                ))}

                {totals.length > 0 &&
                    <StatsTable isBusiness={false} business={{ name: "All", label: "ALL", initials: "T", logo: "", primary_color: "#222222", secondary_color: "", features: [] }} data={totals} isPending={false} isError={false} refetch={() => { }} />
                }
            </div>
        </div>
    )
}

export default StatsTables
