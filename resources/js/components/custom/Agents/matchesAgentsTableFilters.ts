import type {
    AgentRow,
    BusinessSelectOption,
    AgentsSelectOption,
} from './types';

export type AgentsTableFilters = {
    selectedAgents: AgentsSelectOption[];
    selectedBusinesses: BusinessSelectOption[];
    selectedPropertyTypes: string[];
};

export function matchesAgentsTableFilters(
    row: AgentRow,
    {
        selectedAgents,
        selectedBusinesses,
        selectedPropertyTypes,
    }: AgentsTableFilters,
): boolean {
    if (
        (selectedAgents.length > 0 &&
            !selectedAgents.some((agent) => agent.value === row.agent)) ||
        (selectedBusinesses.length > 0 &&
            !selectedBusinesses.some(
                (business) => business.value === row.business.name,
            )) ||
        (selectedPropertyTypes.length > 0 &&
            !row.property_types.some((propertyType) =>
                selectedPropertyTypes.includes(propertyType),
            ))
    ) {
        return false;
    }

    return true;
}
