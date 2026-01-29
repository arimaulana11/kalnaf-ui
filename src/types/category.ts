export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface CategoryPayload {
  name: string;
  description?: string;
}