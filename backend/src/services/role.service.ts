import { Role } from "../entities/Role";
import { RoleInput } from "../dtos/role.dto";
import { Errors } from "../errors/errors";

export class RoleService {
        
    async createRole(data: RoleInput): Promise<Role> {
        const roleName = data.roleName.trim().toLowerCase();
        const exists = await Role.findOne({ where: { roleName: roleName } });
        if (exists) throw Errors.alreadyExists("Role");

        const role = Role.create({ roleName });
        await role.save();
        return role;
    }
    
    async deleteRole(id: number): Promise<boolean> {
        const role = await Role.findOne({ where: { id } });
        if (!role) throw Errors.notFound("Role");
        
        await Role.remove(role);
        return true;
    }

    async getAllRoles(): Promise<Role[]> {
        const roles = await Role.find({ order: { roleName: "ASC" } });
        return roles;
    }

    async getRoleById(id: number): Promise<Role> {
    const role = await Role.findOne({ where: { id } });
    if (!role) throw Errors.notFound("Role");
    return role;
    }
    
    async updateRole(id: number, data: RoleInput): Promise<Role> {
        const role = await Role.findOne({ where: { id } });
        if (!role) throw Errors.notFound("Role");

        const roleName = data.roleName.trim().toLowerCase();;

        const exists = await Role.findOne({ where: { roleName } });
        if (exists && exists.id !== id) throw Errors.alreadyExists("Role");

        role.roleName = roleName;
        await role.save();
        return role;
    }
    
}   