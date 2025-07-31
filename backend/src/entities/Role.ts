import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";

@Entity()
@ObjectType()
export class Role extends BaseEntity {
    
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Field()
    @Column({ length: 20 })
    roleName!: string;

    @OneToMany(() => User, (user) => user.role)
    @Field(() => [User])
    users!: User[];

}
