import { TrendingDown, TrendingUp } from 'lucide-react';
import BusinessIdentityColumn from '@/components/custom/BusinessIdentityColumn';
import ComparisonDiffBadge from '@/components/custom/ComparisonDiffBadge';
import QueryErrorRetry from '@/components/custom/QueryErrorRetry';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatNumber } from '@/lib/format-number';
import type { ExternalStats, ExternalStatsPeriod } from '@/types/external-api/stats';
import type { StatsTableProps } from './types';

type DataField = keyof ExternalStatsPeriod;

type ColumnConfig = {
    label: string;
    field: DataField;
    trend?: boolean;
};

const COLUMNS: ColumnConfig[] = [
    { label: 'Period', field: 'period' },
    { label: 'Viewings', field: 'reservations', trend: true },
    { label: 'New Leads', field: 'new', trend: true },
    { label: 'Follow-up', field: 'followup', trend: true },
    { label: 'Arrived', field: 'arrived', trend: true },
    { label: 'New Arrived', field: 'new_arrived', trend: true },
    { label: 'Followup Arrived', field: 'followup_arrived', trend: true },
    { label: 'Income', field: 'income', trend: true },
    { label: 'Percentage', field: 'percentage', trend: true },
];

function TrendIcon({ data, field }: { data: ExternalStats; field: DataField }) {
    const today = data.find((r) => r.period === 'today')?.[field] as number | undefined;
    const yesterday = data.find((r) => r.period === 'yesterday')?.[field] as number | undefined;

    if (today == null || yesterday == null) return <span className="size-4" />;

    const diff = today - yesterday;
    if (diff === 0) return <span className="size-4" />;

    return diff > 0
        ? <TrendingUp className="shadow size-4 stroke-3 rounded-full p-0.5 bg-success border border-white" />
        : <TrendingDown className="shadow size-4 stroke-3 rounded-full p-0.5 bg-destructive border border-white" />;
}

function CellValue({ row, field, data }: { row: ExternalStatsPeriod; field: DataField; data: ExternalStats }) {
    if (field === 'period') {
        return <span className="capitalize">{row.period.split('_').join(' ')}</span>;
    }

    if (field === 'percentage') {
        if (row.period === 'highest_month') {
            const monthIncome = data.find((r) => r.period === 'month')?.income ?? 0;
            return <ComparisonDiffBadge value={monthIncome - row.income} />;
        }

        const pct = row.percentage;
        return (
            <span>
                {typeof pct === 'number' && Number.isFinite(pct) ? `${formatNumber(pct)}%` : '—'}
            </span>
        );
    }

    return <span>{formatNumber(row[field] as number | undefined)}</span>;
}

function StatsTable({ isBusiness = true, business, data, isPending, isError, refetch }: StatsTableProps) {
    const rows = data ?? [];

    return (
        <div className="flex gap-2">
            <BusinessIdentityColumn
                label={isBusiness ? business.initials : business.label}
                color={business.primary_color}
                logo={business.logo}
                initials={business.initials}
            />
            <div className="overflow-hidden rounded-md border w-full">
                <Table className="min-h-[189px] min-w-[800px]">
                    <TableHeader style={{ backgroundColor: business.primary_color }}>
                        <TableRow>
                            {COLUMNS.map(({ label, field, trend }) => (
                                <TableHead key={field} className="text-white">
                                    <div className="flex min-w-[100px] items-center gap-2">
                                        {label}
                                        {trend && <TrendIcon data={rows} field={field} />}
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody className="bg-card">
                        {!isPending && !isError && rows.map((row) => (
                            <TableRow key={row.period}>
                                {COLUMNS.map(({ field }) => (
                                    <TableCell key={field} className="capitalize">
                                        <CellValue row={row} field={field} data={rows} />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                        {isPending && (
                            <TableRow>
                                <TableCell colSpan={COLUMNS.length} className="space-y-1 text-center">
                                    <Skeleton className="h-7.5 w-full" />
                                    <Skeleton className="h-7.5 w-full" />
                                    <Skeleton className="h-7.5 w-full" />
                                    <Skeleton className="h-7.5 w-full" />
                                </TableCell>
                            </TableRow>
                        )}
                        {isError && (
                            <TableRow>
                                <TableCell colSpan={COLUMNS.length}>
                                    <div className="h-full flex items-center justify-center">
                                        <QueryErrorRetry showRetryLabel onRetry={refetch} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default StatsTable;
