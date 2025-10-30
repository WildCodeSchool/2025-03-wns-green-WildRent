import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category";
import { ProductVariant } from "./ProductVariant";

@Entity()
@ObjectType()
export class Product extends BaseEntity {
    
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Field()
    @Column({ unique: true,unsigned: true })
    productRef!: number;

    @Field()
    @Column({ length: 20 })
    name!: string;

    @Field()
    @Column({ unsigned: true})
    quantity!: number;

    @Field()
    @Column({ unsigned: true })
    price!: number;

    @Field()
    @Column()
    description!: string;

    @Field()
    @Column()
    image!: string;

    @Field()
    @Column({ length: 20 })
    brand!: string;

    @Field()
    @Column({ length: 20 })
    size!: string;

    @Field()
    @Column({ length: 20 })
    color!: string;

    @Field()
    @Column({ length: 20 })
    gender!: string;
    
    @Field()
    @Column({ unsigned: true })
    discount!: number;

    @Field()
    @Column({ unsigned: true})
    note!: number;

    @ManyToOne(() => Category, (category) => category.products )
    @Field(() => Category)
    category!: Category;

    @OneToMany(() => ProductVariant, (productVariant) => productVariant.product)
    @Field(() => [ProductVariant])
    productVariant!: ProductVariant[];

    // @OneToMany(() => BookingProducts, (bookingProducts) => bookingProducts.product)
    // @Field(() => [BookingProducts])
    // bookingsProducts!: BookingProducts[];
}
