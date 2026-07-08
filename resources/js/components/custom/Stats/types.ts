import type { BusinessInfo } from "@/data/businesses";
import type { ExternalStats } from "@/types/external-api/stats";

export type StatsTableProps = {
    isBusiness?: boolean;
    business: BusinessInfo;
    data: ExternalStats;
    isPending: boolean;
    isError: boolean;
    refetch: () => void;
};
