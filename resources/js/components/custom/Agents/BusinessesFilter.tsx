import Select from "react-select";
import BusinessAvatar from "@/components/custom/BusinessAvatar";
import type { BusinessSelectOption, BusinessesFilterProps } from "./types";

function BusinessOptionLabel({ option }: { option: BusinessSelectOption }) {
    return (
        <div className="flex items-center gap-2">
            <BusinessAvatar
                color={option.primaryColor}
                logo={option.logo}
                initials={option.initials}
            />
            <span>{option.label}</span>
        </div>
    );
}

function BusinessMenuOptionLabel({ option }: { option: BusinessSelectOption }) {
    return (
        <div className="flex w-full items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
                <BusinessAvatar
                    color={option.primaryColor}
                    logo={option.logo}
                    initials={option.initials}
                />
                <span className="truncate">{option.label}</span>
            </div>
            <span>{option.agentCount}</span>
        </div>
    );
}

export default function BusinessesFilter({
    options,
    value,
    onChange,
}: BusinessesFilterProps) {
    return (
        <Select<BusinessSelectOption, true>
            className="h-full"
            isMulti
            isSearchable
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            options={options}
            value={value}
            onChange={onChange}
            placeholder="Filter agencies..."
            styles={{
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
                    color: "#f8fafc",
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
                        ? state.data.primaryColor
                        : state.isFocused
                            ? "#222222"
                            : "transparent",
                    color: state.isSelected
                        ? "white"
                        : state.isFocused
                            ? "white"
                            : "var(--foreground)",
                    transition: "color 0.1s ease-in-out",
                    cursor: "pointer",
                }),
                multiValue: (base, state) => ({
                    ...base,
                    backgroundColor: state.data.primaryColor,
                    borderRadius: "9999px",
                    paddingInline: "4px",
                    overflow: "hidden",
                    cursor: "pointer",
                }),
                multiValueLabel: (base) => ({
                    ...base,
                    color: "#ffffff",
                    paddingBlock: "0px",
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
            }}
            formatOptionLabel={(option, { context }) =>
                context === "menu" ? (
                    <BusinessMenuOptionLabel option={option} />
                ) : (
                    <BusinessOptionLabel option={option} />
                )
            }
        />
    );
}
