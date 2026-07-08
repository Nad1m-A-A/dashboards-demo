import { filterFieldClassName } from "@/components/custom/Filters/reactSelectStyles";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type MinMaxValue = {
    min: string;
    max: string;
};

type MinMaxFilterProps = {
    label: string;
    value: MinMaxValue;
    onChange: (value: MinMaxValue) => void;
};

export default function MinMaxFilter({ label, value, onChange }: MinMaxFilterProps) {
    return (
        <div className="flex h-full flex-col gap-1">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            <div className="grid flex-1 grid-cols-2 gap-1">
                <Input
                    type="number"
                    placeholder="Min"
                    value={value.min}
                    onChange={(event) =>
                        onChange({ ...value, min: event.target.value })
                    }
                    className={filterFieldClassName}
                />
                <Input
                    type="number"
                    placeholder="Max"
                    value={value.max}
                    onChange={(event) =>
                        onChange({ ...value, max: event.target.value })
                    }
                    className={filterFieldClassName}
                />
            </div>
        </div>
    );
}
