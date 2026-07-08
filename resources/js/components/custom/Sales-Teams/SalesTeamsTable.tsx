import { router, usePage } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight } from 'lucide-react';
import { Fragment, useEffect, useMemo, useState } from 'react';
import BackgroundFetchingIndicator from '@/components/custom/BackgroundFetchingIndicator';
import QueryErrorRetry from '@/components/custom/QueryErrorRetry';
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
import { businesses, getBusinessesWithFeature } from '@/data/businesses';
import {
    dashboardTableFrameClasses,
    dashboardTableScrollClasses,
    dashboardTableScrollContentClasses,
} from '@/lib/layout-classes';
import { formatNumber } from '@/lib/format-number';
import { cn } from '@/lib/utils';
import { salesTeams } from '@/routes';
import type {
    ExternalSalesTeam,
    ExternalSalesTeamMember,
    ExternalSalesTeams,
} from '@/types/external-api/sales-teams';

const TEAM_COLUMN_COUNT = 8;
const SKELETON_ROW_COUNT = 12;

const memberColumns: ColumnDef<ExternalSalesTeamMember>[] = [
    {
        accessorKey: 'name',
        header: 'Member',
        cell: ({ row }) => <span className={"font-medium"}>{row.original.name}</span>
    },
    {
        accessorKey: 'reservations',
        header: 'Reservations',
        cell: ({ row }) => formatNumber(row.original.reservations),
    },
    {
        accessorKey: 'done_reservations',
        header: 'Done Reservations',
        cell: ({ row }) => formatNumber(row.original.done_reservations),
    },
    {
        accessorKey: 'calls',
        header: 'Calls',
        cell: ({ row }) => formatNumber(row.original.calls),
    },
    {
        accessorKey: 'answered_calls',
        header: 'Answered Calls',
        cell: ({ row }) => formatNumber(row.original.answered_calls),
    },
    {
        accessorKey: 'income',
        header: 'Income',
        cell: ({ row }) => formatNumber(row.original.income),
    },
];

function getBusinessNameFromUrl(url: string): string | null {
    return new URL(url, 'http://localhost').searchParams.get('business');
}

