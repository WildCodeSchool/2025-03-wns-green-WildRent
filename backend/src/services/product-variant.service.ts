import { FindManyOptions } from "typeorm";
import { CreateProductVariantInput, UpdateProductVariantInput } from "../dtos/product-variant.dto";
import { Product } from "../entities/Product";
import { ProductVariant } from "../entities/ProductVariant";

export class ProductVariantService {
    async getAllProductsVariant(): Promise<ProductVariant[]> {
        let findOptions: FindManyOptions<ProductVariant> = {
            relations: { product: true },
        }
        const products_variant = await ProductVariant.find(findOptions);
        return products_variant;
    }

    async getProductVariantById(id: number): Promise<ProductVariant> {
        const productVariant = await ProductVariant.findOneBy({ id: id });
        if(!productVariant) throw new Error("PRODUCT_VARIANT NOT FOUND"); 
        return productVariant
    }

    async createProductVariant(data: CreateProductVariantInput): Promise<ProductVariant> {
        let randomRef = ""; 
        for(let i = 0; i<6; i++) {
            const number = Math.floor(Math.random()*10)
            randomRef += number
        }

        const product = await Product.findOneBy({ id: data.productId})
        if (!product) throw new Error("PRODUCT NOT FOUND")

        const productVariant = ProductVariant.create({
            productRef: randomRef,
            name: data.name, 
            color: data.color, 
            size: data.size, 
            image: data.image, 
            quantity: data.quantity,
            product: product,
        }); 
        await productVariant.save(); 
        return productVariant
    }

    async updateProductVariant(id: number, data: UpdateProductVariantInput): Promise<ProductVariant> {
        let currProductVariant = await ProductVariant.findOneBy({ id: id}); 
        if(!currProductVariant) throw new Error("PRODUCT_VARIANT NOT FOUND");

        currProductVariant = Object.assign(currProductVariant, data); 
        currProductVariant.save(); 
        return currProductVariant;
    }

    async deleteProductVariant(id: number): Promise<string> {
        const currProductVariant = await ProductVariant.findOneBy({ id: id}); 
        if(!currProductVariant) throw new Error("PRODUCT_VARIANT NOT FOUND"); 

        await ProductVariant.remove(currProductVariant); 
        return "PRODUCT_VARIANT DELETED"
    }
}