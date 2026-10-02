import type { PortfolioData } from "@/types/portfolio";

export const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
};

export type ContactMessageInput = {
    name: string;
    email: string;
    message: string;
};

export async function getPortfolio(): Promise<PortfolioData> {
    const response = await fetch(
        `${API_URL}/api/portfolio`,
        {
            next: {
                revalidate: 300,
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch portfolio: ${response.status}`
        );
    }

    const result: ApiResponse<PortfolioData> =
        await response.json();

    if (!result.success || !result.data) {
        throw new Error(
            result.message || "Failed to fetch portfolio"
        );
    }

    return result.data;
}

export async function submitContactMessage(
    message: ContactMessageInput
): Promise<void> {
    const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    });

    const result: ApiResponse<unknown> =
        await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Failed to send message"
        );
    }
}

export async function getDefaultResumeUrl(): Promise<string> {
    const response = await fetch(`${API_URL}/api/resume`);

    const result: ApiResponse<{ url?: string }> =
        await response.json();

    if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(
            result.message || "Failed to fetch resume"
        );
    }

    return result.data.url;
}

export async function recordPortfolioView(): Promise<void> {
    const response = await fetch(`${API_URL}/api/views`, {
        method: "POST",
    });

    const result: ApiResponse<unknown> =
        await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Failed to record portfolio view"
        );
    }
}

export async function registerVisitor(
    visitorId: string
): Promise<{
    isNewVisitor: boolean;
    visitorId: string;
    visitCount: number;
}> {
    const response = await fetch(`${API_URL}/api/visitors`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            visitorId,
        }),
    });

    const result: ApiResponse<{
        isNewVisitor: boolean;
        visitorId: string;
        visitCount: number;
    }> = await response.json();

    if (!response.ok || !result.success || !result.data) {
        throw new Error(
            result.message || "Failed to register visitor"
        );
    }

    return result.data;
}

export async function getUniqueVisitorCount(): Promise<number> {
    const response = await fetch(`${API_URL}/api/visitors`, {
        cache: "no-store",
    });

    const result: ApiResponse<{
        uniqueVisitors: number;
    }> = await response.json();

    if (!response.ok || !result.success || !result.data) {
        throw new Error(
            result.message || "Failed to fetch unique visitor count"
        );
    }

    return result.data.uniqueVisitors;
}