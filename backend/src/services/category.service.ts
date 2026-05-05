import { CategoryInput } from "../dtos/category.dto";
import { Category } from "../entities/Category";
import { Errors } from "../errors/errors";

/**
 * Service responsible for managing equipment categories.
 * Handles CRUD operations with duplicate name prevention.
 */
export class CategoryService {

  /**
   * Retrieves all categories sorted alphabetically by name.
   * @returns Array of all categories
   */
  async getAllCategories(): Promise<Category[]> {
    return Category.find({ order: { name: "ASC" as const } });
  }

  /**
   * Retrieves a single category by its ID.
   * @param id - The category ID
   * @returns The matching category
   * @throws NotFoundError if no category exists with the given ID
   */
  async getCategoryById(id: number): Promise<Category> {
    const cat = await Category.findOne({ where: { id } });
    if (!cat) throw Errors.notFound("Category");
    return cat;
  }

  /**
   * Creates a new category with a normalized (trimmed, lowercase) name.
   * @param data - The category input containing name and optional image
   * @returns The newly created category
   * @throws AlreadyExistsError if a category with the same name already exists
   */
  async createCategory(data: CategoryInput): Promise<Category> {
    const name = data.name.trim().toLowerCase();

    const exists = await Category.findOne({ where: { name } });
    if (exists) throw Errors.alreadyExists("Category");

    const newCat = Category.create({ name, image: data.image });
    await newCat.save();
    return newCat;
  }

  /**
   * Updates an existing category's name and/or image.
   * @param id - The category ID to update
   * @param data - The new category data (name, image)
   * @returns The updated category
   * @throws NotFoundError if the category does not exist
   * @throws AlreadyExistsError if another category with the same name already exists
   */
  async updateCategory(id: number, data: CategoryInput): Promise<Category> {
    const cat = await Category.findOne({ where: { id } });
    if (!cat) throw Errors.notFound("Category");

    const name = data.name.trim().toLowerCase();
    const duplicate = await Category.findOne({ where: { name } });
    if (duplicate && duplicate.id !== id) {
      throw Errors.alreadyExists("Category");
    }

    cat.name = name;
    if (data.image !== undefined) cat.image = data.image;
    await cat.save();
    return cat;
  }

  /**
   * Deletes a category by its ID.
   * @param id - The category ID to delete
   * @returns true if the category was successfully deleted
   * @throws NotFoundError if the category does not exist
   */
  async deleteCategory(id: number): Promise<boolean> {
    const cat = await Category.findOne({ where: { id } });
    if (!cat) throw Errors.notFound("Category");

    await Category.remove(cat);
    return true;
  }
}
