import type { FilterSelectOption } from '@/components/custom/Filters/reactSelectStyles';
import type { BusinessInfo } from '@/data/businesses';
import type { ExternalDeal } from '@/types/external-api/deals';

export type PresenceFilter = 'all' | 'set' | 'missing';

export type InspectionSort = 'default' | 'asc' | 'desc';

export type DealsFilters = {
    agencies: string[];
    offices: string[];
    agents: string[];
    phone: PresenceFilter;
    search: string;
    paid: { min: string; max: string };
    price: { min: string; max: string };
    due: { min: string; max: string };
    date: { from: string; to: string };
};

export const defaultDealsFilters: DealsFilters = {
    agencies: [],
    offices: [],
    agents: [],
    phone: 'all',
    search: '',
    paid: { min: '', max: '' },
    price: { min: '', max: '' },
    due: { min: '', max: '' },
    date: { from: '', to: '' },
};

export type DealRow = {
    key: string;
    business: BusinessInfo;
    originalDate: string;
    deal: ExternalDeal & {
        date: string;
    };
};

export type AgencySelectOption = FilterSelectOption & {
    primaryColor: string;
    logo: string;
    initials: string;
};

export function createPresenceFilterOptions(
    field: string,
): FilterSelectOption[] {
    return [
        { value: 'all', label: `All ${field}` },
        { value: 'set', label: `Set ${field}` },
        { value: 'missing', label: `Missing ${field}` },
    ];
}
