import { formatNumber } from "@/lib/format-number";
import { cn } from "@/lib/utils";

export type ComparisonDiffBadgeProps = {
    value: number;
    className?: string;
};

function ComparisonDiffBadge({ value, className }: ComparisonDiffBadgeProps) {
    const isPositive = value > 0;
    const isNeutral = value === 0;

    return (
        <div
            className={cn(
                "w-fit rounded-full px-2 font-bold text-white animate-in fade-in duration-700",
                isNeutral
                    ? "text-foreground"
                    : isPositive
                        ? "bg-success"
                        : "bg-destructive",
                className,
            )}
        >
            {formatNumber(Math.abs(value))}
        </div>
    );
}

export default ComparisonDiffBadge;
