"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  PROFILE,
  KEY_SKILLS,
  ABOUT_ME,
  PROFESSIONAL_FOCUS,
  FAVORITE_TECH_STACKS,
} from "@/lib/constants";
import {
  Github,
  Linkedin,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

const skillVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
};

const focusItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
    },
  }),
};

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<"about" | "contact">("about");
  return (
    <Card className="bg-card/70 border-border backdrop-blur-sm neumorphic-raised col-span-1 flex flex-col">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-card/50 to-card/80 p-4 sm:p-6 flex flex-col items-center border-b border-border">
          <div className="flex flex-col items-center w-full">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-4 border-2 border-primary/20 ring-4 ring-card/50">
              <Image
                src={PROFILE.image}
                alt={PROFILE.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold">{PROFILE.name}</h2>
              <p className="text-sm text-primary mb-1">{PROFILE.title}</p>
              <div className="flex items-center justify-center text-xs text-muted-foreground mb-3">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{PROFILE.location}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {KEY_SKILLS.slice(0, 4).map((skill, i) => (
              <motion.div
                key={skill}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={skillVariants}>
                <Badge
                  variant="outline"
                  className="bg-card/50 hover:bg-card text-xs">
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </div>

          {PROFILE.availableForHire && (
            <div className="flex items-center justify-center">
              <span className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-xs font-medium text-success">
                Available for Hire
              </motion.span>
            </div>
          )}
        </div>

        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("about")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === "about"
                ? "text-primary bg-primary/10 border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}>
            <User className="h-4 w-4" />
            About
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === "contact"
                ? "text-primary bg-primary/10 border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}>
            <Mail className="h-4 w-4" />
            Contact
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {activeTab === "about" ? (
            <>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  About Me
                </h3>
                <p className="text-sm leading-relaxed text-gray-300">
                  {ABOUT_ME.summary}
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Professional Focus
                </h3>
                <div className="space-y-2">
                  {PROFESSIONAL_FOCUS.map((focus, i) => (
                    <motion.div
                      key={focus}
                      custom={i}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={focusItemVariants}
                      className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-300">{focus}</p>
                    </motion.div>
                  ))}
                </div>
              </div>{" "}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Tech Stacks
                </h3>
                {FAVORITE_TECH_STACKS.map((stack, i) => (
                  <motion.div
                    key={stack.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-card/50 rounded-xl p-3 border border-border neumorphic-inset hover:neumorphic-flat transition-all duration-300">
                    <h4 className="text-xs font-semibold mb-2 text-primary">
                      {stack.name}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {stack.technologies.map((tech, techIndex) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 + techIndex * 0.05 }}
                          className="text-xs bg-muted px-2 py-1 rounded-lg neumorphic-flat text-gray-300">
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <a
                      href={`mailto:${PROFILE.email}`}
                      className="text-sm text-white hover:text-primary transition-colors">
                      {PROFILE.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Phone</p>
                    <a
                      href={`tel:${PROFILE.phone}`}
                      className="text-sm text-white hover:text-primary transition-colors">
                      {PROFILE.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Location
                    </p>
                    <p className="text-sm text-white">{PROFILE.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Working Hours
                    </p>
                    <p className="text-sm text-white">
                      Monday - Friday, 9am - 5pm EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <Link
                    href={PROFILE.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white hover:text-primary transition-colors">
                    <Github className="h-5 w-5" />
                    GitHub
                  </Link>
                  <Link
                    href={PROFILE.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white hover:text-primary transition-colors">
                    <Linkedin className="h-5 w-5" />
                    LinkedIn
                  </Link>
                </div>
              </div>

              {PROFILE.availableForHire && (
                <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <p className="text-xs font-medium text-success">
                      Available for new projects
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
