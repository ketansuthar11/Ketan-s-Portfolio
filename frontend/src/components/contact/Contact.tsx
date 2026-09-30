"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FormEvent, useState } from "react";
import type { PortfolioProfile } from "@/types/portfolio";
import { submitContactMessage } from "@/lib/api/portfolio";

type ContactForm = {
    name: string;
    email: string;
    message: string;
};

const initialForm: ContactForm = {
    name: "",
    email: "",
    message: "",
};

type ContactProps = {
    profile: PortfolioProfile | null;
};

export default function Contact({ profile }: ContactProps) {
    const [form, setForm] = useState<ContactForm>(initialForm);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const socialLinks = (profile?.socialLinks ?? [])
        .filter((link) => link.isVisible)
        .sort((a, b) => a.order - b.order);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await submitContactMessage(form);
            setSubmitted(true);
            setForm(initialForm);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to send message"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section
            id="contact"
            className="
                relative mx-auto w-full max-w-7xl
                px-5 py-20
                sm:px-6 sm:py-24
                lg:px-8 lg:py-28
            "
        >
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
                className="mb-10 sm:mb-12"
            >
                <div
                    className="
                        mb-4 flex items-center gap-3
                        text-[10px] tracking-[0.18em]
                        text-neutral-500
                        sm:text-xs
                    "
                >
                    <span className="h-1.5 w-1.5 bg-[#C7FF00]" />
                    <span>06 / CONTACT</span>
                </div>

                <h2
                    className="
                        text-[30px]
                        font-medium
                        leading-[1.15]
                        tracking-tight
                        text-neutral-900
                        dark:text-white
                        sm:text-[36px]
                        lg:text-[40px]
                    "
                >
                    Let&apos;s{" "}
                    <span className="text-[#C7FF00]">
                        talk
                    </span>
                </h2>

                <p
                    className="
                        mt-4 max-w-xl
                        text-[14px]
                        leading-7
                        text-neutral-600
                        dark:text-neutral-400
                        sm:text-[15px]
                    "
                >
                    Have a project, opportunity or just want to
                    connect? Feel free to send me a message.
                </p>
            </motion.div>

            {/* Content */}
            <div
                className="
                    grid gap-12
                    lg:grid-cols-[0.7fr_1.3fr]
                    lg:gap-20
                "
            >
                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.5 }}
                    className="
                        flex flex-col
                        lg:min-h-[430px]
                    "
                >
                    {/* Email */}
                    <div>
                        <p
                            className="
                                text-[10px]
                                tracking-[0.16em]
                                text-neutral-600
                                sm:text-xs
                            "
                        >
                            GET IN TOUCH
                        </p>

                        {profile?.email && (
                            <a
                                href={`mailto:${profile.email}`}
                                className="
                                    mt-3 inline-flex
                                    items-center gap-2
                                    text-sm
                                    text-neutral-700
                                    dark:text-neutral-300
                                    transition-colors
                                    hover:text-[#C7FF00]
                                "
                            >
                                {profile.email}

                                <ArrowUpRight
                                    size={14}
                                    className="
                                        transition-transform
                                        duration-300
                                        group-hover:-translate-y-0.5
                                    "
                                />
                            </a>
                        )}
                    </div>

                    {/* Location */}
                    {profile?.location && (
                        <div className="mt-10">
                            <p
                                className="
                                    text-[10px]
                                    tracking-[0.16em]
                                    text-neutral-600
                                    sm:text-xs
                                "
                            >
                                LOCATION
                            </p>

                            <p
                                className="
                                    mt-3 max-w-xs
                                    text-[13px]
                                    leading-6
                                    text-neutral-600
                                    dark:text-neutral-500
                                    sm:text-sm
                                "
                            >
                                {profile.location}
                            </p>
                        </div>
                    )}

                    {/* Social Links */}
                    <div className="mt-10 lg:mt-auto lg:pt-12">
                        <p
                            className="
                                mb-4
                                text-[9px]
                                tracking-[0.16em]
                                text-neutral-600
                                sm:text-[10px]
                            "
                        >
                            FIND ME ONLINE
                        </p>

                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        text-xs
                                        text-neutral-600
                                        dark:text-neutral-500
                                        transition-colors
                                        hover:text-[#C7FF00]
                                    "
                                >
                                    {link.platform}
                                </a>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.1,
                    }}
                >
                    {submitted ? (
                        <div
                            className="
                                flex min-h-[320px]
                                flex-col
                                items-center
                                justify-center
                                border
                                border-[#C7FF00]/20
                                bg-[#C7FF00]/[0.018]
                                px-6
                                text-center
                            "
                        >
                            <span
                                className="
                                    flex h-10 w-10
                                    items-center justify-center
                                    border
                                    border-[#C7FF00]/40
                                    text-[#C7FF00]
                                "
                            >
                                ✓
                            </span>

                            <h3
                                className="
                                    mt-5
                                    text-lg
                                    font-medium
                                    text-neutral-900
                                    dark:text-white
                                "
                            >
                                Message received
                            </h3>

                            <p
                                className="
                                    mt-2
                                    max-w-sm
                                    text-[13px]
                                    leading-6
                                    text-neutral-600
                                    dark:text-neutral-500
                                "
                            >
                                Thanks for reaching out. I&apos;ll
                                get back to you soon.
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-7"
                        >
                            {/* Name + Email */}
                            <div
                                className="
                                    grid gap-6
                                    sm:grid-cols-2
                                "
                            >
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="
                                            mb-2 block
                                            text-[10px]
                                            tracking-[0.12em]
                                            text-neutral-600
                                        "
                                    >
                                        NAME
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        value={form.name}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                name: event.target.value,
                                            })
                                        }
                                        placeholder="Your name"
                                        className="
                                            w-full
                                            border-b
                                            border-black/[0.12]
                                            dark:border-white/[0.1]
                                            bg-transparent
                                            px-0 py-3
                                            text-sm
                                            text-neutral-900
                                            dark:text-white
                                            outline-none
                                            placeholder:text-neutral-400
                                            dark:placeholder:text-neutral-700
                                            transition-colors
                                            focus:border-[#C7FF00]
                                        "
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="
                                            mb-2 block
                                            text-[10px]
                                            tracking-[0.12em]
                                            text-neutral-600
                                        "
                                    >
                                        EMAIL
                                    </label>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={form.email}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                email: event.target.value,
                                            })
                                        }
                                        placeholder="you@example.com"
                                        className="
                                            w-full
                                            border-b
                                            border-black/[0.12]
                                            dark:border-white/[0.1]
                                            bg-transparent
                                            px-0 py-3
                                            text-sm
                                            text-neutral-900
                                            dark:text-white
                                            outline-none
                                            placeholder:text-neutral-400
                                            dark:placeholder:text-neutral-700
                                            transition-colors
                                            focus:border-[#C7FF00]
                                        "
                                    />
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label
                                    htmlFor="message"
                                    className="
                                        mb-2 block
                                        text-[10px]
                                        tracking-[0.12em]
                                        text-neutral-600
                                    "
                                >
                                    MESSAGE
                                </label>

                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={6}
                                    value={form.message}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            message:
                                                event.target.value,
                                        })
                                    }
                                    placeholder="Tell me a little about your project or opportunity..."
                                    className="
                                        w-full
                                        resize-none
                                        border-b
                                        border-black/[0.12]
                                        dark:border-white/[0.1]
                                        bg-transparent
                                        px-0 py-3
                                        text-sm
                                        leading-7
                                        text-neutral-900
                                        dark:text-white
                                        outline-none
                                        placeholder:text-neutral-400
                                        dark:placeholder:text-neutral-700
                                        transition-colors
                                        focus:border-[#C7FF00]
                                    "
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    gap-2
                                    bg-[#C7FF00]
                                    px-5 py-3
                                    text-xs
                                    font-medium
                                    text-black
                                    transition-all
                                    duration-300
                                    hover:-translate-y-0.5
                                    hover:bg-[#D4FF33]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                {isSubmitting
                                    ? "Sending..."
                                    : "Send Message"}

                                <ArrowUpRight
                                    size={15}
                                    className="
                                        transition-transform
                                        duration-300
                                        group-hover:translate-x-0.5
                                        group-hover:-translate-y-0.5
                                    "
                                />
                            </button>

                            {error && (
                                <p className="text-xs text-red-400">
                                    {error}
                                </p>
                            )}
                        </form>
                    )}
                </motion.div>
            </div>

            {/* Bottom Divider */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="
                    mt-16 origin-left
                    border-t
                    border-black/[0.08]
                    dark:border-white/[0.08]
                    sm:mt-20
                "
            />

            {/* Footer Meta */}
            <div
                className="
                    mt-5 flex flex-col gap-2
                    text-[9px]
                    tracking-[0.12em]
                    text-neutral-600
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:text-[10px]
                "
            >
                <span>THANKS FOR VISITING</span>

                {profile?.name && (
                    <span>
                        © {new Date().getFullYear()} {profile.name}
                    </span>
                )}
            </div>
        </section>
    );
}