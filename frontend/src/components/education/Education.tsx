"use client";

import { motion } from "framer-motion";
import type { PortfolioEducation } from "@/types/portfolio";

const levelLabels: Record<PortfolioEducation["level"], string> = {
    TENTH: "10th",
    TWELFTH: "12th",
    DIPLOMA: "Diploma",
    BACHELOR: "Bachelor's",
    MASTER: "Master's",
    PHD: "PhD",
};

const institutionTypeLabels: Record<
    PortfolioEducation["institutionType"],
    string
> = {
    SCHOOL: "School",
    COLLEGE: "College",
    UNIVERSITY: "University",
    INSTITUTE: "Institute",
};

function formatDate(date?: string | null) {
    if (!date) return null;

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
}

function formatScore(
    scoreType: PortfolioEducation["scoreType"],
    score: PortfolioEducation["score"]
) {
    if (!scoreType || score === null || score === undefined) {
        return null;
    }

    if (scoreType === "CGPA") {
        return `${score} CGPA`;
    }

    return `${score}%`;
}

type EducationProps = {
    education: PortfolioEducation[];
};

export default function Education({ education }: EducationProps) {
    const visibleEducation = education
        .filter((item) => item.isVisible)
        .sort((a, b) => a.order - b.order);

    if (visibleEducation.length === 0) {
        return null;
    }

    return (
        <section
            id="education"
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
                    <span>04 / EDUCATION</span>
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
                    My{" "}
                    <span className="text-[#C7FF00]">
                        education
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
                    The academic path that helped me build my
                    foundation in computer science and technology.
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
                    {visibleEducation.map((item, index) => {
                        const start = formatDate(item.startDate);
                        const end = formatDate(item.endDate);
                        const score = formatScore(
                            item.scoreType,
                            item.score
                        );

                        return (
                            <motion.article
                                key={item.id}
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

                                {/* Content */}
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
                                            lg:grid-cols-[180px_1fr]
                                            lg:gap-10
                                        "
                                    >
                                        {/* Academic Meta */}
                                        <div
                                            className="
                                                flex flex-wrap
                                                gap-x-3 gap-y-1
                                                lg:block
                                            "
                                        >
                                            <p
                                                className="
                                                    text-[11px]
                                                    text-neutral-600
                                                    dark:text-neutral-400
                                                    sm:text-xs
                                                "
                                            >
                                                {start ?? "—"}

                                                {" — "}

                                                {end ?? "Present"}
                                            </p>

                                            <p
                                                className="
                                                    text-[10px]
                                                    tracking-wide
                                                    text-neutral-500
                                                    dark:text-neutral-700
                                                    lg:mt-2
                                                    sm:text-[11px]
                                                "
                                            >
                                                {
                                                    levelLabels[
                                                        item.level
                                                    ]
                                                }
                                            </p>
                                        </div>

                                        {/* Main Details */}
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
                                                    {
                                                        item.institutionName
                                                    }
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
                                                    {
                                                        institutionTypeLabels[
                                                            item
                                                                .institutionType
                                                        ]
                                                    }
                                                </span>
                                            </div>

                                            {item.field && (
                                                <p
                                                    className="
                                                        mt-3
                                                        text-[13px]
                                                        text-neutral-700
                                                        dark:text-neutral-300
                                                        sm:text-sm
                                                    "
                                                >
                                                    {item.field}
                                                </p>
                                            )}

                                            {(item.boardOrUniversity ||
                                                score) && (
                                                <div
                                                    className="
                                                        mt-4
                                                        flex flex-wrap
                                                        gap-x-5 gap-y-2
                                                    "
                                                >
                                                    {item.boardOrUniversity && (
                                                        <span
                                                            className="
                                                                text-[11px]
                                                                text-neutral-600
                                                                dark:text-neutral-600
                                                                sm:text-xs
                                                            "
                                                        >
                                                            {
                                                                item.boardOrUniversity
                                                            }
                                                        </span>
                                                    )}

                                                    {score && (
                                                        <span
                                                            className="
                                                                text-[11px]
                                                                text-[#C7FF00]/80
                                                                sm:text-xs
                                                            "
                                                        >
                                                            {score}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {item.description && (
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
                                                    {
                                                        item.description
                                                    }
                                                </p>
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