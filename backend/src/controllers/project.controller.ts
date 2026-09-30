import type { Prisma } from "@prisma/client";
import type { Request, Response } from "express";

import {
    getAllProjects,
    getProjectById,
    addProject,
    updateProject,
    removeProject,
    setProjectVisibility,
    setProjectFeatured,
} from "../services/project.service.js";


const parseDate = (
    value: unknown
): Date | undefined => {
    if (value === undefined || value === "") {
        return undefined;
    }

    const date = new Date(String(value));

    if (Number.isNaN(date.getTime())) {
        throw new Error("INVALID_DATE");
    }

    return date;
};

const parseBoolean = (
    value: unknown
): boolean | undefined => {
    if (value === undefined || value === "") {
        return undefined;
    }

    if (value === true || value === "true") {
        return true;
    }

    if (value === false || value === "false") {
        return false;
    }

    throw new Error("INVALID_BOOLEAN");
};

const parseNumber = (
    value: unknown
): number | undefined => {
    if (value === undefined || value === "") {
        return undefined;
    }

    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
        throw new Error("INVALID_NUMBER");
    }

    return parsed;
};

const parseJsonArray = (
    value: unknown
): Prisma.InputJsonValue | undefined => {
    if (value === undefined || value === "") {
        return undefined;
    }

    if (Array.isArray(value)) {
        return value as Prisma.InputJsonValue;
    }

    if (typeof value === "string") {
        try {
            const parsed: unknown = JSON.parse(value);

            if (!Array.isArray(parsed)) {
                throw new Error();
            }

            return parsed as Prisma.InputJsonValue;
        } catch {
            throw new Error("INVALID_JSON_ARRAY");
        }
    }

    throw new Error("INVALID_JSON_ARRAY");
};

export const getAllProjectsController = async (
    _req: Request,
    res: Response
) => {
    try {
        const projects = await getAllProjects();

        return res.status(200).json({
            success: true,
            data: projects,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch projects",
        });
    }
};

export const getProjectByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Project ID is required",
            });
        }
        if(typeof id !=="string") throw new Error("Id must be a string");

        const project = await getProjectById(id);

        return res.status(200).json({
            success: true,
            data: project,
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "PROJECT_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to fetch project",
        });
    }
};

export const createProjectController = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            title,
            slug,
            description,
            githubUrl,
            liveUrl,
            imageUrl,
        } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        if (!slug?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Slug is required",
            });
        }

        const startDate = parseDate(
            req.body.startDate
        );

        const endDate = parseDate(
            req.body.endDate
        );

        const isFeatured = parseBoolean(
            req.body.isFeatured
        );

        const isVisible = parseBoolean(
            req.body.isVisible
        );

        const order = parseNumber(
            req.body.order
        );

        const technologies = parseJsonArray(
            req.body.technologies
        );

        const features = parseJsonArray(
            req.body.features
        );

        const project = await addProject({
            title,
            slug,

            ...(description !== undefined && {
                description,
            }),

            ...(startDate !== undefined && {
                startDate,
            }),

            ...(endDate !== undefined && {
                endDate,
            }),

            ...(githubUrl !== undefined && {
                githubUrl,
            }),

            ...(liveUrl !== undefined && {
                liveUrl,
            }),

            ...(imageUrl !== undefined && {
                imageUrl,
            }),

            ...(technologies !== undefined && {
                technologies,
            }),

            ...(features !== undefined && {
                features,
            }),

            isFeatured: isFeatured ?? false,
            isVisible: isVisible ?? true,
            order: order ?? 0,
        });

        return res.status(201).json({
            success: true,
            data: project,
        });
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            switch (error.message) {
                case "TITLE_REQUIRED":
                    return res.status(400).json({
                        success: false,
                        message: "Title is required",
                    });

                case "SLUG_REQUIRED":
                    return res.status(400).json({
                        success: false,
                        message: "Slug is required",
                    });

                case "INVALID_DATE":
                case "INVALID_START_DATE":
                case "INVALID_END_DATE":
                    return res.status(400).json({
                        success: false,
                        message: "Invalid date",
                    });

                case "INVALID_BOOLEAN":
                    return res.status(400).json({
                        success: false,
                        message: "Invalid boolean value",
                    });

                case "INVALID_NUMBER":
                    return res.status(400).json({
                        success: false,
                        message: "Invalid number",
                    });

                case "INVALID_JSON_ARRAY":
                    return res.status(400).json({
                        success: false,
                        message:
                            "Technologies and features must be valid JSON arrays",
                    });

                case "END_DATE_BEFORE_START_DATE":
                    return res.status(400).json({
                        success: false,
                        message:
                            "End date cannot be before start date",
                    });
            }
        }

        // Prisma unique constraint
        if (
            error &&
            typeof error === "object" &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return res.status(409).json({
                success: false,
                message: "Project slug already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create project",
        });
    }
};

