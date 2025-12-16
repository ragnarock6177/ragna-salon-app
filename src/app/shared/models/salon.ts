export interface Salon {
    id: number;
    name: string;
    owner_name: string;
    email: string;
    phone: string;
    address: string;
    city_id: number;
    services: string; // JSON string
    rating: string;
    total_reviews: number;
    is_active: number;
    created_at: string;
    updated_at: string;
    images: string[];
}
