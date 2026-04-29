import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    Generated,
    OneToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Status } from "./Status";
import { BookingProducts } from "./BookingProducts";
import { User } from "./User";

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

    @ManyToOne(() => User, (user) => user.bookings)
    @Field(() => User)
    user!: User;

    @OneToMany(() => BookingProducts, (bookingProducts) => bookingProducts.booking)
    @Field(() => [BookingProducts])
    bookingsProducts!: BookingProducts[];
}
