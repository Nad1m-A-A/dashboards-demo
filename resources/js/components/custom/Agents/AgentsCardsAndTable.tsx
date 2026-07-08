import type { UseQueryResult } from '@tanstack/react-query';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import BackgroundFetchingIndicator from '@/components/custom/BackgroundFetchingIndicator';
import { getAccessibleBusinessesWithFeature } from '@/data/businesses';
import { usePermissions } from '@/hooks/use-permissions';
import type { ExternalAgents } from '@/types/external-api/agents';
import AgentsTable from './AgentsTable';
import { orderAgentRows } from './orderAgentRows';
import type { AgentRow } from './types';

function AgentsCardsAndTable() {
    const { permissions } = usePermissions();
    const featuredBusinesses = useMemo(
        () => getAccessibleBusinessesWithFeature('agents', permissions),
        [permissions],
    );
    const results: UseQueryResult<ExternalAgents, Error>[] = useQueries({
        queries: featuredBusinesses.map((business) => ({
            queryKey: ['agents', business.name],
            queryFn: async (): Promise<ExternalAgents> => {
                const res = await fetch(`/api/external/${business.name}/agents`);

                if (!res.ok) {
                    throw new Error('Failed to load agents');
                }

                return res.json();
            },
        })),
    });

    const rows: AgentRow[] = orderAgentRows(
        featuredBusinesses.flatMap((business, index) => {
            const result = results[index];

            if (result.isPending || result.isError || !result.data) {
                return [];
            }

            return result.data.map(
                (agent): AgentRow => ({
                    agent: agent.agent,
                    property_types: agent.property_types,
                    current: agent.current,
                    highest: agent.highest,
                    business,
                }),
            );
        }),
        featuredBusinesses,
    );

    const pending = featuredBusinesses
        .map((business, index) => ({ business, index }))
        .filter(({ index }) => results[index].isPending);
    const errored = featuredBusinesses
        .map((business, index) => ({ business, index }))
        .filter(({ index }) => results[index].isError);
    const isEmpty =
        rows.length === 0 && pending.length === 0 && errored.length === 0;

    return (
        <div className="space-y-4">
            <BackgroundFetchingIndicator results={results} />
            <AgentsTable
                rows={rows}
                pending={pending}
                errored={errored}
                isEmpty={isEmpty}
                onRetry={(index) => results[index].refetch()}
            />
        </div>
    );
}

export default AgentsCardsAndTable;
