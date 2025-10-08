"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { Project } from "@/types";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="h-full">
      <Card className="overflow-hidden hover:shadow-[14px_14px_28px_rgba(0,0,0,0.95),-14px_-14px_28px_rgba(55,55,55,0.18)] transition-all duration-300 h-full flex flex-col bg-card/80 backdrop-blur-sm">
        <div className="relative w-full h-48 bg-muted neumorphic-inset">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
          {project.status === "in-progress" && (
            <div className="absolute top-3 right-3">
              <Badge variant="warning" className="neumorphic-raised">
                In Progress
              </Badge>
            </div>
          )}
        </div>

        <CardHeader>
          <CardTitle className="text-xl text-white">{project.title}</CardTitle>
          <p className="text-sm text-gray-300">{project.description}</p>
        </CardHeader>

        <CardContent className="space-y-4 flex-1">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Features:</h4>
            <ul className="space-y-1">
              {project.features.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-white">Tech Stack:</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="outline" className="neumorphic-flat">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {project.clients && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">Clients:</h4>
              <p className="text-sm text-gray-300">
                {project.clients.join(", ")}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="gap-2">
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1">
              <Button variant="default" size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Live Demo
              </Button>
            </Link>
          )}
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Github className="h-4 w-4 mr-2" />
                Code
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
