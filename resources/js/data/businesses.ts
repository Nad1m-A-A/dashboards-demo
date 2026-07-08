import alpha_logo from '@resources/images/alpha.jpg';
import beta_logo from '@resources/images/beta.jpg';
import delta_logo from '@resources/images/delta.jpg';
import epsilon_logo from '@resources/images/epsilon.jpg';
import gamma_logo from '@resources/images/gamma.jpg';
import zeta_logo from '@resources/images/zeta.jpg';

export type BusinessInfo = {
    name: string;
    label: string;
    initials: string;
    logo: string;
    primary_color: string;
    secondary_color: string;
    features?: Feature[];
};

export type Feature =
    | 'targets'
    | 'stats'
    | 'sub-offices'
    | 'stats-totals'
    | 'income-sorting'
    | 'property-types'
    | 'agents'
    | 'deals'
    | 'property-services'
    | 'sales-teams';

const agencyFeatures: Feature[] = [
    'targets',
    'stats',
    'stats-totals',
    'income-sorting',
    'property-types',
    'agents',
    'deals',
    'sales-teams',
];

export const businesses: BusinessInfo[] = [
    {
        name: 'alpha',
        label: 'Alpha Realty',
        initials: 'α',
        logo: alpha_logo,
        primary_color: 'var(--color-alpha)',
        secondary_color: 'var(--color-alpha-secondary)',
        features: [...agencyFeatures, 'sub-offices'],
    },
    {
        name: 'beta',
        label: 'Beta Realty',
        initials: 'β',
        logo: beta_logo,
        primary_color: 'var(--color-beta)',
        secondary_color: 'var(--color-beta-secondary)',
        features: agencyFeatures,
    },
    {
        name: 'gamma',
        label: 'Gamma Realty',
        initials: 'γ',
        logo: gamma_logo,
        primary_color: 'var(--color-gamma)',
        secondary_color: 'var(--color-gamma-secondary)',
        features: agencyFeatures,
    },
    {
        name: 'delta',
        label: 'Delta Realty',
        initials: 'Δ',
        logo: delta_logo,
        primary_color: 'var(--color-delta)',
        secondary_color: 'var(--color-delta-secondary)',
        features: agencyFeatures,
    },
    {
        name: 'epsilon',
        label: 'Epsilon Realty',
        initials: 'ε',
        logo: epsilon_logo,
        primary_color: 'var(--color-epsilon)',
        secondary_color: 'var(--color-epsilon-secondary)',
        features: agencyFeatures,
    },
    {
        name: 'zeta',
        label: 'Zeta Property Management',
        initials: 'ζ',
        logo: zeta_logo,
        primary_color: 'var(--color-zeta)',
        secondary_color: 'var(--color-zeta-secondary)',
        features: ['stats', 'property-services', 'targets'],
    },
];

export const VIEW_FEATURE_MAP: Record<string, Feature> = {
    'stats.view': 'stats',
    'targets.view': 'targets',
    'property types.view': 'property-types',
    'agents.view': 'agents',
    'deals.view': 'deals',
    'property services.view': 'property-services',
    'sales teams.view': 'sales-teams',
};

export function featuresForBusinesses(names: string[]): Set<Feature> {
    const features = new Set<Feature>();

    for (const name of names) {
        const business = getBusinessByName(name);

        if (business?.features) {
            for (const feature of business.features) {
                features.add(feature);
            }
        }
    }

    return features;
}

export function getBusinessesWithFeature(feature: Feature): BusinessInfo[] {
    return businesses.filter((b) => b.features?.includes(feature));
}

export function getAccessibleBusinessesWithFeature(
    feature: Feature,
    permissionNames: string[],
): BusinessInfo[] {
    const permitted = new Set(permissionNames);

    return getBusinessesWithFeature(feature).filter((business) =>
        permitted.has(business.name),
    );
}

export function getBusinessByName(name: string): BusinessInfo | undefined {
    return businesses.find((business) => business.name === name);
}
