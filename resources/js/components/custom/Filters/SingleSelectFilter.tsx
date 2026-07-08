import { useMemo } from "react";
import Select from "react-select";
import type { SingleValue } from "react-select";
import { createReactSelectStyles } from "@/components/custom/Filters/reactSelectStyles";
import type { FilterSelectOption } from "@/components/custom/Filters/reactSelectStyles";

type SingleSelectFilterProps = {
    options: readonly FilterSelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

export default function SingleSelectFilter({
    options,
    value,
    onChange,
    placeholder = "Select...",
}: SingleSelectFilterProps) {
    const selectValue = useMemo(
        () => options.find((option) => option.value === value) ?? null,
        [options, value],
    );

    const handleChange = (selected: SingleValue<FilterSelectOption>) => {
        onChange(selected?.value ?? options[0]?.value ?? "");
    };

    return (
        <Select<FilterSelectOption, false>
            className="h-full"
            isSearchable={false}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            options={[...options]}
            value={selectValue}
            onChange={handleChange}
            placeholder={placeholder}
            styles={createReactSelectStyles<FilterSelectOption, false>()}
        />
    );
}
