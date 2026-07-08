import { RefreshCcwIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type QueryErrorRetryProps = {
    onRetry: () => void;
    message?: string;
    showRetryLabel?: boolean;
    className?: string;
};

function QueryErrorRetry({
    onRetry,
    message = 'Failed',
    showRetryLabel = false,
    className,
}: QueryErrorRetryProps) {
    return (
        <div className={cn('flex items-center gap-4 text-sm', className)}>
            <span className="font-medium text-destructive">{message}</span>
            <Button onClick={onRetry} variant="secondary" size="sm">
                <RefreshCcwIcon className="size-3" />
                {showRetryLabel && 'Retry'}
            </Button>
        </div>
    );
}

export default QueryErrorRetry;
