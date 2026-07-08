export type ExternalDeal = {
    client: string;
    phone: string;
    listing_id: string;
    sqft: number;
    office: string;
    property_type: string;
    date: string;
    inspection_time: string | null;
    from: string | null;
    to: string | null;
    paid: number;
    price: number;
    due: number;
    agents: string[];
    services: string[];
};

export type ExternalDeals = ExternalDeal[];
