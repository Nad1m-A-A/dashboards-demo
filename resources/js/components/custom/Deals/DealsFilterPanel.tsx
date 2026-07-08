import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    X,
} from 'lucide-react';
import type { StylesConfig } from 'react-select';
import BusinessAvatar from '@/components/custom/BusinessAvatar';
import DateRangeFilter from '@/components/custom/Filters/DateRangeFilter';
import MinMaxFilter from '@/components/custom/Filters/MinMaxFilter';
import MultiSelectFilter from '@/components/custom/Filters/MultiSelectFilter';
import {
    createReactSelectStyles,
    filterFieldClassName,
} from '@/components/custom/Filters/reactSelectStyles';
import type { FilterSelectOption } from '@/components/custom/Filters/reactSelectStyles';
import SingleSelectFilter from '@/components/custom/Filters/SingleSelectFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { createPresenceFilterOptions, defaultDealsFilters } from './types';
import type {
    AgencySelectOption,
    DealsFilters,
    InspectionSort,
} from './types';

const agencySelectStyles: StylesConfig<AgencySelectOption, true> = {
    ...createReactSelectStyles<AgencySelectOption>(),
    option: (base, state) => ({
        ...base,
        maxWidth: '95%',
        marginInline: 'auto',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '4px',
        backgroundColor: state.isSelected
            ? state.data.primaryColor
            : state.isFocused
              ? '#222222'
              : 'transparent',
        color:
            state.isSelected || state.isFocused
                ? 'white'
                : 'var(--foreground)',
        transition: 'color 0.1s ease-in-out',
        cursor: 'pointer',
    }),
    multiValue: (base, state) => ({
        ...base,
        backgroundColor: state.data.primaryColor,
        borderRadius: '9999px',
        paddingInline: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: '#ffffff',
        paddingBlock: '0px',
    }),
};

function AgencyOptionLabel({ option }: { option: AgencySelectOption }) {
    return (
        <div className="flex items-center gap-2">
            <BusinessAvatar
                color={option.primaryColor}
                logo={option.logo}
                initials={option.initials}
            />
            <span>{option.label}</span>
        </div>
    );
}

type DealsFilterPanelProps = {
    filters: DealsFilters;
    onChange: (filters: DealsFilters) => void;
    inspectionSort: InspectionSort;
    onInspectionSortChange: (sort: InspectionSort) => void;
    agencyOptions: AgencySelectOption[];
    officeOptions: FilterSelectOption[];
    agentOptions: FilterSelectOption[];
};

function nextInspectionSort(current: InspectionSort): InspectionSort {
    if (current === 'default') {
        return 'asc';
    }

    if (current === 'asc') {
        return 'desc';
    }

    return 'default';
}

function InspectionSortIcon({ sort }: { sort: InspectionSort }) {
    if (sort === 'asc') {
        return <ArrowUp className="size-3.5" />;
    }

    if (sort === 'desc') {
        return <ArrowDown className="size-3.5" />;
    }

    return <ArrowUpDown className="size-3.5" />;
}

export default function DealsFilterPanel({
    filters,
    onChange,
    inspectionSort,
    onInspectionSortChange,
    agencyOptions,
    officeOptions,
    agentOptions,
}: DealsFilterPanelProps) {
    const updateFilters = (partial: Partial<DealsFilters>) => {
        onChange({ ...filters, ...partial });
    };

    return (
        <div className="animate-in fade-in space-y-2 p-1 duration-700">
            <div className="grid min-w-[800px] grid-cols-4 gap-2">
                <SingleSelectFilter
                    options={createPresenceFilterOptions('phone')}
                    value={filters.phone}
                    onChange={(phone) =>
                        updateFilters({
                            phone: phone as DealsFilters['phone'],
                        })
                    }
                />
                <MultiSelectFilter<AgencySelectOption>
                    options={agencyOptions}
                    value={filters.agencies}
                    onChange={(agencies) => updateFilters({ agencies })}
                    placeholder="Filter agencies..."
                    styles={agencySelectStyles}
                    formatOptionLabel={(option) => (
                        <AgencyOptionLabel option={option} />
                    )}
                />
                <MultiSelectFilter
                    options={officeOptions}
                    value={filters.offices}
                    onChange={(offices) => updateFilters({ offices })}
                    placeholder="Filter offices..."
                />
                <MultiSelectFilter
                    options={agentOptions}
                    value={filters.agents}
                    onChange={(agents) => updateFilters({ agents })}
                    placeholder="Filter agents..."
                />
            </div>

            <div className="flex min-w-[800px] flex-wrap items-end gap-4">
                <div className="flex min-w-[12rem] flex-1 flex-col gap-1">
                    <Label className="text-xs text-muted-foreground">
                        String filter
                    </Label>
                    <Input
                        placeholder="Search clients, listing ID, phone..."
                        value={filters.search}
                        onChange={(event) =>
                            updateFilters({ search: event.target.value })
                        }
                        className={filterFieldClassName}
                    />
                </div>
                <div className="min-w-[20rem] flex-[1.5]">
                    <DateRangeFilter
                        value={filters.date}
                        onChange={(date) => updateFilters({ date })}
                    />
                </div>
                <div className="flex min-w-[24rem] flex-[2] items-end gap-2">
                    <MinMaxFilter
                        label="Paid min / max"
                        value={filters.paid}
                        onChange={(paid) => updateFilters({ paid })}
                    />
                    <MinMaxFilter
                        label="Price min / max"
                        value={filters.price}
                        onChange={(price) => updateFilters({ price })}
                    />
                    <MinMaxFilter
                        label="Due min / max"
                        value={filters.due}
                        onChange={(due) => updateFilters({ due })}
                    />
                </div>
                <div className="flex shrink-0 items-end gap-1">
                    <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className={cn(
                            'h-8 border-2 border-border bg-card px-2 text-xs shadow-xs hover:bg-accent/50',
                            inspectionSort !== 'default' &&
                                'border-primary/50 bg-muted',
                        )}
                        onClick={() =>
                            onInspectionSortChange(
                                nextInspectionSort(inspectionSort),
                            )
                        }
                    >
                        <InspectionSortIcon sort={inspectionSort} />
                        Inspection
                    </Button>
                    <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="h-8 px-2 text-xs"
                        onClick={() => onChange(defaultDealsFilters)}
                    >
                        <X className="size-3.5" />
                        Clear
                    </Button>
                </div>
            </div>
        </div>
    );
}
