import { Product } from "../entities/Product";
import { ProductVariant } from "../entities/ProductVariant";
import { ProductVariantService } from "../services/product-variant.service"

// Mock des fonction
jest.mock("../entities/ProductVariant", () => ({
    ProductVariant: {
        find: jest.fn().mockResolvedValue(undefined),
        findOneBy: jest.fn().mockResolvedValue(undefined), 
        create: jest.fn().mockImplementation((data:any) => ({
            ...data, 
            save: jest.fn().mockResolvedValue(undefined)
        })), 
        remove: jest.fn().mockResolvedValue(undefined), 
    }
}));

jest.mock("../entities/Product", () => ({
    Product: {
        findOneBy: jest.fn().mockResolvedValue(undefined)
    }
}));

describe("ProductVariantService", () => {
    let service: ProductVariantService;

    beforeEach(() => {
        service = new ProductVariantService();
    });

    it("should creat a new variant product", async () => {
        (Product.findOneBy as jest.Mock).mockResolvedValue({ id: 1, name: "Tee-shirt" }); 

        const mockProductVariantData = {
            name: "tee-shirt blanc", 
            color: "blanc",
            size: "Medium",
            quantity: 1,
            productId: 1
        }; 

        const result = await service.createProductVariant(mockProductVariantData); 

        expect(result.name).toBe("tee-shirt blanc");
        expect(result.color).toBe("blanc");
        expect(result.size).toBe("Medium");
        expect(result.quantity).toBe(1);
        expect(result.product.id).toBe(1);
    });

    it("should update a variant product", async () => {
        const mockProductVariant = {
            id: 1, 
            name: "tee-shirt blanc", 
            color: "blanc",
            size: "Medium",
            quantity: 1,
            productId: 1, 
            save: jest.fn().mockResolvedValue(undefined)
        };

        const updateProductVariantData = {
            quantity: 15
        };

        (ProductVariant.findOneBy as jest.Mock).mockResolvedValue(mockProductVariant);

        const result = await service.updateProductVariant(mockProductVariant.id, updateProductVariantData); 

        expect(ProductVariant.findOneBy).toHaveBeenCalledWith({ id: 1 }); 
        expect(mockProductVariant.save).toHaveBeenCalled();
        expect(result.quantity).toBe(15);
    });

    // it("should delete a variant product", async () => {

    // });

    // it("should get a variant product by reference", async () => {

    // });
})