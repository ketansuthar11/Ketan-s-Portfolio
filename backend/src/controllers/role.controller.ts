import type { Request, Response } from "express"
import * as roleService from '../services/role.service.js'

const getRolesController = async (req: Request, res: Response) => {
    try {
        const profileId = req.query.profileId;
        if (!profileId || typeof profileId != "string") {
            return res.status(400).json({
                success: false,
                message: "profileId is required",
            });
        }
        const roles = await roleService.getRoles(profileId);
        return res.status(200).json({ success: true, data: roles });
    }
    catch (err) {
        console.error("Get roles error:", err);
        return res.status(500).json({ success: false, message: "Faild to fetch roles" });
    }
}

const createRoleController = async (req: Request, res: Response) => {
    try {
        const { profileId, role, isDefault, order } = req.body;

        if (!profileId || typeof profileId != "string") {
            return res.status(400).json({
                success: false,
                message: "profileId is required",
            });
        }
        if (!role || typeof role != "string") {
            return res.status(400).json({
                success: false,
                message: "Role is required",
            });
        }
        const newRole = await roleService.addRole({ profileId, role, isDefault, order });
        return res.status(201).json({ success: true, message: "Role created successfully", data: newRole });
    }
    catch (error: any) {
        if (error.message === "PROFILE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        if (error.message === "ROLE_REQUIRED") {
            return res.status(400).json({
                success: false,
                message: "Role is required",
            });
        }
        console.error("Create roles error:", error);
        return res.status(500).json({ success: false, message: "Faild to create role" });
    }
}

const updateRoleController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { role, order } = req.body;
        if(typeof id !=="string") throw new Error("Id must be a string");
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Role id is required",
            });
        }
        const updatedRole = await roleService.editRole(id, { role, order });
        return res.status(200).json({ success: true, message: "Role updated successfully", data: updatedRole });
    }
    catch (error: any) {
        if (error.message === "ROLE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        if (error.message === "ROLE_REQUIRED") {
            return res.status(400).json({
                success: false,
                message: "Role cannot be empty",
            });
        }
        console.error("Update role error:", error);
        return res.status(500).json({ success: false, message: "Faild to update role" });
    }
}

const deleteRoleController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(typeof id !=="string") throw new Error("Id must be a string");
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Role id is required",
            });
        }

        await roleService.removeRole(id);

        return res.status(200).json({
            success: true,
            message: "Role deleted successfully",
        });
    }
    catch (error:any) {
        if (error.message === "ROLE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }
        console.error("Delete role error:", error);
        return res.status(500).json({ success: false, message: "Faild to delete roles" });
    }
}

const setDefaultRoleController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        if(typeof id !=="string") throw new Error("Id must be a string");
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Role id is required",
            });
        }

        const role = await roleService.makeRoleDefault(id);

        return res.status(200).json({
            success: true,
            message: "Default role updated successfully",
            data: role,
        });
    } catch (error: any) {
        if (error.message === "ROLE_ID_REQUIRED") {
            return res.status(400).json({
                success: false,
                message: "Role id is required",
            });
        }

        if (error.message === "ROLE_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        console.error("Set default role error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to set default role",
        });
    }
};

export {
    getRolesController,
    createRoleController,
    updateRoleController,
    deleteRoleController,
    setDefaultRoleController
}