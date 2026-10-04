"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
    Eye,
    Users,
    CalendarDays,
    CalendarRange,
    BarChart3,
    RefreshCw,
    LogOut,
    ArrowUpRight,
    UserRound,
    Code2,
    BriefcaseBusiness,
    GraduationCap,
    FolderKanban,
    MessageSquare,
    FileText,
    Link2,
    ExternalLink,
    Bell,
    ChevronRight,
    Activity,
} from "lucide-react";

import {
    getDashboardStats,
    checkServerHealth,
    getAdminMessages,
    type DashboardStats,
    type AdminMessage,
} from "@/lib/api/admin";

export default function AdminDashboardPage() {
    const router = useRouter();

    const [stats, setStats] =
        useState<DashboardStats | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [serverHealth, setServerHealth] = useState<{
        online: boolean;
        responseTime: number;
    } | null>(null);

    const [messages, setMessages] =
        useState<AdminMessage[]>([]);

    /*
     * Only unread messages are shown
     * in the notification badge.
     */
    const messageCount = messages.filter(
        (message) => message.status === "UNREAD"
    ).length;

    const loadDashboard = async () => {
        try {
            setError("");

            const [
                dashboardStats,
                health,
                adminMessages,
            ] = await Promise.all([
                getDashboardStats(),
                checkServerHealth(),
                getAdminMessages(),
            ]);

            setStats(dashboardStats);
            setServerHealth(health);
            setMessages(adminMessages);
        } catch (error) {
            console.error(
                "Dashboard error:",
                error
            );

            if (
                error instanceof Error &&
                error.message === "UNAUTHORIZED"
            ) {
                sessionStorage.removeItem(
                    "admin_token"
                );

                router.replace(
                    "/admin/login"
                );

                return;
            }

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to load dashboard"
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        loadDashboard();
    };

    const handleLogout = () => {
        sessionStorage.removeItem(
            "admin_token"
        );

        router.replace("/admin/login");
    };

    const analyticsCards = [
        {
            title: "Total Views",
            value: stats?.totalViews ?? 0,
            icon: Eye,
            description:
                "All portfolio views",
        },
        {
            title: "Unique Visitors",
            value:
                stats?.uniqueVisitors ?? 0,
            icon: Users,
            description:
                "Individual visitors",
        },
        {
            title: "Today",
            value: stats?.today ?? 0,
            icon: CalendarDays,
            description:
                "Views received today",
        },
        {
            title: "This Week",
            value: stats?.thisWeek ?? 0,
            icon: CalendarRange,
            description:
                "Views this week",
        },
        {
            title: "This Month",
            value: stats?.thisMonth ?? 0,
            icon: BarChart3,
            description:
                "Views this month",
        },
    ];

    const quickActions = [
        {
            title: "Profile",
            description:
                "Personal information",
            icon: UserRound,
            path: "/admin/profile",
        },
        {
            title: "Skills",
            description:
                "Technical skills",
            icon: Code2,
            path: "/admin/skills",
        },
        {
            title: "Experience",
            description:
                "Work experience",
            icon: BriefcaseBusiness,
            path: "/admin/experience",
        },
        {
            title: "Education",
            description:
                "Education details",
            icon: GraduationCap,
            path: "/admin/education",
        },
        {
            title: "Projects",
            description:
                "Portfolio projects",
            icon: FolderKanban,
            path: "/admin/projects",
        },
        {
            title: "Resume",
            description:
                "Manage resume",
            icon: FileText,
            path: "/admin/resume",
        },
        {
            title: "Social Links",
            description:
                "Social profiles",
            icon: Link2,
            path: "/admin/social-links",
        },
    ];

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">

            {/* =====================================================
                BACKGROUND
            ====================================================== */}

            <div className="pointer-events-none fixed inset-0">

                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: `
                            linear-gradient(
                                rgba(255,255,255,1) 1px,
                                transparent 1px
                            ),
                            linear-gradient(
                                90deg,
                                rgba(255,255,255,1) 1px,
                                transparent 1px
                            )
                        `,
                        backgroundSize: "64px 64px",
                    }}
                />

                <div className="absolute left-[10%] top-[5%] h-[420px] w-[420px] rounded-full bg-[#C7FF00]/[0.025] blur-[150px]" />

                <div className="absolute bottom-[5%] right-[5%] h-[350px] w-[350px] rounded-full bg-[#C7FF00]/[0.02] blur-[130px]" />

            </div>

            
            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <section className="relative z-10 mx-auto max-w-[1280px] px-5 py-8 lg:px-8 lg:py-10">

                {/* =================================================
                    WELCOME
                ================================================== */}

                <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

                    <div>

                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#C7FF00]">

                            <span className="h-1.5 w-1.5 rounded-full bg-[#C7FF00]" />

                            Admin Dashboard

                        </div>

                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            Welcome back,
                            <span className="text-[#C7FF00]">
                                {" "}Ketan.
                            </span>
                        </h1>

                        <p className="mt-3 max-w-xl text-base leading-6 text-white/55">
                            Manage your portfolio,
                            monitor activity and
                            keep your content
                            up to date.
                        </p>

                    </div>

                    {/* System Status */}

                    <div className="flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5">

                        <span className="relative flex h-2.5 w-2.5">

                            <span
                                className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
                                    serverHealth?.online
                                        ? "bg-[#C7FF00]/50"
                                        : "bg-red-500/50"
                                }`}
                            />

                            <span
                                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                                    serverHealth?.online
                                        ? "bg-[#C7FF00]"
                                        : "bg-red-500"
                                }`}
                            />

                        </span>

                        <span className="text-sm font-medium text-white/75">
                            {serverHealth === null
                                ? "Checking..."
                                : serverHealth.online
                                    ? "System Online"
                                    : "System Offline"}
                        </span>

                        {serverHealth?.online && (
                            <span className="text-xs text-white/35">
                                {serverHealth.responseTime}ms
                            </span>
                        )}

                    </div>

                </div>

                {/* =================================================
                    ERROR
                ================================================== */}

                {error && (
                    <div className="mb-7 flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3.5 text-sm text-red-300">

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={handleRefresh}
                            className="font-semibold underline"
                        >
                            Try Again
                        </button>

                    </div>
                )}

                {/* =================================================
                    ANALYTICS OVERVIEW
                ================================================== */}

                <section className="mb-9">

                    <div className="mb-4 flex items-end justify-between">

                        <div>

                            <div className="flex items-center gap-2">

                                <Activity
                                    size={18}
                                    className="text-[#C7FF00]"
                                />

                                <h2 className="text-xl font-semibold text-white">
                                    Analytics Overview
                                </h2>

                            </div>

                            <p className="mt-1.5 text-sm text-white/50">
                                Track how your portfolio
                                is performing.
                            </p>

                        </div>

                        <span className="hidden rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-white/45 sm:block">
                            Live Data
                        </span>

                    </div>

                    <div className="rounded-xl border border-white/[0.09] bg-white/[0.018] p-4 sm:p-5">

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

                            {analyticsCards.map(
                                (card) => {
                                    const Icon =
                                        card.icon;

                                    return (
                                        <div
                                            key={
                                                card.title
                                            }
                                            className="group rounded-lg border border-white/[0.08] bg-[#090909] p-5 transition duration-200 hover:border-[#C7FF00]/30 hover:bg-white/[0.035]"
                                        >

                                            <div className="flex items-center justify-between">

                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C7FF00]/10">

                                                    <Icon
                                                        size={19}
                                                        className="text-[#C7FF00]"
                                                        strokeWidth={
                                                            1.8
                                                        }
                                                    />

                                                </div>

                                                <ArrowUpRight
                                                    size={16}
                                                    className="text-white/20 transition group-hover:text-[#C7FF00]"
                                                />

                                            </div>

                                            <p className="mt-5 text-sm font-medium text-white/65">
                                                {
                                                    card.title
                                                }
                                            </p>

                                            {loading ? (
                                                <div className="mt-2 h-10 w-20 animate-pulse rounded bg-white/10" />
                                            ) : (
                                                <p className="mt-1 text-3xl font-bold tracking-tight text-white">
                                                    {card.value.toLocaleString()}
                                                </p>
                                            )}

                                            <p className="mt-2 text-xs text-white/40">
                                                {
                                                    card.description
                                                }
                                            </p>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </div>

                </section>

                {/* =================================================
                    QUICK ACTIONS
                ================================================== */}

                <section className="mb-9">

                    <div className="mb-4">

                        <h2 className="text-xl font-semibold text-white">
                            Quick Actions
                        </h2>

                        <p className="mt-1.5 text-sm text-white/50">
                            Jump directly to the
                            sections you manage most.
                        </p>

                    </div>

                    <div className="overflow-hidden rounded-xl border border-white/[0.09] bg-white/[0.018]">

                        <div className="grid divide-y divide-white/[0.07] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 lg:divide-x">

                            {quickActions.map(
                                (action) => {
                                    const Icon =
                                        action.icon;

                                    return (
                                        <button
                                            key={
                                                action.title
                                            }
                                            onClick={() =>
                                                router.push(
                                                    action.path
                                                )
                                            }
                                            className="group flex items-center gap-4 p-4 text-left transition hover:bg-[#C7FF00]/[0.045]"
                                        >

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.025] transition group-hover:border-[#C7FF00]/30 group-hover:bg-[#C7FF00]/10">

                                                <Icon
                                                    size={18}
                                                    className="text-white/65 transition group-hover:text-[#C7FF00]"
                                                />

                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <p className="text-sm font-semibold text-white">
                                                    {
                                                        action.title
                                                    }
                                                </p>

                                                <p className="mt-0.5 truncate text-xs text-white/40">
                                                    {
                                                        action.description
                                                    }
                                                </p>

                                            </div>

                                            <ChevronRight
                                                size={16}
                                                className="shrink-0 text-white/20 transition group-hover:translate-x-0.5 group-hover:text-[#C7FF00]"
                                            />

                                        </button>
                                    );
                                }
                            )}

                        </div>

                    </div>

                </section>

                {/* =================================================
                    LOWER DASHBOARD
                ================================================== */}

                <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">

                    {/* Recent Messages */}

                    <div className="rounded-xl border border-white/[0.09] bg-white/[0.018]">

                        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">

                            <div>

                                <div className="flex items-center gap-2">

                                    <MessageSquare
                                        size={18}
                                        className="text-[#C7FF00]"
                                    />

                                    <h2 className="text-base font-semibold text-white">
                                        Recent Messages
                                    </h2>

                                    {messageCount > 0 && (
                                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C7FF00] px-1.5 text-[10px] font-bold text-black">
                                            {messageCount}
                                        </span>
                                    )}

                                </div>

                                <p className="mt-1 text-xs text-white/40">
                                    Messages from portfolio
                                    visitors
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    router.push(
                                        "/admin/messages"
                                    )
                                }
                                className="flex items-center gap-1 text-xs font-medium text-[#C7FF00] transition hover:text-white"
                            >
                                View all

                                <ChevronRight
                                    size={14}
                                />
                            </button>

                        </div>

                        {/* Real Message Preview */}

                        <div className="divide-y divide-white/[0.06]">

                            {loading ? (
                                <>
                                    <div className="flex items-center gap-4 px-5 py-5">
                                        <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />

                                        <div className="flex-1">
                                            <div className="h-4 w-32 animate-pulse rounded bg-white/10" />

                                            <div className="mt-2 h-3 w-64 animate-pulse rounded bg-white/10" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 px-5 py-5">
                                        <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />

                                        <div className="flex-1">
                                            <div className="h-4 w-40 animate-pulse rounded bg-white/10" />

                                            <div className="mt-2 h-3 w-56 animate-pulse rounded bg-white/10" />
                                        </div>
                                    </div>
                                </>
                            ) : messages.length === 0 ? (
                                <div className="px-5 py-10 text-center">

                                    <MessageSquare
                                        size={26}
                                        className="mx-auto text-white/20"
                                    />

                                    <p className="mt-3 text-sm font-medium text-white/60">
                                        No messages yet
                                    </p>

                                    <p className="mt-1 text-xs text-white/30">
                                        Portfolio enquiries
                                        will appear here.
                                    </p>

                                </div>
                            ) : (
                                messages
                                    .slice(0, 4)
                                    .map(
                                        (message) => {
                                            const initials =
                                                message.name
                                                    .trim()
                                                    .split(
                                                        /\s+/
                                                    )
                                                    .map(
                                                        (
                                                            part
                                                        ) =>
                                                            part[0]
                                                    )
                                                    .join("")
                                                    .slice(
                                                        0,
                                                        2
                                                    )
                                                    .toUpperCase();

                                            const date =
                                                new Date(
                                                    message.createdAt
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                );

                                            return (
                                                <button
                                                    key={
                                                        message.id
                                                    }
                                                    onClick={() =>
                                                        router.push(
                                                            "/admin/messages"
                                                        )
                                                    }
                                                    className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-white/[0.025]"
                                                >

                                                    {/* Avatar */}

                                                    <div
                                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                                            message.status ===
                                                            "UNREAD"
                                                                ? "bg-[#C7FF00]/10 text-[#C7FF00]"
                                                                : "bg-white/[0.05] text-white/60"
                                                        }`}
                                                    >
                                                        {initials ||
                                                            "?"}
                                                    </div>

                                                    {/* Content */}

                                                    <div className="min-w-0 flex-1">

                                                        <div className="flex items-center justify-between gap-3">

                                                            <p className="truncate text-sm font-semibold text-white">
                                                                {
                                                                    message.name
                                                                }
                                                            </p>

                                                            <span
                                                                className={`shrink-0 text-[10px] font-semibold ${
                                                                    message.status ===
                                                                    "UNREAD"
                                                                        ? "text-[#C7FF00]"
                                                                        : "text-white/30"
                                                                }`}
                                                            >
                                                                {message.status ===
                                                                "UNREAD"
                                                                    ? "Unread"
                                                                    : "Read"}
                                                            </span>

                                                        </div>

                                                        <p className="mt-1 truncate text-xs text-white/45">
                                                            {
                                                                message.message
                                                            }
                                                        </p>

                                                        <div className="mt-1 flex items-center gap-2">

                                                            <span className="truncate text-[10px] text-white/25">
                                                                {
                                                                    message.email
                                                                }
                                                            </span>

                                                            <span className="text-white/15">
                                                                •
                                                            </span>

                                                            <span className="shrink-0 text-[10px] text-white/25">
                                                                {date}
                                                            </span>

                                                        </div>

                                                    </div>

                                                    <ChevronRight
                                                        size={16}
                                                        className="shrink-0 text-white/20"
                                                    />

                                                </button>
                                            );
                                        }
                                    )
                            )}

                        </div>

                    </div>

                    {/* Server Status */}

                    <div className="rounded-xl border border-white/[0.09] bg-white/[0.018]">

                        <div className="border-b border-white/[0.08] px-5 py-4">

                            <div className="flex items-center gap-2">

                                <Activity
                                    size={18}
                                    className="text-[#C7FF00]"
                                />

                                <h2 className="text-base font-semibold text-white">
                                    System Status
                                </h2>

                            </div>

                            <p className="mt-1 text-xs text-white/40">
                                Current backend health
                            </p>

                        </div>

                        <div className="p-5">

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                            serverHealth?.online
                                                ? "bg-[#C7FF00]/10"
                                                : "bg-red-500/10"
                                        }`}
                                    >

                                        <span
                                            className={`h-2.5 w-2.5 rounded-full ${
                                                serverHealth?.online
                                                    ? "bg-[#C7FF00]"
                                                    : "bg-red-500"
                                            }`}
                                        />

                                    </div>

                                    <div>

                                        <p className="text-sm font-semibold text-white">
                                            Backend API
                                        </p>

                                        <p className="mt-0.5 text-xs text-white/40">
                                            {serverHealth ===
                                            null
                                                ? "Checking..."
                                                : serverHealth.online
                                                    ? "Operational"
                                                    : "Unavailable"}
                                        </p>

                                    </div>

                                </div>

                                {serverHealth?.online && (
                                    <span className="text-sm font-semibold text-[#C7FF00]">
                                        {
                                            serverHealth.responseTime
                                        }
                                        ms
                                    </span>
                                )}

                            </div>

                            <div className="mt-5 border-t border-white/[0.07] pt-4">

                                <button
                                    onClick={handleRefresh}
                                    disabled={
                                        refreshing
                                    }
                                    className="flex w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.025] py-2.5 text-xs font-medium text-white/60 transition hover:border-[#C7FF00]/30 hover:bg-[#C7FF00]/5 hover:text-[#C7FF00] disabled:opacity-40"
                                >

                                    <RefreshCw
                                        size={14}
                                        className={
                                            refreshing
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />

                                    Refresh Status

                                </button>

                            </div>

                        </div>

                    </div>

                </section>

                {/* =================================================
                    FOOTER
                ================================================== */}

                <footer className="mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 sm:flex-row">

                    <p className="text-sm text-white/35">
                        KK. / Portfolio Management
                    </p>

                    <p className="text-sm text-white/35">
                        AI Full Stack Developer
                    </p>

                </footer>

            </section>

        </main>
    );
}