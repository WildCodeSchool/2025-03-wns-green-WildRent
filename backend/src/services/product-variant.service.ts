import { CreateProductVariantInput, UpdateProductVariantInput } from "../dtos/product-variant.dto";
import { ProductVariant } from "../entities/ProductVariant";

export class ProductVariantService {
    async getAllProductsVariant(): Promise<ProductVariant[]> {
        const products_variant = await ProductVariant.find();
        return products_variant;
    }

    async getProductVariantById(id: number): Promise<ProductVariant> {
        const productVariant = await ProductVariant.findOneBy({ id: id });
        if(!productVariant) throw new Error("PRODUCT_VARIANT NOT FOUND"); 
        return productVariant
    }

    async createProductVariant(data: CreateProductVariantInput): Promise<ProductVariant> {
        let result = ""; 
        for(let i = 0; i<6; i++) {
            const number = Math.floor(Math.random()*10)
            result += number
        }
        const productRef = Number(result)

        const productVariant = ProductVariant.create({
            productRef: productRef,
            name: data.name, 
            color: data.color, 
            size: data.size, 
            image: data.image, 
            quantity: data.quantity
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