import { useMemo } from "react";
import Select from "react-select";
import BusinessAvatar from "@/components/custom/BusinessAvatar";
import { CardTitle } from "@/components/ui/card";
import { businesses } from "@/data/businesses";
import type { AgentsSelectOption, AgentsFilterProps } from './types';

function AgentOptionLabel({ option }: { option: AgentsSelectOption }) {
    return <span className="capitalize">{option.label}</span>;
}

function AgentMenuOptionLabel({ option }: { option: AgentsSelectOption }) {
    return (
        <div className="flex w-full items-center justify-between gap-2">
            <span className="truncate capitalize">{option.label}</span>
            {option.businessCount > 1 && (
                <span>{option.businessCount}</span>
            )}
        </div>
    );
}

export default function AgentsFilter({
    groupedOptions,
    value,
    onChange,
}: AgentsFilterProps) {
    const businessesByLabel = useMemo(
        () => new Map(businesses.map((business) => [business.label, business])),
        [],
    );

    return (
        <Select<AgentsSelectOption, true>
            className="h-full"
            isMulti
            isSearchable
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            options={groupedOptions}
            value={value}
            onChange={onChange}
            placeholder="Filter agents..."
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
                group: (base) => ({
                    ...base,
                    paddingTop: 0,
                    marginTop: -10,
                }),
                groupHeading: (base, state) => {
                    return {
                        ...base,
                        backgroundColor:
                            state.data.options[0]?.businessPrimaryColor ??
                            "#222222",
                        color: "#ffffff",
                        fontSize: "20px",
                        fontWeight: 700,
                        padding: "8px 10px",
                        marginBottom: "4px",
                        textTransform: "none",
                        position: "sticky",
                        top: "-10px",
                        zIndex: 100,
                    };
                },
                option: (base, state) => ({
                    ...base,
                    maxWidth: "95%",
                    marginInline: "auto",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "4px",
                    backgroundColor: state.isSelected
                        ? state.data.businessPrimaryColor
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
                    backgroundColor: state.data.businessPrimaryColor,
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
            }}
            formatOptionLabel={(option, { context }) =>
                context === "menu" ? (
                    <AgentMenuOptionLabel option={option} />
                ) : (
                    <AgentOptionLabel option={option} />
                )
            }
            formatGroupLabel={(group) => {
                const groupName = group.label ?? "";
                const business = businessesByLabel.get(groupName);

                return (
                    <div className="flex items-center gap-2 py-2">
                        <BusinessAvatar
                            color={business?.primary_color ?? "#222222"}
                            logo={business?.logo ?? ""}
                            initials={
                                business?.initials ??
                                groupName.slice(0, 3).toUpperCase()
                            }
                        />
                        <CardTitle className="text-white">{groupName}</CardTitle>
                    </div>
                );
            }}
        />
    );
}
