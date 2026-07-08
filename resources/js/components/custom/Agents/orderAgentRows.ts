import type { BusinessInfo } from '@/data/businesses';
import type { AgentRow } from './types';

export function orderAgentRows(
    rows: AgentRow[],
    businesses: BusinessInfo[],
): AgentRow[] {
    const rowsByAgent = new Map<string, AgentRow[]>();

    for (const row of rows) {
        const existing = rowsByAgent.get(row.agent) ?? [];
        existing.push(row);
        rowsByAgent.set(row.agent, existing);
    }

    const businessIndex = new Map(
        businesses.map((business, index) => [business.name, index]),
    );

    const primaryBusinessByAgent = new Map<string, string>();

    for (const [agent, agentRows] of rowsByAgent) {
        const primary = agentRows
            .map((row) => row.business.name)
            .sort(
                (a, b) =>
                    (businessIndex.get(a) ?? 0) - (businessIndex.get(b) ?? 0),
            )[0];

        primaryBusinessByAgent.set(agent, primary);
    }

    const agentsByBusinessInApiOrder = new Map<string, string[]>();

    for (const row of rows) {
        const list = agentsByBusinessInApiOrder.get(row.business.name) ?? [];

        if (!list.includes(row.agent)) {
            list.push(row.agent);
        }

        agentsByBusinessInApiOrder.set(row.business.name, list);
    }

    const orderedAgents: string[] = [];
    const added = new Set<string>();

    for (const business of businesses) {
        const agentsInBusiness =
            agentsByBusinessInApiOrder.get(business.name) ?? [];
        const unique = agentsInBusiness.filter(
            (agent) => (rowsByAgent.get(agent)?.length ?? 0) === 1,
        );
        const repeated = agentsInBusiness.filter(
            (agent) => (rowsByAgent.get(agent)?.length ?? 0) > 1,
        );

        for (const agent of [...unique, ...repeated]) {
            if (
                primaryBusinessByAgent.get(agent) === business.name &&
                !added.has(agent)
            ) {
                orderedAgents.push(agent);
                added.add(agent);
            }
        }
    }

    return orderedAgents.flatMap((agent) => {
        const agentRows = rowsByAgent.get(agent) ?? [];

        return [...agentRows].sort(
            (a, b) =>
                (businessIndex.get(a.business.name) ?? 0) -
                (businessIndex.get(b.business.name) ?? 0),
        );
    });
}
