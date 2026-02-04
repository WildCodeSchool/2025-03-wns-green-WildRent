import { Mock } from "node:test";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { ProductService } from "../services/product.service";

jest.mock("../entities/Product", () =>({
    Product: {
        find: jest.fn().mockResolvedValue(undefined),
        findOne: jest.fn().mockResolvedValue(undefined),
        create: jest.fn().mockImplementation((data:any) => ({
            ...data, 
            save: jest.fn().mockResolvedValue(undefined),
        })),
    },
}));

jest.mock("../entities/Category", () => ({
    Category: {
        findOne: jest.fn(), 
        findOneBy: jest.fn().mockResolvedValue(undefined)
    }
}));

describe("ProductService", () => {
    let service: ProductService; 

    beforeEach(() => {
        service = new ProductService(); 
    });

    it("shloud create a new product", async () => {
        (Category.findOneBy as jest.Mock).mockResolvedValueOnce({ id: 1, name: "Haut"});

        const productData = {
            name: "tee-shirt",
            price: 40, 
            description: "une description dans cet input", 
            image: "",
            brand: "marque", 
            gender: "femme", 
            categoryId: 1 
        };


        const result = await service.createProduct(productData);
       
        expect(result.name).toBe("tee-shirt");
        expect(result.price).toBe(40);
        expect(result.description).toBe("une description dans cet input");
        expect(result.image).toBe("");
        expect(result.brand).toBe("marque");
        expect(result.gender).toBe("femme");
        expect(result.category.id).toBe(1);
    });

    it("should get product by id", async () => {
        (Product.findOne as jest.Mock).mockResolvedValue({ id: 1, name: "tee-shirt" });
        const product = await service.getProductById(1); 
        expect(product.name).toBe("tee-shirt");
    });

    it("should update product", async () => {
        const mockProduct = {
            id: 1,
            productRef: "123456",
            name: "tee-shirt",
            brand: "marque", 
            gender: "femme", 
            price: 40, 
            description: "une description dans cet input", 
            quantityVariants: 0,
            discount: 0,
            note: 0,
            image: "",
            category: { id: 1 },
            productVariant: [],
            bookingsProducts: [], 
            save: jest.fn().mockResolvedValue(undefined)
        };
        const mockCategory = {
            id: 1, 
            name: "Haut"
        };
        const updateData = {
            name: "tee-shirt", 
            gender: "femme", 
            price: 30, 
            description: "une description dans cet input", 
            quantityVariants: 0,
            discount: 0,
            categoryId: 1,
            image: "",
        };

        (Product.findOne as jest.Mock).mockResolvedValue(mockProduct);
        (Category.findOneBy as jest.Mock).mockResolvedValue(mockCategory);

        const result = await service.updateProduct(mockProduct.id, updateData)

        expect(Product.findOne).toHaveBeenCalledWith({ where: { id: 1 }});
        expect(Category.findOneBy).toHaveBeenCalledWith({ id: 1 });
        expect(mockProduct.save).toHaveBeenCalled();
        expect(result.price).toBe(30);
    });
})