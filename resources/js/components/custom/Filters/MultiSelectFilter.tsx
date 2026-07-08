import { useMemo } from "react";
import Select from "react-select";
import type { FormatOptionLabelMeta, GroupBase, MultiValue, StylesConfig } from "react-select";
import {
    createReactSelectStyles
    
} from "@/components/custom/Filters/reactSelectStyles";
import type {FilterSelectOption} from "@/components/custom/Filters/reactSelectStyles";

export type { FilterSelectOption };

type MultiSelectFilterProps<
    Option extends FilterSelectOption = FilterSelectOption,
    Group extends GroupBase<Option> = GroupBase<Option>,
> = {
    options: readonly Option[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    formatOptionLabel?: (
        option: Option,
        meta: FormatOptionLabelMeta<Option>,
    ) => React.ReactNode;
    styles?: StylesConfig<Option, true, Group>;
};

export default function MultiSelectFilter<
    Option extends FilterSelectOption = FilterSelectOption,
    Group extends GroupBase<Option> = GroupBase<Option>,
>({
    options,
    value,
    onChange,
    placeholder = "Filter...",
    formatOptionLabel,
    styles = createReactSelectStyles<Option, true, Group>(),
}: MultiSelectFilterProps<Option, Group>) {
    const selectValue = useMemo(
        () =>
            value
                .map((selected) => options.find((option) => option.value === selected))
                .filter((option): option is Option => option != null),
        [options, value],
    );

    const handleChange = (selected: MultiValue<Option>) => {
        onChange(selected.map((option) => option.value));
    };

    return (
        <Select<Option, true, Group>
            className="h-full"
            isMulti
            isSearchable
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            options={[...options]}
            value={selectValue}
            onChange={handleChange}
            placeholder={placeholder}
            styles={styles}
            formatOptionLabel={formatOptionLabel}
        />
    );
}
