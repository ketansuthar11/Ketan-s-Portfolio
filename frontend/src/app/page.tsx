import Background from "@/components/background/Background";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Skills from "@/components/skills/Skills";
import Experience from "@/components/experience/Experience";
import Education from "@/components/education/Education";
import Projects from "@/components/projects/Projects";
import Contact from "@/components/contact/Contact";

import { getPortfolio } from "@/lib/api/portfolio";
import type { PortfolioSectionType } from "@/types/portfolio";

export default async function Home() {
    const portfolio = await getPortfolio();
    const hasSectionConfiguration = portfolio.sections.length > 0;

    const isSectionVisible = (type: PortfolioSectionType) =>
        !hasSectionConfiguration ||
        portfolio.sections.some((section) => section.type === type);

    const sectionVisibility = {
        home: isSectionVisible("HOME"),
        // The schema has no dedicated ABOUT section; it is profile-driven.
        about: portfolio.profile !== null,
        skills: isSectionVisible("SKILLS"),
        experience: isSectionVisible("EXPERIENCE"),
        education: isSectionVisible("EDUCATION"),
        projects: isSectionVisible("PROJECTS"),
        contact: isSectionVisible("CONTACT"),
    };

    return (
        <main className="relative min-h-screen overflow-x-clip bg-[#F7F7F5] dark:bg-black">
            <Background />

            <div className="relative z-10">
                <Navbar
                    profile={portfolio.profile}
                    sections={portfolio.sections}
                    sectionVisibility={sectionVisibility}
                />

                {sectionVisibility.home && (
                    <Hero
                        profile={portfolio.profile}
                        skills={portfolio.skills}
                    />
                )}

                {sectionVisibility.about && (
                    <About
                        profile={portfolio.profile}
                        skills={portfolio.skills}
                    />
                )}

                {sectionVisibility.skills && (
                    <Skills skills={portfolio.skills} />
                )}

                {sectionVisibility.experience && (
                    <Experience
                        experiences={portfolio.experience}
                    />
                )}

                {sectionVisibility.education && (
                    <Education
                        education={portfolio.education}
                    />
                )}

                {sectionVisibility.projects && (
                    <Projects
                        projects={portfolio.projects}
                    />
                )}

                {sectionVisibility.contact && (
                    <Contact
                        profile={portfolio.profile}
                    />
                )}
            </div>
        </main>
    );
}
