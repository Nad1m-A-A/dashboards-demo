import type { BusinessInfo } from "@/data/businesses";

export type TargetCardProps = {
    business: BusinessInfo;
};

export type MetricRowProps = {
    label: string;
    value: number;
    percentage: number;
    businessPrimaryColor: string;
};

export type TargetChartProps = {
    target: number;
    remaining: number;
    business: BusinessInfo;
};