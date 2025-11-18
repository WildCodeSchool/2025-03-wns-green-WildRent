import { Category } from "../entities/Category";

export class CategoryService {

  async getAll(): Promise<Category[]> {
    return Category.find({ order: { name: "ASC" as const } });
  }

  async getById(id: number): Promise<Category> {
    const cat = await Category.findOne({ where: { id } });
    if (!cat) throw new Error("category not found");
    return cat;
  }

  async create(name: string): Promise<Category> {
    const newName = name.trim();
    if (!newName) throw new Error("invalid name");

    const exists = await Category.findOne({ where: { name: newName } });
    if (exists) throw new Error("category already exists");

    const newCat = Category.create({ name: newName });
    await newCat.save();
    return newCat;
  }

  async update(id: number, name: string): Promise<Category> {
    const cat = await Category.findOne({ where: { id } });
    if (!cat) throw new Error("category not found");

    const newName = name.trim();
    if (!newName) throw new Error("invalid name");

    if (newName === cat.name) {
      return cat;
    }

    const duplicate = await Category.findOne({ where: { name: newName } });
    if (duplicate && duplicate.id !== id) {
      throw new Error("category already exists");
    }

    cat.name = newName;
    await cat.save();
    return cat;
  }

  async delete(id: number): Promise<boolean> {
    const cat = await Category.findOne({ where: { id } });
    if (!cat) return false;

    await Category.remove(cat);
    return true;
  }
}
