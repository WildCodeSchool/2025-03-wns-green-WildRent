import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useCart } from "../../context/CartContext";
import type { CartItemData } from "../../types/cart.types";
import { GET_AVAILABLE_STOCK } from "../../graphql/ProductVariantOperations";
import { formatDate } from "../../utils/formatDate";
import { calculateItemTotal } from "../../utils/calculateItemTotal";

export default function CartItem({
  bookingProductId,
  variantId,
  productName,
  productRef,
  image,
  price,
  color,
  size,
  startDate,
  endDate,
  quantity,
}: Readonly<CartItemData>) {
  const { removeItem, updateQuantity, updateDates } = useCart();
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [localStartDate, setLocalStartDate] = useState(startDate.slice(0, 10));
  const [localEndDate, setLocalEndDate] = useState(endDate.slice(0, 10));

  const today = new Date().toISOString().slice(0, 10);

  const { data } = useQuery<{ getAvailableStock: number }>(
    GET_AVAILABLE_STOCK,
    {
      variables: {
        productVariantId: variantId,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      },
    }
  );

  const availableStock = data?.getAvailableStock ?? 0;
  const isMaxStock = quantity >= availableStock;

  function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newStart = e.target.value;
    setLocalStartDate(newStart);
    if (newStart > localEndDate) {
      setLocalEndDate(newStart);
    }
  }

  function handleEndDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLocalEndDate(e.target.value);
  }

  async function handleConfirmDates() {
    if (localStartDate !== startDate.slice(0, 10) || localEndDate !== endDate.slice(0, 10)) {
      await updateDates(bookingProductId, localStartDate, localEndDate);
    }
    setIsEditingDates(false);
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-[var(--dark-green)] rounded-xl text-white">

      <img src={image} alt={productName} className="h-20 w-20 object-contain bg-white rounded-lg p-1" />

      <div className="flex-1">
        <p className="font-bold font-[family-name:var(--font-title)]">{productName}</p>
        <p className="text-xs text-[var(--light-green)]">Ref : {productRef}</p>
        <p className="text-xs">Couleur : {color} · Taille : {size}</p>

        {isEditingDates ? (
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <div className="flex items-center gap-1">
              <label className="text-xs text-[var(--light-green)]">Du</label>
              <input
                type="date"
                value={localStartDate}
                min={today}
                onChange={handleStartDateChange}
                className="text-xs bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
              />
            </div>
            <div className="flex items-center gap-1">
              <label className="text-xs text-[var(--light-green)]">Au</label>
              <input
                type="date"
                value={localEndDate}
                min={localStartDate || today}
                onChange={handleEndDateChange}
                className="text-xs bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
              />
            </div>
            <button
              onClick={handleConfirmDates}
              className="text-xs text-[var(--light-green)] hover:text-white transition cursor-pointer"
            >
              OK
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-2">
            <p className="text-xs">Du {formatDate(startDate)} au {formatDate(endDate)}</p>
            <button
              onClick={() => {
                setLocalStartDate(startDate.slice(0, 10));
                setLocalEndDate(endDate.slice(0, 10));
                setIsEditingDates(true);
              }}
              className="cursor-pointer hover:opacity-80 transition"
              title="Modifier les dates"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[var(--light-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        )}

        {isMaxStock && (
          <p className="text-red-400 text-xs mt-1">
             Stock maximum atteint ({availableStock} disponible{availableStock > 1 ? "s" : ""} sur cette période)
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(bookingProductId, quantity - 1)}
          disabled={quantity <= 1}
          className="h-8 w-8 rounded-lg bg-white text-[var(--dark-green)] font-bold cursor-pointer disabled:opacity-50"
        >
          -
        </button>
        <button className="h-8 w-8 rounded-lg bg-white text-[var(--dark-green)] font-bold">
          {quantity}
        </button>
        <button
          onClick={() => updateQuantity(bookingProductId, quantity + 1)}
          disabled={isMaxStock}
          className="h-8 w-8 rounded-lg bg-white text-[var(--dark-green)] font-bold cursor-pointer disabled:opacity-50"
        >
          +
        </button>
      </div>

      <p className="font-bold text-[var(--light-green)] w-16 text-right">{calculateItemTotal(price, quantity, startDate, endDate)}€</p>

      <button
        onClick={() => removeItem(bookingProductId)}
        className="text-red-400 text-sm cursor-pointer"
      >
        Supprimer
      </button>

    </div>
  );
}
