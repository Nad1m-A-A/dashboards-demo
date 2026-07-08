import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import BusinessAvatar from '@/components/custom/BusinessAvatar';
import CardsCarousel from '@/components/custom/CardsCarousel';
import CardsCollapsible from '@/components/custom/CardsCollapsible';
import QueryErrorRetry from '@/components/custom/QueryErrorRetry';
import type { MetricRowProps, TargetCardProps } from '@/components/custom/Target/types';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getAccessibleBusinessesWithFeature } from '@/data/businesses';
import { usePermissions } from '@/hooks/use-permissions';
import { formatCompactNumber } from '@/lib/format-compact-number';
import type { ExternalTarget } from '@/types/external-api/target';
import TargetChart from './TargetChart';
import { Badge } from '@/components/ui/badge';

function MetricRow({
    label,
    value,
    businessPrimaryColor,
    percentage,
}: MetricRowProps) {
    return (
        <div className="flex items-center justify-between text-sm w-full">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-muted-foreground">{Math.abs((percentage)).toFixed(0)}%</span>
            <Badge className="tabular-nums font-bold text-white px-2 rounded-full" style={{ backgroundColor: businessPrimaryColor }}>
                {formatCompactNumber(Math.abs(value))}
            </Badge>
        </div>
    );
}

function TargetCard({ business }: TargetCardProps) {
    const { data = { done_m: 0, waiting_m: 0 }, isError, refetch, isPending } = useQuery({
        queryKey: ['target', business.name],
        queryFn: async (): Promise<ExternalTarget> => {
            const res = await fetch(`/api/external/${business.name}/target`);

            if (!res.ok) {
                throw new Error('Failed to load target metrics');
            }

            return res.json();
        },
    });

    return (
        <Card className="gap-2 h-full">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <BusinessAvatar logo={business.logo} initials={business.initials} />
                <CardTitle className="line-clamp-2 text-base leading-snug">
                    {business.label}
                </CardTitle>
            </CardHeader>
            {isPending ? (
                <div className="p-4 w-full">
                    <Skeleton className="w-full aspect-square max-h-[148px]" aria-hidden />
                </div>
            ) :
                !isError && (
                    <TargetChart
                        target={Math.abs(data.done_m)}
                        remaining={Math.abs(data.waiting_m)}
                        business={business}
                    />
                )
            }

            <CardContent className="space-y-4">
                <Separator />
                <>
                    {isError ? (
                        <QueryErrorRetry
                            showRetryLabel
                            onRetry={() => refetch()}
                            className="justify-between"
                        />
                    ) :
                        isPending ? (
                            <div className="flex flex-col items-center justify-between gap-4 text-sm">
                                <div className="flex w-full items-center justify-between gap-4 text-sm">
                                    <span className="text-muted-foreground">Remaining</span>
                                    <Skeleton className="h-5 w-14" aria-hidden />
                                </div>
                                <div className="flex w-full items-center justify-between gap-4 text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <Skeleton className="h-5 w-14" aria-hidden />
                                </div>
                            </div>
                        ) :
                            <div className="flex flex-col items-center justify-between gap-4 text-sm">
                                <MetricRow
                                    label="Progress"
                                    value={data.done_m - (Math.abs(data.waiting_m))}
                                    percentage={((data.done_m - Math.abs(data.waiting_m)) / data.done_m) * 100}
                                    businessPrimaryColor={business.primary_color}
                                />
                                <MetricRow
                                    label="Remaining"
                                    value={data.waiting_m}
                                    percentage={(data.waiting_m / data.done_m) * 100}
                                    businessPrimaryColor={business.primary_color}
                                />
                            </div>
                    }
                </>
            </CardContent>
        </Card>
    );
}

function TargetsCards() {
    const { permissions } = usePermissions();
    const featuredBusinesses = useMemo(
        () => getAccessibleBusinessesWithFeature('targets', permissions),
        [permissions],
    );

    const title = 'Targets';

    const cards = featuredBusinesses.map((business) => (
        <TargetCard key={business.name} business={business} />
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

export default TargetsCards;
