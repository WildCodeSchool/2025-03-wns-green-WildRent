import CartItemList from "../components/Cart/CartItemList";
import CartSummary from "../components/Cart/CartSummary";

export function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartItemList />
        </div>
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}