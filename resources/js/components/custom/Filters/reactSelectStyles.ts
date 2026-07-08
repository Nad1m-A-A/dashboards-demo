import type { GroupBase, StylesConfig } from "react-select";

export type FilterSelectOption = {
    value: string;
    label: string;
};

/** Matches react-select control styling used by filter dropdowns. */
export const filterFieldClassName =
    "border-2 border-border bg-card rounded-[10px] shadow-xs";

export function createReactSelectStyles<
    Option extends FilterSelectOption = FilterSelectOption,
    IsMulti extends boolean = true,
    Group extends GroupBase<Option> = GroupBase<Option>,
>(): StylesConfig<Option, IsMulti, Group> {
    return {
        container: (base) => ({
            ...base,
            height: "100%",
        }),
        control: (base, state) => ({
            ...base,
            height: "100%",
            minHeight: "100%",
            alignItems: "flex-start",
            backgroundColor: "var(--card)",
            border: "2px solid var(--border)",
            borderColor: state.isFocused ? "" : "var(--border)",
            borderRadius: "10px",
        }),
        dropdownIndicator(base) {
            return {
                ...base,
                color: "var(--foreground)",
            };
        },
        indicatorSeparator(base) {
            return {
                ...base,
                display: "none",
            };
        },
        clearIndicator(base) {
            return {
                ...base,
                color: "red",
                cursor: "pointer",
                ":hover": {
                    color: "red",
                },
            };
        },
        valueContainer: (base) => ({
            ...base,
            maxHeight: "70px",
            scrollbarWidth: "none",
            overflowY: "scroll",
            paddingBlock: "6px",
            marginBlock: "auto",
        }),
        input: (base) => ({
            ...base,
            color: "var(--foreground)",
        }),
        singleValue: (base) => ({
            ...base,
            color: "var(--foreground)",
        }),
        placeholder: (base) => ({
            ...base,
            color: "var(--muted-foreground)",
        }),
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: "var(--background)",
            border: "1px solid #2a2a2a",
            borderRadius: "10px",
            overflow: "hidden",
        }),
        menuList: (base) => ({
            ...base,
            overflowY: "scroll",
        }),
        option: (base, state) => ({
            ...base,
            maxWidth: "95%",
            marginInline: "auto",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "4px",
            backgroundColor: state.isSelected
                ? "#222222"
                : state.isFocused
                    ? "#222222"
                    : "transparent",
            color: state.isSelected || state.isFocused ? "white" : "var(--foreground)",
            transition: "color 0.1s ease-in-out",
            cursor: "pointer",
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: "#222222",
            borderRadius: "9999px",
            paddingInline: "4px",
            overflow: "hidden",
            cursor: "pointer",
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: "#ffffff",
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: "red",
            borderRadius: "9999px",
            height: "fit-content",
            width: "fit-content",
            margin: "auto",
            padding: "4px",
            ":hover": {
                backgroundColor: "rgba(255,255,255,0.22)",
            },
        }),
    };
}

export const reactSelectStyles = createReactSelectStyles();
