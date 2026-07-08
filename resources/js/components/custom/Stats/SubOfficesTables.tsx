import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { ChevronsDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type {BusinessInfo} from '@/data/businesses';
import type { ExternalSubOffices } from '@/types/external-api/sub-office';
import StatsTable from './StatsTable';

type SubOfficesTablesProps = {
    business: BusinessInfo;
};

const subOffices: Omit<
    BusinessInfo,
    'primary_color' | 'secondary_color' | 'logo'
>[] = [
    {
        name: 'Section 1',
        label: 'ONE',
        initials: 'S1',
    },
    {
        name: 'Section 2',
        label: 'TWO',
        initials: 'S2',
    },
    {
        name: 'Section 3',
        label: 'THREE',
        initials: 'S3',
    },
];

function SubOfficesTables({ business }: SubOfficesTablesProps) {
    const result: UseQueryResult<ExternalSubOffices, Error> = useQuery({
        queryKey: ['sub-offices', business.name],
        queryFn: async () => {
            const res = await fetch(
                `/api/external/${business.name}/sub-offices`,
            );

            if (!res.ok) {
                throw new Error('Failed to load sub-offices');
            }

            return res.json();
        },
    });

    const businessesWithResultsData = subOffices
        .map((subOffice) => {
            const found = result.data?.find((item) => item.name === subOffice.name);

            return {
                business: subOffice,
                data: found?.stats ?? [],
                todayIncome:
                    found?.stats?.find((stat) => stat.period === 'today')
                        ?.income ?? 0,
                isPending: result.isPending,
                isError: result.isError,
                refetch: result.refetch,
            };
        })
        .filter((subOffice) => subOffice.data.length > 0)
        .sort((a, b) => b.todayIncome - a.todayIncome);

    return (
        <Collapsible className="relative -mt-15">
            <CollapsibleTrigger asChild>
                <Button variant="link" className="relative mt-2 justify-start">
                    <ChevronsDownIcon className="absolute top-[10%] left-[43%] z-50 size-5 rounded-full bg-foreground p-0.5 text-background" />
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4">
                {businessesWithResultsData.map((subOffice) => (
                    <StatsTable
                        isBusiness={false}
                        key={subOffice.business.name}
                        business={{
                            ...subOffice.business,
                            logo: business.logo,
                            primary_color: business.primary_color,
                            secondary_color: business.secondary_color,
                        }}
                        data={subOffice.data}
                        isPending={result.isPending}
                        isError={result.isError}
                        refetch={result.refetch}
                    />
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
}

export default SubOfficesTables;
