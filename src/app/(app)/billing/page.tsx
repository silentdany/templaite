import { BillingPlayground } from "./billing-playground";

export default function BillingPage() {
  return (
    <div className="p-6 max-w-3xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Exercise Polar checkout, customer portal, and customer APIs exposed
          through Better Auth.
        </p>
      </div>
      <BillingPlayground />
    </div>
  );
}
