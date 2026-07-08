export type Permission = {
    id: number;
    name: string;
};

export type Role = {
    id: number;
    name: string;
    permissions: Permission[];
};

export type User = {
    id: number;
    created_at: string;
    updated_at: string;
    role: Role;
    [key: string]: unknown;
};

export type Auth = {
    user: User | null;
};

export type Session = {
    id: string;
    user_id: number;
    ip_address: string;
    visitor_name: string;
    user_agent: string;
    payload: string;
    last_activity: number;
};

/* @chisel-passkeys */
export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};
/* @end-chisel-passkeys */
