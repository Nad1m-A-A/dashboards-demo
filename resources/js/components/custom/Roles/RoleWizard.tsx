import { useEffect, useId, useState, type ReactNode } from 'react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    VIEW_FEATURE_MAP,
    featuresForBusinesses,
    getBusinessByName,
} from '@/data/businesses';
import { formatPermissionLabel } from '@/lib/format-permission-label';
import { cn } from '@/lib/utils';
import type { Permission } from '@/types/auth';
import type { PermissionGroups } from '@/types/ui';

type RoleWizardProps = {
    permissionGroups: PermissionGroups;
    processing: boolean;
    errors: {
        name?: string;
        permissions?: string;
        'dialog-permissions'?: string;
    };
    fieldName?: 'permissions[]' | 'dialog-permissions[]';
    initialName?: string;
    initialSelectedNames?: string[];
    submitLabel?: string;
    secondaryAction?: ReactNode;
};

type WizardSelection = {
    businesses: Set<string>;
    views: Set<string>;
    actions: Set<string>;
};

function viewResource(viewName: string): string {
    return viewName.endsWith('.view') ? viewName.slice(0, -'.view'.length) : viewName;
}

function actionsForView(viewName: string, actions: Permission[]): Permission[] {
    const resource = viewResource(viewName);

    return actions.filter((action) => {
        const lastDot = action.name.lastIndexOf('.');

        return action.name.slice(0, lastDot) === resource;
    });
}

function pruneViewsForBusinesses(
    businessNames: Set<string>,
    views: Set<string>,
): Set<string> {
    const availableFeatures = featuresForBusinesses([...businessNames]);

    return new Set(
        [...views].filter((viewName) => {
            const feature = VIEW_FEATURE_MAP[viewName];

            if (!feature) {
                return true;
            }

            return availableFeatures.has(feature);
        }),
    );
}

function pruneActionsForViews(
    views: Set<string>,
    actions: Set<string>,
    allActions: Permission[],
): Set<string> {
    const validActionNames = new Set<string>();

    for (const viewName of views) {
        for (const action of actionsForView(viewName, allActions)) {
            validActionNames.add(action.name);
        }
    }

    return new Set([...actions].filter((name) => validActionNames.has(name)));
}

function buildInitialSelection(
    permissionGroups: PermissionGroups,
    initialSelectedNames: string[],
): WizardSelection {
    const businessNames = new Set(permissionGroups.businesses.map(({ name }) => name));
    const viewNames = new Set(permissionGroups.views.map(({ name }) => name));
    const actionNames = new Set(permissionGroups.actions.map(({ name }) => name));

    const businesses = new Set<string>();
    const views = new Set<string>();
    const actions = new Set<string>();

    for (const name of initialSelectedNames) {
        if (businessNames.has(name)) {
            businesses.add(name);
        } else if (viewNames.has(name)) {
            views.add(name);
        } else if (actionNames.has(name)) {
            actions.add(name);
        }
    }

    const prunedViews = pruneViewsForBusinesses(businesses, views);
    const prunedActions = pruneActionsForViews(
        prunedViews,
        actions,
        permissionGroups.actions,
    );

    return { businesses, views: prunedViews, actions: prunedActions };
}

function BusinessBadge({
    businessName,
    checked,
    onCheckedChange,
}: {
    businessName: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}) {
    const inputId = useId();
    const business = getBusinessByName(businessName);

    if (!business) {
        return null;
    }

    return (
        <label htmlFor={inputId} className="group cursor-pointer">
            <input
                id={inputId}
                type="checkbox"
                checked={checked}
                onChange={(event) => onCheckedChange(event.target.checked)}
                className="peer sr-only"
            />
            <Badge
                className={cn(
                    'gap-2 py-0 pe-2 group-has-checked:bg-blue-900! group-has-checked:text-white peer-focus-visible:border-ring peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50',
                )}
            >
                <span className="relative size-8 shrink-0">
                    <img
                        src={business.logo}
                        alt=""
                        className="size-8 rounded-sm object-contain transition-opacity group-has-checked:opacity-0"
                    />
                    <img
                        src={business.logo}
                        alt=""
                        className="absolute inset-0 size-8 rounded-sm object-contain opacity-0 transition-opacity group-has-checked:opacity-100"
                    />
                </span>
                {business.label}
            </Badge>
        </label>
    );
}

function PermissionBadge({
    name,
    checked,
    isDeleteAction = false,
    onCheckedChange,
}: {
    name: string;
    checked: boolean;
    isDeleteAction?: boolean;
    onCheckedChange: (checked: boolean) => void;
}) {
    const inputId = useId();

    return (
        <label htmlFor={inputId} className="cursor-pointer">
            <input
                id={inputId}
                type="checkbox"
                checked={checked}
                onChange={(event) => onCheckedChange(event.target.checked)}
                className="peer sr-only"
            />
            <Badge
                className={cn(
                    'peer-checked:bg-blue-600 peer-checked:text-white peer-focus-visible:border-ring peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50',
                    isDeleteAction &&
                    'peer-checked:bg-destructive peer-checked:text-white',
                )}
            >
                {formatPermissionLabel(name)}
            </Badge>
        </label>
    );
}

