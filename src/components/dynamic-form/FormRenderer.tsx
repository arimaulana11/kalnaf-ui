'use client';
import { useForm } from 'react-hook-form';
import { FormMeta } from '@/types/meta-json';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface FormRendererProps {
  meta: FormMeta;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  submitLabel?: string;
  initialData?: any;
}

export default function FormRenderer({ 
  meta, 
  onSubmit, 
  isLoading, 
  submitLabel, 
  initialData 
}: FormRendererProps) {
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: initialData 
  });

  return (
    <div className="w-full max-w-xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-slate-900">{meta.title}</h2>
        <p className="text-slate-500 text-sm mt-1">Sistem POS Kalnaf Coresys</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="flex flex-col gap-5 w-full">
          {meta.fields.map((field) => {
            // LOGIKA TAMBAHAN UNTUK CHECKBOX (is_active)
            if (field.type === 'checkbox') {
              return (
                <div key={field.name} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-slate-100/50">
                  <div className="flex flex-col">
                    <label htmlFor={field.name} className="text-sm font-bold text-slate-700 cursor-pointer">
                      {field.label}
                    </label>
                    <p className="text-xs text-slate-500">Status saat ini: Aktifkan untuk publikasi</p>
                  </div>
                  <input
                    type="checkbox"
                    id={field.name}
                    className="w-6 h-6 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all"
                    {...register(field.name)}
                  />
                </div>
              );
            }

            // DEFAULT UNTUK TYPE TEXT, TEL, DLL
            return (
              <Input
                key={field.name}
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
                error={errors[field.name]?.message as string}
                {...register(field.name, { 
                  required: field.required ? `${field.label} wajib diisi` : false 
                })}
              />
            );
          })}
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          variant="primary"
          className="w-full py-4 rounded-2xl shadow-lg shadow-blue-200"
        >
          {submitLabel || 'Simpan Perubahan'}
        </Button>
      </form>
    </div>
  );
}