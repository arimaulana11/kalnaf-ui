'use client';
import { useForm } from 'react-hook-form';
import { FormMeta } from '@/types/meta-json';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button'; // Import komponen Anda

interface FormRendererProps {
  meta: FormMeta;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export default function FormRenderer({ meta, onSubmit, isLoading, submitLabel }: FormRendererProps) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-slate-900">{meta.title}</h2>
        <p className="text-slate-500 text-sm mt-1">Sistem POS Kalnaf Coresys</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="flex flex-col gap-5 w-full">
          {meta.fields.map((field) => (
            <Input
              key={field.name}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              error={errors[field.name]?.message as string} 
              {...register(field.name, { required: field.required })}
            />
          ))}
        </div>

        {/* Menggunakan Reusable Button Component */}
        <Button 
          type="submit" 
          isLoading={isLoading} 
          variant="primary"
        >
          {submitLabel || 'Lanjutkan'}
        </Button>
      </form>
    </div>
  );
}