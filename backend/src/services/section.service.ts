import type { SectionType } from "@prisma/client";
import {
    createSection,
    deleteSection,
    findAllSections,
    findSectionById,
    updateSection,
    updateSectionOrder,
    updateSectionVisibility,
} from "../repository/section.repository.js";

const allowedSectionTypes: SectionType[] = [
    "HOME",
    "SKILLS",
    "PROJECTS",
    "EXPERIENCE",
    "EDUCATION",
    "ACHIEVEMENTS",
    "CERTIFICATIONS",
    "CONTACT",
    "CUSTOM",
];

export const getAllSections = async () => {
    return findAllSections();
};

export const getSectionById = async (id: string) => {
    const section = await findSectionById(id);

    if (!section) {
        throw new Error("SECTION_NOT_FOUND");
    }

    return section;
};

export const addSection = async (data: {
    name: string;
    slug: string;
    type: SectionType;
    isVisible?: boolean;
    order?: number;
}) => {
    const name = data.name.trim();
    const slug = data.slug.trim();

    if (!name) {
        throw new Error("SECTION_NAME_REQUIRED");
    }

    if (!slug) {
        throw new Error("SECTION_SLUG_REQUIRED");
    }

    if (!allowedSectionTypes.includes(data.type)) {
        throw new Error("INVALID_SECTION_TYPE");
    }

    if (data.order !== undefined && data.order < 0) {
        throw new Error("ORDER_CANNOT_BE_NEGATIVE");
    }

    return createSection({
        name,
        slug,
        type: data.type,
        ...(data.isVisible !== undefined && { isVisible: data.isVisible }),
        ...(data.order !== undefined && { order: data.order }),

    });

};

export const editSection = async (
    id: string,
    data: {
        name?: string;
        slug?: string;
        type?: SectionType;
        isVisible?: boolean;
        order?: number;
    }
) => {
    const existingSection = await findSectionById(id);

    if (!existingSection) {
        throw new Error("SECTION_NOT_FOUND");
    }

    if (data.name !== undefined) {
        data.name = data.name.trim();

        if (!data.name) {
            throw new Error("SECTION_NAME_REQUIRED");
        }
    }

    if (data.slug !== undefined) {
        data.slug = data.slug.trim();

        if (!data.slug) {
            throw new Error("SECTION_SLUG_REQUIRED");
        }
    }

    if (
        data.type !== undefined &&
        !allowedSectionTypes.includes(data.type)
    ) {
        throw new Error("INVALID_SECTION_TYPE");
    }

    if (data.order !== undefined && data.order < 0) {
        throw new Error("ORDER_CANNOT_BE_NEGATIVE");
    }

    return updateSection(id, data);
};

export const removeSection = async (id: string) => {
    const existingSection = await findSectionById(id);

    if (!existingSection) {
        throw new Error("SECTION_NOT_FOUND");
    }

    return deleteSection(id);
};

export const setSectionVisibility = async (
    id: string,
    isVisible: boolean
) => {
    const existingSection = await findSectionById(id);

    if (!existingSection) {
        throw new Error("SECTION_NOT_FOUND");
    }

    return updateSectionVisibility(id, isVisible);
};

export const setSectionOrder = async (
    id: string,
    order: number
) => {
    const existingSection = await findSectionById(id);

    if (!existingSection) {
        throw new Error("SECTION_NOT_FOUND");
    }

    if (order < 0) {
        throw new Error("ORDER_CANNOT_BE_NEGATIVE");
    }

    return updateSectionOrder(id, order);
};