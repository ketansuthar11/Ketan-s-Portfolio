import * as roleRepository from '../repository/role.repository.js'

export const getRoles = async (profileId: string) => {
    return roleRepository.findRolesByProfileId(profileId);
}

export const addRole = async (data: { profileId: string, role: string, isDefault: boolean, order: number }) => {
    if (!data.role || data.role.trim().length === 0) {
        throw new Error("ROLE_REQUIRED");
    }
    return roleRepository.createRoleWithDefault({ ...data, role: data.role.trim() });
}

export const editRole = async (id: string, data: { role: string, order: number }) => {
    const existingRole = await roleRepository.findRoleById(id);
    if (!existingRole) throw new Error("ROLE_NOT_FOUND");
    if (data.role !== undefined && data.role.trim().length === 0) throw new Error("ROLE_REQUIRED");
    return roleRepository.updateRole(id, {...data, role:data.role?.trim()});
}

export const removeRole = async (id: string) => {
    const existingRole = await roleRepository.findRoleById(id);
    if (!existingRole) throw new Error("ROLE_NOT_FOUND");
    return roleRepository.deleteRole(id);
}

export const makeRoleDefault = async (id: string) => {
    if (!id || id.trim().length === 0) {
        throw new Error("ROLE_ID_REQUIRED");
    }
    return roleRepository.setDefaultRole(id);
};