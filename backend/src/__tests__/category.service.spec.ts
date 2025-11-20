import { CategoryService } from "../services/category.service";
import { Category } from "../entities/Category";

jest.mock("../entities/Category"); 

describe("CategoryService", () => {
  let service: CategoryService;

  beforeEach(() => {
    service = new CategoryService();
    jest.clearAllMocks();
  });

  it("should create a new category", async () => {
    (Category.findOne as jest.Mock).mockResolvedValue(null);
    (Category.create as jest.Mock).mockReturnValue({
      save: jest.fn().mockResolvedValue(true),
      name: "tennis"
    });

    const res = await service.createCategory({ name: "Tennis" });

    expect(Category.findOne).toHaveBeenCalledWith({ where: { name: "tennis" } });
    expect(res.name).toBe("tennis");
  });

  it("should throw if category exists", async () => {
    (Category.findOne as jest.Mock).mockResolvedValue({ id: 1, name: "tennis" });

    await expect(
      service.createCategory({ name: "Tennis" })
    ).rejects.toThrow("category already exists");
  });

  it("should get category by ID", async () => {
    (Category.findOne as jest.Mock).mockResolvedValue({ id: 1, name: "ski" });

    const cat = await service.getCategoryById(1);

    expect(cat.name).toBe("ski");
  });

  it("should throw if category not found", async () => {
    (Category.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.getCategoryById(1)).rejects.toThrow("category not found");
  });

  it("should update category", async () => {
    const saveMock = jest.fn().mockResolvedValue(true);

    (Category.findOne as jest.Mock)
      .mockResolvedValueOnce({ id: 1, name: "ski", save: saveMock })
      .mockResolvedValueOnce(null);

    const updated = await service.updateCategory(1, { name: "Hiver" });

    expect(updated.name).toBe("hiver");
    expect(saveMock).toHaveBeenCalled();
  });

  it("should delete a category", async () => {
    const removeMock = jest.fn().mockResolvedValue(true);

    (Category.findOne as jest.Mock).mockResolvedValue({
      id: 1,
      name: "vélo",
      remove: removeMock
    });

    const result = await service.deleteCategory(1);
    expect(result).toBe(true);
  });

  it("should return false if delete target not found", async () => {
    (Category.findOne as jest.Mock).mockResolvedValue(null);

    const result = await service.deleteCategory(1);
    expect(result).toBe(false);
  });
});
