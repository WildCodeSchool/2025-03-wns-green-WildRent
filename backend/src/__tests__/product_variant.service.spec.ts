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

    it("should create a new variant product", async () => {
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

    it("should throw error if product not found when create a new product variant", async () => {
        (Product.findOneBy as jest.Mock).mockResolvedValue(null);

        const mockProductVariantData = {
            name: "tee-shirt blanc", 
            color: "blanc",
            size: "Medium",
            quantity: 1,
            productId: 999
        };

        await expect(service.createProductVariant(mockProductVariantData)).rejects.toThrow("PRODUCT NOT FOUND");
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

    it("should delete a variant product", async () => {
        const mockProductVariant = { id: 1 };
        (ProductVariant.findOneBy as jest.Mock).mockResolvedValue(mockProductVariant);
        (ProductVariant.remove as jest.Mock).mockResolvedValue(undefined);

        const result = await service.deleteProductVariant(1);

        expect(ProductVariant.findOneBy).toHaveBeenCalledWith({ id: 1 });
        expect(ProductVariant.remove).toHaveBeenCalledWith(mockProductVariant);
        expect(result).toBe("PRODUCT_VARIANT DELETED");
    });

    it("should get a variant product by id", async () => {
        (ProductVariant.findOneBy as jest.Mock).mockResolvedValue({ id: 1, name: "tee-shirt blanc", color: "blanc" });
        const result = await service.getProductVariantById(1); 

        expect(ProductVariant.findOneBy).toHaveBeenCalledWith({ id: 1 }); 
        expect(result.name).toBe("tee-shirt blanc");
        expect(result.color).toBe("blanc");
    });

    it("should return error if variant does not exist", async () => {
        (ProductVariant.findOneBy as jest.Mock).mockResolvedValue(null);

        await expect(service.getProductVariantById(999)).rejects.toThrow("PRODUCT_VARIANT NOT FOUND")
    });

    it("should get all product variant", async () => {
        (ProductVariant.find as jest.Mock).mockResolvedValue([
            {id: 1, name: "tee-shirt blanc", color: "blanc", size: "medium"},
            {id: 2, name: "tee-shirt rouge", color: "rouge", size: "large"},
            {id: 3, name: "tee-shirt bleu", color: "bleu", size: "small"}
        ]);

        const result = await service.getAllProductsVariant();

        expect(ProductVariant.find).toHaveBeenCalled();
        expect(result.length).toBe(3);
        expect(result[0].name).toBe("tee-shirt blanc");
        expect(result[1].color).toBe("rouge");
        expect(result[2].size).toBe("small");
    });
})