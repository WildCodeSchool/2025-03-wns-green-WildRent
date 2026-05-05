import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

import { Booking } from "../entities/Booking";
import { CartService } from "../services/cart.service";
import {
  AddToCartInput,
  UpdateCartItemQuantityInput,
  UpdateCartItemDatesInput,
  RemoveCartItemInput,
} from "../dtos/cart.dto";
import { AuthContext } from "../types/types";

@Resolver()
export class CartResolver {
  private readonly cartService = new CartService();

  @Authorized()
  @Query(() => [Booking])
  async getMyCart(@Ctx() context: AuthContext): Promise<Booking[]> {
    return this.cartService.getMyCart(context.user.id);
  }

  @Authorized()
  @Mutation(() => Booking)
  async addToCart(
    @Arg("data") data: AddToCartInput,
    @Ctx() context: AuthContext,
  ): Promise<Booking> {
    return this.cartService.addToCart(
      context.user.id,
      data.productVariantId,
      data.quantity,
      data.startDate,
      data.endDate,
    );
  }

  @Authorized()
  @Mutation(() => Booking)
  async updateCartItemQuantity(
    @Arg("data") data: UpdateCartItemQuantityInput,
    @Ctx() context: AuthContext,
  ): Promise<Booking> {
    return this.cartService.updateCartItemQuantity(
      context.user.id,
      data.bookingProductId,
      data.quantity,
    );
  }

  @Authorized()
  @Mutation(() => Booking)
  async updateCartItemDates(
    @Arg("data") data: UpdateCartItemDatesInput,
    @Ctx() context: AuthContext,
  ): Promise<Booking> {
    return this.cartService.updateCartItemDates(
      context.user.id,
      data.bookingProductId,
      data.startDate,
      data.endDate,
    );
  }

  @Authorized()
  @Mutation(() => ID)
  async removeCartItem(
    @Arg("data") data: RemoveCartItemInput,
    @Ctx() context: AuthContext,
  ): Promise<number> {
    return this.cartService.removeCartItem(context.user.id, data.bookingProductId);
  }

  @Authorized()
  @Mutation(() => Boolean)
  async clearCart(@Ctx() context: AuthContext): Promise<boolean> {
    return this.cartService.clearCart(context.user.id);
  }

  @Authorized()
  @Mutation(() => [Booking])
  async validateCart(@Ctx() context: AuthContext): Promise<Booking[]> {
    return this.cartService.validateCart(context.user.id);
  }
}
