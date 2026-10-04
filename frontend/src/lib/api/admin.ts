import { API_URL } from "./portfolio";

/* ================================
   Types
================================ */

type ApiResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
};

export type DashboardStats = {
    totalViews: number;
    uniqueVisitors: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
};

/* ================================
   Admin Token
================================ */

function getAdminToken(): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    return sessionStorage.getItem("admin_token");
}

/* ================================
   Admin Fetch
================================ */

export async function adminFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getAdminToken();

    if (!token) {
        throw new Error("UNAUTHORIZED");
    }

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        }
    );

    const result: ApiResponse<T> =
        await response.json();

    if (
        response.status === 401 ||
        response.status === 403
    ) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok || !result.success) {
        throw new Error(
            result.message ||
                "Request failed"
        );
    }

    return result.data as T;
}

/* ================================
   Admin Authentication
================================ */

export async function loginAdmin(
    email: string,
    password: string
): Promise<string> {
    const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        }
    );

    const result: ApiResponse<{
        token: string;
    }> = await response.json();

    if (
        !response.ok ||
        !result.success ||
        !result.data?.token
    ) {
        throw new Error(
            result.message ||
                "Invalid credentials"
        );
    }

    return result.data.token;
}

/* ================================
   Admin Logout
================================ */

export async function logoutAdmin(): Promise<void> {
    const token = getAdminToken();

    if (!token) {
        return;
    }

    const response = await fetch(
        `${API_URL}/api/auth/logout`,
        {
            method: "POST",
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to logout"
        );
    }
}

/* ================================
   Admin Me
================================ */

export async function getAdminMe(): Promise<{
    authenticated: boolean;
    role: string;
}> {
    return adminFetch<{
        authenticated: boolean;
        role: string;
    }>("/api/auth/me");
}

/* ================================
   VIEW ANALYTICS
================================ */

export type ViewStats = {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
};

/**
 * Get portfolio view statistics.
 *
 * Source:
 * GET /api/views/stats
 */
export async function getViewStats(): Promise<ViewStats> {
    const response = await fetch(
        `${API_URL}/api/views/stats`,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    const result: ApiResponse<ViewStats> =
        await response.json();

    if (
        !response.ok ||
        !result.success ||
        !result.data
    ) {
        throw new Error(
            result.message ||
                "Failed to fetch view statistics"
        );
    }

    return result.data;
}

/* ================================
   UNIQUE VISITORS
================================ */

/**
 * Get unique portfolio visitors.
 *
 * Source:
 * GET /api/visitors
 */
export async function getUniqueVisitorCount(): Promise<number> {
    const response = await fetch(
        `${API_URL}/api/visitors`,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    const result: ApiResponse<{
        uniqueVisitors: number;
    }> = await response.json();

    if (
        !response.ok ||
        !result.success ||
        !result.data
    ) {
        throw new Error(
            result.message ||
                "Failed to fetch unique visitor count"
        );
    }

    return result.data.uniqueVisitors;
}

/* ================================
   DASHBOARD STATS
================================ */

/**
 * Compose dashboard analytics
 * from their dedicated APIs.
 *
 * Views:
 * /api/views/stats
 *
 * Unique visitors:
 * /api/visitors
 */
export async function getDashboardStats(): Promise<DashboardStats> {
    const [
        viewStats,
        uniqueVisitors,
    ] = await Promise.all([
        getViewStats(),
        getUniqueVisitorCount(),
    ]);

    return {
        totalViews: viewStats.total,
        uniqueVisitors,
        today: viewStats.today,
        thisWeek: viewStats.thisWeek,
        thisMonth: viewStats.thisMonth,
    };
}

/* ================================
   SERVER HEALTH
================================ */

export type ServerHealth = {
    online: boolean;
    responseTime: number;
};

export async function checkServerHealth(): Promise<ServerHealth> {
    const start = performance.now();

    try {
        const response = await fetch(
            `${API_URL}/api/health`,
            {
                method: "GET",
                cache: "no-store",
            }
        );

        const end = performance.now();

        return {
            online: response.ok,
            responseTime: Math.round(
                end - start
            ),
        };
    } catch (error) {
        console.error(
            "Health check failed:",
            error
        );

        return {
            online: false,
            responseTime: 0,
        };
    }
}

/* ================================
   MESSAGES
================================ */

export type AdminMessageStatus = "UNREAD" | "READ";

export type AdminMessage = {
    id: string;
    name: string;
    email: string;
    message: string;
    status: AdminMessageStatus;
    createdAt: string;
};


export async function getAdminMessages(): Promise<AdminMessage[]> {
    return adminFetch<AdminMessage[]>(
        "/api/admin/messages"
    );
}

export async function markAdminMessageAsRead(
    messageId: string
): Promise<AdminMessage> {
    return adminFetch<AdminMessage>(
        `/api/admin/messages/${messageId}/read`,
        {
            method: "PATCH",
        }
    );
}

