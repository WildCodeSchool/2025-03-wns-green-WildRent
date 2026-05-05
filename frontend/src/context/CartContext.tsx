import { createContext, useContext } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useAuth } from "./AuthContext";
import {
  GET_MY_CART,
  ADD_TO_CART,
  UPDATE_CART_ITEM_QUANTITY,
  UPDATE_CART_ITEM_DATES,
  REMOVE_CART_ITEM,
  CLEAR_CART,
  VALIDATE_CART,
} from "../graphql/cart.operations";
import { handleGraphQLError } from "../utils/handleGraphQLError";
import { getEffectiveDiscount } from "../utils/getEffectiveDiscount";
import type {
  CartBooking,
  CartBookingProduct,
  CartItemData,
  GetMyCartResponse,
  ValidateCartResponse,
} from "../types/cart.types";

type CartContextType = {
  items: CartItemData[];
  loading: boolean;
  addItem: (data: {
    productVariantId: number;
    quantity: number;
    startDate: string;
    endDate: string;
  }) => Promise<void>;
  removeItem: (bookingProductId: number) => Promise<void>;
  updateQuantity: (bookingProductId: number, quantity: number) => Promise<void>;
  updateDates: (bookingProductId: number, newStartDate: string, newEndDate: string) => Promise<void>;
  clearCart: () => Promise<void>;
  validateCart: () => Promise<CartBooking[]>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = useAuth();

  const { data, loading, refetch } = useQuery<GetMyCartResponse>(GET_MY_CART, {
    skip: !user,
    fetchPolicy: "cache-and-network",
  });

  const [addToCartMutation] = useMutation(ADD_TO_CART);
  const [updateQuantityMutation] = useMutation(UPDATE_CART_ITEM_QUANTITY);
  const [updateDatesMutation] = useMutation(UPDATE_CART_ITEM_DATES);
  const [removeItemMutation] = useMutation(REMOVE_CART_ITEM);
  const [clearCartMutation] = useMutation(CLEAR_CART);
  const [validateCartMutation] = useMutation<ValidateCartResponse>(VALIDATE_CART);

  // Flatten bookings into a flat list of items for components
  const items: CartItemData[] = (data?.getMyCart ?? []).flatMap((booking: CartBooking) =>
    booking.bookingsProducts.map((bp: CartBookingProduct) => ({
      bookingProductId: bp.id,
      bookingId: booking.id,
      productId: bp.productVariant.product.id,
      variantId: bp.productVariant.id,
      productName: bp.productVariant.product.name,
      image: bp.productVariant.image || bp.productVariant.product.image || "",
      price: bp.productVariant.product.price,
      discount: getEffectiveDiscount(bp.productVariant.product.discount, bp.productVariant.discount),
      productRef: bp.productVariant.productRef,
      color: bp.productVariant.color,
      size: bp.productVariant.size,
      startDate: booking.startDate,
      endDate: booking.endDate,
      quantity: bp.productQuantity,
    }))
  );

  async function addItem(input: {
    productVariantId: number;
    quantity: number;
    startDate: string;
    endDate: string;
  }) {
    try {
      await addToCartMutation({
        variables: {
          data: {
            productVariantId: input.productVariantId,
            quantity: input.quantity,
            startDate: new Date(input.startDate).toISOString(),
            endDate: new Date(input.endDate).toISOString(),
          },
        },
      });
      await refetch();
    } catch (err: unknown) {
      handleGraphQLError(err);
      throw err;
    }
  }

  async function removeItem(bookingProductId: number) {
    try {
      await removeItemMutation({
        variables: { data: { bookingProductId } },
      });
      await refetch();
    } catch (err: unknown) {
      handleGraphQLError(err);
    }
  }

  async function updateQuantity(bookingProductId: number, quantity: number) {
    try {
      await updateQuantityMutation({
        variables: { data: { bookingProductId, quantity } },
      });
      await refetch();
    } catch (err: unknown) {
      handleGraphQLError(err);
    }
  }

  async function updateDates(bookingProductId: number, newStartDate: string, newEndDate: string) {
    try {
      await updateDatesMutation({
        variables: {
          data: {
            bookingProductId,
            startDate: new Date(newStartDate).toISOString(),
            endDate: new Date(newEndDate).toISOString(),
          },
        },
      });
      await refetch();
    } catch (err: unknown) {
      handleGraphQLError(err);
    }
  }

  async function clearCart() {
    try {
      await clearCartMutation();
      await refetch();
    } catch (err: unknown) {
      handleGraphQLError(err);
    }
  }

  async function validateCart(): Promise<CartBooking[]> {
    try {
      const result = await validateCartMutation();
      await refetch();
      return result.data?.validateCart ?? [];
    } catch (err: unknown) {
      handleGraphQLError(err);
      throw err;
    }
  }

  return (
    <CartContext.Provider
      value={{ items, loading, addItem, removeItem, updateQuantity, updateDates, clearCart, validateCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
