import type { UseQueryResult } from '@tanstack/react-query';
import { useQueries } from '@tanstack/react-query';
import { RefreshCcwIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import BackgroundFetchingIndicator from '@/components/custom/BackgroundFetchingIndicator';
import BusinessIdentityCell from '@/components/custom/BusinessIdentityCell';
import DealsFilterPanel from '@/components/custom/Deals/DealsFilterPanel';
import { matchesDealsFilters } from '@/components/custom/Deals/matchesDealsFilters';
import { defaultDealsFilters } from '@/components/custom/Deals/types';
import type {
    AgencySelectOption,
    DealRow,
    DealsFilters,
    InspectionSort,
} from '@/components/custom/Deals/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getAccessibleBusinessesWithFeature } from '@/data/businesses';
import { usePermissions } from '@/hooks/use-permissions';
import { formatNumber } from '@/lib/format-number';
import type { ExternalDeals } from '@/types/external-api/deals';

const DETAIL_COLUMN_COUNT = 16;

const OFFICE_LABELS: Record<
    string,
    { label: string; backgroundColor: string; color: string }
> = {
    'Downtown Office': {
        label: 'Downtown',
        backgroundColor: '#C2185B',
        color: '#FFFFFF',
    },
    'Marina Branch': {
        label: 'Marina',
        backgroundColor: '#B8860B',
        color: '#FFFFFF',
    },
    'Lakeside Office': {
        label: 'Lakeside',
        backgroundColor: '#9C0505',
        color: '#FFFFFF',
    },
    'Riverside Branch': {
        label: 'Riverside',
        backgroundColor: '#2D77B0',
        color: '#FFFFFF',
    },
    'Central Plaza Office': {
        label: 'Central Plaza',
        backgroundColor: '#808080',
        color: '#FFFFFF',
    },
    'Westview Branch': {
        label: 'Westview',
        backgroundColor: '#567838',
        color: '#FFFFFF',
    },
    empty: {
        label: '—',
        backgroundColor: '',
        color: '',
    },
};

function compareInspectionTime(
    a: string | null,
    b: string | null,
    direction: 'asc' | 'desc',
): number {
    if (a == null && b == null) {
        return 0;
    }

    if (a == null) {
        return 1;
    }

    if (b == null) {
        return -1;
    }

    const comparison = a.localeCompare(b);

    return direction === 'asc' ? comparison : -comparison;
}

function DealsTable() {
    const { permissions } = usePermissions();
    const [filters, setFilters] = useState<DealsFilters>(defaultDealsFilters);
    const [inspectionSort, setInspectionSort] =
        useState<InspectionSort>('default');
    const featuredBusinesses = useMemo(
        () => getAccessibleBusinessesWithFeature('deals', permissions),
        [permissions],
    );
    const results: UseQueryResult<ExternalDeals, Error>[] = useQueries({
        queries: featuredBusinesses.map((business) => ({
            queryKey: ['deals', business.name],
            queryFn: async (): Promise<ExternalDeals> => {
                const response = await fetch(
                    `/api/external/${business.name}/deals`,
                );

                if (!response.ok) {
                    throw new Error('Failed to load deals');
                }

                return response.json();
            },
        })),
    });

    const rows: DealRow[] = useMemo(
        () =>
            featuredBusinesses.flatMap((business, index) => {
                const result = results[index];

                if (result.isPending || result.isError || !result.data) {
                    return [];
                }

                return result.data.map((deal, dealIndex) => ({
                    key: `${business.name}-${deal.client}-${deal.date}-${dealIndex}`,
                    business,
                    originalDate: deal.date,
                    deal: {
                        ...deal,
                        date: new Date(deal.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                        }),
                    },
                }));
            }),
        [featuredBusinesses, results],
    );

    const agencyOptions: AgencySelectOption[] = useMemo(
        () =>
            featuredBusinesses.map((business) => ({
                label: business.label,
                value: business.name,
                primaryColor: business.primary_color,
                logo: business.logo,
                initials: business.initials,
            })),
        [featuredBusinesses],
    );

    const officeOptions = useMemo(
        () =>
            [...new Set(rows.map((row) => row.deal.office).filter(Boolean))]
                .sort((a, b) => a.localeCompare(b))
                .map((office) => ({ value: office, label: office })),
        [rows],
    );

    const agentOptions = useMemo(
        () =>
            [
                ...new Set(
                    rows.flatMap((row) => row.deal.agents).filter(Boolean),
                ),
            ]
                .sort((a, b) => a.localeCompare(b))
                .map((agent) => ({ value: agent, label: agent })),
        [rows],
    );

    const filteredRows = useMemo(
        () => rows.filter((row) => matchesDealsFilters(row, filters)),
        [rows, filters],
    );

    const sortedRows = useMemo(() => {
        const nextRows = [...filteredRows];

        if (inspectionSort === 'default') {
            return nextRows
                .sort((a, b) =>
                    (a.deal.office ?? '').localeCompare(b.deal.office ?? ''),
                )
                .sort(
                    (a, b) =>
                        new Date(a.originalDate).getTime() -
                        new Date(b.originalDate).getTime(),
                );
        }

        return nextRows.sort((a, b) =>
            compareInspectionTime(
                a.deal.inspection_time,
                b.deal.inspection_time,
                inspectionSort,
            ),
        );
    }, [filteredRows, inspectionSort]);

    const pending = featuredBusinesses.flatMap((business, index) => {
        const result = results[index];

        if (!result.isPending) {
            return [];
        }

        return [{ business }];
    });
    const errored = featuredBusinesses.flatMap((business, index) => {
        const result = results[index];

        if (!result.isError) {
            return [];
        }

        return [{ business, index }];
    });
    const showNoResults =
        sortedRows.length === 0 &&
        pending.length === 0 &&
        errored.length === 0 &&
        (rows.length === 0 || filteredRows.length === 0);

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
            <div className="min-w-0 shrink-0 overflow-x-auto">
                <DealsFilterPanel
                    filters={filters}
                    onChange={setFilters}
                    inspectionSort={inspectionSort}
                    onInspectionSortChange={setInspectionSort}
                    agencyOptions={agencyOptions}
                    officeOptions={officeOptions}
                    agentOptions={agentOptions}
                />
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border">
                <BackgroundFetchingIndicator results={results} />
                <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden">
                    <div className="h-full w-max min-w-full overflow-y-auto **:data-[slot=table-container]:overflow-visible">
                        <Table>
                            <TableHeader className="bg-[#222222]">
                                <TableRow className="sticky top-0 z-10 bg-[#222222]">
                                    <TableHead className="min-w-[200px] text-white">
                                        Agency
                                    </TableHead>
                                    <TableHead className="min-w-[250px] text-white">
                                        Client
                                    </TableHead>
                                    <TableHead className="min-w-[160px] text-white">
                                        Phone
                                    </TableHead>
                                    <TableHead className="min-w-[100px] text-white">
                                        Listing ID
                                    </TableHead>
                                    <TableHead className="min-w-[100px] text-white">
                                        Sq Ft
                                    </TableHead>
                                    <TableHead className="min-w-[110px] text-white">
                                        Inspection
                                    </TableHead>
                                    <TableHead className="min-w-[160px] text-white">
                                        Office
                                    </TableHead>
                                    <TableHead className="min-w-[160px] text-white">
                                        Property Type
                                    </TableHead>
                                    <TableHead className="min-w-[160px] text-white">
                                        Services
                                    </TableHead>
                                    <TableHead className="min-w-[260px] text-white">
                                        First Agent
                                    </TableHead>
                                    <TableHead className="min-w-[200px] text-white">
                                        Second Agent
                                    </TableHead>
                                    <TableHead className="min-w-[200px] text-white">
                                        Third Agent
                                    </TableHead>
                                    <TableHead className="min-w-[200px] text-white">
                                        Date
                                    </TableHead>
                                    <TableHead className="min-w-[120px] text-white">
                                        From
                                    </TableHead>
                                    <TableHead className="min-w-[120px] text-right text-white">
                                        Price
                                    </TableHead>
                                    <TableHead className="min-w-[120px] text-right text-white">
                                        Paid
                                    </TableHead>
                                    <TableHead className="min-w-[120px] pe-10 text-right text-white">
                                        Due
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="bg-card">
                                {pending.map(({ business }) => (
                                    <TableRow key={`pending-${business.name}`}>
                                        <TableCell className="space-y-1">
                                            <Skeleton className="h-7.5" />
                                            <Skeleton className="h-7.5" />
                                            <Skeleton className="h-7.5" />
                                        </TableCell>
                                        <TableCell
                                            className="space-y-1"
                                            colSpan={DETAIL_COLUMN_COUNT}
                                        >
                                            <Skeleton className="h-7.5" />
                                            <Skeleton className="h-7.5" />
                                            <Skeleton className="h-7.5" />
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {errored.map(({ business, index }) => (
                                    <TableRow key={`error-${business.name}`}>
                                        <TableCell>
                                            <BusinessIdentityCell
                                                business={business}
                                            />
                                        </TableCell>
                                        <TableCell colSpan={DETAIL_COLUMN_COUNT}>
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-destructive">
                                                    Failed
                                                </span>
                                                <Button
                                                    onClick={() => {
                                                        void results[
                                                            index
                                                        ].refetch();
                                                    }}
                                                    variant="secondary"
                                                    size="sm"
                                                >
                                                    <RefreshCcwIcon className="size-3" />
                                                    Retry
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {sortedRows.map((row, i) => {
                                    const isLastOfGroup =
                                        i - 1 === sortedRows.length ||
                                        (sortedRows[i + 1] &&
                                            row.deal.date !==
                                                sortedRows[i + 1].deal.date);

                                    return (
                                        <TableRow
                                            key={row.key}
                                            className={
                                                isLastOfGroup
                                                    ? 'border-b-4 border-foreground'
                                                    : ''
                                            }
                                        >
                                            <TableCell>
                                                <BusinessIdentityCell
                                                    business={row.business}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium whitespace-normal">
                                                {row.deal.client}
                                            </TableCell>
                                            <TableCell>{row.deal.phone}</TableCell>
                                            <TableCell>
                                                {row.deal.listing_id}
                                            </TableCell>
                                            <TableCell>{row.deal.sqft}</TableCell>
                                            <TableCell>
                                                {row.deal.inspection_time ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className="inline-flex items-center rounded-md px-3 py-1.5"
                                                    style={{
                                                        backgroundColor:
                                                            OFFICE_LABELS[
                                                                row.deal.office
                                                            ]?.backgroundColor ??
                                                            OFFICE_LABELS.empty
                                                                .backgroundColor,
                                                        color:
                                                            OFFICE_LABELS[
                                                                row.deal.office
                                                            ]?.color ??
                                                            OFFICE_LABELS.empty
                                                                .color,
                                                    }}
                                                >
                                                    {OFFICE_LABELS[
                                                        row.deal.office
                                                    ]?.label ??
                                                        row.deal.office ??
                                                        '—'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {row.deal.property_type}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    {row.deal.services.map(
                                                        (service) => (
                                                            <Badge
                                                                key={service}
                                                                className="capitalize"
                                                            >
                                                                {service.toLowerCase()}
                                                            </Badge>
                                                        ),
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {row.deal.agents[0]}
                                            </TableCell>
                                            <TableCell>
                                                {row.deal.agents[1] ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                {row.deal.agents[2] ?? '—'}
                                            </TableCell>
                                            <TableCell>{row.deal.date}</TableCell>
                                            <TableCell>
                                                {row.deal.from ?? '—'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatNumber(row.deal.price)}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-green-500">
                                                {formatNumber(row.deal.paid)}
                                            </TableCell>
                                            <TableCell className="pe-10 text-right font-bold text-red-500">
                                                {formatNumber(row.deal.due)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                                {showNoResults && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={DETAIL_COLUMN_COUNT + 1}
                                            className="py-8 text-center text-muted-foreground"
                                        >
                                            No deals found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DealsTable;
