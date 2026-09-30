import * as educationRepository from "../repository/education.repository.js";

export const getAllEducation = async () => {
    return educationRepository.findAllEducation();
};

export const getEducationById = async (id: string) => {
    const education = await educationRepository.findEducationById(id);

    if (!education) {
        throw new Error("EDUCATION_NOT_FOUND");
    }

    return education;
};

export const addEducation = async (data: {
    level: "TENTH" | "TWELFTH" | "DIPLOMA" | "BACHELOR" | "MASTER" | "PHD";
    institutionType: "SCHOOL" | "COLLEGE" | "UNIVERSITY" | "INSTITUTE";
    institutionName: string;
    field?: string;
    boardOrUniversity?: string;
    startDate?: Date;
    endDate?: Date;
    scoreType?: "CGPA" | "PERCENTAGE";
    score?: number;
    description?: string;
    isVisible?: boolean;
    order?: number;
}) => {
    if (!data.institutionName.trim()) {
        throw new Error("INSTITUTION_NAME_REQUIRED");
    }

    if (data.score !== undefined && data.score < 0) {
        throw new Error("INVALID_SCORE");
    }

    return educationRepository.createEducation(data);
};

export const updateEducation = async (
    id: string,
    data: {
        level?: "TENTH" | "TWELFTH" | "DIPLOMA" | "BACHELOR" | "MASTER" | "PHD";
        institutionType?: "SCHOOL" | "COLLEGE" | "UNIVERSITY" | "INSTITUTE";
        institutionName?: string;
        field?: string;
        boardOrUniversity?: string;
        startDate?: Date;
        endDate?: Date;
        scoreType?: "CGPA" | "PERCENTAGE";
        score?: number;
        description?: string;
        isVisible?: boolean;
        order?: number;
    }
) => {
    const existingEducation =
        await educationRepository.findEducationById(id);

    if (!existingEducation) {
        throw new Error("EDUCATION_NOT_FOUND");
    }

    if (
        data.institutionName !== undefined &&
        !data.institutionName.trim()
    ) {
        throw new Error("INSTITUTION_NAME_REQUIRED");
    }

    if (data.score !== undefined && data.score < 0) {
        throw new Error("INVALID_SCORE");
    }

    return educationRepository.updateEducation(id, data);
};

export const removeEducation = async (id: string) => {
    const education = await educationRepository.findEducationById(id);

    if (!education) {
        throw new Error("EDUCATION_NOT_FOUND");
    }

    return educationRepository.deleteEducation(id);
};

export const setEducationVisibility = async (
    id: string,
    isVisible: boolean
) => {
    const education = await educationRepository.findEducationById(id);

    if (!education) {
        throw new Error("EDUCATION_NOT_FOUND");
    }

    return educationRepository.updateEducationVisibility(
        id,
        isVisible
    );
};