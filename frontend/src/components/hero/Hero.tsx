"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { useState } from "react";
import HeroScene from "./HeroScene";
import type {
    PortfolioProfile,
    PortfolioSkill,
} from "@/types/portfolio";
import { getDefaultResumeUrl } from "@/lib/api/portfolio";
import { getPrimaryRole } from "@/lib/portfolio-utils";

type HeroProps = {
    profile: PortfolioProfile | null;
    skills: PortfolioSkill[];
};

export default function Hero({ profile, skills }: HeroProps) {
    const [isDownloadingResume, setIsDownloadingResume] = useState(false);
    const [resumeError, setResumeError] = useState<string | null>(null);

    if (!profile) {
        return null;
    }

    const primaryRole = getPrimaryRole(profile.roles);

    const techStack = skills.slice(0, 6);

    const hasDefaultResume = profile.resumes.some(
        (resume) => resume.isDefault
    );

    const handleResumeDownload = async () => {
        setResumeError(null);
        setIsDownloadingResume(true);

        try {
            const url = await getDefaultResumeUrl();

            const link = document.createElement("a");
            link.href = url;
            link.target = "_blank";
            link.rel = "noreferrer";

            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            setResumeError(
                error instanceof Error
                    ? error.message
                    : "Failed to download resume"
            );
        } finally {
            setIsDownloadingResume(false);
        }
    };

    return (
        <section
            id="home"
            className="
                relative
                z-10
                flex
                min-h-screen
                w-full
                max-w-full
                items-center
                overflow-x-hidden
            "
        >
            <div
                className="
                    mx-auto
                    w-full
                    max-w-7xl
                    min-w-0
                    px-5
                    pb-10
                    pt-24
                    sm:px-6
                    sm:pb-14
                    sm:pt-28
                    lg:px-8
                    lg:pb-16
                    lg:pt-28
                "
            >
                <div
                    className="
                        grid
                        min-w-0
                        grid-cols-1
                        items-center
                        gap-0
                        lg:grid-cols-[0.9fr_1.1fr]
                        lg:gap-2
                        xl:grid-cols-[0.95fr_1.05fr]
                    "
                >
                    {/* Left Content */}
                    <div
                        className="
                            relative
                            z-20
                            min-w-0
                            max-w-xl
                        "
                    >
                        {/* Heading */}
                        <h1
                            className="
                                max-w-full
                                break-words
                                text-[30px]
                                font-medium
                                leading-[1.12]
                                tracking-tight
                                text-neutral-900
                                dark:text-white
                                sm:text-[40px]
                                lg:max-w-lg
                                lg:text-[48px]
                                xl:text-[52px]
                            "
                        >
                            Hi, I&apos;m{" "}
                            <span className="text-[#C7FF00]">
                                {profile.name}
                            </span>

                            <br />

                            {primaryRole && (
                                <span className="text-neutral-700 dark:text-neutral-200">
                                    {primaryRole}
                                </span>
                            )}
                        </h1>

                        {/* Description */}
                        {profile.bio && (
                            <p
                                className="
                                    mt-5
                                    max-w-full
                                    text-[13px]
                                    leading-6
                                    text-neutral-600
                                    dark:text-neutral-300
                                    sm:mt-6
                                    sm:max-w-lg
                                    sm:text-[15px]
                                    sm:leading-7
                                "
                            >
                                {profile.bio}
                            </p>
                        )}

                        {/* Actions */}
                        <div
                            className="
                                mt-7
                                flex
                                max-w-full
                                flex-wrap
                                items-center
                                gap-2.5
                                sm:mt-8
                                sm:gap-3
                            "
                        >
                            <Link
                                href="#projects"
                                className="
                                    group
                                    inline-flex
                                    min-h-10
                                    shrink-0
                                    items-center
                                    gap-2
                                    bg-[#C7FF00]
                                    px-4
                                    py-2.5
                                    text-xs
                                    font-medium
                                    text-black
                                    transition-all
                                    duration-300
                                    hover:-translate-y-0.5
                                    hover:bg-[#D4FF33]
                                    sm:px-5
                                    sm:text-sm
                                "
                            >
                                View Projects

                                <ArrowUpRight
                                    size={15}
                                    className="
                                        transition-transform
                                        duration-300
                                        group-hover:translate-x-0.5
                                        group-hover:-translate-y-0.5
                                    "
                                />
                            </Link>

                            <Link
                                href="#contact"
                                className="
                                    inline-flex
                                    min-h-10
                                    shrink-0
                                    items-center
                                    gap-2
                                    border
                                    border-black/10
                                    bg-black/[0.02]
                                    px-4
                                    py-2.5
                                    text-xs
                                    text-neutral-700
                                    transition-all
                                    duration-300
                                    hover:border-[#C7FF00]/40
                                    hover:text-[#C7FF00]
                                    dark:border-white/10
                                    dark:bg-white/[0.02]
                                    dark:text-neutral-300
                                    sm:px-5
                                    sm:text-sm
                                "
                            >
                                Contact Me
                            </Link>

                            {hasDefaultResume && (
                                <button
                                    type="button"
                                    disabled={isDownloadingResume}
                                    onClick={handleResumeDownload}
                                    className="
                                        inline-flex
                                        min-h-10
                                        shrink-0
                                        items-center
                                        gap-2
                                        px-1
                                        py-2.5
                                        text-xs
                                        text-neutral-600
                                        transition-colors
                                        duration-300
                                        hover:text-[#C7FF00]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                        dark:text-neutral-500
                                        sm:px-2
                                        sm:text-sm
                                    "
                                >
                                    <Download size={15} />

                                    {isDownloadingResume
                                        ? "Opening..."
                                        : "Resume"}
                                </button>
                            )}
                        </div>

                        {resumeError && (
                            <p className="mt-2 text-xs text-red-400">
                                {resumeError}
                            </p>
                        )}

                        {/* Tech Stack */}
                        <div
                            className="
                                mt-8
                                flex
                                max-w-full
                                flex-wrap
                                items-center
                                gap-x-2.5
                                gap-y-2
                                overflow-hidden
                                text-[9px]
                                text-neutral-500
                                sm:mt-9
                                sm:max-w-lg
                                sm:gap-x-3
                                sm:text-[11px]
                                dark:text-neutral-600
                            "
                        >
                            {techStack.map((skill, index) => (
                                <span
                                    key={skill.id}
                                    className="shrink-0"
                                >
                                    {index > 0 && (
                                        <span className="mr-2.5 text-neutral-400 dark:text-neutral-800">
                                            •
                                        </span>
                                    )}

                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right 3D Area */}
                    <div
                        className="
                            relative
                            z-10
                            -mt-4
                            flex
                            min-h-[330px]
                            min-w-0
                            w-full
                            max-w-full
                            items-center
                            justify-center
                            overflow-hidden
                            sm:-mt-2
                            sm:min-h-[400px]
                            lg:mt-0
                            lg:min-h-[540px]
                            xl:min-h-[570px]
                        "
                    >
                        {/* Very subtle lime atmosphere */}
                        <div
                            className="
                                pointer-events-none
                                absolute
                                left-1/2
                                top-1/2
                                h-48
                                w-48
                                -translate-x-1/2
                                -translate-y-1/2
                                rounded-full
                                bg-[#C7FF00]/[0.025]
                                blur-[90px]
                                sm:h-72
                                sm:w-72
                                sm:blur-[120px]
                            "
                        />

                        <div
                            className="
                                relative
                                h-[420px]
                                w-full
                                max-w-full
                                min-w-0
                                overflow-hidden
                                sm:h-[420px]
                                md:h-[480px]
                                lg:h-[540px]
                                xl:h-[560px]
                            "
                        >
                            <HeroScene
                                profile={profile}
                                skills={techStack}
                            />
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div
                    className="
                        mt-0
                        hidden
                        items-center
                        gap-3
                        text-[10px]
                        tracking-wide
                        text-neutral-600
                        dark:text-neutral-700
                        lg:flex
                    "
                >
                    <span>Scroll to explore</span>

                    <ArrowDown
                        size={13}
                        className="animate-bounce"
                    />
                </div>
            </div>
        </section>
    );
}