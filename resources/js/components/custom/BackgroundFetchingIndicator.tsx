import { Loader } from 'lucide-react';
import type { UseQueryResult } from '@tanstack/react-query';

type BackgroundFetchingIndicatorProps = {
    results: Pick<UseQueryResult, 'isFetching' | 'isPending'>[];
};

function BackgroundFetchingIndicator({ results }: BackgroundFetchingIndicatorProps) {
    const isBackgroundFetching = results.some(
        (result) => result.isFetching && !result.isPending,
    );

    if (!isBackgroundFetching) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 p-2 bg-primary text-secondary rounded-lg z-50">
            <Loader className="animate-spin size-5" />
        </div>
    );
}

export default BackgroundFetchingIndicator;
