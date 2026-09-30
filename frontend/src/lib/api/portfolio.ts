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

    const result: ApiResponse<PortfolioData> = await response.json();

    if (!result.success || !result.data) {
        throw new Error(
            result.message || "Failed to fetch portfolio"
        );
    }

        console.log(result.data);
    
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

    const result: ApiResponse<unknown> = await response.json();

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
