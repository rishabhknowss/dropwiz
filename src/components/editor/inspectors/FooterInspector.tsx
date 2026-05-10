import type { StoreSection } from "@/db/schema";
import type { FooterData, PaymentMethod } from "@/types/store-sections";
import { TextField, ImagePickerField, CheckboxField } from "./fields";
import { Label } from "@/components/ui/label";

type Commit = (data: Record<string, unknown>) => void;

const ALL_PAYMENT_METHODS: { id: PaymentMethod; label: string }[] = [
  { id: "visa", label: "Visa" },
  { id: "mastercard", label: "Mastercard" },
  { id: "amex", label: "Amex" },
  { id: "paypal", label: "PayPal" },
  { id: "applepay", label: "Apple Pay" },
  { id: "googlepay", label: "Google Pay" },
  { id: "discover", label: "Discover" },
  { id: "stripe", label: "Stripe" },
];

const DEFAULT_METHODS: PaymentMethod[] = ["visa", "mastercard", "amex", "paypal", "applepay", "googlepay"];

export const FooterInspector = ({
  section,
  storeId,
  onCommit,
}: {
  section: StoreSection;
  storeId: string;
  onCommit: Commit;
}) => {
  const data = section.data as FooterData;
  const selectedMethods = data.paymentMethods ?? DEFAULT_METHODS;
  const showPayments = data.showPayments !== false;

  const toggleMethod = (method: PaymentMethod) => {
    const current = selectedMethods;
    const updated = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method];
    onCommit({ paymentMethods: updated });
  };

  return (
    <div className="space-y-3">
      <TextField
        label="Store name"
        defaultValue={data.storeName}
        onCommit={(v) => onCommit({ storeName: v })}
      />
      <ImagePickerField
        label="Logo"
        storeId={storeId}
        kind="logo"
        currentUrl={data.logoUrl}
        promptSeed="Minimal modern logo design, clean typography, white background"
        onPick={(url) => onCommit({ logoUrl: url })}
      />
      <TextField
        label="Tagline"
        defaultValue={data.tagline ?? ""}
        placeholder="Quality products, delivered fast"
        onCommit={(v) => onCommit({ tagline: v })}
      />
      <TextField
        label="Copyright text"
        defaultValue={data.copyrightText ?? ""}
        placeholder="All rights reserved"
        onCommit={(v) => onCommit({ copyrightText: v })}
      />
      <CheckboxField
        label="Show payment methods"
        defaultChecked={showPayments}
        onCommit={(v) => onCommit({ showPayments: v })}
      />
      {showPayments && (
        <div className="space-y-1.5">
          <Label className="text-[11px] text-[color:var(--dw-text-dim)]">
            Payment Methods
          </Label>
          <div className="grid grid-cols-2 gap-1.5">
            {ALL_PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => toggleMethod(method.id)}
                className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-[11px] transition ${
                  selectedMethods.includes(method.id)
                    ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-accent)]/10 text-[color:var(--dw-text)]"
                    : "border-[color:var(--dw-border)] text-[color:var(--dw-text-muted)] hover:border-[color:var(--dw-accent)]/40"
                }`}
              >
                <span
                  className={`h-3 w-3 rounded-sm border ${
                    selectedMethods.includes(method.id)
                      ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-accent)]"
                      : "border-[color:var(--dw-border)]"
                  }`}
                >
                  {selectedMethods.includes(method.id) && (
                    <svg viewBox="0 0 12 12" className="h-full w-full text-white">
                      <path
                        d="M3 6l2 2 4-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                {method.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <CheckboxField
        label="Show 'Built with Dropwiz'"
        defaultChecked={data.showPoweredBy !== false}
        onCommit={(v) => onCommit({ showPoweredBy: v })}
      />
    </div>
  );
};
