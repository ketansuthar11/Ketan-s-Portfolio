"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioProject } from "@/types/portfolio";
import { getStringArray } from "@/lib/portfolio-utils";

type ProjectsProps = {
    projects: PortfolioProject[];
};

export default function Projects({ projects }: ProjectsProps) {
    const visibleProjects = projects
        .filter((project) => project.isVisible)
        .sort((a, b) => a.order - b.order);

    if (visibleProjects.length === 0) {
        return null;
    }

    return (
        <section
            id="projects"
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
                    <span>05 / PROJECTS</span>
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
                    Things I&apos;ve{" "}
                    <span className="text-[#C7FF00]">
                        built
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
                    A selection of projects I&apos;ve built while
                    learning, experimenting and working with different
                    technologies.
                </p>
            </motion.div>

            {/* Projects */}
            <div className="space-y-6">
                {visibleProjects.map((project, index) => {
                    const technologies = getStringArray(
                        project.technologies
                    );
                    const features = getStringArray(project.features);

                    return (
                        <motion.article
                            key={project.id}
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                                amount: 0.12,
                            }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.08,
                            }}
                            className="
                                group relative overflow-hidden
                                border
                                border-black/[0.08]
                                bg-black/[0.012]
                                transition-all duration-300
                                hover:border-[#C7FF00]/25
                                dark:border-white/[0.08]
                                dark:bg-white/[0.012]
                            "
                        >
                            <div
                                className="
                                    grid
                                    lg:grid-cols-[0.82fr_1.18fr]
                                "
                            >
                                {/* Visual */}
                                <div
                                    className="
                                        relative flex
                                        min-h-[230px]
                                        items-center justify-center
                                        overflow-hidden
                                        border-b
                                        border-black/[0.08]
                                        bg-[#EEEEEC]
                                        sm:min-h-[270px]
                                        lg:min-h-[330px]
                                        lg:border-b-0
                                        lg:border-r
                                        dark:border-white/[0.08]
                                        dark:bg-[#070707]
                                    "
                                >
                                    {/* Grid */}
                                    <div
                                        className="
                                            absolute inset-0
                                            opacity-40
                                        "
                                        style={{
                                            backgroundImage: `
                                                linear-gradient(
                                                    rgba(0,0,0,0.05) 1px,
                                                    transparent 1px
                                                ),
                                                linear-gradient(
                                                    90deg,
                                                    rgba(0,0,0,0.05) 1px,
                                                    transparent 1px
                                                )
                                            `,
                                            backgroundSize: "42px 42px",
                                        }}
                                    />

                                    {/* Dark mode grid overlay */}
                                    <div
                                        className="
                                            pointer-events-none
                                            absolute inset-0
                                            hidden
                                            dark:block
                                        "
                                        style={{
                                            backgroundImage: `
                                                linear-gradient(
                                                    rgba(255,255,255,0.04) 1px,
                                                    transparent 1px
                                                ),
                                                linear-gradient(
                                                    90deg,
                                                    rgba(255,255,255,0.04) 1px,
                                                    transparent 1px
                                                )
                                            `,
                                            backgroundSize: "42px 42px",
                                        }}
                                    />

                                    {/* Glow */}
                                    <div
                                        className="
                                            absolute left-1/2 top-1/2
                                            h-40 w-40
                                            -translate-x-1/2
                                            -translate-y-1/2
                                            rounded-full
                                            bg-[#C7FF00]/[0.035]
                                            blur-[70px]
                                        "
                                    />

                                    {project.imageUrl ? (
                                        <img
                                            src={project.imageUrl}
                                            alt={project.title}
                                            className="
                                                relative z-10
                                                h-full w-full
                                                object-cover
                                            "
                                        />
                                    ) : (
                                        <div
                                            className="
                                                relative z-10
                                                w-[78%]
                                                max-w-[370px]
                                                transition-transform
                                                duration-500
                                                group-hover:-translate-y-1
                                            "
                                        >
                                            {/* Browser */}
                                            <div
                                                className="
                                                    overflow-hidden
                                                    border
                                                    border-black/[0.1]
                                                    bg-[#F7F7F5]
                                                    shadow-[0_20px_60px_rgba(0,0,0,0.12)]
                                                    transition-colors
                                                    duration-300
                                                    group-hover:border-[#C7FF00]/25
                                                    dark:border-white/[0.1]
                                                    dark:bg-[#050505]
                                                    dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]
                                                "
                                            >
                                                {/* Browser Header */}
                                                <div
                                                    className="
                                                        flex h-8
                                                        items-center
                                                        justify-between
                                                        border-b
                                                        border-black/[0.08]
                                                        px-3
                                                        dark:border-white/[0.08]
                                                    "
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-black/15 dark:bg-white/15" />
                                                        <span className="h-1.5 w-1.5 rounded-full bg-black/15 dark:bg-white/15" />
                                                        <span className="h-1.5 w-1.5 rounded-full bg-black/15 dark:bg-white/15" />
                                                    </div>

                                                    <span className="text-[8px] text-neutral-500 dark:text-neutral-700">
                                                        {project.slug}.app
                                                    </span>
                                                </div>

                                                {/* Preview */}
                                                <div className="p-4 sm:p-5">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <span className="text-[8px] tracking-[0.18em] text-[#C7FF00]/70">
                                                                PROJECT /{" "}
                                                                {String(
                                                                    index + 1
                                                                ).padStart(
                                                                    2,
                                                                    "0"
                                                                )}
                                                            </span>

                                                            <p className="mt-2 text-sm text-neutral-900 dark:text-neutral-200">
                                                                {project.title}
                                                            </p>
                                                        </div>

                                                        <span className="text-[9px] text-neutral-500 dark:text-neutral-700">
                                                            {String(
                                                                index + 1
                                                            ).padStart(
                                                                2,
                                                                "0"
                                                            )}
                                                        </span>
                                                    </div>

                                                    {/* Project Content */}
                                                    <div
                                                        className="
                                                            mt-5
                                                            border
                                                            border-black/[0.08]
                                                            p-3
                                                            dark:border-white/[0.08]
                                                        "
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="
                                                                    flex h-9 w-8
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    border
                                                                    border-black/10
                                                                    dark:border-white/10
                                                                "
                                                            >
                                                                <span className="text-[7px] text-[#C7FF00]">
                                                                    {project.title
                                                                        .slice(
                                                                            0,
                                                                            3
                                                                        )
                                                                        .toUpperCase()}
                                                                </span>
                                                            </div>

                                                            <div className="flex-1 space-y-2">
                                                                <div className="h-1.5 w-3/4 bg-black/15 dark:bg-white/15" />
                                                                <div className="h-1.5 w-full bg-black/[0.07] dark:bg-white/[0.07]" />
                                                                <div className="h-1.5 w-2/3 bg-black/[0.07] dark:bg-white/[0.07]" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Status Flow */}
                                                    <div className="mt-5 flex items-center gap-2">
                                                        <span className="h-1 w-1 shrink-0 rounded-full bg-[#C7FF00]" />

                                                        <div className="h-px flex-1 bg-black/[0.08] dark:bg-white/[0.08]" />

                                                        <span className="text-[8px] tracking-[0.1em] text-neutral-500 dark:text-neutral-600">
                                                            BUILD
                                                        </span>

                                                        <div className="h-px flex-1 bg-black/[0.08] dark:bg-white/[0.08]" />

                                                        <span className="h-1 w-1 shrink-0 rounded-full bg-black/20 dark:bg-white/20" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Floating Label */}
                                            <div
                                                className="
                                                    absolute -bottom-3
                                                    -right-3
                                                    border
                                                    border-black/[0.08]
                                                    bg-[#F7F7F5]
                                                    px-3 py-2
                                                    dark:border-white/[0.08]
                                                    dark:bg-[#080808]
                                                "
                                            >
                                                <span className="text-[8px] tracking-[0.12em] text-neutral-500 dark:text-neutral-600">
                                                    {technologies
                                                        .slice(0, 2)
                                                        .join(" · ")}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Number */}
                                    <span
                                        className="
                                            absolute left-5 top-5
                                            z-20
                                            text-[9px]
                                            tracking-[0.16em]
                                            text-neutral-500
                                            dark:text-neutral-700
                                        "
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>

                                {/* Details */}
                                <div
                                    className="
                                        flex flex-col
                                        p-5
                                        sm:p-7
                                        lg:p-8
                                    "
                                >
                                    {/* Heading */}
                                    <div className="flex items-start justify-between gap-5">
                                        <div>
                                            {project.isFeatured && (
                                                <div
                                                    className="
                                                        mb-3
                                                        flex items-center gap-2
                                                        text-[9px]
                                                        tracking-[0.16em]
                                                        text-[#C7FF00]/80
                                                    "
                                                >
                                                    <span className="h-1 w-1 rounded-full bg-[#C7FF00]" />
                                                    FEATURED
                                                </div>
                                            )}

                                            <h3
                                                className="
                                                    text-xl
                                                    font-medium
                                                    tracking-tight
                                                    text-neutral-900
                                                    dark:text-white
                                                    sm:text-2xl
                                                "
                                            >
                                                {project.title}
                                            </h3>
                                        </div>

                                        <ArrowUpRight
                                            size={19}
                                            className="
                                                shrink-0
                                                text-neutral-500
                                                transition-all
                                                duration-300
                                                group-hover:-translate-y-0.5
                                                group-hover:translate-x-0.5
                                                group-hover:text-[#C7FF00]
                                                dark:text-neutral-700
                                            "
                                        />
                                    </div>

                                    {/* Description */}
                                    {project.description && (
                                        <p
                                            className="
                                                mt-5
                                                max-w-2xl
                                                text-[13px]
                                                leading-7
                                                text-neutral-600
                                                dark:text-neutral-400
                                                sm:text-sm
                                            "
                                        >
                                            {project.description}
                                        </p>
                                    )}

                                    {/* Features */}
                                    {features.length > 0 && (
                                        <ul className="mt-5 space-y-2.5">
                                            {features.map(
                                                (feature) => (
                                                    <li
                                                        key={feature}
                                                        className="
                                                            flex gap-3
                                                            text-[12px]
                                                            leading-6
                                                            text-neutral-600
                                                            dark:text-neutral-500
                                                            sm:text-[13px]
                                                        "
                                                    >
                                                        <span
                                                            className="
                                                                mt-[9px]
                                                                h-1 w-1
                                                                shrink-0
                                                                bg-[#C7FF00]/60
                                                            "
                                                        />

                                                        <span>
                                                            {feature}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}

                                    {/* Footer */}
                                    <div className="mt-auto pt-7">
                                        <div
                                            className="
                                                border-t
                                                border-black/[0.07]
                                                pt-5
                                                dark:border-white/[0.07]
                                            "
                                        >
                                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                                {technologies.map(
                                                    (technology) => (
                                                        <span
                                                            key={technology}
                                                            className="
                                                                text-[10px]
                                                                text-neutral-600
                                                                transition-colors
                                                                duration-300
                                                                group-hover:text-neutral-900
                                                                dark:text-neutral-600
                                                                dark:group-hover:text-neutral-400
                                                                sm:text-[11px]
                                                            "
                                                        >
                                                            {technology}
                                                        </span>
                                                    )
                                                )}
                                            </div>

                                            {/* Links */}
                                            {(project.githubUrl ||
                                                project.liveUrl) && (
                                                <div className="mt-5 flex flex-wrap gap-5">
                                                    {project.githubUrl && (
                                                        <a
                                                            href={
                                                                project.githubUrl
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-2
                                                                text-xs
                                                                text-neutral-600
                                                                transition-colors
                                                                hover:text-[#C7FF00]
                                                                dark:text-neutral-400
                                                            "
                                                        >
                                                            GitHub
                                                            <ArrowUpRight
                                                                size={13}
                                                            />
                                                        </a>
                                                    )}

                                                    {project.liveUrl && (
                                                        <a
                                                            href={
                                                                project.liveUrl
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="
                                                                inline-flex
                                                                items-center
                                                                gap-2
                                                                text-xs
                                                                text-neutral-600
                                                                transition-colors
                                                                hover:text-[#C7FF00]
                                                                dark:text-neutral-400
                                                            "
                                                        >
                                                            Live Demo
                                                            <ArrowUpRight
                                                                size={13}
                                                            />
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.article>
                    );
                })}
            </div>

            {/* Bottom Note */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="
                    mt-6
                    text-[9px]
                    tracking-[0.14em]
                    text-neutral-500
                    dark:text-neutral-700
                    sm:text-[10px]
                "
            >
                MORE PROJECTS WILL BE ADDED AS I BUILD
            </motion.div>
        </section>
    );
}