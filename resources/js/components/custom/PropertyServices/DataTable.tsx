import type {
    ColumnDef,
    SortingState} from "@tanstack/react-table";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { useState } from "react"

import QueryErrorRetry from "@/components/custom/QueryErrorRetry"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
    loading?: boolean
    error?: boolean
    refetch?: () => void
    data: TData[]
    businessColor?: string
    columns: ColumnDef<TData, TValue>[]
}

export function DataTable<TData, TValue>({
    loading = false,
    error = false,
    refetch = () => { },
    columns,
    data,
    businessColor = "#222222",
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = useState<SortingState>([])
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    })

    return (
        <div className="overflow-hidden rounded-md border w-full">
            <Table className="min-h-[189px] min-w-[800px]">
                <TableHeader style={{ backgroundColor: businessColor }}>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                const sorted = header.column.getIsSorted()
                                const canSort = header.column.getCanSort()

                                return (
                                    <TableHead className="text-white" key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <button
                                                onClick={header.column.getToggleSortingHandler()}
                                                className={`flex items-center gap-1.5 ${canSort ? "cursor-pointer select-none" : "cursor-default"}`}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {canSort && (
                                                    sorted === "asc" ? <ArrowUp className="size-3.5 shrink-0" />
                                                        : sorted === "desc" ? <ArrowDown className="size-3.5 shrink-0" />
                                                            : <ArrowUpDown className="size-3.5 shrink-0 opacity-40" />
                                                )}
                                            </button>
                                        )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="bg-card">
                    {!loading && Boolean(table.getRowModel().rows?.length) && table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id} className="capitalize">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {loading &&
                        <TableRow>
                            <TableCell colSpan={columns.length} className="space-y-1 text-center">
                                {
                                    Array.from({ length: 16 }).map((_, index) => (
                                        <Skeleton key={index} className="h-8 w-full" />
                                    ))
                                }
                            </TableCell>
                        </TableRow>
                    }
                    {error &&
                        <TableRow>
                            <TableCell colSpan={columns.length}>
                                <div className="h-full flex items-center justify-center">
                                    <QueryErrorRetry showRetryLabel onRetry={() => refetch()} />
                                </div>
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        </div>
    )
}
