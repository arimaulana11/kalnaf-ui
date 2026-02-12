export interface Staff {
  id: string; // UUID
  tenant_id: string; // UUID
  name: string | null;
  email: string;
  role: 'owner' | 'manager' | 'staff'; // default: owner, manager, staff, dll
  is_active: boolean | null;
  last_login_at: string | null;
  created_at: string | null;
}
