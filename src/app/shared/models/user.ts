export interface User {
    name: string;
    email: string;
    role: string;
    active: 'Active' | 'Pending' | 'Inactive';
    last: string;
}