import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "./Role";
import { Booking } from "./Booking";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ length: 20 })
  firstname!: string;

  @Field()
  @Column({ length: 20 })
  lastname!: string;

  @Field()
  @Column()
  phoneNumber!: string;

  @Field()
  @Column({ length: 30, unique: true })
  email!: string;

  @Column({ length: 250 })
  password!: string;

  @Field()
  @Column({ length: 250 })
  address!: string;

  @Field()
  @Column({ length: 50 })
  city!: string;

  @OneToMany(() => Booking, (booking) => booking.user)
  @Field(() => [Booking])
  bookings!: Booking[];

  @ManyToOne(() => Role, (role) => role.users)
  @Field(() => Role)
  role!: Role;
}
