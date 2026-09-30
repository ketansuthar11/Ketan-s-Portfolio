import * as skillRepository from "../repository/skill.repository.js";

export const getAllSkills = async () => {
    return skillRepository.findAllSkills();
};

export const getSkillById = async (id: string) => {
    const skill = await skillRepository.findSkillById(id);

    if (!skill) {
        throw new Error("SKILL_NOT_FOUND");
    }

    return skill;
};

export const addSkill = async (data: {
    category: string;
    name: string;
    icon?: string;
    level?: number;
    isVisible?: boolean;
    order?: number;
}) => {
    if (!data.category.trim()) {
        throw new Error("CATEGORY_REQUIRED");
    }

    if (!data.name.trim()) {
        throw new Error("SKILL_NAME_REQUIRED");
    }

    if (
        data.level !== undefined &&
        (data.level < 0 || data.level > 100)
    ) {
        throw new Error("INVALID_LEVEL");
    }

    return skillRepository.createSkill(data);
};

export const updateSkill = async (
    id: string,
    data: {
        category?: string;
        name?: string;
        icon?: string;
        level?: number;
        isVisible?: boolean;
        order?: number;
    }
) => {
    const existingSkill = await skillRepository.findSkillById(id);

    if (!existingSkill) {
        throw new Error("SKILL_NOT_FOUND");
    }

    if (
        data.category !== undefined &&
        !data.category.trim()
    ) {
        throw new Error("CATEGORY_REQUIRED");
    }

    if (
        data.name !== undefined &&
        !data.name.trim()
    ) {
        throw new Error("SKILL_NAME_REQUIRED");
    }

    if (
        data.level !== undefined &&
        (data.level < 0 || data.level > 100)
    ) {
        throw new Error("INVALID_LEVEL");
    }

    return skillRepository.updateSkill(id, data);
};

export const removeSkill = async (id: string) => {
    const skill = await skillRepository.findSkillById(id);

    if (!skill) {
        throw new Error("SKILL_NOT_FOUND");
    }

    return skillRepository.deleteSkill(id);
};

export const setSkillVisibility = async (
    id: string,
    isVisible: boolean
) => {
    const skill = await skillRepository.findSkillById(id);

    if (!skill) {
        throw new Error("SKILL_NOT_FOUND");
    }

    return skillRepository.updateSkillVisibility(
        id,
        isVisible
    );
};