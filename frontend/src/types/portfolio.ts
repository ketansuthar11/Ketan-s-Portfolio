export type PortfolioRole = {
    id: string;
    profileId: string;
    role: string;
    isDefault: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
};

export type PortfolioProfileImage = {
    id: string;
    profileId: string;
    bucket: string;
    objectKey: string;
    isDefault: boolean;
    createdAt: string;
    /** A temporary URL added by the public portfolio endpoint when available. */
    url: string | null;
};

export type PortfolioResume = {
    id: string;
    profileId: string;
    name: string;
    bucket: string;
    objectKey: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
};

export type PortfolioSocialLink = {
    id: string;
    profileId: string;
    platform: string;
    url: string;
    icon: string | null;
    isVisible: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
};

export type PortfolioProfile = {
    id: string;
    name: string;
    bio: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    roles: PortfolioRole[];
    images: PortfolioProfileImage[];
    resumes: PortfolioResume[];
    socialLinks: PortfolioSocialLink[];
    createdAt: string;
    updatedAt: string;
};

export type PortfolioSkill = {
    id: string;
    category: string;
    name: string;
    icon: string | null;
    level: number | null;
    isVisible: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
};

export type PortfolioExperience = {
    id: string;
    company: string;
    role: string;
    location: string | null;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    description: string | null;
    responsibilities: unknown;
    isVisible: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
};

export type PortfolioEducation = {
    id: string;
    level:
        | "TENTH"
        | "TWELFTH"
        | "DIPLOMA"
        | "BACHELOR"
        | "MASTER"
        | "PHD";
    institutionType:
        | "SCHOOL"
        | "COLLEGE"
        | "UNIVERSITY"
        | "INSTITUTE";
    institutionName: string;
    field: string | null;
    boardOrUniversity: string | null;
    startDate: string | null;
    endDate: string | null;
    scoreType: "CGPA" | "PERCENTAGE" | null;
    /** Prisma Decimal is serialized as a string by JSON responses. */
    score: number | string | null;
    description: string | null;
    isVisible: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
};

export type PortfolioProject = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    startDate: string | null;
    endDate: string | null;
    githubUrl: string | null;
    liveUrl: string | null;
    imageUrl: string | null;
    technologies: unknown;
    features: unknown;
    isFeatured: boolean;
    isVisible: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
};

export type PortfolioSectionType =
    | "HOME"
    | "SKILLS"
    | "PROJECTS"
    | "EXPERIENCE"
    | "EDUCATION"
    | "ACHIEVEMENTS"
    | "CERTIFICATIONS"
    | "CONTACT"
    | "CUSTOM";

export type PortfolioSection = {
    id: string;
    name: string;
    slug: string;
    type: PortfolioSectionType;
    isVisible: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
};

/** Matches the response returned by GET /api/portfolio. */
export type PortfolioData = {
    profile: PortfolioProfile | null;
    skills: PortfolioSkill[];
    experience: PortfolioExperience[];
    education: PortfolioEducation[];
    projects: PortfolioProject[];
    sections: PortfolioSection[];
};
