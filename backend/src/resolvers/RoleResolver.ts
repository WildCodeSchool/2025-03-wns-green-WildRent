import { Arg, Authorized, ID, Mutation, Query, Resolver } from "type-graphql";
import { Role } from "../entities/Role";
import { RoleService } from "../services/role.service";
import { RoleInput } from "../dtos/role.dto";

@Resolver(Role)
export default class RoleResolver {

    private readonly roleService = new RoleService();
    
    @Authorized("admin")
    @Mutation(() => Role)
    async createRole(@Arg("data") data: RoleInput): Promise<Role> {
        return this.roleService.createRole(data);
    }
    
    @Authorized("admin")
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
    
    @Authorized("admin")
    @Mutation(() => Role)
    async updateRole(@Arg("id", () => ID) id: number,@Arg("data") data: RoleInput): Promise<Role> {
        return this.roleService.updateRole(id, data);
    }

}