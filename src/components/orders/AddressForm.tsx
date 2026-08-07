import { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const addressSchema = z.object({
  recipientName: z.string().min(2, "Nome obrigatório"),
  zipCode: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido (00000-000)"),
  street: z.string().min(3, "Rua obrigatória"),
  number: z.string().min(1, "Número obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro obrigatório"),
  city: z.string().min(2, "Cidade obrigatória"),
  state: z.string().length(2, "UF com 2 caracteres"),
  label: z.string().optional(),
  isDefault: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => Promise<void> | void;
  isLoading?: boolean;
}

export function AddressForm({ onSubmit, isLoading = false }: AddressFormProps) {
  const [form, setForm] = useState<AddressFormData>({
    recipientName: "", zipCode: "", street: "", number: "",
    complement: "", neighborhood: "", city: "", state: "",
    label: "", isDefault: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const maskZipCode = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    return digits;
  };

  const handleChange = (field: keyof AddressFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = addressSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    await onSubmit(result.data);
  };

  const inputCls = "w-full px-3 py-2 bg-card border border-border rounded-md text-sm focus:ring-2 focus:ring-ring outline-none";
  const labelCls = "block text-sm font-medium text-foreground mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Destinatário *</label>
          <input className={inputCls} value={form.recipientName} onChange={(e) => handleChange("recipientName", e.target.value)} />
          {errors.recipientName && <p className="text-xs text-destructive mt-1">{errors.recipientName}</p>}
        </div>
        <div>
          <label className={labelCls}>CEP *</label>
          <input className={inputCls} value={form.zipCode} onChange={(e) => handleChange("zipCode", maskZipCode(e.target.value))} placeholder="00000-000" />
          {errors.zipCode && <p className="text-xs text-destructive mt-1">{errors.zipCode}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Rua *</label>
          <input className={inputCls} value={form.street} onChange={(e) => handleChange("street", e.target.value)} />
          {errors.street && <p className="text-xs text-destructive mt-1">{errors.street}</p>}
        </div>
        <div>
          <label className={labelCls}>Número *</label>
          <input className={inputCls} value={form.number} onChange={(e) => handleChange("number", e.target.value)} />
          {errors.number && <p className="text-xs text-destructive mt-1">{errors.number}</p>}
        </div>
        <div>
          <label className={labelCls}>Complemento</label>
          <input className={inputCls} value={form.complement} onChange={(e) => handleChange("complement", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Bairro *</label>
          <input className={inputCls} value={form.neighborhood} onChange={(e) => handleChange("neighborhood", e.target.value)} />
          {errors.neighborhood && <p className="text-xs text-destructive mt-1">{errors.neighborhood}</p>}
        </div>
        <div>
          <label className={labelCls}>Cidade *</label>
          <input className={inputCls} value={form.city} onChange={(e) => handleChange("city", e.target.value)} />
          {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className={labelCls}>UF *</label>
          <input className={inputCls} maxLength={2} value={form.state} onChange={(e) => handleChange("state", e.target.value.toUpperCase())} />
          {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
        </div>
        <div>
          <label className={labelCls}>Rótulo</label>
          <input className={inputCls} value={form.label} onChange={(e) => handleChange("label", e.target.value)} placeholder="Ex: Casa, Trabalho" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={form.isDefault} onChange={(e) => handleChange("isDefault", e.target.checked)} className="rounded border-border" />
        Definir como endereço padrão
      </label>
      <button type="submit" disabled={isLoading} className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        Salvar endereço
      </button>
    </form>
  );
}
