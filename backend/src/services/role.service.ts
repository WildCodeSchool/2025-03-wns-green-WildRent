import { Role } from "../entities/Role";

export class RoleService {
    
    async createRole(roleName: string): Promise<Role> {
        const exists = await Role.findOne({ where: { roleName } });
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
    
    async updateRole(id: number, newRoleName: string): Promise<Role> {
        const role = await Role.findOne({ where: { id } });
        if (!role) throw new Error("Role not found");
        
        const exists = await Role.findOne({ where: { roleName: newRoleName } });
        if (exists) throw new Error("Role already exists");

        role.roleName = newRoleName;
        await role.save();
        return role;
    }


    
}   