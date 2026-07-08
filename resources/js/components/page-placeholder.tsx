type PagePlaceholderProps = {
    title: string;
};

export function PagePlaceholder({ title }: PagePlaceholderProps) {
    return (
        <div className="flex h-full items-center justify-center">
            <h1 className="text-3xl">{title}</h1>
        </div>
    );
}
