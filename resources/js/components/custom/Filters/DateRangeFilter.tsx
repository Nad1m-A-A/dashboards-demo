import { CalendarIcon } from "lucide-react";
import { filterFieldClassName } from "@/components/custom/Filters/reactSelectStyles";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type DateRangeValue = {
    from: string;
    to: string;
};

type DateRangeFilterProps = {
    value: DateRangeValue;
    onChange: (value: DateRangeValue) => void;
};

function openDatePicker(input: HTMLInputElement) {
    if (typeof input.showPicker === "function") {
        try {
            input.showPicker();
        } catch {
            input.focus();
        }

        return;
    }

    input.focus();
}

type DateInputProps = {
    "aria-label": string;
    value: string;
    onChange: (value: string) => void;
};

function DateInput({ "aria-label": ariaLabel, value, onChange }: DateInputProps) {
    return (
        <div className="relative">
            <Input
                type="date"
                aria-label={ariaLabel}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onClick={(event) => openDatePicker(event.currentTarget)}
                className={cn(
                    filterFieldClassName,
                    "min-w-[9.5rem] pr-9",
                    "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0",
                )}
            />
            <button
                type="button"
                tabIndex={-1}
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
            >
                <CalendarIcon className="size-4" />
            </button>
        </div>
    );
}

export default function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
    return (
        <div className="flex h-full flex-col gap-1">
            <Label className="text-xs text-muted-foreground">Date range</Label>
            <div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
                <DateInput
                    aria-label="From date"
                    value={value.from}
                    onChange={(from) => onChange({ ...value, from })}
                />
                <DateInput
                    aria-label="To date"
                    value={value.to}
                    onChange={(to) => onChange({ ...value, to })}
                />
            </div>
        </div>
    );
}
