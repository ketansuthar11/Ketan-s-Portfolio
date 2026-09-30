"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
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

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

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
                    px-6
                    lg:px-8
                "
            >
                {/* Logo */}
                <Link
                    href="#home"
                    onClick={handleNavClick}
                    className="group flex items-center gap-2"
                >
                    <span
                        className="
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
                        items-center
                        gap-3
                    "
                >
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
        </header >
    );
}