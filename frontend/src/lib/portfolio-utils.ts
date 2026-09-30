import type {
    PortfolioProfile,
    PortfolioRole,
} from "@/types/portfolio";

export function getPrimaryRole(
    roles: PortfolioRole[] | undefined
): string | null {
    const defaultRole = roles?.find((role) => role.isDefault);

    return defaultRole?.role ?? roles?.[0]?.role ?? null;
}

export function getStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter(
        (item): item is string =>
            typeof item === "string" && item.trim().length > 0
    );
}

export function getInitials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

export function getDefaultImageUrl(
    profile: PortfolioProfile | null
): string | null {
    return profile?.images.find((image) => image.isDefault)?.url ?? null;
}
