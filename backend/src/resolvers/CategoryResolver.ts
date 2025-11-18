import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Category } from "../entities/Category";
import { CategoryService } from "../services/category.service";
import { CategoryDto } from "../dtos/category.dto";

@Resolver(Category)
export default class CategoryResolver {
  private service = new CategoryService();

  @Query(() => [Category])
  async getAllCategories(): Promise<Category[]> {
    return this.service.getAll();
  }

  @Query(() => Category)
  async getCategoryById(@Arg("id", () => ID) id: number): Promise<Category> {
    return this.service.getById(id);
  }

  @Mutation(() => Category)
  async createCategory(
    @Arg("data") data: CategoryDto
  ): Promise<Category> {
    return this.service.create(data.name);
  }

  @Mutation(() => Category)
  async updateCategory(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: CategoryDto
  ): Promise<Category> {
    return this.service.update(id, data.name);
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @Arg("id", () => ID) id: number
  ): Promise<boolean> {
    return this.service.delete(id);
  }
}