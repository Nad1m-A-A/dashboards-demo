import type { GroupBase, MultiValue } from 'react-select';
import type { BusinessInfo } from '@/data/businesses';
import type { ExternalAgent } from '@/types/external-api/agents';

export type AgentRow = ExternalAgent & {
    business: BusinessInfo;
};

export type AgentsTableProps = {
    rows: AgentRow[];
    pending: Array<{ business: BusinessInfo; index: number }>;
    errored: Array<{ business: BusinessInfo; index: number }>;
    isEmpty: boolean;
    onRetry: (index: number) => void;
};

export type SelectOption = {
    value: string;
    label: string;
};

export type AgentsSelectOption = SelectOption & {
    businessPrimaryColor: string;
    businessCount: number;
};

export type AgentsFilterProps = {
    groupedOptions: GroupBase<AgentsSelectOption>[];
    value: AgentsSelectOption[];
    onChange: (value: MultiValue<AgentsSelectOption>) => void;
};

export type BusinessSelectOption = SelectOption & {
    primaryColor: string;
    logo: string;
    initials: string;
    agentCount: number;
};

export type BusinessesFilterProps = {
    options: BusinessSelectOption[];
    value: BusinessSelectOption[];
    onChange: (value: MultiValue<BusinessSelectOption>) => void;
};

export type PropertyTypesFilterProps = {
    options: string[];
    value: string[];
    onChange: (value: readonly string[]) => void;
};
