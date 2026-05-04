import { Product } from "../entities/Product";
import { ProductVariant } from "../entities/ProductVariant";
import { ProductVariantService } from "../services/product-variant.service";
import { BookingProducts } from "../entities/BookingProducts";

jest.mock("../entities/ProductVariant", () => ({
    ProductVariant: {
        find: jest.fn().mockResolvedValue(undefined),
        findOne: jest.fn().mockResolvedValue(undefined),
        findOneBy: jest.fn().mockResolvedValue(undefined),
        create: jest.fn().mockImplementation((data: unknown) => ({
            ...data as object,
            save: jest.fn().mockResolvedValue(undefined),
        })),
        remove: jest.fn().mockResolvedValue(undefined),
    },
}));

jest.mock("../entities/Product", () => ({
    Product: {
        findOneBy: jest.fn().mockResolvedValue(undefined),
        update: jest.fn().mockResolvedValue(undefined),
    },
}));

jest.mock("../entities/BookingProducts", () => ({
    BookingProducts: {
        find: jest.fn().mockResolvedValue([]),
    },
}));

describe("ProductVariantService", () => {
    let service: ProductVariantService;

    beforeEach(() => {
        service = new ProductVariantService();
        jest.clearAllMocks();
    });

    it("should create a new product variant", async () => {
        (Product.findOneBy as jest.Mock).mockResolvedValue({ id: 1, name: "Tee-shirt", discount: 0 });
        (ProductVariant.findOneBy as jest.Mock).mockResolvedValue(null);
        (ProductVariant.find as jest.Mock).mockResolvedValue([]);

        const mockData = {
            color: "blanc",
            size: "Medium",
            quantity: 1,
            productId: 1,
        };

        const result = await service.createProductVariant(mockData);

        expect(result.color).toBe("blanc");
        expect(result.size).toBe("Medium");
        expect(result.quantity).toBe(1);
        expect(result.productRef).toMatch(/^WR-[A-Z0-9]{8}$/);
        expect(result.product.id).toBe(1);
    });

    it("should throw error if product not found when creating variant", async () => {
        (Product.findOneBy as jest.Mock).mockResolvedValue(null);

        const mockData = {
            color: "blanc",
            size: "Medium",
            quantity: 1,
            productId: 999,
        };

        await expect(service.createProductVariant(mockData)).rejects.toThrow("Product introuvable");
    });

    it("should reject variant discount lower than product discount", async () => {
        (Product.findOneBy as jest.Mock).mockResolvedValue({ id: 1, name: "Tee-shirt", discount: 20 });
        (ProductVariant.findOneBy as jest.Mock).mockResolvedValue(null);

        const mockData = {
            color: "blanc",
            size: "Medium",
            quantity: 1,
            productId: 1,
            discount: 10,
        };

        await expect(service.createProductVariant(mockData)).rejects.toThrow(
            "La réduction du variant ne peut pas être inférieure à celle du produit"
        );
    });

    it("should update a product variant", async () => {
        const mockProductVariant = {
            id: 1,
            color: "blanc",
            size: "Medium",
            quantity: 1,
            product: { id: 1, discount: 0 },
            save: jest.fn().mockResolvedValue(undefined),
        };

        (ProductVariant.findOne as jest.Mock).mockResolvedValue(mockProductVariant);
        (ProductVariant.find as jest.Mock).mockResolvedValue([{ quantity: 15 }]);

        const result = await service.updateProductVariant(1, { quantity: 15 });

        expect(mockProductVariant.save).toHaveBeenCalled();
        expect(result.quantity).toBe(15);
    });

    it("should delete a product variant", async () => {
        const mockProductVariant = { id: 1, product: { id: 1 } };
        (ProductVariant.findOne as jest.Mock).mockResolvedValue(mockProductVariant);
        (ProductVariant.remove as jest.Mock).mockResolvedValue(undefined);
        (ProductVariant.find as jest.Mock).mockResolvedValue([]);

        const result = await service.deleteProductVariant(1);

        expect(ProductVariant.remove).toHaveBeenCalledWith(mockProductVariant);
        expect(result).toBe("PRODUCT_VARIANT DELETED");
    });

    it("should throw error if variant not found on delete", async () => {
        (ProductVariant.findOne as jest.Mock).mockResolvedValue(null);

        await expect(service.deleteProductVariant(999)).rejects.toThrow("ProductVariant introuvable");
    });

    it("should get a product variant by id", async () => {
        (ProductVariant.findOneBy as jest.Mock).mockResolvedValue({ id: 1, color: "blanc", size: "Medium" });
        const result = await service.getProductVariantById(1);

        expect(ProductVariant.findOneBy).toHaveBeenCalledWith({ id: 1 });
        expect(result.color).toBe("blanc");
    });

    it("should throw error if variant not found by id", async () => {
        (ProductVariant.findOneBy as jest.Mock).mockResolvedValue(null);

        await expect(service.getProductVariantById(999)).rejects.toThrow("ProductVariant introuvable");
    });

    it("should get all product variants", async () => {
        (ProductVariant.find as jest.Mock).mockResolvedValue([
            { id: 1, color: "blanc", size: "medium" },
            { id: 2, color: "rouge", size: "large" },
            { id: 3, color: "bleu", size: "small" },
        ]);

        const result = await service.getAllProductsVariant();

        expect(ProductVariant.find).toHaveBeenCalled();
        expect(result.length).toBe(3);
        expect(result[0].color).toBe("blanc");
        expect(result[1].color).toBe("rouge");
        expect(result[2].size).toBe("small");
    });

    describe("getAvailableStock", () => {
        it("should return total stock when no bookings exist", async () => {
            (ProductVariant.findOne as jest.Mock).mockResolvedValue({
                id: 1,
                quantity: 5,
            });
            (BookingProducts.find as jest.Mock).mockResolvedValue([]);

            const result = await service.getAvailableStock(
                1,
                new Date("2026-06-01"),
                new Date("2026-06-10")
            );

            expect(result).toBe(5);
        });

        it("should subtract reserved quantities when bookings overlap", async () => {
            (ProductVariant.findOne as jest.Mock).mockResolvedValue({
                id: 1,
                quantity: 5,
            });
            (BookingProducts.find as jest.Mock).mockResolvedValue([
                { productQuantity: 1, booking: { id: 10 } },
                { productQuantity: 3, booking: { id: 11 } },
            ]);

            const result = await service.getAvailableStock(
                1,
                new Date("2026-04-30"),
                new Date("2026-05-02")
            );

            expect(result).toBe(1);
        });

        it("should return 0 when all stock is reserved", async () => {
            (ProductVariant.findOne as jest.Mock).mockResolvedValue({
                id: 1,
                quantity: 3,
            });
            (BookingProducts.find as jest.Mock).mockResolvedValue([
                { productQuantity: 3, booking: { id: 10 } },
            ]);

            const result = await service.getAvailableStock(
                1,
                new Date("2026-04-30"),
                new Date("2026-05-02")
            );

            expect(result).toBe(0);
        });

        it("should throw error if product variant not found", async () => {
            (ProductVariant.findOne as jest.Mock).mockResolvedValue(null);

            await expect(
                service.getAvailableStock(
                    999,
                    new Date("2026-04-30"),
                    new Date("2026-05-02")
                )
            ).rejects.toThrow("ProductVariant introuvable");
        });
    });

    describe("updateQuantityVariants", () => {
        it("should recalculate total quantity for a product", async () => {
            (ProductVariant.find as jest.Mock).mockResolvedValue([
                { quantity: 5 },
                { quantity: 3 },
                { quantity: 7 },
            ]);

            await service.updateQuantityVariants(1);

            expect(Product.update).toHaveBeenCalledWith(1, { quantityVariants: 15 });
        });
    });
});
