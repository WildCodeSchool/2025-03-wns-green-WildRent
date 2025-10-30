import { Arg } from "type-graphql";
import { Product } from "../entities/Product";

export class ProductService {

    async getAllProducts(): Promise<Product[]>{
        const products = await Product.find();
        return products; 
    }

    async getProductByRef(productRef: number): Promise<Product>{
        const product = await Product.findOne({where: { productRef } });
        if(!product) throw new Error("PRODUCT_NOT_FOUND");
        return product;
    }
}