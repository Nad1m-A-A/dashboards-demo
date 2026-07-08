import BusinessAvatar from '@/components/custom/BusinessAvatar';
import { cn } from '@/lib/utils';

export type BusinessIdentityColumnProps = {
    color: string;
    logo: string;
    initials: string;
    label: string;
    labelAlignmentClassName?: 'justify-center' | 'justify-start';
};

function BusinessIdentityColumn({ color, logo, initials, label, labelAlignmentClassName = 'justify-start' }: BusinessIdentityColumnProps) {
    return (
        <div className="flex w-10 shrink-0 flex-col items-center gap-2 animate-in fade-in duration-700">
            <BusinessAvatar color={color} logo={logo} initials={initials} />
            <div className={cn(labelAlignmentClassName, "flex h-full flex-col items-center gap-1 text-sm font-bold")}>
                {label.split('').map((letter, index) => (
                    <span key={index}>{letter}</span>
                ))}
            </div>
        </div>
    );
}

export default BusinessIdentityColumn;
