import type { PresenceFilter, DealsFilters, DealRow } from './types';

function matchesPresence(
    value: string | null | undefined,
    filter: PresenceFilter,
): boolean {
    if (filter === 'all') {
        return true;
    }

    const isSet = value != null && value !== '';

    return filter === 'set' ? isSet : !isSet;
}

function matchesNumericRange(
    value: number,
    range: { min: string; max: string },
): boolean {
    if (range.min !== '' && value < Number(range.min)) {
        return false;
    }

    if (range.max !== '' && value > Number(range.max)) {
        return false;
    }

    return true;
}

export function matchesDealsFilters(
    row: DealRow,
    filters: DealsFilters,
): boolean {
    if (
        filters.agencies.length > 0 &&
        !filters.agencies.includes(row.business.name)
    ) {
        return false;
    }

    if (
        filters.offices.length > 0 &&
        !filters.offices.includes(row.deal.office)
    ) {
        return false;
    }

    if (
        filters.agents.length > 0 &&
        !row.deal.agents.some((agent) => filters.agents.includes(agent))
    ) {
        return false;
    }

    if (!matchesPresence(row.deal.phone, filters.phone)) {
        return false;
    }

    if (filters.search.trim() !== '') {
        const query = filters.search.trim().toLowerCase();
        const searchable = [
            row.deal.client,
            row.deal.listing_id,
            row.deal.phone,
            ...row.deal.agents,
            row.deal.office,
            row.deal.property_type,
            ...row.deal.services,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        if (!searchable.includes(query)) {
            return false;
        }
    }

    if (!matchesNumericRange(row.deal.paid, filters.paid)) {
        return false;
    }

    if (!matchesNumericRange(row.deal.price, filters.price)) {
        return false;
    }

    if (!matchesNumericRange(row.deal.due, filters.due)) {
        return false;
    }

    const rowDate = row.originalDate.slice(0, 10);

    if (filters.date.from !== '' && rowDate < filters.date.from) {
        return false;
    }

    if (filters.date.to !== '' && rowDate > filters.date.to) {
        return false;
    }

    return true;
}
