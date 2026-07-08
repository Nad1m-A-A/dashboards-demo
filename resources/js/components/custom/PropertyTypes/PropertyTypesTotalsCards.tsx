import BusinessAvatar from '@/components/custom/BusinessAvatar';
import CardsCarousel from '@/components/custom/CardsCarousel';
import CardsCollapsible from '@/components/custom/CardsCollapsible';
import ComparisonDiffBadge from '@/components/custom/ComparisonDiffBadge';
import QueryErrorRetry from '@/components/custom/QueryErrorRetry';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import type { BusinessInfo } from '@/data/businesses';
import { formatNumber } from '@/lib/format-number';
import type { PropertyTypesCardsProps, PropertyTypeQueryState } from './types';

type PropertyTypeMetrics = {
    new: number;
    current: number;
    highest: number;
};

function PropertyTypeTotalMetricRow({
    label,
    value,
    isPending,
    businessPrimaryColor,
}: {
    label: string;
    value: number;
    isPending: boolean;
    businessPrimaryColor: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-muted-foreground">{label}</span>
            {isPending ? (
                <Skeleton className="h-5 w-14" aria-hidden />
            ) : label === 'Difference' ? (
                <ComparisonDiffBadge value={value} />
            ) : (
                <Badge
                    className="rounded-full font-bold tabular-nums text-white"
                    style={{ backgroundColor: businessPrimaryColor }}
                >
                    {formatNumber(value)}
                </Badge>
            )}
        </div>
    );
}

function PropertyTypeTotalsMetrics({
    business,
    metrics,
    queryState,
}: {
    business: BusinessInfo;
    metrics: PropertyTypeMetrics;
    queryState: PropertyTypeQueryState;
}) {
    if (queryState.isError) {
        return (
            <div className="flex items-center justify-center py-2">
                <QueryErrorRetry
                    showRetryLabel
                    onRetry={() => queryState.refetch()}
                />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <PropertyTypeTotalMetricRow
                label="New"
                value={metrics.new}
                isPending={queryState.isPending}
                businessPrimaryColor={business.primary_color}
            />
            <PropertyTypeTotalMetricRow
                label="Current"
                value={metrics.current}
                isPending={queryState.isPending}
                businessPrimaryColor={business.primary_color}
            />
            <PropertyTypeTotalMetricRow
                label="Highest"
                value={metrics.highest}
                isPending={queryState.isPending}
                businessPrimaryColor={business.primary_color}
            />
            <PropertyTypeTotalMetricRow
                label="Difference"
                value={metrics.current - metrics.highest}
                isPending={queryState.isPending}
                businessPrimaryColor={business.primary_color}
            />
        </div>
    );
}

function PropertyTypeTotalsCardHeader({ business }: { business: BusinessInfo }) {
    return (
        <div className="flex items-center gap-4">
            <BusinessAvatar
                color={business.primary_color}
                logo={business.logo}
                initials={business.initials}
            />
            <CardTitle className="line-clamp-2 text-base">
                {business.label}
            </CardTitle>
        </div>
    );
}

function PropertyTypeTotalsCard({
    business,
    metrics,
    queryState,
}: {
    business: BusinessInfo;
    metrics: PropertyTypeMetrics;
    queryState: PropertyTypeQueryState;
}) {
    return (
        <Card className="h-full gap-2">
            <CardHeader className="mb-2 flex flex-row items-center gap-4">
                <PropertyTypeTotalsCardHeader business={business} />
            </CardHeader>
            <CardContent className="space-y-4">
                <Separator />
                <PropertyTypeTotalsMetrics
                    business={business}
                    metrics={metrics}
                    queryState={queryState}
                />
            </CardContent>
        </Card>
    );
}

export default function PropertyTypesTotalsCards({
    totals,
    queryStates,
}: PropertyTypesCardsProps) {
    const title = 'Property Types Totals';

    const cards = totals.map(({ business, totals: metrics }, index) => (
        <PropertyTypeTotalsCard
            key={business.name}
            business={business}
            metrics={metrics}
            queryState={queryStates[index]}
        />
    ));

    return (
        <>
            <div className="xl:hidden border-b pb-4">
                <CardsCollapsible title={title}>{cards}</CardsCollapsible>
            </div>

            <div className="hidden xl:block border-b pb-4">
                <CardsCarousel title={title} visibleCount={5}>
                    {cards}
                </CardsCarousel>
            </div>
        </>
    );
}
