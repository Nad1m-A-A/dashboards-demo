import { Head } from '@inertiajs/react';
import { Can } from '@/components/can';
import StatsTables from '@/components/custom/Stats/StatsTables';
import TargetsCards from '@/components/custom/Target/TargetsCards';
import { stats } from '@/routes';

export default function Stats() {
    return (
        <>
            <Head title="Stats" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Can permission="targets.view">
                    <TargetsCards />
                </Can>
                <StatsTables />
            </div>
        </>
    );
}

Stats.layout = {
    breadcrumbs: [
        {
            title: 'Stats',
            href: stats(),
        },
    ],
};
