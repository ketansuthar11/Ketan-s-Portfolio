import {
    getProjectStats,
    getTotalViews,
    getViewsByDate,
} from "../repository/analytics.repository.js";

export const getAnalyticsSummary = async () => {
    const [
        totalViews,
        projectStats,
    ] = await Promise.all([
        getTotalViews(),
        getProjectStats(),
    ]);

    return {
        totalViews,
        projects: projectStats,
    };
};

export const getViewAnalytics = async (
    startDate?: Date,
    endDate?: Date
) => {
    const now = new Date();

    const start =
        startDate ??
        new Date(
            now.getTime() - 30 * 24 * 60 * 60 * 1000
        );

    const end = endDate ?? now;

    const views = await getViewsByDate(
        start,
        end
    );

    const grouped: Record<string, number> = {};

    for (const view of views) {
        const date = view.createdAt
            .toISOString()
            .slice(0, 10);

        grouped[date] =
            (grouped[date] ?? 0) + 1;
    }

    return Object.entries(grouped).map(
        ([date, views]) => ({
            date,
            views,
        })
    );
};

export const getProjectAnalytics = async () => {
    return getProjectStats();
};