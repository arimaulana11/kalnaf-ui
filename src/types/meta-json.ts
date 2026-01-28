export type FieldType = 'text' | 'number' | 'select' | 'date'; 
 
export interface FormField { name: string; label: string; type: FieldType; required?: boolean; placeholder?: string; options?: { label: string; value: any }[]; } 
 
export interface FormMeta { moduleName: string; title: string; fields: FormField[]; } 
