const VISITOR_ID_KEY = "portfolio_visitor_id";

export function getVisitorId(): string {
    if (typeof window === "undefined") {
        throw new Error("getVisitorId must be called in the browser");
    }

    const existingVisitorId = localStorage.getItem(VISITOR_ID_KEY);

    if (existingVisitorId) {
        return existingVisitorId;
    }

    const newVisitorId = crypto.randomUUID();

    localStorage.setItem(VISITOR_ID_KEY, newVisitorId);

    return newVisitorId;
}