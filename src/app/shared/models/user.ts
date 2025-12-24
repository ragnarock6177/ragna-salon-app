export interface User {
    _id?: string;
    name: string;
    email: string;
    role: string;
    active: 'Active' | 'Pending' | 'Inactive';
    last: string;
}