import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Role } from "./Role";

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

  @Field()
  @Column({ length: 5 })
  postalCode!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar?: string;

  @ManyToOne(() => Role, (role) => role.users)
  @Field(() => Role)
  role!: Role;
}
