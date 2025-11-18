import { Role } from "../entities/Role";
import { RoleInput } from "../dtos/role.dto";

export class RoleService {
    
    async createRole(data: RoleInput): Promise<Role> {
        const roleName = data.roleName.trim().toLowerCase();
        const exists = await Role.findOne({ where: { roleName: roleName } });
        if (exists) {
            throw new Error("Role already exists");
        }

        const role = Role.create({ roleName });
        await role.save();
        return role;
    }
    
    async deleteRole(id: number): Promise<boolean> {
        const role = await Role.findOne({ where: { id } });
        if (!role) throw new Error("Role not found");
        
        await Role.remove(role);
        return true;
    }

    async getAllRoles(): Promise<Role[]> {
        const roles = await Role.find({ order: { roleName: "ASC" } });
        return roles;
    }

    async getRoleById(id: number): Promise<Role> {
    const role = await Role.findOne({ where: { id } });
    if (!role) throw new Error("Role not found");
    return role;
    }
    
    async updateRole(id: number, data: RoleInput): Promise<Role> {
        const role = await Role.findOne({ where: { id } });
        if (!role) throw new Error("Role not found");

        const roleName = data.roleName.trim().toLowerCase();;

        const exists = await Role.findOne({ where: { roleName } });
        if (exists && exists.id !== id) throw new Error("Role already exists");

        role.roleName = roleName;
        await role.save();
        return role;
    }
    
}   