import type { Prisma } from "@prisma/client";
import type { Request, Response } from "express";

import {
    getAllExperiences,
    getExperienceById,
    addExperience,
    updateExperience,
    removeExperience,
    setExperienceVisibility,
} from "../services/experience.service.js";



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

const parseResponsibilities = (
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
            throw new Error("INVALID_RESPONSIBILITIES");
        }
    }

    throw new Error("INVALID_RESPONSIBILITIES");
};

export const getAllExperiencesController = async (
    _req: Request,
    res: Response
) => {
    try {
        const experiences = await getAllExperiences();

        return res.status(200).json({
            success: true,
            data: experiences,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch experiences",
        });
    }
};

export const getExperienceByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        if(typeof id !=="string") throw new Error("Id must be a string")
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Experience ID is required",
            });
        }

        const experience = await getExperienceById(id);

        return res.status(200).json({
            success: true,
            data: experience,
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "EXPERIENCE_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Experience not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to fetch experience",
        });
    }
};

export const createExperienceController = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            company,
            role,
            location,
            description,
            startDate: rawStartDate,
            endDate: rawEndDate,
            isCurrent: rawIsCurrent,
            isVisible: rawIsVisible,
            order: rawOrder,
            responsibilities: rawResponsibilities,
        } = req.body;

        if (!company?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Company is required",
            });
        }

        if (!role?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Role is required",
            });
        }

        if (!rawStartDate) {
            return res.status(400).json({
                success: false,
                message: "Start date is required",
            });
        }

        const startDate = parseDate(rawStartDate);

        if (!startDate) {
            return res.status(400).json({
                success: false,
                message: "Start date is required",
            });
        }

        const endDate = parseDate(rawEndDate);
        const isCurrent = parseBoolean(rawIsCurrent);
        const isVisible = parseBoolean(rawIsVisible);
        const order = parseNumber(rawOrder);

        const responsibilities =
            parseResponsibilities(rawResponsibilities);

        const experience = await addExperience({
            company,
            role,

            ...(location !== undefined && {
                location,
            }),

            startDate,

            ...(endDate !== undefined && {
                endDate,
            }),

            isCurrent: isCurrent ?? false,

            ...(description !== undefined && {
                description,
            }),

            ...(responsibilities !== undefined && {
                responsibilities,
            }),

            isVisible: isVisible ?? true,

            order: order ?? 0,
        });

        return res.status(201).json({
            success: true,
            data: experience,
        });
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            switch (error.message) {
                case "COMPANY_REQUIRED":
                    return res.status(400).json({
                        success: false,
                        message: "Company is required",
                    });

                case "ROLE_REQUIRED":
                    return res.status(400).json({
                        success: false,
                        message: "Role is required",
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

                case "INVALID_RESPONSIBILITIES":
                    return res.status(400).json({
                        success: false,
                        message:
                            "Responsibilities must be a valid JSON array",
                    });

                case "END_DATE_BEFORE_START_DATE":
                    return res.status(400).json({
                        success: false,
                        message:
                            "End date cannot be before start date",
                    });
            }
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create experience",
        });
    }
};

export const updateExperienceController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        if(typeof id !=="string") throw new Error("Id must be a string")
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Experience ID is required",
            });
        }

        const {
            company,
            role,
            location,
            description,
            startDate: rawStartDate,
            endDate: rawEndDate,
            isCurrent: rawIsCurrent,
            isVisible: rawIsVisible,
            order: rawOrder,
            responsibilities: rawResponsibilities,
        } = req.body;

        const startDate = parseDate(rawStartDate);

        // undefined = don't update
        // null = clear the existing end date
        const endDate =
            rawEndDate === null
                ? null
                : parseDate(rawEndDate);

        const isCurrent = parseBoolean(rawIsCurrent);
        const isVisible = parseBoolean(rawIsVisible);
        const order = parseNumber(rawOrder);

        const responsibilities =
            parseResponsibilities(rawResponsibilities);

        const experience = await updateExperience(id, {
            ...(company !== undefined && {
                company,
            }),

            ...(role !== undefined && {
                role,
            }),

            ...(location !== undefined && {
                location,
            }),

            ...(startDate !== undefined && {
                startDate,
            }),

            ...(endDate !== undefined && {
                endDate,
            }),

            ...(isCurrent !== undefined && {
                isCurrent,
            }),

            ...(description !== undefined && {
                description,
            }),

            ...(responsibilities !== undefined && {
                responsibilities,
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
            data: experience,
        });
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            switch (error.message) {
                case "EXPERIENCE_NOT_FOUND":
                    return res.status(404).json({
                        success: false,
                        message: "Experience not found",
                    });

                case "COMPANY_REQUIRED":
                    return res.status(400).json({
                        success: false,
                        message: "Company is required",
                    });

                case "ROLE_REQUIRED":
                    return res.status(400).json({
                        success: false,
                        message: "Role is required",
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

                case "INVALID_RESPONSIBILITIES":
                    return res.status(400).json({
                        success: false,
                        message:
                            "Responsibilities must be a valid JSON array",
                    });

                case "END_DATE_BEFORE_START_DATE":
                    return res.status(400).json({
                        success: false,
                        message:
                            "End date cannot be before start date",
                    });
            }
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update experience",
        });
    }
};

export const deleteExperienceController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        if(typeof id !=="string") throw new Error("Id must be a string")
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Experience ID is required",
            });
        }

        await removeExperience(id);

        return res.status(200).json({
            success: true,
            message: "Experience deleted successfully",
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "EXPERIENCE_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Experience not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to delete experience",
        });
    }
};

export const updateExperienceVisibilityController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        if(typeof id !=="string") throw new Error("Id must be a string")
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Experience ID is required",
            });
        }

        const { isVisible } = req.body;

        if (typeof isVisible !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isVisible must be a boolean",
            });
        }

        const experience =
            await setExperienceVisibility(
                id,
                isVisible
            );

        return res.status(200).json({
            success: true,
            data: experience,
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "EXPERIENCE_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Experience not found",
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Failed to update experience visibility",
        });
    }
};