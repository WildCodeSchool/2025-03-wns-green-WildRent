import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne
} from "typeorm";

import { Booking } from "./Booking";
import { Product } from "./Product";

@Entity()
@ObjectType()
export class BookingProducts extends BaseEntity {

    @Field()
    @Column({ unsigned: true })
    productQuantity!: number;

    @ManyToOne(() => Product, (product) => product.bookingsProducts)
    @Field(() => Product)
    product!: Product;

    @ManyToOne(() => Booking, (booking) => booking.bookingsProducts)
    @Field(() => Booking)
    booking!: Booking;

}
