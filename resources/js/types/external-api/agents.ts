export type ExternalAgent = {
    agent: string;
    property_types: string[];
    current: {
        income: number;
        new_leads: number;
        follow_up: number;
    };
    highest: {
        income: number;
        new_leads: number;
        follow_up: number;
    };
};

export type ExternalAgents = ExternalAgent[];
