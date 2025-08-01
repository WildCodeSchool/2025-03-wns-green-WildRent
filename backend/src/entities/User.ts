import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { Role } from "./Role";

@Entity()
@ObjectType()
export class User extends BaseEntity {
    
    @Field()
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
    phoneNumber!: number;

    @Field()
    @Column({ length: 20 })
    email!: string;

    @Field()
    @Column({ length: 250 })
    password!: string;

    @Field()
    @Column({ length: 250 })
    address!: string;

    @Field()
    @Column({ length: 250 })
    city!: string;

    // @ManyToOne(() => Role, (role) => role.users)
    // @Field(() => Role)
    // role!: Role;
}
