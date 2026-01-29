export type FieldType = 'text' | 'email' | 'password' | 'tel' | 'number' | 'checkbox';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
}

export interface FormMeta {
  moduleName: string;
  title: string;
  fields: FormField[];
}
