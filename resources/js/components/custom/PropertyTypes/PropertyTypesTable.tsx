import { RefreshCcwIcon } from 'lucide-react';
import BusinessIdentityCell from '@/components/custom/BusinessIdentityCell';
import ComparisonDiffBadge from '@/components/custom/ComparisonDiffBadge';
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
import { formatNumber } from '@/lib/format-number';
import { dashboardTableFrameClasses } from '@/lib/layout-classes';
import type { PropertyTypesTableProps } from './types';

const METRIC_COLUMN_COUNT = 5;

export default function PropertyTypesTable({
    rows,
    propertyTypesRowCounts,
    pending,
    errored,
    isEmpty,
    onRetry,
}: PropertyTypesTableProps) {
    return (
        <div className={dashboardTableFrameClasses}>
            <Table>
                <TableHeader className="bg-[#222222]">
                    <TableRow>
                        <TableHead className="w-[220px] text-center text-white">
                            Property Type
                        </TableHead>
                        <TableHead className="w-[200px] ps-6 text-white">
                            Agency
                        </TableHead>
                        <TableHead className="w-[100px] text-white">New</TableHead>
                        <TableHead className="w-[100px] text-white">
                            Current
                        </TableHead>
                        <TableHead className="w-[100px] text-white">
                            Highest
                        </TableHead>
                        <TableHead className="w-[140px] text-white">
                            Difference
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-card">
                    {pending.map(({ business }) => (
                        <TableRow key={`pending-${business.label}`}>
                            <TableCell>
                                <Skeleton className="mx-auto h-7.5 w-34" />
                            </TableCell>
                            <TableCell
                                colSpan={METRIC_COLUMN_COUNT}
                                className="space-y-1"
                            >
                                <Skeleton className="h-7.5 w-full" />
                                <Skeleton className="h-7.5 w-full" />
                                <Skeleton className="h-7.5 w-full" />
                                <Skeleton className="h-7.5 w-full" />
                                <Skeleton className="h-7.5 w-full" />
                            </TableCell>
                        </TableRow>
                    ))}

                    {errored.map(({ business, index }) => (
                        <TableRow key={`error-${business.label}`}>
                            <TableCell className="flex items-center justify-center">
                                <BusinessIdentityCell business={business} />
                            </TableCell>
                            <TableCell colSpan={METRIC_COLUMN_COUNT}>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="font-medium text-destructive">
                                        Failed
                                    </span>
                                    <Button
                                        onClick={() => onRetry(index)}
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

                    {rows.map((row, i) => {
                        const isFirstOfGroup =
                            i === 0 ||
                            rows[i - 1].property_type !== row.property_type;

                        return (
                            <TableRow
                                key={`${row.property_type}-${row.business.label}`}
                            >
                                {isFirstOfGroup && (
                                    <TableCell
                                        rowSpan={
                                            propertyTypesRowCounts[
                                                row.property_type
                                            ]
                                        }
                                        data-property-type
                                        className="max-w-[200px] border-r text-center text-2xl"
                                    >
                                        {row.property_type}
                                    </TableCell>
                                )}
                                <TableCell className="ps-4">
                                    <BusinessIdentityCell
                                        business={row.business}
                                    />
                                </TableCell>
                                <TableCell>{formatNumber(row.new)}</TableCell>
                                <TableCell>
                                    {formatNumber(row.current)}
                                </TableCell>
                                <TableCell>
                                    {formatNumber(row.highest)}
                                </TableCell>
                                <TableCell>
                                    <ComparisonDiffBadge
                                        value={row.current - row.highest}
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}

                    {isEmpty && (
                        <TableRow>
                            <TableCell
                                colSpan={METRIC_COLUMN_COUNT + 2}
                                className="py-8 text-center text-muted-foreground"
                            >
                                No property types found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
