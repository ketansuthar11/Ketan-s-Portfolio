"use client";

import { motion } from "framer-motion";
import type {
    PortfolioProfile,
    PortfolioSkill,
} from "@/types/portfolio";

type AboutProps = {
    profile: PortfolioProfile | null;
    skills: PortfolioSkill[];
};

export default function About({ profile, skills }: AboutProps) {
    const technologies = skills
        .filter((skill) => skill.isVisible)
        .sort((a, b) => a.order - b.order);

    if (!profile) {
        return null;
    }

    return (
        <section
            id="about"
            className="
                relative mx-auto w-full max-w-7xl
                px-5 py-20
                sm:px-6 sm:py-24
                lg:px-8 lg:py-28
            "
        >
            {/* Section Label */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
                className="
                    mb-10 flex items-center gap-3
                    text-[10px] tracking-[0.18em]
                    text-neutral-500 dark:text-neutral-500
                    sm:mb-12 sm:text-xs
                "
            >
                <span className="h-1.5 w-1.5 bg-[#C7FF00]" />
                <span>01 / ABOUT</span>
            </motion.div>

            <div
                className="
                    grid gap-12
                    lg:grid-cols-[1.25fr_0.75fr]
                    lg:gap-20
                    xl:gap-28
                "
            >
                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2
                        className="
                            max-w-2xl
                            text-[30px] font-medium
                            leading-[1.15] tracking-tight
                            text-neutral-900 dark:text-white
                            sm:text-[38px]
                            lg:text-[42px]
                        "
                    >
                        A little{" "}
                        <span className="text-[#C7FF00]">
                            about me
                        </span>
                    </h2>

                    <div
                        className="
                            mt-7 max-w-2xl
                            space-y-5
                            text-[14px]
                            leading-7
                            sm:mt-8
                            sm:space-y-6
                            sm:text-[15px]
                            sm:leading-[1.9]
                        "
                    >
                        {profile.bio && (
                            <p className="text-neutral-600 dark:text-neutral-300">
                                {profile.bio}
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Technologies */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                        duration: 0.6,
                        delay: 0.1,
                    }}
                    className="lg:pt-1"
                >
                    <p
                        className="
                            mb-5
                            text-[10px]
                            tracking-[0.18em]
                            text-neutral-500
                            sm:text-xs
                        "
                    >
                        TECHNOLOGIES I WORK WITH
                    </p>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-2">
                        {technologies.map((technology, index) => (
                            <motion.div
                                key={technology.id}
                                initial={{ opacity: 0, x: -8 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.35,
                                    delay: index * 0.05,
                                }}
                                className="
                                    group flex items-center gap-2
                                    py-1
                                "
                            >
                                <span
                                    className="
                                        h-1 w-1
                                        bg-neutral-400 dark:bg-neutral-700
                                        transition-colors
                                        duration-300
                                        group-hover:bg-[#C7FF00]
                                    "
                                />

                                <span
                                    className="
                                        text-[13px]
                                        text-neutral-600
                                        transition-colors
                                        duration-300
                                        group-hover:text-neutral-900
                                        dark:text-neutral-400
                                        dark:group-hover:text-white
                                        sm:text-sm
                                    "
                                >
                                    {technology.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                </motion.div>
            </div>

            {/* Bottom Divider */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="
                    mt-16 origin-left
                    border-t border-black/[0.08] dark:border-white/[0.08]
                    sm:mt-20
                "
            />

        </section>
    );
}
