"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { ExperienceCard } from "@/components/sections/ExperienceCard";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { CredentialCard } from "@/components/sections/CredentialCard";
import { SkillBadge } from "@/components/sections/SkillBadge";
import { Card, CardContent } from "@/components/ui/Card";
import {
  EXPERIENCE,
  FREELANCE_PROJECTS,
  PROJECTS,
  PROFILE,
  CERTIFICATIONS,
  EDUCATION,
  PROGRAMMING_SKILLS,
} from "@/lib/constants";
import { Sparkles, Code2, Award } from "lucide-react";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const sidebarVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:20px_20px] z-0"
      />

      <div className="relative z-10 container mx-auto p-3 sm:p-4 pt-20 sm:pt-24 pb-6 sm:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            className="md:sticky md:top-24 self-start">
            <Sidebar />
          </motion.div>

          <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="col-span-1 md:col-span-2 lg:col-span-3 space-y-4 sm:space-y-6">
            <motion.section
              id="experience"
              variants={itemVariants}
              className="scroll-mt-20">
              <Card className="bg-card/70 border-border backdrop-blur-sm neumorphic-raised">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg neumorphic-pressed mr-3">
                      <Code2 className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Experience
                    </h2>
                  </div>

                  <div className="space-y-6 sm:space-y-8">
                    {EXPERIENCE.map((exp) => (
                      <ExperienceCard key={exp.id} experience={exp} />
                    ))}
                  </div>

                  <div className="mt-8 sm:mt-10">
                    <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white">
                      Freelance Highlights
                    </h3>
                    <div className="space-y-4 sm:space-y-6">
                      {FREELANCE_PROJECTS.map((project) => (
                        <div
                          key={project.id}
                          className="bg-card/50 border border-border rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 neumorphic-card hover:shadow-[12px_12px_24px_rgba(0,0,0,0.95),-12px_-12px_24px_rgba(52,52,52,0.16)] transition-all duration-300">
                          <div>
                            <h4 className="text-base sm:text-lg font-semibold text-white">
                              {project.title}
                            </h4>
                            {"clients" in project && project.clients && (
                              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                Clients: {project.clients.join(", ")}
                              </p>
                            )}
                          </div>
                          <p className="text-sm sm:text-base text-gray-300">
                            {project.description}
                          </p>
                          <ul className="space-y-2">
                            {project.achievements.map((achievement, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-xs sm:text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            <motion.section
              id="credentials"
              variants={itemVariants}
              className="scroll-mt-20">
              <Card className="bg-card/70 border-border backdrop-blur-sm neumorphic-raised">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg neumorphic-pressed mr-3">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Credentials
                    </h2>
                  </div>

                  <div className="space-y-6 sm:space-y-8">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
                        Education
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                        {EDUCATION.map((edu, index) => (
                          <CredentialCard
                            key={index}
                            title={edu.degree}
                            institution={edu.institution}
                            year={edu.period}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white">
                        Certifications
                      </h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {CERTIFICATIONS.map((cert, index) => (
                          <CredentialCard
                            key={index}
                            title={cert}
                            institution="IBM / Coursera"
                            year="2023"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            <motion.section
              id="skills"
              variants={itemVariants}
              className="scroll-mt-20">
              <Card className="bg-card/70 border-border backdrop-blur-sm neumorphic-raised">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg neumorphic-pressed mr-3">
                      <Code2 className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Technical Skills
                    </h2>
                  </div>

                  <div className="space-y-6 sm:space-y-8">
                    <div>
                      <h3 className="text-sm font-medium text-white mb-3">
                        Programming Languages
                      </h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {PROGRAMMING_SKILLS.languages.map((skill) => (
                          <SkillBadge
                            key={skill.name}
                            name={skill.name}
                            proficiency={skill.proficiency}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-white mb-3">
                        Frameworks & Libraries
                      </h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {PROGRAMMING_SKILLS.frameworks.map((skill) => (
                          <SkillBadge
                            key={skill.name}
                            name={skill.name}
                            proficiency={skill.proficiency}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-white mb-3">
                        Tools & Platforms
                      </h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {PROGRAMMING_SKILLS.tools.map((skill) => (
                          <SkillBadge
                            key={skill.name}
                            name={skill.name}
                            proficiency={skill.proficiency}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            <motion.section
              id="projects"
              variants={itemVariants}
              className="scroll-mt-20">
              <Card className="bg-card/70 border-border backdrop-blur-sm neumorphic-raised">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg neumorphic-pressed mr-3">
                      <Code2 className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Featured Projects
                    </h2>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {PROJECTS.filter((p) => p.status === "completed").map(
                      (project) => (
                        <ProjectCard key={project.id} project={project} />
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          </motion.main>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}>
          <Footer />
        </motion.div>
      </div>
    </div>
  );
}
