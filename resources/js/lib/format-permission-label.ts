/**
 * Turns a Spatie-style permission name into a readable label.
 *
 * @example formatPermissionLabel('main.view') // "View Main"
 * @example formatPermissionLabel('property services.view') // "View Property Services"
 * @example formatPermissionLabel('property types.view') // "View Property Types"
 */
export function formatPermissionLabel(permission: string): string {
    const lastDot = permission.lastIndexOf('.');

    if (lastDot === -1) {
        return formatResource(permission);
    }

    const resource = permission.slice(0, lastDot);
    const action = permission.slice(lastDot + 1);

    return `${formatAction(action)} ${formatResource(resource)}`;
}

function formatAction(action: string): string {
    if (action.length === 0) {
        return action;
    }

    return action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();
}

function formatResource(resource: string): string {
    return resource
        .split(/\s+/)
        .filter((part) => part.length > 0)
        .map(formatResourcePart)
        .join(' ');
}

function formatResourcePart(part: string): string {
    if (hasCamelCase(part)) {
        return splitCamelCase(part).map(formatWord).join('');
    }

    return formatWord(part);
}

function hasCamelCase(segment: string): boolean {
    const compact = segment.replace(/\s+/g, '');

    return /[a-z][A-Z]/.test(compact) || /[A-Z][a-z]/.test(compact);
}

function splitCamelCase(value: string): string[] {
    return value
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
        .split(/\s+/)
        .filter((word) => word.length > 0);
}

function formatWord(word: string): string {
    if (word.length > 1 && word === word.toUpperCase()) {
        return word;
    }

    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
