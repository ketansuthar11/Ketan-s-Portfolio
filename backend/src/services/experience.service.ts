import type { Prisma } from "@prisma/client";
import * as experienceRepository from "../repository/experience.repository.js";

export const getAllExperiences = async () => {
    return experienceRepository.findAllExperiences();
};

export const getExperienceById = async (id: string) => {
    const experience =
        await experienceRepository.findExperienceById(id);

    if (!experience) {
        throw new Error("EXPERIENCE_NOT_FOUND");
    }

    return experience;
};

export const addExperience = async (data: {
    company: string;
    role: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    isCurrent?: boolean;
    description?: string;
    responsibilities?: Prisma.InputJsonValue;
    isVisible?: boolean;
    order?: number;
}) => {
    if (!data.company.trim()) {
        throw new Error("COMPANY_REQUIRED");
    }

    if (!data.role.trim()) {
        throw new Error("ROLE_REQUIRED");
    }

    if (Number.isNaN(data.startDate.getTime())) {
        throw new Error("INVALID_START_DATE");
    }

    if (
        data.endDate !== undefined &&
        Number.isNaN(data.endDate.getTime())
    ) {
        throw new Error("INVALID_END_DATE");
    }

    if (
        data.endDate !== undefined &&
        data.endDate < data.startDate
    ) {
        throw new Error("END_DATE_BEFORE_START_DATE");
    }

    return experienceRepository.createExperience(data);
};

export const updateExperience = async (
    id: string,
    data: {
        company?: string;
        role?: string;
        location?: string;
        startDate?: Date;
        endDate?: Date | null;
        isCurrent?: boolean;
        description?: string;
        responsibilities?: Prisma.InputJsonValue;
        isVisible?: boolean;
        order?: number;
    }
) => {
    const existingExperience =
        await experienceRepository.findExperienceById(id);

    if (!existingExperience) {
        throw new Error("EXPERIENCE_NOT_FOUND");
    }

    if (
        data.company !== undefined &&
        !data.company.trim()
    ) {
        throw new Error("COMPANY_REQUIRED");
    }

    if (
        data.role !== undefined &&
        !data.role.trim()
    ) {
        throw new Error("ROLE_REQUIRED");
    }

    if (
        data.startDate !== undefined &&
        Number.isNaN(data.startDate.getTime())
    ) {
        throw new Error("INVALID_START_DATE");
    }

    if (
        data.endDate !== undefined &&
        data.endDate !== null &&
        Number.isNaN(data.endDate.getTime())
    ) {
        throw new Error("INVALID_END_DATE");
    }

    const effectiveStartDate =
        data.startDate ?? existingExperience.startDate;

    const effectiveEndDate =
        data.endDate !== undefined
            ? data.endDate
            : existingExperience.endDate;

    if (
        effectiveEndDate !== null &&
        effectiveEndDate !== undefined &&
        effectiveEndDate < effectiveStartDate
    ) {
        throw new Error("END_DATE_BEFORE_START_DATE");
    }

    return experienceRepository.updateExperience(id, data);
};

export const removeExperience = async (id: string) => {
    const experience =
        await experienceRepository.findExperienceById(id);

    if (!experience) {
        throw new Error("EXPERIENCE_NOT_FOUND");
    }

    return experienceRepository.deleteExperience(id);
};

export const setExperienceVisibility = async (
    id: string,
    isVisible: boolean
) => {
    const experience =
        await experienceRepository.findExperienceById(id);

    if (!experience) {
        throw new Error("EXPERIENCE_NOT_FOUND");
    }

    return experienceRepository.updateExperienceVisibility(
        id,
        isVisible
    );
};