import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";

import { Booking } from "./Booking";
import { ProductVariant } from "./ProductVariant";

@Entity()
@ObjectType()
export class BookingProducts extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({ unsigned: true })
    productQuantity!: number;

    @ManyToOne(() => Booking, (booking) => booking.bookingsProducts)
    @Field(() => Booking)
    booking!: Booking;

    @ManyToOne(() => ProductVariant, (variant) => variant.bookingsProducts)
    @Field(() => ProductVariant)
    productVariant!: ProductVariant;

}
