import type { Request, Response } from "express";
import {
    getAllSkills,
    getSkillById,
    addSkill,
    updateSkill,
    removeSkill,
    setSkillVisibility,
} from "../services/skill.service.js";


export const getAllSkillsController = async (
    _req: Request,
    res: Response
) => {
    try {
        const skills = await getAllSkills();

        return res.status(200).json({
            success: true,
            data: skills,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch skills",
        });
    }
};

export const getSkillByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        if(typeof id !=="string") throw new Error("Id must be a string")
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Skill ID is required",
            });
        }

        const skill = await getSkillById(id);

        return res.status(200).json({
            success: true,
            data: skill,
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "SKILL_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to fetch skill",
        });
    }
};

export const createSkillController = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            category,
            name,
            icon,
            level,
            isVisible,
            order,
        } = req.body;

        if (!category?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Category is required",
            });
        }

        if (!name?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Skill name is required",
            });
        }

        const parsedLevel =
            level !== undefined && level !== ""
                ? Number(level)
                : undefined;

        if (
            parsedLevel !== undefined &&
            (Number.isNaN(parsedLevel) ||
                parsedLevel < 0 ||
                parsedLevel > 100)
        ) {
            return res.status(400).json({
                success: false,
                message: "Level must be between 0 and 100",
            });
        }

        const parsedOrder =
            order !== undefined && order !== ""
                ? Number(order)
                : undefined;

        const skill = await addSkill({
            category,
            name,
            ...(icon !== undefined && { icon }),
            ...(parsedLevel !== undefined && {
                level: parsedLevel,
            }),
            ...(isVisible !== undefined && {
                isVisible:
                    isVisible === true ||
                    isVisible === "true",
            }),
            ...(parsedOrder !== undefined && {
                order: parsedOrder,
            }),
        });

        return res.status(201).json({
            success: true,
            data: skill,
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "CATEGORY_REQUIRED"
        ) {
            return res.status(400).json({
                success: false,
                message: "Category is required",
            });
        }

        if (
            error instanceof Error &&
            error.message === "SKILL_NAME_REQUIRED"
        ) {
            return res.status(400).json({
                success: false,
                message: "Skill name is required",
            });
        }

        if (
            error instanceof Error &&
            error.message === "INVALID_LEVEL"
        ) {
            return res.status(400).json({
                success: false,
                message: "Level must be between 0 and 100",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create skill",
        });
    }
};

export const updateSkillController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        if(typeof id !=="string") throw new Error("Id must be a string")
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Skill ID is required",
            });
        }

        const {
            category,
            name,
            icon,
            level,
            isVisible,
            order,
        } = req.body;

        const parsedLevel =
            level !== undefined && level !== ""
                ? Number(level)
                : undefined;

        if (
            parsedLevel !== undefined &&
            (Number.isNaN(parsedLevel) ||
                parsedLevel < 0 ||
                parsedLevel > 100)
        ) {
            return res.status(400).json({
                success: false,
                message: "Level must be between 0 and 100",
            });
        }

        const parsedOrder =
            order !== undefined && order !== ""
                ? Number(order)
                : undefined;

        const skill = await updateSkill(id, {
            ...(category !== undefined && { category }),
            ...(name !== undefined && { name }),
            ...(icon !== undefined && { icon }),
            ...(parsedLevel !== undefined && {
                level: parsedLevel,
            }),
            ...(isVisible !== undefined && {
                isVisible:
                    isVisible === true ||
                    isVisible === "true",
            }),
            ...(parsedOrder !== undefined && {
                order: parsedOrder,
            }),
        });

        return res.status(200).json({
            success: true,
            data: skill,
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "SKILL_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
            });
        }

        if (
            error instanceof Error &&
            error.message === "CATEGORY_REQUIRED"
        ) {
            return res.status(400).json({
                success: false,
                message: "Category is required",
            });
        }

        if (
            error instanceof Error &&
            error.message === "SKILL_NAME_REQUIRED"
        ) {
            return res.status(400).json({
                success: false,
                message: "Skill name is required",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update skill",
        });
    }
};

export const deleteSkillController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        
        if(typeof id !=="string") throw new Error("Id must be a string")

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Skill ID is required",
            });
        }

        await removeSkill(id);

        return res.status(200).json({
            success: true,
            message: "Skill deleted successfully",
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "SKILL_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to delete skill",
        });
    }
};

export const updateSkillVisibilityController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;

        if(typeof id !=="string") throw new Error("Id must be a string")

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Skill ID is required",
            });
        }

        const { isVisible } = req.body;

        if (typeof isVisible !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isVisible must be a boolean",
            });
        }

        const skill = await setSkillVisibility(
            id,
            isVisible
        );

        return res.status(200).json({
            success: true,
            data: skill,
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "SKILL_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update skill visibility",
        });
    }
};