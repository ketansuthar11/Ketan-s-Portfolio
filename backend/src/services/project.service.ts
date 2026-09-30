import type { Prisma } from "@prisma/client";
import * as projectRepository from "../repository/project.repository.js";

export const getAllProjects = async () => {
    return projectRepository.findAllProjects();
};

export const getProjectById = async (id: string) => {
    const project = await projectRepository.findProjectById(id);

    if (!project) {
        throw new Error("PROJECT_NOT_FOUND");
    }

    return project;
};

export const addProject = async (data: {
    title: string;
    slug: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    githubUrl?: string;
    liveUrl?: string;
    imageUrl?: string;
    technologies?: Prisma.InputJsonValue;
    features?: Prisma.InputJsonValue;
    isFeatured?: boolean;
    isVisible?: boolean;
    order?: number;
}) => {
    if (!data.title.trim()) {
        throw new Error("TITLE_REQUIRED");
    }

    if (!data.slug.trim()) {
        throw new Error("SLUG_REQUIRED");
    }

    const existingProject =
        await projectRepository.findProjectById(data.slug);

    // We don't use findProjectById for slug because
    // that repository method searches by ID.
    // Slug uniqueness is ultimately enforced by Prisma/DB.
    void existingProject;

    if (
        data.startDate !== undefined &&
        Number.isNaN(data.startDate.getTime())
    ) {
        throw new Error("INVALID_START_DATE");
    }

    if (
        data.endDate !== undefined &&
        Number.isNaN(data.endDate.getTime())
    ) {
        throw new Error("INVALID_END_DATE");
    }

    if (
        data.startDate !== undefined &&
        data.endDate !== undefined &&
        data.endDate < data.startDate
    ) {
        throw new Error("END_DATE_BEFORE_START_DATE");
    }

    return projectRepository.createProject(data);
};

export const updateProject = async (
    id: string,
    data: {
        title?: string;
        slug?: string;
        description?: string | null;
        startDate?: Date | null;
        endDate?: Date | null;
        githubUrl?: string | null;
        liveUrl?: string | null;
        imageUrl?: string | null;
        technologies?: Prisma.InputJsonValue;
        features?: Prisma.InputJsonValue;
        isFeatured?: boolean;
        isVisible?: boolean;
        order?: number;
    }
) => {
    const existingProject =
        await projectRepository.findProjectById(id);

    if (!existingProject) {
        throw new Error("PROJECT_NOT_FOUND");
    }

    if (
        data.title !== undefined &&
        !data.title.trim()
    ) {
        throw new Error("TITLE_REQUIRED");
    }

    if (
        data.slug !== undefined &&
        !data.slug.trim()
    ) {
        throw new Error("SLUG_REQUIRED");
    }

    if (
        data.startDate !== undefined &&
        data.startDate !== null &&
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
        data.startDate !== undefined
            ? data.startDate
            : existingProject.startDate;

    const effectiveEndDate =
        data.endDate !== undefined
            ? data.endDate
            : existingProject.endDate;

    if (
        effectiveStartDate !== null &&
        effectiveStartDate !== undefined &&
        effectiveEndDate !== null &&
        effectiveEndDate !== undefined &&
        effectiveEndDate < effectiveStartDate
    ) {
        throw new Error("END_DATE_BEFORE_START_DATE");
    }

    return projectRepository.updateProject(id, data);
};

export const removeProject = async (id: string) => {
    const project = await projectRepository.findProjectById(id);

    if (!project) {
        throw new Error("PROJECT_NOT_FOUND");
    }

    return projectRepository.deleteProject(id);
};

export const setProjectVisibility = async (
    id: string,
    isVisible: boolean
) => {
    const project = await projectRepository.findProjectById(id);

    if (!project) {
        throw new Error("PROJECT_NOT_FOUND");
    }

    return projectRepository.updateProjectVisibility(
        id,
        isVisible
    );
};

export const setProjectFeatured = async (
    id: string,
    isFeatured: boolean
) => {
    const project = await projectRepository.findProjectById(id);

    if (!project) {
        throw new Error("PROJECT_NOT_FOUND");
    }

    return projectRepository.updateProjectFeatured(
        id,
        isFeatured
    );
};