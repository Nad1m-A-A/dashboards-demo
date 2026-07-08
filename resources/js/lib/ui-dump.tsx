export default function UiDump({ children }: { children: any }) {
    return (
        <pre>
            {children === null
                ? 'null'
                : children === undefined
                    ? 'undefined'
                    : typeof children === 'string'
                        ? children === '' ? '""' : children
                        : typeof children === 'number' && children === 0
                            ? '0'
                            : JSON.stringify(children, null, 2)}
        </pre>
    );
}