export type ExternalSubOfficeStats = {
    period: 'today' | 'yesterday' | 'month' | 'highest_month';
    income: number;
    reservations?: number;
    new?: number;
    followup?: number;
    arrived?: number;
    new_arrived?: number;
    followup_arrived?: number;
    percentage?: number;
};

export type ExternalSubOffice = {
    name: string;
    stats: ExternalSubOfficeStats[];
};

export type ExternalSubOffices = ExternalSubOffice[];
