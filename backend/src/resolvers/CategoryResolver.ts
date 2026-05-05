import { Arg, Authorized, ID, Mutation, Query, Resolver } from "type-graphql";
import { Category } from "../entities/Category";
import { CategoryService } from "../services/category.service";
import { CategoryInput } from "../dtos/category.dto";

@Resolver(Category)
export default class CategoryResolver {
  private service = new CategoryService();

  @Query(() => [Category])
  async getAllCategories(): Promise<Category[]> {
    return this.service.getAllCategories();
  }

  @Query(() => Category)
  async getCategoryById(@Arg("id", () => ID) id: number): Promise<Category> {
    return this.service.getCategoryById(id);
  }

  @Authorized("admin")
  @Mutation(() => Category)
  async createCategory(
    @Arg("data") data: CategoryInput
  ): Promise<Category> {
    return this.service.createCategory(data);
  }

  @Authorized("admin")
  @Mutation(() => Category)
  async updateCategory(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: CategoryInput
  ): Promise<Category> {
    return this.service.updateCategory(id, data);
  }

  @Authorized("admin")
  @Mutation(() => Boolean)
  async deleteCategory(
    @Arg("id", () => ID) id: number
  ): Promise<boolean> {
    return this.service.deleteCategory(id);
  }
}