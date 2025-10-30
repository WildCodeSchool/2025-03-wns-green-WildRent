import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Role } from "../entities/Role";
import { RoleService } from "../services/role.service";

@Resolver(Role)
export default class RoleResolver {

    private readonly roleService = new RoleService();
    
    @Mutation(() => Role)
    async createRole(@Arg("roleName") roleName: string): Promise<Role> {
        return this.roleService.createRole(roleName);
    }
    
    @Mutation(() => Boolean)
    async deleteRole(@Arg("id", () => ID) id: number): Promise<boolean> {
        return this.roleService.deleteRole(id);
    }

    @Query(() => [Role])
    async getAllRoles(): Promise<Role[]> {
        return this.roleService.getAllRoles();
    }

    @Query(() => Role)
    async getRoleById(@Arg("id", () => ID) id: number): Promise<Role> {
        return this.roleService.getRoleById(id);
    }
    
    @Mutation(() => Role)
    async updateRole(@Arg("id", () => ID) id: number,@Arg("roleName") roleName: string): Promise<Role> {
        return this.roleService.updateRole(id, roleName);
    }

}