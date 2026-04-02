import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";

import { Booking } from "./Booking";
import { Product } from "./Product";

@Entity()
@ObjectType()
export class BookingProducts extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

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
