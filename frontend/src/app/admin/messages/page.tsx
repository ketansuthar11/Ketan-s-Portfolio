"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
    ArrowLeft,
    Bell,
    Check,
    ChevronRight,
    Clock3,
    Mail,
    MailOpen,
    RefreshCw,
    Search,
    User,
    X,
} from "lucide-react";

import {
    getAdminMessages,
    markAdminMessageAsRead,
    type AdminMessage,
} from "@/lib/api/admin";

type FilterType = "ALL" | "UNREAD" | "READ";

export default function AdminMessagesPage() {
    const router = useRouter();

    const [messages, setMessages] =
        useState<AdminMessage[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [filter, setFilter] =
        useState<FilterType>("ALL");

    const [selectedMessage, setSelectedMessage] =
        useState<AdminMessage | null>(null);

    const loadMessages = async () => {
        try {
            setError("");

            const data =
                await getAdminMessages();

            setMessages(data);
        } catch (error) {
            console.error(
                "Messages error:",
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
                    : "Failed to load messages"
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleOpenMessage = async (message: AdminMessage) => {
        try {
            setSelectedMessage(message);

            if (message.status === "UNREAD") {
                const updatedMessage =
                    await markAdminMessageAsRead(message.id);

                setMessages((prev) =>
                    prev.map((item) =>
                        item.id === message.id
                            ? updatedMessage
                            : item
                    )
                );

                setSelectedMessage(updatedMessage);
            }
        } catch (error) {
            console.error(
                "Failed to mark message as read:",
                error
            );
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        loadMessages();
    };

    const unreadCount = messages.filter(
        (message) =>
            message.status === "UNREAD"
    ).length;

    const readCount = messages.filter(
        (message) =>
            message.status === "READ"
    ).length;

    const filteredMessages = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        return messages.filter(
            (message) => {
                const matchesFilter =
                    filter === "ALL" ||
                    message.status === filter;

                if (!matchesFilter) {
                    return false;
                }

                if (!query) {
                    return true;
                }

                return (
                    message.name
                        .toLowerCase()
                        .includes(query) ||
                    message.email
                        .toLowerCase()
                        .includes(query) ||
                    message.message
                        .toLowerCase()
                        .includes(query)
                );
            }
        );
    }, [messages, search, filter]);

    const formatDate = (
        dateString: string
    ) => {
        const date = new Date(dateString);

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const formatTime = (
        dateString: string
    ) => {
        const date = new Date(dateString);

        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const getInitials = (
        name: string
    ) => {
        return (
            name
                .trim()
                .split(/\s+/)
                .map(
                    (part) =>
                        part[0]
                )
                .join("")
                .slice(0, 2)
                .toUpperCase() ||
            "?"
        );
    };

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
                        backgroundSize:
                            "64px 64px",
                    }}
                />

                <div className="absolute left-[10%] top-[5%] h-[420px] w-[420px] rounded-full bg-[#C7FF00]/[0.025] blur-[150px]" />

                <div className="absolute bottom-[5%] right-[5%] h-[350px] w-[350px] rounded-full bg-[#C7FF00]/[0.02] blur-[130px]" />

            </div>

            {/* =====================================================
                CONTENT
            ====================================================== */}

            <section className="relative z-10 mx-auto max-w-[1280px] px-5 py-8 lg:px-8 lg:py-10">

                {/* HEADER */}

                <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

                    <div>

                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#C7FF00]">

                            <span className="h-1.5 w-1.5 rounded-full bg-[#C7FF00]" />

                            Communication

                        </div>

                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            Your Messages
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
                            Manage messages and
                            enquiries received
                            through your portfolio.
                        </p>

                    </div>

                    {/* Stats */}

                    <div className="flex items-center gap-2">

                        <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3">
                            <p className="text-[10px] uppercase tracking-wider text-white/30">
                                Total
                            </p>

                            <p className="mt-1 text-xl font-bold">
                                {messages.length}
                            </p>
                        </div>

                        <div className="rounded-lg border border-[#C7FF00]/20 bg-[#C7FF00]/[0.04] px-4 py-3">
                            <p className="text-[10px] uppercase tracking-wider text-[#C7FF00]/60">
                                Unread
                            </p>

                            <p className="mt-1 text-xl font-bold text-[#C7FF00]">
                                {unreadCount}
                            </p>
                        </div>

                        <div className="hidden rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3 sm:block">
                            <p className="text-[10px] uppercase tracking-wider text-white/30">
                                Read
                            </p>

                            <p className="mt-1 text-xl font-bold">
                                {readCount}
                            </p>
                        </div>

                    </div>

                </div>

                {/* ERROR */}

                {error && (
                    <div className="mb-6 flex items-center justify-between rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={
                                handleRefresh
                            }
                            className="font-semibold underline"
                        >
                            Retry
                        </button>

                    </div>
                )}

                {/* =================================================
                    TOOLBAR
                ================================================== */}

                <div className="mb-5 rounded-xl border border-white/[0.08] bg-white/[0.018] p-3">

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                        {/* Search */}

                        <div className="relative flex-1">

                            <Search
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(
                                    event
                                ) =>
                                    setSearch(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Search by name, email or message..."
                                className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.025] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#C7FF00]/40"
                            />

                        </div>

                        {/* Filters */}

                        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.02] p-1">

                            {(
                                [
                                    "ALL",
                                    "UNREAD",
                                    "READ",
                                ] as FilterType[]
                            ).map(
                                (
                                    item
                                ) => (
                                    <button
                                        key={
                                            item
                                        }
                                        onClick={() =>
                                            setFilter(
                                                item
                                            )
                                        }
                                        className={`rounded-md px-4 py-2 text-xs font-medium transition ${filter ===
                                                item
                                                ? "bg-[#C7FF00] text-black"
                                                : "text-white/45 hover:bg-white/[0.05] hover:text-white"
                                            }`}
                                    >
                                        {item ===
                                            "ALL"
                                            ? "All"
                                            : item ===
                                                "UNREAD"
                                                ? "Unread"
                                                : "Read"}
                                    </button>
                                )
                            )}

                        </div>

                    </div>

                </div>

                {/* =================================================
                    MESSAGES
                ================================================== */}

                <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.018]">

                    {/* Table Header */}

                    <div className="hidden border-b border-white/[0.08] bg-white/[0.02] px-5 py-3 md:grid md:grid-cols-[2fr_2fr_3fr_1fr_auto] md:gap-4">

                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                            Sender
                        </p>

                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                            Email
                        </p>

                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                            Message
                        </p>

                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30">
                            Date
                        </p>

                        <span />

                    </div>

                    {/* Loading */}

                    {loading ? (
                        <div className="divide-y divide-white/[0.06]">

                            {[1, 2, 3, 4].map(
                                (item) => (
                                    <div
                                        key={
                                            item
                                        }
                                        className="flex items-center gap-4 px-5 py-5"
                                    >
                                        <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />

                                        <div className="flex-1">

                                            <div className="h-4 w-36 animate-pulse rounded bg-white/10" />

                                            <div className="mt-2 h-3 w-64 animate-pulse rounded bg-white/10" />

                                        </div>
                                    </div>
                                )
                            )}

                        </div>
                    ) : filteredMessages.length ===
                        0 ? (
                        <div className="px-6 py-16 text-center">

                            <Mail
                                size={32}
                                className="mx-auto text-white/15"
                            />

                            <h3 className="mt-4 text-base font-semibold text-white/60">
                                No messages found
                            </h3>

                            <p className="mt-1 text-sm text-white/30">
                                {search ||
                                    filter !==
                                    "ALL"
                                    ? "Try changing your search or filter."
                                    : "No portfolio messages have been received yet."}
                            </p>

                        </div>
                    ) : (
                        <div className="divide-y divide-white/[0.06]">

                            {filteredMessages.map(
                                (
                                    message
                                ) => (
                                    <button
                                        key={
                                            message.id
                                        }
                                        onClick={() =>
                                            handleOpenMessage(message)
                                        }
                                        className="group w-full text-left transition hover:bg-white/[0.025]"
                                    >

                                        {/* Desktop */}

                                        <div className="hidden items-center gap-4 px-5 py-4 md:grid md:grid-cols-[2fr_2fr_3fr_1fr_auto]">

                                            {/* Sender */}

                                            <div className="flex min-w-0 items-center gap-3">

                                                <div
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${message.status ===
                                                            "UNREAD"
                                                            ? "bg-[#C7FF00]/10 text-[#C7FF00]"
                                                            : "bg-white/[0.05] text-white/50"
                                                        }`}
                                                >
                                                    {getInitials(
                                                        message.name
                                                    )}
                                                </div>

                                                <div className="min-w-0">

                                                    <p className="truncate text-sm font-semibold text-white">
                                                        {
                                                            message.name
                                                        }
                                                    </p>

                                                    {message.status ===
                                                        "UNREAD" && (
                                                            <span className="mt-1 inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-[#C7FF00]">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-[#C7FF00]" />
                                                                Unread
                                                            </span>
                                                        )}

                                                </div>

                                            </div>

                                            {/* Email */}

                                            <div className="flex min-w-0 items-center gap-2">

                                                <Mail
                                                    size={13}
                                                    className="shrink-0 text-white/20"
                                                />

                                                <span className="truncate text-xs text-white/45">
                                                    {
                                                        message.email
                                                    }
                                                </span>

                                            </div>

                                            {/* Message */}

                                            <p className="truncate text-xs text-white/50">
                                                {
                                                    message.message
                                                }
                                            </p>

                                            {/* Date */}

                                            <div>

                                                <p className="text-xs text-white/50">
                                                    {formatDate(
                                                        message.createdAt
                                                    )}
                                                </p>

                                                <p className="mt-0.5 text-[10px] text-white/25">
                                                    {formatTime(
                                                        message.createdAt
                                                    )}
                                                </p>

                                            </div>

                                            <ChevronRight
                                                size={16}
                                                className="text-white/20 transition group-hover:translate-x-0.5 group-hover:text-[#C7FF00]"
                                            />

                                        </div>

                                        {/* Mobile */}

                                        <div className="flex items-start gap-3 px-4 py-4 md:hidden">

                                            <div
                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${message.status ===
                                                        "UNREAD"
                                                        ? "bg-[#C7FF00]/10 text-[#C7FF00]"
                                                        : "bg-white/[0.05] text-white/50"
                                                    }`}
                                            >
                                                {getInitials(
                                                    message.name
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <div className="flex items-center justify-between gap-2">

                                                    <p className="truncate text-sm font-semibold text-white">
                                                        {
                                                            message.name
                                                        }
                                                    </p>

                                                    <span className="shrink-0 text-[10px] text-white/25">
                                                        {formatDate(
                                                            message.createdAt
                                                        )}
                                                    </span>

                                                </div>

                                                <p className="mt-1 truncate text-xs text-white/35">
                                                    {
                                                        message.email
                                                    }
                                                </p>

                                                <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/50">
                                                    {
                                                        message.message
                                                    }
                                                </p>

                                                <div className="mt-2 flex items-center gap-2">

                                                    {message.status ===
                                                        "UNREAD" && (
                                                            <span className="rounded-full bg-[#C7FF00]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#C7FF00]">
                                                                Unread
                                                            </span>
                                                        )}

                                                    <span className="text-[10px] text-white/20">
                                                        {formatTime(
                                                            message.createdAt
                                                        )}
                                                    </span>

                                                </div>

                                            </div>

                                            <ChevronRight
                                                size={16}
                                                className="mt-1 shrink-0 text-white/20"
                                            />

                                        </div>

                                    </button>
                                )
                            )}

                        </div>
                    )}

                </div>

                {/* RESULT COUNT */}

                {!loading &&
                    filteredMessages.length >
                    0 && (
                        <div className="mt-4 flex justify-between text-xs text-white/25">

                            <span>
                                Showing{" "}
                                {
                                    filteredMessages.length
                                }{" "}
                                of{" "}
                                {
                                    messages.length
                                }{" "}
                                messages
                            </span>

                            <span>
                                {unreadCount} unread
                            </span>

                        </div>
                    )}

            </section>

            {/* =====================================================
                MESSAGE DETAIL MODAL
            ====================================================== */}

            {selectedMessage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onClick={() =>
                        setSelectedMessage(
                            null
                        )
                    }
                >

                    <div
                        className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] shadow-2xl"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* Modal Header */}

                        <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C7FF00]/10 text-sm font-bold text-[#C7FF00]">
                                    {getInitials(
                                        selectedMessage.name
                                    )}
                                </div>

                                <div>

                                    <p className="text-sm font-semibold text-white">
                                        {
                                            selectedMessage.name
                                        }
                                    </p>

                                    <p className="mt-0.5 text-xs text-white/35">
                                        {
                                            selectedMessage.email
                                        }
                                    </p>

                                </div>

                            </div>

                            <button
                                onClick={() =>
                                    setSelectedMessage(
                                        null
                                    )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-white/40 transition hover:border-white/20 hover:text-white"
                            >
                                <X
                                    size={16}
                                />
                            </button>

                        </div>

                        {/* Modal Body */}

                        <div className="p-5">

                            <div className="mb-5 flex flex-wrap items-center gap-2">

                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${selectedMessage.status ===
                                            "UNREAD"
                                            ? "bg-[#C7FF00]/10 text-[#C7FF00]"
                                            : "bg-white/[0.06] text-white/40"
                                        }`}
                                >
                                    {selectedMessage.status ===
                                        "UNREAD" ? (
                                        <Mail
                                            size={11}
                                        />
                                    ) : (
                                        <MailOpen
                                            size={11}
                                        />
                                    )}

                                    {
                                        selectedMessage.status
                                    }
                                </span>

                                <span className="inline-flex items-center gap-1.5 text-[10px] text-white/30">
                                    <Clock3
                                        size={11}
                                    />

                                    {formatDate(
                                        selectedMessage.createdAt
                                    )}

                                    {" • "}

                                    {formatTime(
                                        selectedMessage.createdAt
                                    )}
                                </span>

                            </div>

                            <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-5">

                                <p className="whitespace-pre-wrap text-sm leading-7 text-white/75">
                                    {
                                        selectedMessage.message
                                    }
                                </p>

                            </div>

                        </div>

                        {/* Modal Footer */}

                        <div className="flex items-center justify-between border-t border-white/[0.08] px-5 py-4">

                            <div className="flex items-center gap-2 text-xs text-white/30">

                                <User
                                    size={13}
                                />

                                Portfolio visitor

                            </div>

                            <button
                                onClick={() =>
                                    setSelectedMessage(
                                        null
                                    )
                                }
                                className="rounded-md border border-white/10 px-4 py-2 text-xs font-medium text-white/60 transition hover:border-[#C7FF00]/30 hover:text-[#C7FF00]"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </main>
    );
}