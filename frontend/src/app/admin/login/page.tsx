"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { loginAdmin } from "@/lib/api/admin";

export default function AdminLoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const token = await loginAdmin(
                email.trim(),
                password
            );

            sessionStorage.setItem(
                "admin_token",
                token
            );

            router.push("/admin/dashboard");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-black text-white">
            {/* Grid Background */}
            <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `
                        linear-gradient(
                            rgba(255,255,255,0.035) 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            90deg,
                            rgba(255,255,255,0.035) 1px,
                            transparent 1px
                        )
                    `,
                    backgroundSize: "48px 48px",
                }}
            />

            {/* Glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C7FF00]/5 blur-[120px]" />

            {/* Header */}
            <header className="relative z-10 border-b border-white/10">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
                    <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold tracking-tight">
                            KK<span className="text-[#C7FF00]">.</span>
                        </div>

                        <div className="h-5 w-px bg-white/10" />

                        <span className="font-mono text-xs text-white/40">
                            ADMIN PANEL
                        </span>
                    </div>

                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                        Secure Access
                    </div>
                </div>
            </header>

            {/* Login */}
            <div className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
                <div className="w-full max-w-[430px]">

                    {/* Top Label */}
                    <div className="mb-8">
                        <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#C7FF00]">
                            <span className="h-1.5 w-1.5 bg-[#C7FF00]" />
                            Authentication Required
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            Welcome
                            <br />
                            <span className="text-[#C7FF00]">
                                back.
                            </span>
                        </h1>

                        <p className="mt-4 max-w-sm font-mono text-xs leading-6 text-white/40">
                            Sign in to access your portfolio
                            management system.
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="border border-white/10 bg-black/60 p-6 backdrop-blur-sm sm:p-8"
                    >
                        {/* Email */}
                        <div className="mb-5">
                            <label
                                htmlFor="email"
                                className="mb-2 block font-mono text-[10px] uppercase tracking-[0.15em] text-white/40"
                            >
                                Email Address
                            </label>

                            <div className="relative">
                                <Mail
                                    size={15}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="admin@example.com"
                                    autoComplete="email"
                                    required
                                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 font-mono text-xs text-white outline-none transition placeholder:text-white/20 focus:border-[#C7FF00]"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="mb-5">
                            <label
                                htmlFor="password"
                                className="mb-2 block font-mono text-[10px] uppercase tracking-[0.15em] text-white/40"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <Lock
                                    size={15}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                                />

                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    className="h-12 w-full border border-white/10 bg-white/[0.02] pl-11 pr-4 font-mono text-xs text-white outline-none transition placeholder:text-white/20 focus:border-[#C7FF00]"
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-5 border border-red-500/20 bg-red-500/5 px-4 py-3 font-mono text-xs text-red-400">
                                <span className="mr-2">
                                    [ERROR]
                                </span>
                                {error}
                            </div>
                        )}

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group flex h-12 w-full items-center justify-between bg-[#C7FF00] px-5 font-mono text-xs font-bold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <span>
                                {loading
                                    ? "AUTHENTICATING..."
                                    : "ENTER DASHBOARD"}
                            </span>

                            {!loading && (
                                <ArrowRight
                                    size={16}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-white/20">
                        <span>KK. / PORTFOLIO</span>

                        <span>
                            Authorized Access Only
                        </span>
                    </div>
                </div>
            </div>
        </main>
    );
}