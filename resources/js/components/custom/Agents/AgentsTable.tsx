import { RefreshCcwIcon } from "lucide-react";
import { useMemo, useState } from "react";
import type { GroupBase } from "react-select";
import BusinessIdentityCell from "@/components/custom/BusinessIdentityCell";
import ComparisonDiffBadge from "@/components/custom/ComparisonDiffBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getAccessibleBusinessesWithFeature } from "@/data/businesses";
import { usePermissions } from "@/hooks/use-permissions";
import { formatNumber } from "@/lib/format-number";
import {
    dashboardTableFrameClasses,
    dashboardTableScrollClasses,
    dashboardTableScrollContentClasses,
} from "@/lib/layout-classes";
import { cn } from "@/lib/utils";
import AgentsFilter from './AgentsFilter';
import BusinessesFilter from './BusinessesFilter';
import { matchesAgentsTableFilters } from './matchesAgentsTableFilters';
import PropertyTypesFilter from './PropertyTypesFilter';
import type {
    BusinessSelectOption,
    AgentsSelectOption,
    AgentsTableProps,
} from './types';

const METRIC_COLUMN_COUNT = 5;

export default function AgentsTable({
    rows,
    pending,
    errored,
    isEmpty,
    onRetry,
}: AgentsTableProps) {
    const [selectedAgents, setSelectedAgents] = useState<AgentsSelectOption[]>([]);
    const [selectedBusinesses, setSelectedBusinesses] = useState<
        BusinessSelectOption[]
    >([]);
    const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);

    const { permissions } = usePermissions();
    const featuredBusinesses = useMemo(
        () => getAccessibleBusinessesWithFeature('agents', permissions),
        [permissions],
    );
    const agentBusinessCounts = rows.reduce<Record<string, number>>(
        (acc, row) => {
            acc[row.agent] = (acc[row.agent] ?? 0) + 1;

            return acc;
        },
        {},
    );
    const agentsPerBusiness = featuredBusinesses.map((business) => {
        if (selectedBusinesses.length > 0 && !selectedBusinesses.some(selectedBusiness => selectedBusiness.label === business.label)) {
            return undefined;
        }

        const correspondingRows = rows.filter(
            (row) => row.business.name === business.name,
        );
        const agents = correspondingRows.map((row) => row.agent);

        return {
            business,
            agents,
        };
    }).filter(item => item !== undefined);

    const groupedAgentsOptions: GroupBase<AgentsSelectOption>[] =
        agentsPerBusiness.map((group) => ({
            label: group.business.label,
            options: group.agents.map((agent) => ({
                value: agent,
                label: agent,
                businessPrimaryColor: group.business.primary_color,
                businessCount: agentBusinessCounts[agent] ?? 1,
            })),
        }));

    const businessOptions: BusinessSelectOption[] = featuredBusinesses.map(
        (business) => ({
            label: business.label,
            value: business.name,
            primaryColor: business.primary_color,
            logo: business.logo,
            initials: business.initials,
            agentCount: rows.filter(
                (row) => row.business.name === business.name,
            ).length,
        }),
    );

    const handleAgentsFilterChange = (value: readonly AgentsSelectOption[]) => {
        setSelectedAgents([...value]);
    };

    const agentsFilterProps = {
        groupedOptions: groupedAgentsOptions,
        value: selectedAgents,
        onChange: handleAgentsFilterChange,
    };
    const handleBusinessesFilterChange = (value: readonly BusinessSelectOption[]) => {
        setSelectedAgents([]);
        setSelectedBusinesses([...value]);
    };
    const businessesFilterProps = {
        options: businessOptions,
        value: selectedBusinesses,
        onChange: handleBusinessesFilterChange,
    };

    const handlePropertyTypesFilterChange = (value: readonly string[]) => {
        setSelectedPropertyTypes([...value]);
    };

    const rowsForPropertyTypeOptions = rows.filter((row) => {
        if (
            selectedBusinesses.length > 0 &&
            !selectedBusinesses.some(
                (business) => business.value === row.business.name,
            )
        ) {
            return false;
        }

        if (
            selectedAgents.length > 0 &&
            !selectedAgents.some((agent) => agent.value === row.agent)
        ) {
            return false;
        }

        return true;
    });
    const propertyTypeOptions = [
        ...new Set(rowsForPropertyTypeOptions.flatMap((row) => row.property_types)),
    ];
    const effectiveSelectedPropertyTypes = selectedPropertyTypes.filter(
        (propertyType) => propertyTypeOptions.includes(propertyType),
    );
    const propertyTypesFilterProps = {
        options: propertyTypeOptions,
        value: effectiveSelectedPropertyTypes,
        onChange: handlePropertyTypesFilterChange,
    };

    const tableFilters = {
        selectedAgents,
        selectedBusinesses,
        selectedPropertyTypes: effectiveSelectedPropertyTypes,
    };
    const visibleRows = rows.filter((row) =>
        matchesAgentsTableFilters(row, tableFilters),
    );
    const agentsRowCounts = visibleRows.reduce<Record<string, number>>(
        (acc, row) => {
            acc[row.agent] = (acc[row.agent] ?? 0) + 1;

            return acc;
        },
        {},
    );

    return (
        <div>
            <div className={cn(dashboardTableScrollClasses, "space-y-4")}>
                <div className="grid grid-cols-3 gap-2 animate-in fade-in duration-700 p-1 min-w-[800px]">
                    <BusinessesFilter {...businessesFilterProps} />
                    <AgentsFilter {...agentsFilterProps} />
                    <PropertyTypesFilter {...propertyTypesFilterProps} />
                </div>
                <div className={dashboardTableScrollContentClasses}>
                    <div className={dashboardTableFrameClasses}>
                        <Table>
                            <TableHeader className="bg-[#222222]">
                                <TableRow>
                                    <TableHead className="w-[220px] text-center text-white">
                                        Agent
                                    </TableHead>
                                    <TableHead className="w-[200px] text-white">
                                        Agency
                                    </TableHead>
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
                                        <TableCell className="space-y-1">
                                            <Skeleton className="h-7.5" />
                                            <Skeleton className="h-7.5" />
                                            <Skeleton className="h-7.5" />
                                        </TableCell>
                                        <TableCell
                                            className="space-y-1"
                                            colSpan={METRIC_COLUMN_COUNT}
                                        >
                                            <Skeleton className="h-7.5" />
                                            <Skeleton className="h-7.5" />
                                            <Skeleton className="h-7.5" />
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

                                {visibleRows.map((row, i) => {
                                    const isFirstOfGroup =
                                        i === 0 ||
                                        visibleRows[i - 1].agent !== row.agent;

                                    return (
                                        <TableRow
                                            key={`${row.agent}-${row.business.label}`}
                                        >
                                            {isFirstOfGroup && (
                                                <TableCell
                                                    rowSpan={
                                                        agentsRowCounts[row.agent]
                                                    }
                                                    data-agent
                                                    className="max-w-[200px] border-r text-center text-xl capitalize whitespace-normal"
                                                >
                                                    {row.agent}
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <BusinessIdentityCell
                                                    business={row.business}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {formatNumber(row.current.income)}
                                            </TableCell>
                                            <TableCell>
                                                {formatNumber(row.highest.income)}
                                            </TableCell>
                                            <TableCell>
                                                <ComparisonDiffBadge
                                                    value={
                                                        row.current.income -
                                                        row.highest.income
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                                {isEmpty && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={METRIC_COLUMN_COUNT + 2}
                                            className="text-muted-foreground py-8 text-center"
                                        >
                                            No agents found.
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
