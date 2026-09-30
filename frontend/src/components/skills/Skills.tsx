"use client";

import { motion } from "framer-motion";
import type { PortfolioSkill } from "@/types/portfolio";

type SkillProps = {
    skills: PortfolioSkill[];
};

export default function Skills({ skills }: SkillProps) {
    const visibleSkills = skills
        .filter((skill) => skill.isVisible)
        .sort((a, b) => a.order - b.order);

    const categories = Array.from(
        new Set(visibleSkills.map((skill) => skill.category))
    );

    if (visibleSkills.length === 0) {
        return null;
    }

    return (
        <section
            id="skills"
            className="
                relative mx-auto w-full max-w-7xl
                px-5 py-20
                sm:px-6 sm:py-24
                lg:px-8 lg:py-28
            "
        >
            {/* Section Header */}
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
                    <span>02 / SKILLS</span>
                </div>

                <div
                    className="
                        flex flex-col gap-5
                        md:flex-row md:items-end md:justify-between
                    "
                >
                    <div>
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
                            Things I{" "}
                            <span className="text-[#C7FF00]">
                                work with
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
                            Technologies I use while building projects
                            and the areas I&apos;m currently exploring.
                        </p>
                    </div>

                    {/* Desktop Meta */}
                    <div
                        className="
                            hidden text-right
                            text-[9px]
                            tracking-[0.16em]
                            text-neutral-600
                            dark:text-neutral-700
                            md:block
                        "
                    >
                        <div>{visibleSkills.length} SKILLS</div>

                        <div className="mt-2 text-[#C7FF00]/60">
                            ● {categories.length} CATEGORIES
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Skill Map */}
            <div className="relative">
                {/* Vertical Accent */}
                <div
                    className="
                        absolute
                        bottom-0 left-[3px] top-0
                        hidden w-px
                        bg-gradient-to-b
                        from-[#C7FF00]/50
                        via-black/[0.08]
                        dark:via-white/[0.08]
                        to-transparent
                        md:block
                    "
                />

                <div className="md:pl-8">
                    {categories.map((category, categoryIndex) => {
                        const categorySkills = visibleSkills.filter(
                            (skill) => skill.category === category
                        );

                        if (categorySkills.length === 0) {
                            return null;
                        }

                        return (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{
                                    once: true,
                                    amount: 0.15,
                                }}
                                transition={{
                                    duration: 0.45,
                                    delay: categoryIndex * 0.05,
                                }}
                                className="
                                    relative
                                    border-t
                                    border-black/[0.07]
                                    dark:border-white/[0.07]
                                    py-5
                                    last:border-b
                                    sm:py-6
                                "
                            >
                                <div
                                    className="
                                        grid gap-4
                                        md:grid-cols-[140px_1fr]
                                        md:items-start
                                        lg:grid-cols-[155px_1fr]
                                    "
                                >
                                    {/* Category */}
                                    <div
                                        className="
                                            flex items-center gap-3
                                            pt-1
                                        "
                                    >
                                        <span
                                            className="
                                                text-[10px]
                                                tracking-[0.16em]
                                                text-neutral-600
                                                dark:text-neutral-500
                                                sm:text-[11px]
                                            "
                                        >
                                            {category.toUpperCase()}
                                        </span>

                                        <span className="text-[10px] text-[#C7FF00]/40">
                                            /
                                        </span>
                                    </div>

                                    {/* Skills */}
                                    <div
                                        className="
                                            grid
                                            grid-cols-1
                                            gap-2
                                            sm:grid-cols-2
                                            lg:grid-cols-3
                                        "
                                    >
                                        {categorySkills.map(
                                            (skill, skillIndex) => (
                                                <motion.div
                                                    key={skill.id}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 5,
                                                    }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    viewport={{
                                                        once: true,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                        delay:
                                                            categoryIndex *
                                                                0.04 +
                                                            skillIndex *
                                                                0.03,
                                                    }}
                                                    className="
                                                        group relative
                                                        flex min-h-[52px]
                                                        items-center
                                                        justify-between
                                                        gap-3
                                                        overflow-hidden
                                                        border
                                                        border-black/[0.08]
                                                        bg-black/[0.015]
                                                        px-3.5 py-3
                                                        transition-all
                                                        duration-300
                                                        hover:-translate-y-0.5
                                                        hover:border-[#C7FF00]/30
                                                        hover:bg-[#C7FF00]/[0.025]
                                                        dark:border-white/[0.08]
                                                        dark:bg-white/[0.015]
                                                    "
                                                >
                                                    {/* Hover Accent */}
                                                    <span
                                                        className="
                                                            absolute
                                                            bottom-0 left-0
                                                            h-px w-0
                                                            bg-[#C7FF00]
                                                            transition-all
                                                            duration-300
                                                            group-hover:w-full
                                                        "
                                                    />

                                                    <div className="flex min-w-0 items-center gap-2.5">
                                                        <span
                                                            className="
                                                                h-1 w-1
                                                                shrink-0
                                                                bg-neutral-400
                                                                transition-colors
                                                                duration-300
                                                                group-hover:bg-[#C7FF00]
                                                                dark:bg-neutral-700
                                                            "
                                                        />

                                                        <span
                                                            className="
                                                                truncate
                                                                text-[13px]
                                                                text-neutral-700
                                                                transition-colors
                                                                duration-300
                                                                group-hover:text-neutral-900
                                                                dark:text-neutral-300
                                                                dark:group-hover:text-white
                                                                sm:text-sm
                                                            "
                                                        >
                                                            {skill.name}
                                                        </span>
                                                    </div>

                                                    {skill.level && (
                                                        <span
                                                            className="
                                                                shrink-0
                                                                text-[9px]
                                                                text-neutral-500
                                                                transition-colors
                                                                duration-300
                                                                group-hover:text-neutral-700
                                                                dark:text-neutral-700
                                                                dark:group-hover:text-neutral-500
                                                            "
                                                        >
                                                            {skill.level}
                                                        </span>
                                                    )}
                                                </motion.div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Information */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="
                    mt-5 flex flex-col gap-3
                    text-[9px]
                    tracking-[0.12em]
                    text-neutral-600
                    dark:text-neutral-700
                    sm:mt-6
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:text-[10px]
                "
            >
                <span>MORE TO LEARN · MORE TO BUILD</span>

                <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-[#C7FF00]" />
                    CURRENTLY LEARNING
                </span>
            </motion.div>
        </section>
    );
}