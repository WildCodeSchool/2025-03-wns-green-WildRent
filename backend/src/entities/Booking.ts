import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    Generated,
    // OneToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Status } from "./Status";
// import { BookingProducts } from "./BookingProducts";

@Entity()
@ObjectType()
export class Booking extends BaseEntity {
    
    @Field(()=> ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({ unique: true })
	@Generated("increment")
    bookingRef!: number;
    
    @Field()
    @Column({ nullable: true })
    totalPrice?: number;

    @Field()
    @Column({ })
    startDate!: Date;

    @Field()
    @Column({ })
    endDate!: Date;
    
    @ManyToOne(() => Status, (status) => status.bookings)
    @Field(() => Status)
    status!: Status;

    // @OneToMany(() => BookingProducts, (bookingProducts) => bookingProducts.booking)
    // @Field(() => [BookingProducts])
    // bookingsProducts!: BookingProducts[];
}
