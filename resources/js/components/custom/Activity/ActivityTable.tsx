import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Activity } from './types';

const METHOD_STYLES: Record<string, string> = {
    GET: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    POST: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    PUT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    PATCH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

function ActivityTable({ activities }: { activities: Activity[] }) {
    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border">
            <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden">
                <div className="h-full w-max min-w-full overflow-y-auto **:data-[slot=table-container]:overflow-visible">
                    <Table>
                        <TableHeader className="bg-[#222222]">
                            <TableRow>
                                <TableHead className="min-w-[160px] text-white">Visitor</TableHead>
                                <TableHead className="min-w-[80px] text-white">Method</TableHead>
                                <TableHead className="min-w-[240px] text-white">Route</TableHead>
                                <TableHead className="min-w-[130px] text-white">IP</TableHead>
                                <TableHead className="min-w-[130px] text-white">Device</TableHead>
                                <TableHead className="min-w-[160px] text-white">Browser</TableHead>
                                <TableHead className="min-w-[130px] text-white">OS</TableHead>
                                <TableHead className="min-w-[180px] text-white">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-card">
                            {activities.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-8 px-4 md:text-center text-muted-foreground text-sm">
                                        No activity recorded yet.
                                    </TableCell>
                                </TableRow>
                            )}

                            {activities.map((activity) => (
                                <TableRow key={activity.id}>
                                    <TableCell className="capitalize">{activity.visitor_name || '—'}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={METHOD_STYLES[activity.method.toUpperCase()] ?? ''}
                                        >
                                            {activity.method.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{activity.route}</TableCell>
                                    <TableCell>{activity.ip}</TableCell>
                                    <TableCell className="capitalize">{activity.device || '—'}</TableCell>
                                    <TableCell>{activity.browser || '—'}</TableCell>
                                    <TableCell>{activity.os || '—'}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(activity.created_at).toLocaleString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default ActivityTable;