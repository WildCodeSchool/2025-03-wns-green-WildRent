import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";
import { BookingProducts } from "./BookingProducts";

@Entity()
@ObjectType()
export class ProductVariant extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number; 

    @Field()
    @Column({ length: 20 })
    color!: string; 

    @Field()
    @Column({ length: 20 })
    size!: string; 

    @Field()
    @Column({ unsigned: true, default: 0 })
    discount!: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    image?: string;

    @Field()
    @Column({ unique: true })
    productRef!: string;

    @Field()
    @Column({ unsigned: true })
    quantity!: number;

    @ManyToOne(() => Product, (product) => product.productVariant)
    @Field(() => Product)
    product!: Product; 

      @OneToMany(() => BookingProducts, (bp) => bp.productVariant)
      @Field(() => [BookingProducts])
      bookingsProducts!: BookingProducts[];
}