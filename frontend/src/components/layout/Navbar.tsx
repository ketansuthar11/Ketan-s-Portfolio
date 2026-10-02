"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Eye } from "lucide-react";

import type {
    PortfolioProfile,
    PortfolioSection,
    PortfolioSectionType,
} from "@/types/portfolio";

import { getInitials } from "@/lib/portfolio-utils";
import ThemeToggle from "@/components/theme/ThemeToggle";

type SectionVisibility = Record<
    "home" | "about" | "skills" | "experience" | "education" | "projects" | "contact",
    boolean
>;
import {
    recordPortfolioView,
    getUniqueVisitorCount,
    registerVisitor,
} from "@/lib/api/portfolio";

import { getVisitorId } from "@/lib/visitor";

type NavbarProps = {
    profile: PortfolioProfile | null;
    sections: PortfolioSection[];
    sectionVisibility: SectionVisibility;
};

const sectionHrefByType: Partial<
    Record<PortfolioSectionType, string>
> = {
    HOME: "#home",
    SKILLS: "#skills",
    EXPERIENCE: "#experience",
    EDUCATION: "#education",
    PROJECTS: "#projects",
    CONTACT: "#contact",
};

export default function Navbar({
    profile,
    sections,
    sectionVisibility,
}: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [isScrolled, setIsScrolled] = useState(false);

    // Live view count
    const [viewCount, setViewCount] = useState<number | null>(null);

    // View popup
    const [showViewPopup, setShowViewPopup] = useState(false);

    // Prevent duplicate view recording in development
    const hasRecordedView = useRef(false);

    /*
     * Record portfolio view when the page loads
     */
    useEffect(() => {
        if (hasRecordedView.current) return;

        hasRecordedView.current = true;

        const trackVisitorAndView = async () => {
            try {
                // 1. Get or create anonymous visitor ID
                const visitorId = getVisitorId();

                // 2. Register/update unique visitor
                await registerVisitor(visitorId);

                // 3. Record page view
                await recordPortfolioView();

                // 4. Get fresh total views
                const totalViews = await getUniqueVisitorCount();

                setViewCount(totalViews);
                setShowViewPopup(true);

                setTimeout(() => {
                    setShowViewPopup(false);
                }, 3000);
            } catch (error) {
                console.error(
                    "Failed to track visitor/view:",
                    error
                );
            }
        };

        trackVisitorAndView();
    }, []);

    /*
     * Navigation items
     */
    const navItems = useMemo(() => {
        const items = sections
            .map((section) => ({
                label: section.name,
                href:
                    sectionHrefByType[section.type] ??
                    (section.slug.toLowerCase() === "about"
                        ? "#about"
                        : null),
                order: section.order,
            }))
            .filter(
                (
                    item
                ): item is {
                    label: string;
                    href: string;
                    order: number;
                } => item.href !== null
            )
            .sort((a, b) => a.order - b.order);

        if (!items.some((item) => item.href === "#home")) {
            items.unshift({
                label: "Home",
                href: "#home",
                order: -1,
            });
        }

        if (
            sectionVisibility.about &&
            !items.some((item) => item.href === "#about")
        ) {
            items.splice(1, 0, {
                label: "About",
                href: "#about",
                order: 0,
            });
        }

        return items.filter((item) => {
            const sectionId =
                item.href.slice(1) as keyof SectionVisibility;

            return sectionVisibility[sectionId];
        });
    }, [sectionVisibility, sections]);

    /*
     * Navbar scroll state
     */
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    /*
     * Active section detection
     */
    useEffect(() => {
        const sections = navItems
            .map((item) => document.querySelector(item.href))
            .filter(
                (section): section is Element =>
                    section !== null
            );

        if (sections.length === 0) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const visibleSections = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            b.intersectionRatio -
                            a.intersectionRatio
                    );

                if (visibleSections[0]) {
                    setActiveSection(
                        visibleSections[0].target.id
                    );
                }
            },
            {
                rootMargin: "-25% 0px -60% 0px",
                threshold: [0, 0.1, 0.25, 0.5],
            }
        );

        sections.forEach((section) => {
            observer.observe(section);
        });

        return () => {
            observer.disconnect();
        };
    }, [navItems]);

    const handleNavClick = () => {
        setIsOpen(false);
    };

    return (
        <header
            className={`
                fixed
                left-0
                right-0
                top-0
                z-50
                transition-all
                duration-300
                ${isScrolled
                    ? `
                            border-b
                            border-black/[0.07]
                            bg-[#F7F7F5]/80
                            backdrop-blur-md
                            dark:border-white/[0.07]
                            dark:bg-black/80
                        `
                    : "bg-transparent"
                }
            `}
        >
            <nav
                className="
                    mx-auto
                    flex
                    h-[72px]
                    max-w-7xl
                    items-center
                    justify-between
                    px-4
                    sm:px-6
                    lg:px-8
                "
            >
                {/* Logo */}
                <Link
                    href="#home"
                    onClick={handleNavClick}
                    className="group flex min-w-0 items-center gap-2"
                >
                    <span
                        className="
                            shrink-0
                            text-lg
                            font-medium
                            tracking-tight
                            text-neutral-900
                            dark:text-white
                        "
                    >
                        {getInitials(profile?.name ?? "") || "P"}

                        <span className="text-[var(--lime)]">
                            .
                        </span>
                    </span>

                    <span
                        className="
                            hidden
                            truncate
                            border-l
                            border-black/10
                            pl-2.5
                            text-xs
                            text-neutral-500
                            transition-colors
                            group-hover:text-neutral-800
                            dark:border-white/10
                            dark:text-neutral-500
                            dark:group-hover:text-neutral-300
                            sm:block
                        "
                    >
                        {profile?.name}
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div
                    className="
                        hidden
                        items-center
                        gap-5
                        lg:flex
                    "
                >
                    {navItems.map((item) => {
                        const sectionId =
                            item.href.replace("#", "");

                        const isActive =
                            activeSection === sectionId;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    group
                                    relative
                                    px-1
                                    py-2
                                    text-[11px]
                                    transition-colors
                                    duration-200
                                    ${isActive
                                        ? `
                                                text-neutral-900
                                                dark:text-white
                                            `
                                        : `
                                                text-neutral-500
                                                hover:text-neutral-900
                                                dark:text-neutral-500
                                                dark:hover:text-neutral-200
                                            `
                                    }
                                `}
                            >
                                {item.label}

                                {/* Active indicator */}
                                <span
                                    className={`
                                        absolute
                                        -bottom-0.5
                                        left-1/2
                                        h-px
                                        -translate-x-1/2
                                        bg-[var(--lime)]
                                        transition-all
                                        duration-300
                                        ${isActive
                                            ? "w-full opacity-100"
                                            : "w-0 opacity-0 group-hover:w-full group-hover:opacity-60"
                                        }
                                    `}
                                />
                            </Link>
                        );
                    })}
                </div>

                {/* Right Controls */}
                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                        sm:gap-3
                    "
                >
                    {/* View Count + Popup */}
                    <div className="relative">
                        <div
                            className="
                                flex
                                items-center
                                gap-1.5
                                text-[10px]
                                text-neutral-500
                                dark:text-neutral-500
                            "
                            title="Portfolio views"
                        >
                            <Eye size={13} />

                            {viewCount === null ? (
                                <span
                                    className="
                                        inline-block
                                        h-2.5
                                        w-6
                                        animate-pulse
                                        bg-neutral-200
                                        dark:bg-neutral-800
                                    "
                                />
                            ) : (
                                <span>
                                    {viewCount.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Popup directly below view count */}
                        {showViewPopup && viewCount !== null && (
                            <div
                                className="
                                    absolute
                                    right-0
                                    top-full
                                    mt-2
                                    z-[70]
                                    w-max
                                    max-w-[190px]
                                    border
                                    border-black/10
                                    bg-white/95
                                    px-3
                                    py-2
                                    text-[10px]
                                    font-medium
                                    text-neutral-800
                                    shadow-lg
                                    backdrop-blur-md
                                    animate-in
                                    fade-in
                                    slide-in-from-top-1
                                    dark:border-white/10
                                    dark:bg-neutral-900/95
                                    dark:text-white
                                "
                            >
                                👀 I see you.
                            </div>
                        )}
                    </div>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Desktop CTA */}
                    <Link
                        href="#contact"
                        className="
                            group
                            hidden
                            items-center
                            gap-2
                            border
                            border-[#B8C400]
                            bg-[#C7FF00]
                            px-4
                            py-2
                            text-[11px]
                            font-medium
                            text-black
                            transition-all
                            duration-300
                            hover:border-[#C9D45A]
                            hover:bg-black
                            hover:text-[#C7FF00]
                            dark:border-[#C7FF00]/40
                            dark:bg-transparent
                            dark:text-[#C7FF00]
                            dark:hover:border-[#C7FF00]/70
                            dark:hover:bg-[#C7FF00]
                            dark:hover:text-black
                            md:flex
                        "
                    >
                        Let's Talk

                        <ArrowUpRight
                            size={13}
                            className="
                                transition-transform
                                duration-300
                                group-hover:translate-x-0.5
                                group-hover:-translate-y-0.5
                            "
                        />
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        aria-label={
                            isOpen
                                ? "Close navigation menu"
                                : "Open navigation menu"
                        }
                        aria-expanded={isOpen}
                        onClick={() =>
                            setIsOpen((previous) => !previous)
                        }
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            border
                            border-black/10
                            text-neutral-600
                            transition-colors
                            hover:border-[#B8C400]/50
                            hover:text-[#B8C400]
                            dark:border-white/10
                            dark:text-neutral-400
                            dark:hover:border-[#C7FF00]/40
                            dark:hover:text-[#C7FF00]
                            md:hidden
                        "
                    >
                        {isOpen ? (
                            <X size={18} />
                        ) : (
                            <Menu size={18} />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <div
                className={`
                    overflow-hidden
                    border-b
                    border-black/[0.07]
                    bg-[#F7F7F5]/95
                    transition-all
                    duration-300
                    dark:border-white/[0.07]
                    dark:bg-black/95
                    md:hidden
                    ${isOpen
                        ? "max-h-[520px] opacity-100"
                        : "max-h-0 border-transparent opacity-0"
                    }
                `}
            >
                <div className="px-6 pb-5 pt-2">
                    <div
                        className="
                            border-t
                            border-black/[0.07]
                            pt-3
                            dark:border-white/[0.07]
                        "
                    >
                        {navItems.map((item) => {
                            const sectionId =
                                item.href.replace("#", "");

                            const isActive =
                                activeSection === sectionId;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={handleNavClick}
                                    className={`
                                        flex
                                        items-center
                                        justify-between
                                        border-b
                                        border-black/[0.05]
                                        py-3.5
                                        text-sm
                                        transition-colors
                                        dark:border-white/[0.05]
                                        ${isActive
                                            ? "text-[#B8C400] dark:text-[#C7FF00]"
                                            : `
                                                    text-neutral-600
                                                    hover:text-neutral-900
                                                    dark:text-neutral-400
                                                    dark:hover:text-white
                                                `
                                        }
                                    `}
                                >
                                    <span>{item.label}</span>

                                    {isActive && (
                                        <span className="h-1.5 w-1.5 bg-[#B8C400] dark:bg-[#C7FF00]" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <Link
                        href="#contact"
                        className="
                            group
                            hidden
                            items-center
                            gap-2
                            bg-[#C7FF00]
                            px-4
                            py-2
                            text-[11px]
                            font-medium
                            text-black
                            transition-colors
                            duration-300
                            hover:bg-[#D7FF4A]
                            md:flex
                        "
                    >
                        Let's Talk

                        <ArrowUpRight
                            size={13}
                            className="
                                transition-transform
                                duration-300
                                group-hover:translate-x-0.5
                                group-hover:-translate-y-0.5
                            "
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
}