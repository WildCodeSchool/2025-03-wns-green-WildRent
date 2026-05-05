/** GraphQL response type for a BookingProduct inside the cart */
export type CartBookingProduct = {
  id: number;
  productQuantity: number;
  productVariant: {
    id: number;
    color: string;
    size: string;
    image?: string;
    productRef: string;
    quantity: number;
    discount: number;
    product: {
      id: number;
      name: string;
      productRef: string;
      price: number;
      image?: string;
      discount: number;
    };
  };
};

/** GraphQL response type for a Booking in the cart */
export type CartBooking = {
  id: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: { statusName: string };
  bookingsProducts: CartBookingProduct[];
};

/** Flattened cart item used by frontend components */
export type CartItemData = {
  bookingProductId: number;
  bookingId: number;
  productId: number;
  variantId: number;
  productName: string;
  image: string;
  price: number;
  discount: number;
  productRef: string;
  color: string;
  size: string;
  startDate: string;
  endDate: string;
  quantity: number;
};

/** GraphQL response shape for getMyCart query */
export type GetMyCartResponse = {
  getMyCart: CartBooking[];
};

/** GraphQL response shape for validateCart mutation */
export type ValidateCartResponse = {
  validateCart: CartBooking[];
};
