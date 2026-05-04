import { Role } from "../entities/Role";
import { RoleInput } from "../dtos/role.dto";
import { Errors } from "../errors/errors";

/**
 * Service responsible for managing user roles (e.g., admin, customer).
 * Handles CRUD operations with duplicate name prevention.
 */
export class RoleService {

  /**
   * Creates a new role with a normalized (trimmed, lowercase) name.
   * @param data - The role input containing the role name
   * @returns The newly created role
   * @throws AlreadyExistsError if a role with the same name already exists
   */
  async createRole(data: RoleInput): Promise<Role> {
    const roleName = data.roleName.trim().toLowerCase();
    const exists = await Role.findOne({ where: { roleName: roleName } });
    if (exists) throw Errors.alreadyExists("Role");

    const role = Role.create({ roleName });
    await role.save();
    return role;
  }

  /**
   * Deletes a role by its ID.
   * @param id - The role ID to delete
   * @returns true if the role was successfully deleted
   * @throws NotFoundError if the role does not exist
   */
  async deleteRole(id: number): Promise<boolean> {
    const role = await Role.findOne({ where: { id } });
    if (!role) throw Errors.notFound("Role");

    await Role.remove(role);
    return true;
  }

  /**
   * Retrieves all roles sorted alphabetically by name.
   * @returns Array of all roles
   */
  async getAllRoles(): Promise<Role[]> {
    const roles = await Role.find({ order: { roleName: "ASC" } });
    return roles;
  }

  /**
   * Retrieves a single role by its ID.
   * @param id - The role ID
   * @returns The matching role
   * @throws NotFoundError if no role exists with the given ID
   */
  async getRoleById(id: number): Promise<Role> {
    const role = await Role.findOne({ where: { id } });
    if (!role) throw Errors.notFound("Role");
    return role;
  }

  /**
   * Updates an existing role's name.
   * @param id - The role ID to update
   * @param data - The new role data containing the role name
   * @returns The updated role
   * @throws NotFoundError if the role does not exist
   * @throws AlreadyExistsError if another role with the same name already exists
   */
  async updateRole(id: number, data: RoleInput): Promise<Role> {
    const role = await Role.findOne({ where: { id } });
    if (!role) throw Errors.notFound("Role");

    const roleName = data.roleName.trim().toLowerCase();

    const exists = await Role.findOne({ where: { roleName } });
    if (exists && exists.id !== id) throw Errors.alreadyExists("Role");

    role.roleName = roleName;
    await role.save();
    return role;
  }
}
