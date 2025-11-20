import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";

@Entity()
@ObjectType()
export class ProductVariant extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number; 

    @Field()
    @Column({ unsigned: true })
    productRef!: number;

    @Field()
    @Column({ length: 20 })
    name!: string;
    
    @Field()
    @Column({ length: 20 })
    color!: string; 

    @Field()
    @Column({ length: 20 })
    size!: string; 

    @Field()
    @Column({ unsigned: true })
    quantity!: number; 

    // @ManyToOne(() => Product, (product) => product.productVariant)
    // @Field(() => Product)
    // product!: Product; 
}