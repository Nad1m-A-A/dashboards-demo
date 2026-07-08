import type { BusinessInfo } from '@/data/businesses';
import type { ExternalPropertyType } from '@/types/external-api/property-types';

export type PropertyTypeRow = ExternalPropertyType & {
    business: BusinessInfo;
};

export type PropertyTypeTotals = {
    business: BusinessInfo;
    totals: {
        new: number;
        current: number;
        highest: number;
    };
};

export type PropertyTypeQueryState = {
    isPending: boolean;
    isError: boolean;
    refetch: () => void;
};

export type PropertyTypesCardsProps = {
    totals: PropertyTypeTotals[];
    queryStates: PropertyTypeQueryState[];
};

export type PropertyTypesTableProps = {
    rows: PropertyTypeRow[];
    propertyTypesRowCounts: Record<string, number>;
    pending: Array<{ business: BusinessInfo; index: number }>;
    errored: Array<{ business: BusinessInfo; index: number }>;
    isEmpty: boolean;
    onRetry: (index: number) => void;
};
