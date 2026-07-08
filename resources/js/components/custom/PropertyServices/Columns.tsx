import type { ColumnDef } from '@tanstack/react-table';
import ComparisonDiffBadge from '@/components/custom/ComparisonDiffBadge';
import { formatNumber } from '@/lib/format-number';
import type { ExternalPropertyServicesItem } from '@/types/external-api/property-services';

export const columns: ColumnDef<ExternalPropertyServicesItem>[] = [
    {
        accessorKey: 'location',
        enableSorting: true,
        header: 'Location',
        cell: ({ row }) => <div>{row.original.location}</div>,
    },
    {
        accessorKey: 'today',
        header: 'Today',
        cell: ({ row }) => <div>{formatNumber(row.original.today)}</div>,
    },
    {
        accessorKey: 'yesterday',
        header: 'Yesterday',
        cell: ({ row }) => <div>{formatNumber(row.original.yesterday)}</div>,
    },
    {
        accessorKey: 'current_month',
        header: 'Current Month',
        cell: ({ row }) => <div>{formatNumber(row.original.current_month)}</div>,
    },
    {
        accessorKey: 'highest_month',
        header: 'Highest Month',
        cell: ({ row }) => <div>{formatNumber(row.original.highest_month)}</div>,
    },
    {
        id: 'difference',
        accessorFn: (row) => row.current_month - row.highest_month,
        header: 'Difference',
        cell: ({ row }) => (
            <ComparisonDiffBadge
                value={row.original.current_month - row.original.highest_month}
            />
        ),
    },
];
