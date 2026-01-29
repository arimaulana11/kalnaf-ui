export type FieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'select' | 'checkbox';

export interface FormField {
  name: string;
  label: string;
  type: FieldType; // Tipe ini harus mencakup 'email' dan 'password'
  placeholder?: string;
  required?: boolean;
}

export interface FormMeta {
  moduleName: string;
  title: string;
  fields: FormField[];
}