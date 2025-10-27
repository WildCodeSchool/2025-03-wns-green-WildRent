import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Booking } from "./Booking";

@Entity()
@ObjectType()
export class Status extends BaseEntity {
    
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Field()
    @Column({ length: 20, unique: true })
    statusName!: string;
    
    @OneToMany(() => Booking, (booking) => booking.status)
    @Field(() => [Booking], { nullable: true })
    bookings?: Booking[];
    
}
