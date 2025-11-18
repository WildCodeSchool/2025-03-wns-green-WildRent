import { CategoryInput } from "../dtos/category.dto";
import { Category } from "../entities/Category";

export class CategoryService {

  async getAllCategories(): Promise<Category[]> {
    return Category.find({ order: { name: "ASC" as const } });
  }

  async getCategoryById(id: number): Promise<Category> {
    const cat = await Category.findOne({ where: { id } });
    if (!cat) throw new Error("category not found");
    return cat;
  }

  async createCategory(data:CategoryInput): Promise<Category> {
    const name = data.name.trim().toLowerCase();

    const exists = await Category.findOne({ where: {name} });
    if (exists) throw new Error("category already exists");

    const newCat = Category.create({ name });
    await newCat.save();
    return newCat;
  }

  async updateCategory(id: number, data:CategoryInput): Promise<Category> {
    const cat = await Category.findOne({ where: { id } });
    if (!cat) throw new Error("category not found");

    const name = data.name.trim().toLowerCase();
    const duplicate = await Category.findOne({ where: { name } });
    if (duplicate && duplicate.id !== id) {
      throw new Error("category already exists");
    }

    cat.name = name;
    await cat.save();
    return cat;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const cat = await Category.findOne({ where: { id } });
    if (!cat) return false;

    await Category.remove(cat);
    return true;
  }
}
