export interface Coupon {
    id: number;
    salon_id: number;
    code: string;
    description: string;
    discount: number;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    max_discount_amount: number | null;
    min_order_amount: number | null;
    valid_from: string;
    valid_to: string;
    max_usage: number | null;
    used_count: number;
    status: string;
    created_at: string;
    updated_at: string;
}
