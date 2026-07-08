export type ExternalSalesTeamMember = {
    name: string;
    reservations: number;
    done_reservations: number;
    calls: number;
    answered_calls: number;
    income: number;
};

export type ExternalSalesTeam = {
    name: string;
    reservations: number;
    done_reservations: number;
    calls: number;
    answered_calls: number;
    income: number;
    members_count: number;
    members: ExternalSalesTeamMember[];
};

export type ExternalSalesTeams = ExternalSalesTeam[];
