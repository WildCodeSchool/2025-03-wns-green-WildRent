import PaymentForm from "../components/Payement/PayementForm";
import PaymentSummary from "../components/Payement/PayementSummary";
import BillingAddress from "../components/Payement/BillingAdress";

export function PaymentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PaymentForm />
        </div>

        <div className="flex flex-col gap-8">
          <PaymentSummary />
          <BillingAddress />
        </div>
      </div>
    </div>
  );
}