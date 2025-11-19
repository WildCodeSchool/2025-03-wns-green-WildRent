import { NewProductInput, UpdateProductInput } from "../dtos/product.dto";
import { Product } from "../entities/Product";

export class ProductService {

    async getAllProducts(): Promise<Product[]>{
        const products = await Product.find();
        return products; 
    }

    async getProductById(id: number): Promise<Product>{
        const product = await Product.findOne({where: { id } });
        if(!product) throw new Error("PRODUCT_NOT_FOUND");
        return product;
    }

    async createProduct(data: NewProductInput): Promise<Product>{
        let result = ""; 
        for(let i = 0; i<6; i++) {
            const number = Math.floor(Math.random()*10)
            result += number
        }
        const productRef = Number(result)

        const product = Product.create({
            name: data.name,
            price: data.price,
            productRef: productRef, 
            description: data.description, 
            image: data.image,
            brand: data.brand, 
            gender: data.gender, 
            category: data.category
        });
        await product.save();
        return product;
    }

    async updateProduct(id: number, data: UpdateProductInput): Promise<Product> {
        let currProduct = await Product.findOne({ where: { id }}); 
        if(!currProduct) throw new Error("PRODUCT NOT FOUND");
        currProduct = Object.assign(currProduct, data); 
        currProduct.save();
        return currProduct;

    }

    async deleteProduct(id: number): Promise<Boolean>{
        const currProduct = await Product.findOne({ where: { id }}); 
        if(!currProduct) throw new Error("PRODUCT NOT FOUND"); 
        await Product.remove(currProduct); 
        return true;
    }
}