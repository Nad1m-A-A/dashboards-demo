import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Children,
    useEffect,
    useMemo,
    useState,
    type CSSProperties,
    type ReactNode,
} from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CardsCarouselProps = {
    children: ReactNode;
    className?: string;
    title?: ReactNode;
    visibleCount?: number;
};

export default function CardsCarousel({
    children,
    className,
    title,
    visibleCount = 5,
}: CardsCarouselProps) {
    const items = useMemo(() => Children.toArray(children), [children]);
    const [startIndex, setStartIndex] = useState(0);
    const maxStartIndex = Math.max(0, items.length - visibleCount);
    const showNavigation = items.length > visibleCount;

    useEffect(() => {
        setStartIndex((currentIndex) => Math.min(currentIndex, maxStartIndex));
    }, [maxStartIndex]);

    const carouselStyle = {
        '--visible-count': visibleCount,
        '--gap': '1rem',
        '--slide-size':
            'calc((100% - (var(--visible-count) - 1) * var(--gap)) / var(--visible-count))',
    } as CSSProperties;

    return (
        <div className={cn('space-y-6', className)}>
            {(title || showNavigation) && (
                <div className="flex items-center gap-4">
                    {title ? (
                        typeof title === 'string' ? (
                            <h1 className="text-2xl font-medium">{title}</h1>
                        ) : (
                            title
                        )
                    ) : (
                        <span />
                    )}

                    {showNavigation && (
                        <div className="flex shrink-0 items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label="Show previous cards"
                                disabled={startIndex === 0}
                                onClick={() =>
                                    setStartIndex((currentIndex) =>
                                        Math.max(0, currentIndex - 1),
                                    )
                                }
                            >
                                <ChevronLeft />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                aria-label="Show next cards"
                                disabled={startIndex >= maxStartIndex}
                                onClick={() =>
                                    setStartIndex((currentIndex) =>
                                        Math.min(maxStartIndex, currentIndex + 1),
                                    )
                                }
                            >
                                <ChevronRight />
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <div className="overflow-hidden" style={carouselStyle}>
                <div
                    className="flex gap-4 transition-transform duration-300 ease-in-out"
                    style={{
                        transform: `translateX(calc(-1 * ${startIndex} * (var(--slide-size) + var(--gap))))`,
                    }}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="min-w-0 shrink-0"
                            style={{ flexBasis: 'var(--slide-size)' }}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
