import type { Request, Response } from "express";
import type { SectionType } from "@prisma/client";

import {
    addSection,
    editSection,
    getAllSections,
    getSectionById,
    removeSection,
    setSectionOrder,
    setSectionVisibility,
} from "../services/section.service.js";


const parseBoolean = (
    value: unknown
): boolean | undefined => {
    if (value === undefined) {
        return undefined;
    }

    if (value === true || value === "true") {
        return true;
    }

    if (value === false || value === "false") {
        return false;
    }

    throw new Error("INVALID_BOOLEAN_VALUE");
};

const parseNumber = (
    value: unknown
): number | undefined => {
    if (value === undefined) {
        return undefined;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed)) {
        throw new Error("INVALID_NUMBER_VALUE");
    }

    return parsed;
};

const parseSectionType = (
    value: unknown
): SectionType | undefined => {
    if (value === undefined) {
        return undefined;
    }

    const allowedTypes = [
        "HOME",
        "SKILLS",
        "PROJECTS",
        "EXPERIENCE",
        "EDUCATION",
        "ACHIEVEMENTS",
        "CERTIFICATIONS",
        "CONTACT",
        "CUSTOM",
    ] as const;

    if (
        typeof value !== "string" ||
        !allowedTypes.includes(
            value as (typeof allowedTypes)[number]
        )
    ) {
        throw new Error("INVALID_SECTION_TYPE");
    }

    return value as SectionType;
};

export const getAllSectionsController = async (
    _req: Request,
    res: Response
) => {
    const sections = await getAllSections();

    return res.status(200).json({
        success: true,
        data: sections,
    });
};

export const getSectionByIdController = async (
    req: Request,
    res: Response
) => {
    const id = req.params.id;
    if (typeof id !== "string") throw new Error("Id must be a string");
    const section = await getSectionById(id);

    return res.status(200).json({
        success: true,
        data: section,
    });
};

export const createSectionController = async (
    req: Request,
    res: Response
) => {
    const {
        name,
        slug,
        type,
    } = req.body;

    const isVisible = parseBoolean(req.body.isVisible);
    const order = parseNumber(req.body.order);
    const sectionType = parseSectionType(type);

    if (!name || typeof name !== "string") {
        throw new Error("SECTION_NAME_REQUIRED");
    }

    if (!slug || typeof slug !== "string") {
        throw new Error("SECTION_SLUG_REQUIRED");
    }

    if (!sectionType) {
        throw new Error("SECTION_TYPE_REQUIRED");
    }

    const section = await addSection({
        name,
        slug,
        type: sectionType,
        ...(isVisible !== undefined && {
            isVisible,
        }),
        ...(order !== undefined && {
            order,
        }),
    });

    return res.status(201).json({
        success: true,
        data: section,
    });
};

export const updateSectionController = async (
    req: Request,
    res: Response
) => {
    const {
        name,
        slug,
        type,
    } = req.body;
    const id = req.params.id;

    const isVisible = parseBoolean(req.body.isVisible);
    const order = parseNumber(req.body.order);
    const sectionType = parseSectionType(type);

    if (typeof id !== "string") throw new Error("Id must be a string");
    const section = await editSection(
        id,
        {
            ...(name !== undefined && { name }),
            ...(slug !== undefined && { slug }),
            ...(sectionType !== undefined && {
                type: sectionType,
            }),
            ...(isVisible !== undefined && {
                isVisible,
            }),
            ...(order !== undefined && {
                order,
            }),
        }
    );

    return res.status(200).json({
        success: true,
        data: section,
    });
};

export const deleteSectionController = async (
    req: Request,
    res: Response
) => {
    const id = req.params.id;
    if (typeof id !== "string") throw new Error("Id must be a string");
    await removeSection(id);

    return res.status(200).json({
        success: true,
        message: "SECTION_DELETED",
    });
};

export const updateSectionVisibilityController =
    async (req: Request, res: Response) => {

        const id = req.params.id;
        if (typeof id !== "string") throw new Error("Id must be a string");

        const isVisible = parseBoolean(
            req.body.isVisible
        );

        if (isVisible === undefined) {
            throw new Error("IS_VISIBLE_REQUIRED");
        }

        const section = await setSectionVisibility(
            id,
            isVisible
        );

        return res.status(200).json({
            success: true,
            data: section,
        });
    };

export const updateSectionOrderController =
    async (req: Request, res: Response) => {
        const id = req.params.id;
        if (typeof id !== "string") throw new Error("Id must be a string");

        const order = parseNumber(req.body.order);

        if (order === undefined) {
            throw new Error("ORDER_REQUIRED");
        }

        const section = await setSectionOrder(
            id,
            order
        );

        return res.status(200).json({
            success: true,
            data: section,
        });
    };