import { Head } from '@inertiajs/react';
import { activityLog } from '@/routes';
import ActivityTable from '@/components/custom/Activity/ActivityTable';
import type { Activity } from '@/components/custom/Activity/types';

export default function ActivityLog({ activities }: { activities: Activity[] }) {
    return (
        <>
            <Head title="Activity Log" />
            <div className="flex flex-col gap-4 p-4">
                <ActivityTable activities={activities} />
            </div>
        </>
    );
}

ActivityLog.layout = {
    breadcrumbs: [
        {
            title: 'Activity Log',
            href: activityLog(),
        },
    ],
};
