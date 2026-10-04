"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    Bell,
    ExternalLink,
    LogOut,
    RefreshCw,
} from "lucide-react";
import {
    getAdminMessages,
    logoutAdmin,
    type AdminMessage,
} from "@/lib/api/admin";

type AdminLayoutProps = {
    children: ReactNode;
};

export default function AdminLayout({
    children,
}: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();

    const [messages, setMessages] = useState<AdminMessage[]>([]);
    const [loggingOut, setLoggingOut] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        if (isLoginPage) return;

        const loadMessages = async () => {
            try {
                const data = await getAdminMessages();
                setMessages(data);
            } catch (error) {
                console.error(
                    "Failed to load messages:",
                    error
                );

                if (
                    error instanceof Error &&
                    error.message === "UNAUTHORIZED"
                ) {
                    sessionStorage.removeItem(
                        "admin_token"
                    );

                    router.replace("/admin/login");
                }
            }
        };

        loadMessages();
    }, [isLoginPage, pathname, router]);

    if (isLoginPage) {
        return <>{children}</>;
    }

    const unreadCount = messages.filter(
        (message) => message.status === "UNREAD"
    ).length;

    const handleRefresh = () => {
        setRefreshing(true);
        window.location.reload();
    };

    const handleLogout = async () => {
        if (loggingOut) return;

        setLoggingOut(true);

        try {
            await logoutAdmin();
        } catch (error) {
            console.error(
                "Logout error:",
                error
            );
        } finally {
            sessionStorage.removeItem(
                "admin_token"
            );

            router.replace("/admin/login");
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white">

            {/* ================================
                COMMON ADMIN NAVBAR
            ================================= */}

            <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#050505]/95 backdrop-blur-xl">
                <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 lg:px-8">

                    {/* BRAND */}
                    <button
                        onClick={() =>
                            router.push(
                                "/admin/dashboard"
                            )
                        }
                        className="flex items-center gap-4"
                    >
                        <span className="text-2xl font-bold tracking-tight text-white">
                            KK
                            <span className="text-[#C7FF00]">
                                .
                            </span>
                        </span>

                        <span className="hidden h-7 w-px bg-white/10 sm:block" />

                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-semibold text-white">
                                Ketan Kumar Suthar
                            </p>

                            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#C7FF00]">
                                Portfolio Admin
                            </p>
                        </div>
                    </button>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2">

                        {/* Messages */}
                        <button
                            onClick={() =>
                                router.push(
                                    "/admin/messages"
                                )
                            }
                            className="flex h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-3 text-xs font-semibold text-white/60 transition hover:border-[#C7FF00]/30 hover:bg-[#C7FF00]/5 hover:text-[#C7FF00]"
                        >
                            <Bell size={15} />

                            <span className="hidden sm:inline">
                                Messages
                            </span>

                            {unreadCount > 0 && (
                                <span className="flex min-w-5 items-center justify-center rounded-full bg-[#C7FF00] px-1.5 py-0.5 text-[9px] font-bold text-black">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* View Portfolio */}
                        <button
                            onClick={() =>
                                window.open(
                                    "/",
                                    "_blank"
                                )
                            }
                            className="hidden h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-3 text-xs font-semibold text-white/60 transition hover:border-[#C7FF00]/30 hover:bg-[#C7FF00]/5 hover:text-[#C7FF00] sm:flex"
                        >
                            <ExternalLink
                                size={15}
                            />

                            View Portfolio
                        </button>

                        {/* Refresh */}
                        <button
                            onClick={
                                handleRefresh
                            }
                            disabled={refreshing}
                            title="Refresh"
                            className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.02] text-white/50 transition hover:border-[#C7FF00]/30 hover:bg-[#C7FF00]/5 hover:text-[#C7FF00] disabled:opacity-40"
                        >
                            <RefreshCw
                                size={15}
                                className={
                                    refreshing
                                        ? "animate-spin"
                                        : ""
                                }
                            />
                        </button>

                        {/* Logout */}
                        <button
                            onClick={
                                handleLogout
                            }
                            disabled={
                                loggingOut
                            }
                            className="hidden h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-3 text-xs font-semibold text-white/60 transition hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400 sm:flex"
                        >
                            <LogOut
                                size={15}
                            />

                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* PAGE CONTENT */}
            {children}
        </div>
    );
}