import { ChevronDown } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

type CardsCollapsibleProps = {
    children: ReactNode;
    className?: string;
    defaultOpen?: boolean;
    title: ReactNode;
};

function CollapsibleTitle({
    open,
    title,
}: {
    open: boolean;
    title: ReactNode;
}) {
    return (
        <span className="inline-flex items-center gap-1.5">
            {typeof title === 'string' ? (
                <h1 className="text-2xl font-medium">{title}</h1>
            ) : (
                title
            )}
            <ChevronDown
                aria-hidden
                className={cn(
                    'size-5 shrink-0 text-muted-foreground transition-transform duration-300 ease-in-out',
                    open && 'rotate-180',
                )}
            />
        </span>
    );
}

export default function CardsCollapsible({
    children,
    className,
    defaultOpen = true,
    title,
}: CardsCollapsibleProps) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <Collapsible
            open={open}
            onOpenChange={setOpen}
            className={cn('group/collapsible space-y-4', className)}
        >
            <CollapsibleTrigger asChild>
                <button
                    type="button"
                    className="flex w-full cursor-pointer flex-wrap items-center gap-x-3 gap-y-1 text-left"
                >
                    <CollapsibleTitle open={open} title={title} />
                    <Badge
                        variant="secondary"
                        className="border-transparent bg-muted/60 px-2 py-0.5 text-xs font-normal text-muted-foreground"
                    >
                        {open ? '− Show less' : '+ Click to expand'}
                    </Badge>
                </button>
            </CollapsibleTrigger>

            <CollapsibleContent className="cards-collapsible-content">
                <div className="space-y-4 pt-1">{children}</div>
            </CollapsibleContent>
        </Collapsible>
    );
}
