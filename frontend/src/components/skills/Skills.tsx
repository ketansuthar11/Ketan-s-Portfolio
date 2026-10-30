"use client";

import { getSkillIcon } from "@/utils/getSkillIcon";
import { motion } from "framer-motion";
import type { PortfolioSkill } from "@/types/portfolio";
import { useEffect, useState } from "react";

type SkillProps = {
    skills: PortfolioSkill[];
};

function SkillLogo({ name }: { name: string }) {
    const [iconUrl, setIconUrl] = useState("");
    const [iconFailed, setIconFailed] = useState(false);

    useEffect(() => {
        let active = true;

        setIconUrl("");
        setIconFailed(false);

        getSkillIcon(name)
            .then((url) => {
                if (!active) return;

                setIconUrl(url);
                setIconFailed(!url);
            })
            .catch(() => {
                if (active) {
                    setIconUrl("");
                    setIconFailed(true);
                }
            });

        return () => {
            active = false;
        };
    }, [name]);

    return iconUrl && !iconFailed ? (
        <img
            src={iconUrl}
            alt={`${name} logo`}
            width={48}
            height={48}
            loading="lazy"
            onError={() => setIconFailed(true)}
            className="h-full w-full object-contain"
        />
    ) : (
        <span className="text-lg font-bold text-neutral-900">
            {name.trim().charAt(0).toUpperCase()}
        </span>
    );
}

export default function Skills({ skills }: SkillProps) {
    const visibleSkills = skills
        .filter((skill) => skill.isVisible)
        .sort((a, b) => a.order - b.order);

    const categories = Array.from(
        new Set(visibleSkills.map((skill) => skill.category))
    );

    if (visibleSkills.length === 0) return null;

    return (
        <section
            id="skills"
            className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
        >
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45 }}
                className="mb-9 sm:mb-12"
            >
                <div className="mb-4 flex items-center gap-3 text-[10px] tracking-[0.18em] text-neutral-500 sm:text-xs">
                    <span className="h-1.5 w-1.5 bg-[#C7FF00]" />
                    <span>02 / SKILLS</span>
                </div>

                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-[30px] font-medium leading-[1.12] tracking-tight text-neutral-900 dark:text-white sm:text-[36px] lg:text-[42px]">
                            Things I{" "}
                            <span className="text-lime-600 dark:text-[#C7FF00]">
                                work with
                            </span>
                        </h2>
                        <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:text-[15px]">
                            Technologies I use to build projects, grouped by area so they are easier to scan.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 md:justify-end">
                        <span className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1.5 text-xs font-medium text-neutral-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300">
                            {visibleSkills.length} skills
                        </span>
                        <span className="rounded-full border border-lime-600/20 bg-lime-500/10 px-3 py-1.5 text-xs font-medium text-lime-800 dark:border-[#C7FF00]/20 dark:bg-[#C7FF00]/[0.08] dark:text-[#D9FF66]">
                            {categories.length} categories
                        </span>
                    </div>
                </div>
            </motion.div>

            <div className="grid gap-5 md:gap-6">
                {categories.map((category, categoryIndex) => {
                    const categorySkills = visibleSkills.filter(
                        (skill) => skill.category === category
                    );

                    if (categorySkills.length === 0) return null;

                    return (
                        <motion.section
                            key={category}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.12 }}
                            transition={{ duration: 0.4, delay: categoryIndex * 0.04 }}
                            aria-label={`${category} skills`}
                            className="overflow-hidden rounded-2xl border border-black/[0.09] bg-white/70 shadow-sm dark:border-white/[0.09] dark:bg-white/[0.025]"
                        >
                            <div className="flex flex-col gap-2 border-b border-black/[0.07] bg-black/[0.025] px-4 py-4 dark:border-white/[0.07] dark:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                <div className="flex items-center gap-3">
                                    <span className="h-7 w-1 rounded-full bg-lime-500 dark:bg-[#C7FF00]" />
                                    <h3 className="text-sm font-semibold tracking-wide text-neutral-900 dark:text-white sm:text-base">
                                        {category}
                                    </h3>
                                </div>
                                <span className="pl-4 text-xs text-neutral-500 dark:text-neutral-400 sm:pl-0">
                                    {categorySkills.length}{" "}
                                    {categorySkills.length === 1 ? "skill" : "skills"}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-3">
                                {categorySkills.map((skill, skillIndex) => (
                                    <motion.div
                                        key={skill.id}
                                        initial={{ opacity: 0, y: 6 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.25,
                                            delay: Math.min(skillIndex * 0.025, 0.15),
                                        }}
                                        className="group flex min-h-[64px] items-center gap-3 rounded-xl border border-black/[0.08] bg-white px-3.5 py-3 transition-all duration-200 hover:border-lime-600/40 hover:shadow-md dark:border-white/[0.09] dark:bg-neutral-950/50 dark:hover:border-[#C7FF00]/35 sm:px-4"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F1F2ED] p-2 ring-1 ring-black/10 dark:bg-[#E8EAE2]">
                                            <SkillLogo name={skill.name} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="break-words text-sm font-medium leading-5 text-neutral-900 dark:text-neutral-100">
                                                {skill.name}
                                            </p>
                                            {skill.level ? (
                                                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                    {skill.level}
                                                </p>
                                            ) : null}
                                        </div>

                                        <span className="h-2 w-2 shrink-0 rounded-full bg-neutral-300 transition-colors group-hover:bg-lime-500 dark:bg-neutral-700 dark:group-hover:bg-[#C7FF00]" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    );
                })}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
                className="mt-6 flex flex-col gap-3 text-[10px] tracking-[0.1em] text-neutral-500 dark:text-neutral-400 sm:flex-row sm:items-center sm:justify-between"
            >
                <span>MORE TO LEARN · MORE TO BUILD</span>
                <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-500 dark:bg-[#C7FF00]" />
                    CURRENTLY LEARNING
                </span>
            </motion.div>
        </section>
    );
}
