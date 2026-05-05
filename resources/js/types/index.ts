export type Outlet = {
    id: number;
    name: string;
    slug: string;
    address: string;
    city: string;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    google_maps_url: string | null;
    latitude: number | null;
    longitude: number | null;
    description: string | null;
    is_active: boolean;
    opening_hours?: OpeningHour[];
};

export type OpeningHour = {
    id: number;
    day_of_week: number;
    open_time: string | null;
    close_time: string | null;
    is_closed: boolean;
};

export type MenuCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    sort_order: number;
    is_active: boolean;
    menu_items_count?: number;
    menu_items?: MenuItem[];
};

export type MenuItemDetails = {
    long_description?: string | null;
    ingredients?: string[] | null;
    allergens?: string[] | null;
    diet?: string[] | null;
    pairings?: string[] | null;
    prep_time_min?: number | null;
    calories?: number | null;
    portion?: string | null;
    spice_level?: number | null;
    origin?: string | null;
    chef_note?: string | null;
};

export type MenuItem = {
    id: number;
    menu_category_id: number;
    name: string;
    slug: string;
    description: string | null;
    details: MenuItemDetails | null;
    price: number;
    image_path: string | null;
    image_url: string | null;
    is_signature: boolean;
    is_popular: boolean;
    is_new: boolean;
    is_available: boolean;
    sort_order: number;
    category?: MenuCategory;
};

export type GalleryAsset = {
    id: number;
    title: string | null;
    category: 'interior' | 'food' | 'beverage' | 'event' | 'ambience';
    image_path: string;
    image_url: string | null;
    alt_text: string;
    sort_order: number;
    is_featured: boolean;
};

export type Testimonial = {
    id: number;
    customer_name: string;
    rating: number;
    content: string;
    source: string | null;
    is_featured: boolean;
    created_at: string;
};

export type Promotion = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    image_path: string | null;
    image_url: string | null;
    start_date: string | null;
    end_date: string | null;
    is_active: boolean;
};

export type Reservation = {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    reservation_date: string;
    reservation_time: string;
    guest_count: number;
    occasion_type: string | null;
    notes: string | null;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    created_at: string;
};

export type EventInquiry = {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    event_type: string;
    event_date: string | null;
    guest_count: number | null;
    budget_estimate: string | null;
    notes: string | null;
    status: string;
    created_at: string;
};

export type ContactMessage = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string | null;
    message: string;
    status: 'unread' | 'read' | 'archived';
    created_at: string;
};

export type SiteSettings = Record<string, { value: string | number | boolean | null; type: string; group: string }>;

export type AdminUser = {
    id: number;
    name: string;
    email: string;
    role: 'super_admin' | 'admin';
};

export type ApiCollection<T> = { data: T[] };
export type ApiResource<T> = { data: T };
