import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function BusinessAvatar({ logo, initials }: { logo: string, initials: string }) {
    return (
        <Avatar className="size-10">
            <AvatarImage src={logo} />
            <AvatarFallback className='bg-inherit text-white'>{initials}</AvatarFallback>
        </Avatar>
    )
}

export default BusinessAvatar