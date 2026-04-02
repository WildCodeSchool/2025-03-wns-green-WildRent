import { CategoryService } from "../services/category.service";
import { Category } from "../entities/Category";

jest.mock("../entities/Category", () => ({
  Category: {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  },
}));

describe("CategoryService", () => {
  let service: CategoryService;

  beforeEach(() => {
    service = new CategoryService();
    jest.clearAllMocks();
  });

  it("should create a new category", async () => {
    (Category.findOne as jest.Mock).mockResolvedValueOnce(null);

    (Category.create as jest.Mock).mockImplementation((data: any) => ({
      ...data,
      save: jest.fn().mockResolvedValue(undefined),
    }));

    const result = await service.createCategory({ name: "Tennis" });

    expect(Category.findOne).toHaveBeenCalledWith({
      where: { name: "tennis" },
    });

    expect(Category.create).toHaveBeenCalledWith({ name: "tennis" });
    expect(result.name).toBe("tennis");
  });

  it("should throw error if category already exists", async () => {
    (Category.findOne as jest.Mock).mockResolvedValueOnce({
      id: 1,
      name: "tennis",
    });

    await expect(service.createCategory({ name: "Tennis" })).rejects.toThrow(
      "category already exists",
    );
  });

  it("should get category by id", async () => {
    (Category.findOne as jest.Mock).mockResolvedValueOnce({
      id: 1,
      name: "ski",
    });

    const result = await service.getCategoryById(1);

    expect(Category.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result.name).toBe("ski");
  });

  it("should throw error if category not found by id", async () => {
    (Category.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(service.getCategoryById(1)).rejects.toThrow(
      "category not found",
    );
  });

  it("should update category", async () => {
    const categoryMock = {
      id: 1,
      name: "ski",
      save: jest.fn().mockResolvedValue(undefined),
    };

    (Category.findOne as jest.Mock)
      .mockResolvedValueOnce(categoryMock)
      .mockResolvedValueOnce(null);

    const result = await service.updateCategory(1, { name: "Hiver" });

    expect(Category.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    expect(categoryMock.save).toHaveBeenCalled();
    expect(result.name).toBe("hiver");
  });

  it("should delete a category", async () => {
    const categoryMock = {
      id: 1,
      name: "vélo",
    };

    (Category.findOne as jest.Mock).mockResolvedValueOnce(categoryMock);
    (Category.remove as jest.Mock).mockResolvedValue(undefined);

    const result = await service.deleteCategory(1);

    expect(Category.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(Category.remove).toHaveBeenCalledWith(categoryMock);
    expect(result).toBe(true);
  });

  it("should return false if category not found on delete", async () => {
    (Category.findOne as jest.Mock).mockResolvedValueOnce(null);

    const result = await service.deleteCategory(1);

    expect(result).toBe(false);
    expect(Category.remove).not.toHaveBeenCalled();
  });
});
