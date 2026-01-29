export type UpdateStorePayload = {
  name: string;
  address: string;
  phone?: string;
  description?: string;
  receipt_header?: string;
  receipt_footer?: string;
  logo_url?: string;
  is_active: boolean;
};

export type Store = {
  id: string;
  tenant_id: string;
  name: string;
  address: string;
  phone?: string;
  is_active: boolean;
  logo_url?: string;
  receipt_header?: string;
  receipt_footer?: string;
  created_at: string;
  updated_at: string;
  user_stores: unknown[];
};