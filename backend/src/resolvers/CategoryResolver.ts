import { Arg, Field, ID, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Category } from "../entities/Category";

@InputType()
class NewCategoryInput implements Partial<Category> {
  @Field()
  name!: string;
}

@InputType()
class UpdateCategoryInput implements Partial<Category> {
  @Field({ nullable: true })
  name?: string;
}
@Resolver(Category)
export default class CategoryResolver {
  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return await Category.find({ order: { name: "ASC" as const } });
  }

  @Query(() => Category)
  async category(@Arg("id", () => ID) id: number): Promise<Category> {
    const cat = await Category.findOne({ where: { id } });
    if (!cat) throw new Error("CATEGORY_NOT_FOUND");
    return cat;
  }

  @Mutation(() => Category)
  async createCategory(@Arg("data") data: NewCategoryInput): Promise<Category> {
    const exists = await Category.findOne({ where: { name: data.name } });
    if (exists) {
      throw new Error("CATEGORY_ALREADY_EXISTS");
    }
    const cat = Category.create({ name: data.name.trim() });
    await cat.save();
    return cat;
  }

  @Mutation(() => Category)
  async updateCategory(
    @Arg("id", () => ID) id: number,
    @Arg("data") data: UpdateCategoryInput
  ): Promise<Category> {
    const cat = await Category.findOne({ where: { id } });
    if (!cat) {
      throw new Error("CATEGORY_NOT_FOUND");
    }
    if (typeof data.name === "string") {
      const newName = data.name.trim();
      if (!newName) {
        throw new Error("INVALID_NAME");
      }

      const duplicate = await Category.findOne({ where: { name: newName } });
      if (duplicate && duplicate.id !== id) {
        throw new Error("CATEGORY_ALREADY_EXISTS");
      }
      cat.name = newName;
    }
    await cat.save();
    return cat;
  }

  @Mutation(() => Boolean)
   async deleteCategory(@Arg("id", () => ID) id: number): Promise<boolean> {
    const cat = await Category.findOne({ where: { id } });
    if (!cat) {
      return false;
    }
    await Category.remove(cat);
    return true;
  }
}
