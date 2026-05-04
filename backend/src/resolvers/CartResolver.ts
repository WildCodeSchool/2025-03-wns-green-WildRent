import {
  Arg,
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
import { AnonContext, AuthContext } from "../types/types";
import { Errors } from "../errors/errors";

@Resolver()
export class CartResolver {
  private readonly cartService = new CartService();

  @Query(() => [Booking])
  async getMyCart(
    @Ctx() context: AnonContext | AuthContext
  ): Promise<Booking[]> {
    const userToken = (context as AuthContext).user;
    if (!userToken) throw Errors.notAuthenticated();

    return this.cartService.getMyCart(userToken.id);
  }

  @Mutation(() => Booking)
  async addToCart(
    @Arg("data") data: AddToCartInput,
    @Ctx() context: AnonContext | AuthContext
  ): Promise<Booking> {
    const userToken = (context as AuthContext).user;
    if (!userToken) throw Errors.notAuthenticated();

    return this.cartService.addToCart(
      userToken.id,
      data.productVariantId,
      data.quantity,
      data.startDate,
      data.endDate
    );
  }

  @Mutation(() => Booking)
  async updateCartItemQuantity(
    @Arg("data") data: UpdateCartItemQuantityInput,
    @Ctx() context: AnonContext | AuthContext
  ): Promise<Booking> {
    const userToken = (context as AuthContext).user;
    if (!userToken) throw Errors.notAuthenticated();

    return this.cartService.updateCartItemQuantity(
      userToken.id,
      data.bookingProductId,
      data.quantity
    );
  }

  @Mutation(() => Booking)
  async updateCartItemDates(
    @Arg("data") data: UpdateCartItemDatesInput,
    @Ctx() context: AnonContext | AuthContext
  ): Promise<Booking> {
    const userToken = (context as AuthContext).user;
    if (!userToken) throw Errors.notAuthenticated();

    return this.cartService.updateCartItemDates(
      userToken.id,
      data.bookingProductId,
      data.startDate,
      data.endDate
    );
  }

  @Mutation(() => ID)
  async removeCartItem(
    @Arg("data") data: RemoveCartItemInput,
    @Ctx() context: AnonContext | AuthContext
  ): Promise<number> {
    const userToken = (context as AuthContext).user;
    if (!userToken) throw Errors.notAuthenticated();

    return this.cartService.removeCartItem(userToken.id, data.bookingProductId);
  }

  @Mutation(() => Boolean)
  async clearCart(
    @Ctx() context: AnonContext | AuthContext
  ): Promise<boolean> {
    const userToken = (context as AuthContext).user;
    if (!userToken) throw Errors.notAuthenticated();

    return this.cartService.clearCart(userToken.id);
  }

  @Mutation(() => [Booking])
  async validateCart(
    @Ctx() context: AnonContext | AuthContext
  ): Promise<Booking[]> {
    const userToken = (context as AuthContext).user;
    if (!userToken) throw Errors.notAuthenticated();

    return this.cartService.validateCart(userToken.id);
  }
}
