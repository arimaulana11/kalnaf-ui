'use client';
import { useForm } from 'react-hook-form';
import { FormMeta } from '@/types/meta-json';

export default function FormRenderer({ meta, onSubmit }: { meta: FormMeta, onSubmit: (data: any) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold">{meta.title}</h2>
      {meta.fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1">
          <label className="text-sm font-medium">{field.label}</label>
          <input
            type={field.type}
            placeholder={field.placeholder}
            {...register(field.name, { required: field.required })}
            className="border p-2 rounded-md"
          />
          {errors[field.name] && <span className="text-red-500 text-xs">Field ini wajib diisi</span>}
        </div>
      ))}
      <button type="submit" className="bg-blue-600 text-white p-2 rounded-md w-full">
        Simpan Data
      </button>
    </form>
  );
}