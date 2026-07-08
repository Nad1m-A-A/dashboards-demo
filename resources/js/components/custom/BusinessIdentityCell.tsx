import BusinessAvatar from '@/components/custom/BusinessAvatar';
import type { BusinessInfo } from '@/data/businesses';
import { cn } from '@/lib/utils';

export type BusinessIdentityCellProps = {
    business: BusinessInfo;
    className?: string;
    labelClassName?: string;
};

function BusinessIdentityCell({
    business,
    className,
    labelClassName,
}: BusinessIdentityCellProps) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <BusinessAvatar
                logo={business.logo}
                initials={business.initials}
            />
            <span className={cn('font-medium', labelClassName)}>
                {business.label}
            </span>
        </div>
    );
}

export default BusinessIdentityCell;