function MembersTable({
    members,
    businessColor,
}: {
    members: ExternalSalesTeamMember[];
    businessColor: string;
}) {
    const [sorting, setSorting] = useState<SortingState>([{ id: 'income', desc: true }]);

    const table = useReactTable({
        data: members,
        columns: memberColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: { sorting },
    });

    const maxIncome = useMemo(
        () => Math.max(0, ...members.map((m) => m.income)),
        [members],
    );

    return (
        <div className="overflow-hidden rounded-md border bg-background">
            <Table>
                <TableHeader style={{ backgroundColor: businessColor }}>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const sorted = header.column.getIsSorted();
                                const canSort = header.column.getCanSort();
                                return (
                                    <TableHead key={header.id} className="text-white">
                                        {header.isPlaceholder ? null : (
                                            <button
                                                onClick={header.column.getToggleSortingHandler()}
                                                className={cn(
                                                    'flex items-center gap-1.5',
                                                    canSort ? 'cursor-pointer select-none' : 'cursor-default',
                                                )}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {canSort && (
                                                    sorted === 'asc' ? (
                                                        <ArrowUp className="size-3.5 shrink-0" />
                                                    ) : sorted === 'desc' ? (
                                                        <ArrowDown className="size-3.5 shrink-0" />
                                                    ) : (
                                                        <ArrowUpDown className="size-3.5 shrink-0 opacity-40" />
                                                    )
                                                )}
                                            </button>
                                        )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={memberColumns.length}
                                className="text-muted-foreground py-6 text-center text-sm"
                            >
                                No members found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className={cn(
                                    maxIncome > 0 &&
                                    row.original.income === maxIncome &&
                                    'bg-linear-to-r from-yellow-400 via-amber-500 to-yellow-400 text-black hover:from-yellow-400 hover:via-amber-500 hover:to-yellow-400',
                                )}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

function SalesTeamsTableSkeleton() {
    return (
        <>
            {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                    <TableCell className="w-10 px-2">
                        <Skeleton className="size-7.5" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-7.5 w-32" />
                    </TableCell>
                    <TableCell colSpan={TEAM_COLUMN_COUNT - 2}>
                        <div className="space-y-1">
                            <Skeleton className="h-7.5 w-full" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}

function SalesTeamsTable() {
    const page = usePage();
    const businessName = useMemo(() => getBusinessNameFromUrl(page.url), [page.url]);
    const business = useMemo(
        () => businesses.find((item) => item.name === businessName),
        [businessName],
    );
    const salesTeamsBusinesses = useMemo(() => getBusinessesWithFeature('sales-teams'), []);

    useEffect(() => {
        if (businessName) {
            return;
        }

        const firstBusiness = salesTeamsBusinesses[0];

        if (firstBusiness) {
            router.replace(salesTeams({ query: { business: firstBusiness.name } }));
        }
    }, [businessName, salesTeamsBusinesses]);

    const query = useQuery({
        queryKey: ['sales-teams', businessName],
        queryFn: async (): Promise<ExternalSalesTeams> => {
            const response = await fetch(
                `/api/external/${businessName}/sales-teams`,
            );

            if (!response.ok) {
                throw new Error('Failed to load sales teams');
            }

            return response.json();
        },
        enabled: Boolean(businessName && business),
    });

    const businessColor = business?.primary_color ?? '#222222';

    const maxIncome = useMemo(
        () => Math.max(0, ...(query.data?.map((t) => t.income) ?? [])),
        [query.data],
    );

    const teamColumns = useMemo<ColumnDef<ExternalSalesTeam>[]>(
        () => [
            {
                id: 'expand',
                enableSorting: false,
                header: () => null,
                cell: ({ row }) => (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        aria-expanded={row.getIsExpanded()}
                        aria-label={`${row.getIsExpanded() ? 'Collapse' : 'Expand'} ${row.original.name} members`}
                    >
                        <ChevronRight
                            className={cn(
                                'size-4 transition-transform duration-200',
                                row.getIsExpanded() && 'rotate-90',
                            )}
                        />
                    </Button>
                ),
            },
            {
                accessorKey: 'name',
                header: 'Team',
                cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
            },
            {
                accessorKey: 'reservations',
                header: 'Reservations',
                cell: ({ row }) => formatNumber(row.original.reservations),
            },
            {
                accessorKey: 'done_reservations',
                header: 'Done Reservations',
                cell: ({ row }) => formatNumber(row.original.done_reservations),
            },
            {
                accessorKey: 'calls',
                header: 'Calls',
                cell: ({ row }) => formatNumber(row.original.calls),
            },
            {
                accessorKey: 'answered_calls',
                header: 'Answered Calls',
                cell: ({ row }) => formatNumber(row.original.answered_calls),
            },
            {
                accessorKey: 'income',
                header: 'Income',
                cell: ({ row }) => formatNumber(row.original.income),
            },
            {
                accessorKey: 'members_count',
                header: 'Members',
                cell: ({ row }) => formatNumber(row.original.members_count),
            },
        ],
        [],
    );

    const [sorting, setSorting] = useState<SortingState>([{ id: 'income', desc: true }]);

    const table = useReactTable({
        data: query.data ?? [],
        columns: teamColumns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onSortingChange: setSorting,
        state: { sorting },
    });

    const showInvalidBusiness = Boolean(businessName) && !business;
    const showNoSalesTeamsFound =
        Boolean(businessName) &&
        Boolean(business) &&
        !query.isPending &&
        !query.isError &&
        (query.data?.length ?? 0) === 0;

    return (
        <div className="flex flex-col gap-4">
            <div className={dashboardTableScrollClasses}>
                <div className={dashboardTableScrollContentClasses}>
                    <div className={dashboardTableFrameClasses}>
                        <Table>
                            <TableHeader style={{ backgroundColor: businessColor }}>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            const sorted = header.column.getIsSorted();
                                            const canSort = header.column.getCanSort();
                                            return (
                                                <TableHead key={header.id} className="text-white">
                                                    {header.isPlaceholder ? null : (
                                                        <button
                                                            onClick={header.column.getToggleSortingHandler()}
                                                            className={cn(
                                                                'flex items-center gap-1.5',
                                                                canSort
                                                                    ? 'cursor-pointer select-none'
                                                                    : 'cursor-default',
                                                            )}
                                                        >
                                                            {flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext(),
                                                            )}
                                                            {canSort && (
                                                                sorted === 'asc' ? (
                                                                    <ArrowUp className="size-3.5 shrink-0" />
                                                                ) : sorted === 'desc' ? (
                                                                    <ArrowDown className="size-3.5 shrink-0" />
                                                                ) : (
                                                                    <ArrowUpDown className="size-3.5 shrink-0 opacity-40" />
                                                                )
                                                            )}
                                                        </button>
                                                    )}
                                                </TableHead>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody className="bg-card">

                                {/* //X Pending */}
                                {query.isPending && <SalesTeamsTableSkeleton />}

                                {/* //X Error */}
                                {query.isError && (
                                    <TableRow>
                                        <TableCell colSpan={TEAM_COLUMN_COUNT} className="py-8">
                                            <QueryErrorRetry
                                                showRetryLabel
                                                onRetry={() => query.refetch()}
                                                className="justify-center"
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* //X Invalid Business */}
                                {showInvalidBusiness && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={TEAM_COLUMN_COUNT}
                                            className="text-muted-foreground py-8 text-center"
                                        >
                                            Unknown business selected.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* //X No Sales Teams Found */}
                                {showNoSalesTeamsFound && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={TEAM_COLUMN_COUNT}
                                            className="text-muted-foreground py-8 text-center"
                                        >
                                            No sales teams found.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {/* Sales Teams */}
                                {!query.isPending &&
                                    !query.isError &&
                                    Boolean(business) &&
                                    table.getRowModel().rows.map((row) => (
                                        <Fragment key={row.id}>
                                            <TableRow
                                                onClick={() => row.toggleExpanded()}
                                                className={cn(
                                                    maxIncome > 0 &&
                                                    row.original.income === maxIncome &&
                                                    'bg-linear-to-r from-yellow-400 via-amber-500 to-yellow-400 text-black hover:from-yellow-400 hover:via-amber-500 hover:to-yellow-400',
                                                )}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className={cn(
                                                            cell.column.id === 'expand' && 'w-10 px-2',
                                                        )}
                                                    >
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                            {row.getIsExpanded() && (
                                                <TableRow className="bg-muted/20 hover:bg-muted/20">
                                                    <TableCell colSpan={TEAM_COLUMN_COUNT} className="p-4">
                                                        <MembersTable
                                                            members={row.original.members}
                                                            businessColor={businessColor}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </Fragment>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <BackgroundFetchingIndicator results={[query]} />
        </div>
    );
}

export default SalesTeamsTable;
