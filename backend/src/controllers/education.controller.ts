import type { Request, Response } from "express";
import {
    getAllEducation,
    getEducationById,
    addEducation,
    updateEducation,
    removeEducation,
    setEducationVisibility,
} from "../services/education.service.js";

const EDUCATION_LEVELS = [
    "TENTH",
    "TWELFTH",
    "DIPLOMA",
    "BACHELOR",
    "MASTER",
    "PHD",
] as const;

const INSTITUTION_TYPES = [
    "SCHOOL",
    "COLLEGE",
    "UNIVERSITY",
    "INSTITUTE",
] as const;

const SCORE_TYPES = ["CGPA", "PERCENTAGE"] as const;


export const getAllEducationController = async (
    _req: Request,
    res: Response
) => {
    try {
        const education = await getAllEducation();

        return res.status(200).json({
            success: true,
            data: education,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch education",
        });
    }
};

export const getEducationByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Education ID is required",
            });
        }
        if(typeof id !=="string") throw new Error("Id must be a string")
        const education = await getEducationById(id);

        return res.status(200).json({
            success: true,
            data: education,
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "EDUCATION_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Education not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to fetch education",
        });
    }
};

export const createEducationController = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            level,
            institutionType,
            institutionName,
            field,
            boardOrUniversity,
            startDate,
            endDate,
            scoreType,
            score,
            description,
            isVisible,
            order,
        } = req.body;

        if (!level || !EDUCATION_LEVELS.includes(level)) {
            return res.status(400).json({
                success: false,
                message: "Valid education level is required",
            });
        }

        if (
            !institutionType ||
            !INSTITUTION_TYPES.includes(institutionType)
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid institution type is required",
            });
        }

        if (!institutionName?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Institution name is required",
            });
        }

        if (
            scoreType !== undefined &&
            !SCORE_TYPES.includes(scoreType)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid score type",
            });
        }

        const parsedScore =
            score !== undefined && score !== ""
                ? Number(score)
                : undefined;

        if (
            parsedScore !== undefined &&
            (Number.isNaN(parsedScore) || parsedScore < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid score",
            });
        }

        const education = await addEducation({
            level,
            institutionType,
            institutionName,
            ...(field !== undefined && { field }),
            ...(boardOrUniversity !== undefined && {
                boardOrUniversity,
            }),
            ...(startDate !== undefined &&
                startDate !== "" && {
                startDate: new Date(startDate),
            }),
            ...(endDate !== undefined &&
                endDate !== "" && {
                endDate: new Date(endDate),
            }),
            ...(scoreType !== undefined && { scoreType }),
            ...(parsedScore !== undefined && {
                score: parsedScore,
            }),
            ...(description !== undefined && { description }),
            ...(isVisible !== undefined && {
                isVisible:
                    isVisible === true || isVisible === "true",
            }),
            ...(order !== undefined && {
                order: Number(order),
            }),
        });

        return res.status(201).json({
            success: true,
            data: education,
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "INSTITUTION_NAME_REQUIRED"
        ) {
            return res.status(400).json({
                success: false,
                message: "Institution name is required",
            });
        }

        if (
            error instanceof Error &&
            error.message === "INVALID_SCORE"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid score",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create education",
        });
    }
};

export const updateEducationController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        if(typeof id !=="string") throw new Error("Id must be a string")
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Education ID is required",
            });
        }

        const {
            level,
            institutionType,
            institutionName,
            field,
            boardOrUniversity,
            startDate,
            endDate,
            scoreType,
            score,
            description,
            isVisible,
            order,
        } = req.body;

        if (
            level !== undefined &&
            !EDUCATION_LEVELS.includes(level)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid education level",
            });
        }

        if (
            institutionType !== undefined &&
            !INSTITUTION_TYPES.includes(institutionType)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid institution type",
            });
        }

        if (
            scoreType !== undefined &&
            !SCORE_TYPES.includes(scoreType)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid score type",
            });
        }

        const parsedScore =
            score !== undefined && score !== ""
                ? Number(score)
                : undefined;

        if (
            parsedScore !== undefined &&
            (Number.isNaN(parsedScore) || parsedScore < 0)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid score",
            });
        }

        const education = await updateEducation(id, {
            ...(level !== undefined && { level }),
            ...(institutionType !== undefined && {
                institutionType,
            }),
            ...(institutionName !== undefined && {
                institutionName,
            }),
            ...(field !== undefined && { field }),
            ...(boardOrUniversity !== undefined && {
                boardOrUniversity,
            }),
            ...(startDate !== undefined &&
                startDate !== "" && {
                startDate: new Date(startDate),
            }),
            ...(endDate !== undefined &&
                endDate !== "" && {
                endDate: new Date(endDate),
            }),
            ...(scoreType !== undefined && { scoreType }),
            ...(parsedScore !== undefined && {
                score: parsedScore,
            }),
            ...(description !== undefined && { description }),
            ...(isVisible !== undefined && {
                isVisible:
                    isVisible === true || isVisible === "true",
            }),
            ...(order !== undefined && {
                order: Number(order),
            }),
        });

        return res.status(200).json({
            success: true,
            data: education,
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "EDUCATION_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Education not found",
            });
        }

        if (
            error instanceof Error &&
            error.message === "INSTITUTION_NAME_REQUIRED"
        ) {
            return res.status(400).json({
                success: false,
                message: "Institution name is required",
            });
        }

        if (
            error instanceof Error &&
            error.message === "INVALID_SCORE"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid score",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update education",
        });
    }
};

export const deleteEducationController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        if(typeof id !=="string") throw new Error("Id must be a string")
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Education ID is required",
            });
        }

        await removeEducation(id);

        return res.status(200).json({
            success: true,
            message: "Education deleted successfully",
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "EDUCATION_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Education not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to delete education",
        });
    }
};

export const updateEducationVisibilityController = async (
    req: Request,
    res: Response
) => {
    try {
        const { id } = req.params;
        if(typeof id !=="string") throw new Error("Id must be a string")
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Education ID is required",
            });
        }

        const { isVisible } = req.body;

        if (typeof isVisible !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isVisible must be a boolean",
            });
        }

        const education = await setEducationVisibility(
            id,
            isVisible
        );

        return res.status(200).json({
            success: true,
            data: education,
        });
    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "EDUCATION_NOT_FOUND"
        ) {
            return res.status(404).json({
                success: false,
                message: "Education not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update education visibility",
        });
    }
};