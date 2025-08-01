// import { Field, ID, ObjectType } from "type-graphql";
// import {
//     BaseEntity,
//     Column,
//     Entity,
//     OneToMany,
//     PrimaryGeneratedColumn,
// } from "typeorm";

// import { Product } from "./Product";

// @Entity()
// @ObjectType()
// export class Category extends BaseEntity {
    
//     @Field()
//     @PrimaryGeneratedColumn()
//     id!: number;
    
//     @Field()
//     @Column({ length: 20 })
//     name!: string;

//     @OneToMany(() => Product, (product) => product.category)
//     @Field(() => [Product])
//     products!: Product[];
// }