function WizardStepper({
    step,
    stepLabels,
}: {
    step: number;
    stepLabels: string[];
}) {
    return (
        <nav aria-label="Role steps" className="border-b pb-2 w-fit">
            <ol className="flex items-center">
                {stepLabels.map((label, index) => {
                    const stepNumber = index + 1;
                    const isCurrent = step === stepNumber;
                    const isComplete = step > stepNumber;

                    return (
                        <li
                            key={label}
                            className={cn(
                                'flex items-center',
                                index < stepLabels.length - 1 ? 'flex-1' : '',
                            )}
                        >
                            {index > 0 && (
                                <span
                                    className={cn(
                                        'mx-3 hidden h-px flex-1 sm:block',
                                        isComplete ? 'bg-primary' : 'bg-border',
                                    )}
                                    aria-hidden
                                />
                            )}
                            <div className="flex shrink-0 items-center gap-2.5">
                                <span
                                    className={cn(
                                        'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium',
                                        isCurrent
                                            ? 'bg-primary text-primary-foreground'
                                            : isComplete
                                                ? 'bg-primary/20 text-primary'
                                                : 'bg-muted text-muted-foreground',
                                    )}
                                >
                                    {stepNumber}
                                </span>
                                <span
                                    className={cn(
                                        'text-sm font-medium',
                                        isCurrent
                                            ? 'text-foreground'
                                            : 'text-muted-foreground',
                                    )}
                                >
                                    {label}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

function WizardStepHeader({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="">
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
        </div>
    );
}

function WizardSectionCard({
    title,
    description,
    meta,
    children,
}: {
    title: string;
    description?: string;
    meta?: string;
    children: ReactNode;
}) {
    return (
        <Card className="gap-4 py-4 shadow-none">
            <CardHeader className="gap-1 px-4">
                <CardTitle className="text-base">{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
                {meta && (
                    <p className="text-muted-foreground text-sm">{meta}</p>
                )}
            </CardHeader>
            <CardContent className="px-4">
                <div className="flex flex-wrap gap-2">{children}</div>
            </CardContent>
        </Card>
    );
}

export function RoleWizard({
    permissionGroups,
    processing,
    errors,
    fieldName = 'permissions[]',
    initialName = '',
    initialSelectedNames = [],
    submitLabel = 'Create',
    secondaryAction,
}: RoleWizardProps) {
    const [name, setName] = useState(initialName);
    const [step, setStep] = useState(1);
    const [selectedBusinesses, setSelectedBusinesses] = useState<Set<string>>(
        () => buildInitialSelection(permissionGroups, initialSelectedNames).businesses,
    );
    const [selectedViews, setSelectedViews] = useState<Set<string>>(
        () => buildInitialSelection(permissionGroups, initialSelectedNames).views,
    );
    const [selectedActions, setSelectedActions] = useState<Set<string>>(
        () => buildInitialSelection(permissionGroups, initialSelectedNames).actions,
    );

    const permissionsError =
        fieldName === 'permissions[]'
            ? errors.permissions
            : errors['dialog-permissions'];

    const availableFeatures = featuresForBusinesses([...selectedBusinesses]);

    const businessViews = permissionGroups.views.filter((view) => {
        const feature = VIEW_FEATURE_MAP[view.name];

        return feature !== undefined && availableFeatures.has(feature);
    });

    const generalViews = permissionGroups.views.filter(
        (view) => VIEW_FEATURE_MAP[view.name] === undefined,
    );

    const actionsByView = [...selectedViews]
        .map((viewName) => ({
            viewName,
            actions: actionsForView(viewName, permissionGroups.actions),
        }))
        .filter(({ actions }) => actions.length > 0);

    const hasActionsStep = actionsByView.length > 0;
    const totalSteps = hasActionsStep ? 3 : 2;
    const stepLabels = hasActionsStep
        ? ['Businesses', 'Views', 'Actions']
        : ['Businesses', 'Views'];
    const isLastStep = step === totalSteps;

    const totalPermissions =
        selectedBusinesses.size + selectedViews.size + selectedActions.size;

    const canGoNext = step !== 1 || name.trim() !== '';

    const showSubmitButton =
        isLastStep && name.trim() !== '' && totalPermissions >= 1;

    useEffect(() => {
        if (step > totalSteps) {
            setStep(totalSteps);
        }
    }, [step, totalSteps]);

    const handleBusinessToggle = (businessName: string, checked: boolean): void => {
        const nextBusinesses = new Set(selectedBusinesses);

        if (checked) {
            nextBusinesses.add(businessName);
        } else {
            nextBusinesses.delete(businessName);
        }

        const nextViews = pruneViewsForBusinesses(nextBusinesses, selectedViews);
        const nextActions = pruneActionsForViews(
            nextViews,
            selectedActions,
            permissionGroups.actions,
        );

        setSelectedBusinesses(nextBusinesses);
        setSelectedViews(nextViews);
        setSelectedActions(nextActions);
    };

    const handleViewToggle = (viewName: string, checked: boolean): void => {
        const nextViews = new Set(selectedViews);

        if (checked) {
            nextViews.add(viewName);
        } else {
            nextViews.delete(viewName);
        }

        const nextActions = pruneActionsForViews(
            nextViews,
            selectedActions,
            permissionGroups.actions,
        );

        setSelectedViews(nextViews);
        setSelectedActions(nextActions);
    };

    const handleActionToggle = (actionName: string, checked: boolean): void => {
        setSelectedActions((previous) => {
            const next = new Set(previous);

            if (checked) {
                next.add(actionName);
            } else {
                next.delete(actionName);
            }

            return next;
        });
    };

    return (
        <div className="space-y-4">
            <WizardStepper step={step} stepLabels={stepLabels} />

            {step === 1 && (
                <div className="space-y-4">
                    <WizardStepHeader
                        title="Businesses"
                        description="Name the role and choose which businesses it can access."
                    />

                    <Card className="gap-2 py-4 shadow-none">
                        <CardHeader className="px-4">
                            <CardTitle className="text-base">Role name</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4">
                            <div className="grid gap-2">
                                <Label htmlFor="role-name" className="sr-only">
                                    Name
                                </Label>
                                <Input
                                    id="role-name"
                                    className="bg-background block w-full max-w-md"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    autoComplete="off"
                                    placeholder="e.g: Super User"
                                />
                                <InputError message={errors.name} />
                            </div>
                        </CardContent>
                    </Card>

                    <WizardSectionCard
                        title="Business access"
                        description={`Choose the businesses this role can access (${permissionGroups.businesses.length} available)`}
                    >
                        {permissionGroups.businesses.map(({ name: businessName }) => (
                            <BusinessBadge
                                key={businessName}
                                businessName={businessName}
                                checked={selectedBusinesses.has(businessName)}
                                onCheckedChange={(checked) =>
                                    handleBusinessToggle(businessName, checked)
                                }
                            />
                        ))}
                    </WizardSectionCard>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4">
                    <WizardStepHeader
                        title="Page access"
                        description="Choose the pages this role can view."
                    />

                    <InputError message={permissionsError} />

                    <div className="grid gap-4 lg:grid-cols-2">
                        {businessViews.length > 0 && (
                            <WizardSectionCard
                                title="Business pages"
                                description={`Pages tied to the selected businesses (${businessViews.length} available)`}
                            >
                                {businessViews.map(({ name: viewName }) => (
                                    <PermissionBadge
                                        key={viewName}
                                        name={viewName}
                                        checked={selectedViews.has(viewName)}
                                        onCheckedChange={(checked) =>
                                            handleViewToggle(viewName, checked)
                                        }
                                    />
                                ))}
                            </WizardSectionCard>
                        )}

                        {generalViews.length > 0 && (
                            <WizardSectionCard
                                title="General access"
                                description={`App-wide pages available to every role (${generalViews.length} available)`}
                            >
                                {generalViews.map(({ name: viewName }) => (
                                    <PermissionBadge
                                        key={viewName}
                                        name={viewName}
                                        checked={selectedViews.has(viewName)}
                                        onCheckedChange={(checked) =>
                                            handleViewToggle(viewName, checked)
                                        }
                                    />
                                ))}
                            </WizardSectionCard>
                        )}
                    </div>
                </div>
            )}

            {step === 3 && hasActionsStep && (
                <div className="space-y-4">
                    <WizardStepHeader
                        title="Actions"
                        description="Optionally grant actions for the pages you selected."
                    />

                    <div className="grid gap-4">
                        {actionsByView.map(({ viewName, actions }) => (
                            <WizardSectionCard
                                key={viewName}
                                title={formatPermissionLabel(viewName)}
                                meta={`${actions.length} actions available`}
                            >
                                {actions.map(({ name: actionName }) => (
                                    <PermissionBadge
                                        key={actionName}
                                        name={actionName}
                                        checked={selectedActions.has(actionName)}
                                        isDeleteAction={actionName.endsWith('.delete')}
                                        onCheckedChange={(checked) =>
                                            handleActionToggle(actionName, checked)
                                        }
                                    />
                                ))}
                            </WizardSectionCard>
                        ))}
                    </div>
                </div>
            )}

            <input type="hidden" name="name" value={name} />
            {[...selectedBusinesses, ...selectedViews, ...selectedActions].map(
                (permissionName) => (
                    <input
                        key={permissionName}
                        type="hidden"
                        name={fieldName}
                        value={permissionName}
                    />
                ),
            )}

            <div className="flex items-center w-fit gap-2">
                {secondaryAction}

                {step > 1 && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep((current) => current - 1)}
                    >
                        Previous
                    </Button>
                )}

                <div className="flex items-center gap-3">
                    {!isLastStep && (
                        <Button
                            type="button"
                            disabled={!canGoNext}
                            onClick={() => setStep((current) => current + 1)}
                        >
                            Next
                        </Button>
                    )}

                    {showSubmitButton && (
                        <Button
                            type="submit"
                            disabled={processing}
                            data-test="update-roles-and-permissions-button"
                        >
                            {submitLabel}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
