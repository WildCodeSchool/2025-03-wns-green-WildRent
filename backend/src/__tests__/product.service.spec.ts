import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { ProductService } from "../services/product.service";

jest.mock("../entities/Product", () => ({
    Product: {
        find: jest.fn().mockResolvedValue(undefined),
        findAndCount: jest.fn().mockResolvedValue([[], 0]),
        findOne: jest.fn().mockResolvedValue(undefined),
        findOneBy: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation((data: unknown) => ({
            ...data as object,
            save: jest.fn().mockResolvedValue(undefined),
        })),
        remove: jest.fn().mockResolvedValue(undefined),
    },
}));

jest.mock("../entities/Category", () => ({
    Category: {
        findOne: jest.fn(),
        findOneBy: jest.fn().mockResolvedValue(undefined),
    },
}));

describe("ProductService", () => {
    let service: ProductService;

    beforeEach(() => {
        service = new ProductService();
        jest.clearAllMocks();
    });

    it("should create a new product", async () => {
        (Category.findOneBy as jest.Mock).mockResolvedValueOnce({ id: 1, name: "Haut" });

        const productData = {
            name: "tee-shirt",
            price: 40,
            description: "une description dans cet input",
            image: "",
            brand: "marque",
            gender: "femme",
            categoryId: 1,
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

    it("should throw error if category not found on create", async () => {
        (Category.findOneBy as jest.Mock).mockResolvedValueOnce(null);

        const productData = {
            name: "tee-shirt",
            price: 40,
            description: "desc",
            image: "",
            brand: "marque",
            gender: "femme",
            categoryId: 999,
        };

        await expect(service.createProduct(productData)).rejects.toThrow("Category introuvable");
    });

    it("should get product by id", async () => {
        (Product.findOne as jest.Mock).mockResolvedValue({ id: 1, name: "tee-shirt" });
        const product = await service.getProductById(1);
        expect(product.name).toBe("tee-shirt");
    });

    it("should throw error if product not found by id", async () => {
        (Product.findOne as jest.Mock).mockResolvedValue(null);
        await expect(service.getProductById(999)).rejects.toThrow("Product introuvable");
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
            save: jest.fn().mockResolvedValue(undefined),
        };
        const mockCategory = { id: 1, name: "Haut" };
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

        const result = await service.updateProduct(mockProduct.id, updateData);

        expect(Product.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(Category.findOneBy).toHaveBeenCalledWith({ id: 1 });
        expect(mockProduct.save).toHaveBeenCalled();
        expect(result.price).toBe(30);
    });

    it("should get all products with pagination", async () => {
        const mockProducts = [
            { id: 1, name: "tee-shirt" },
            { id: 2, name: "pantalon" },
        ];
        (Product.findAndCount as jest.Mock).mockResolvedValueOnce([mockProducts, 2]);

        const result = await service.getAllProducts(20, 0);

        expect(result.products).toHaveLength(2);
        expect(result.total).toBe(2);
        expect(result.hasMore).toBe(false);
    });

    it("should return hasMore true when more products exist", async () => {
        const mockProducts = [{ id: 1, name: "tee-shirt" }];
        (Product.findAndCount as jest.Mock).mockResolvedValueOnce([mockProducts, 5]);

        const result = await service.getAllProducts(1, 0);

        expect(result.products).toHaveLength(1);
        expect(result.total).toBe(5);
        expect(result.hasMore).toBe(true);
    });

    it("should search products by query", async () => {
        const mockProducts = [
            { id: 1, name: "Escalade Pro", brand: "Petzl" },
        ];
        (Product.findAndCount as jest.Mock).mockResolvedValueOnce([mockProducts, 1]);

        const result = await service.searchProducts("esca", 20, 0);

        expect(result.products).toHaveLength(1);
        expect(result.total).toBe(1);
        expect(result.hasMore).toBe(false);
        expect(Product.findAndCount).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.arrayContaining([
                    expect.objectContaining({ name: expect.anything() }),
                    expect.objectContaining({ brand: expect.anything() }),
                    expect.objectContaining({ productRef: expect.anything() }),
                ]),
                take: 20,
                skip: 0,
            })
        );
    });

    it("should get products by category", async () => {
        (Product.find as jest.Mock).mockResolvedValue([
            { id: 1, name: "masque", category: { id: 1, name: "aquatique" } },
        ]);

        const result = await service.getProductsByCategory(1);

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("masque");
    });
});
