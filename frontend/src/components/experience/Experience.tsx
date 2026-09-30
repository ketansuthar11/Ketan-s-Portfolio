"use client";

import { motion } from "framer-motion";
import type { PortfolioExperience } from "@/types/portfolio";
import { getStringArray } from "@/lib/portfolio-utils";

function formatDate(date: string) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
}

type ExperienceProps = {
    experiences: PortfolioExperience[];
};

export default function Experience({ experiences }: ExperienceProps) {
    const visibleExperiences = experiences
        .filter((experience) => experience.isVisible)
        .sort((a, b) => a.order - b.order);

    if (visibleExperiences.length === 0) {
        return null;
    }

    return (
        <section
            id="experience"
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
                    <span>03 / EXPERIENCE</span>
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
                    Where I&apos;ve{" "}
                    <span className="text-[#C7FF00]">
                        worked
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
                    A few places where I&apos;ve gained experience,
                    worked on projects and learned along the way.
                </p>
            </motion.div>

            {/* Timeline */}
            <div className="relative">
                {/* Timeline Line */}
                <div
                    className="
                        absolute
                        bottom-4
                        left-[5px]
                        top-5
                        w-px
                        bg-gradient-to-b
                        from-[#C7FF00]/40
                        via-black/[0.10]
                        dark:via-white/[0.10]
                        to-transparent
                        sm:left-[6px]
                    "
                />

                <div className="space-y-10 sm:space-y-12">
                    {visibleExperiences.map((experience, index) => {
                        const responsibilities = getStringArray(
                            experience.responsibilities
                        );

                        return (
                            <motion.article
                                key={experience.id}
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
                                    amount: 0.15,
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.08,
                                }}
                                className="
                                    group
                                    relative
                                    pl-7
                                    sm:pl-10
                                    lg:pl-12
                                "
                            >
                                {/* Timeline Node */}
                                <div
                                    className="
                                        absolute
                                        left-0
                                        top-1
                                        flex
                                        h-3
                                        w-3
                                        items-center
                                        justify-center
                                        sm:h-4
                                        sm:w-4
                                    "
                                >
                                    <span
                                        className="
                                            h-1.5
                                            w-1.5
                                            rounded-full
                                            border
                                            border-[#C7FF00]
                                            bg-[#F7F7F5]
                                            dark:bg-black
                                            transition-all
                                            duration-300
                                            group-hover:bg-[#C7FF00]
                                            group-hover:shadow-[0_0_12px_rgba(199,255,0,0.3)]
                                            sm:h-2
                                            sm:w-2
                                        "
                                    />
                                </div>

                                {/* Connector */}
                                <div
                                    className="
                                        absolute
                                        left-[6px]
                                        top-[7px]
                                        h-px
                                        w-4
                                        bg-black/10
                                        dark:bg-white/10
                                        transition-colors
                                        duration-300
                                        group-hover:bg-[#C7FF00]/40
                                        sm:left-[8px]
                                        sm:w-5
                                    "
                                />

                                {/* Experience */}
                                <div
                                    className="
                                        border-t
                                        border-black/[0.07]
                                        dark:border-white/[0.07]
                                        pt-5
                                    "
                                >
                                    <div
                                        className="
                                            grid gap-5
                                            lg:grid-cols-[170px_1fr]
                                            lg:gap-10
                                        "
                                    >
                                        {/* Date / Location */}
                                        <div className="flex flex-wrap gap-x-3 gap-y-1 lg:block">
                                            <p
                                                className="
                                                    text-[11px]
                                                    text-neutral-600
                                                    dark:text-neutral-400
                                                    sm:text-xs
                                                "
                                            >
                                                {formatDate(
                                                    experience.startDate
                                                )}

                                                {" — "}

                                                {experience.isCurrent
                                                    ? "Present"
                                                    : experience.endDate
                                                        ? formatDate(
                                                            experience.endDate
                                                        )
                                                        : "—"}
                                            </p>

                                            {experience.location && (
                                                <p
                                                    className="
                                                        text-[10px]
                                                        text-neutral-500
                                                        dark:text-neutral-700
                                                        lg:mt-2
                                                        sm:text-[11px]
                                                    "
                                                >
                                                    {experience.location}
                                                </p>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="max-w-3xl">
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                <h3
                                                    className="
                                                        text-base
                                                        font-medium
                                                        text-neutral-900
                                                        dark:text-white
                                                        sm:text-lg
                                                    "
                                                >
                                                    {experience.role}
                                                </h3>

                                                <span className="text-[#C7FF00]/50">
                                                    /
                                                </span>

                                                <span
                                                    className="
                                                        text-xs
                                                        text-neutral-600
                                                        dark:text-neutral-500
                                                        sm:text-sm
                                                    "
                                                >
                                                    {experience.company}
                                                </span>
                                            </div>

                                            {experience.description && (
                                                <p
                                                    className="
                                                        mt-4
                                                        max-w-2xl
                                                        text-[13px]
                                                        leading-7
                                                        text-neutral-600
                                                        dark:text-neutral-400
                                                        sm:text-[15px]
                                                    "
                                                >
                                                    {experience.description}
                                                </p>
                                            )}

                                            {responsibilities.length > 0 && (
                                                <ul
                                                    className="
                                                        mt-5
                                                        space-y-2.5
                                                    "
                                                >
                                                    {responsibilities.map(
                                                        (responsibility) => (
                                                            <li
                                                                key={
                                                                    responsibility
                                                                }
                                                                className="
                                                                    flex
                                                                    gap-3
                                                                    text-[13px]
                                                                    leading-6
                                                                    text-neutral-600
                                                                    dark:text-neutral-500
                                                                    sm:text-sm
                                                                "
                                                            >
                                                                <span
                                                                    className="
                                                                        mt-[10px]
                                                                        h-1
                                                                        w-1
                                                                        shrink-0
                                                                        bg-[#C7FF00]/60
                                                                    "
                                                                />

                                                                <span>
                                                                    {
                                                                        responsibility
                                                                    }
                                                                </span>
                                                            </li>
                                                        )
                                                    )}
                                                    </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Divider */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="
                    mt-12
                    origin-left
                    border-t
                    border-black/[0.08]
                    dark:border-white/[0.08]
                    sm:mt-16
                "
            />
        </section>
    );
}