export const updateProjectController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        if(typeof id !=="string") throw new Error("Id must be a string");
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Project ID is required",
            });
        }

        const {
            title,
            slug,
            description,
            githubUrl,
            liveUrl,
            imageUrl,
        } = req.body;

        const startDate =
            req.body.startDate === null
                ? null
                : parseDate(req.body.startDate);

        const endDate =
            req.body.endDate === null
                ? null
                : parseDate(req.body.endDate);

        const isFeatured = parseBoolean(
            req.body.isFeatured
        );

        const isVisible = parseBoolean(
            req.body.isVisible
        );

        const order = parseNumber(
            req.body.order
        );

        const technologies = parseJsonArray(
            req.body.technologies
        );

        const features = parseJsonArray(
            req.body.features
        );

        const project = await updateProject(id, {
            ...(title !== undefined && {
                title,
            }),

            ...(slug !== undefined && {
                slug,
            }),

            ...(description !== undefined && {
                description,
            }),

            ...(startDate !== undefined && {
                startDate,
            }),

            ...(endDate !== undefined && {
                endDate,
            }),

            ...(githubUrl !== undefined && {
                githubUrl,
            }),

            ...(liveUrl !== undefined && {
                liveUrl,
            }),

            ...(imageUrl !== undefined && {
                imageUrl,
            }),

            ...(technologies !== undefined && {
                technologies,
            }),

            ...(features !== undefined && {
                features,
            }),

            ...(isFeatured !== undefined && {
                isFeatured,
            }),

            ...(isVisible !== undefined && {
                isVisible,
            }),

            ...(order !== undefined && {
                order,
            }),
        });

        return res.status(200).json({
            success: true,
            data: project,
        });
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            switch (error.message) {
                case "PROJECT_NOT_FOUND":
                    return res.status(404).json({
                        success: false,
                        message: "Project not found",
                    });

                case "TITLE_REQUIRED":
                    return res.status(400).json({
                        success: false,
                        message: "Title is required",
                    });

                case "SLUG_REQUIRED":
                    return res.status(400).json({
                        success: false,
                        message: "Slug is required",
                    });

                case "INVALID_DATE":
                case "INVALID_START_DATE":
                case "INVALID_END_DATE":
                    return res.status(400).json({
                        success: false,
                        message: "Invalid date",
                    });

                case "INVALID_BOOLEAN":
                    return res.status(400).json({
                        success: false,
                        message: "Invalid boolean value",
                    });

                case "INVALID_NUMBER":
                    return res.status(400).json({
                        success: false,
                        message: "Invalid number",
                    });

                case "INVALID_JSON_ARRAY":
                    return res.status(400).json({
                        success: false,
                        message:
                            "Technologies and features must be valid JSON arrays",
                    });

                case "END_DATE_BEFORE_START_DATE":
                    return res.status(400).json({
                        success: false,
                        message:
                            "End date cannot be before start date",
                    });
            }
        }

        if (
            error &&
            typeof error === "object" &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return res.status(409).json({
                success: false,
                message: "Project slug already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update project",
        });
    }
};

export const deleteProjectController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        if(typeof id !=="string") throw new Error("Id must be a string");
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Project ID is required",
            });
        }

        await removeProject(id);

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "PROJECT_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to delete project",
        });
    }
};

export const updateProjectVisibilityController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        if(typeof id !=="string") throw new Error("Id must be a string");
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Project ID is required",
            });
        }

        const { isVisible } = req.body;

        if (typeof isVisible !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isVisible must be a boolean",
            });
        }

        const project = await setProjectVisibility(
            id,
            isVisible
        );

        return res.status(200).json({
            success: true,
            data: project,
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "PROJECT_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Failed to update project visibility",
        });
    }
};

export const updateProjectFeaturedController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        if(typeof id !=="string") throw new Error("Id must be a string");
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Project ID is required",
            });
        }

        const { isFeatured } = req.body;

        if (typeof isFeatured !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isFeatured must be a boolean",
            });
        }

        const project = await setProjectFeatured(
            id,
            isFeatured
        );

        return res.status(200).json({
            success: true,
            data: project,
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "PROJECT_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Failed to update project featured status",
        });
    }
};