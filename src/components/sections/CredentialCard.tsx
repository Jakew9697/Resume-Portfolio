"use client";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Award, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface CredentialCardProps {
  title: string;
  institution?: string;
  year?: string;
  credentialUrl?: string;
  icon?: React.ReactNode;
}

export function CredentialCard({
  title,
  institution,
  year,
  credentialUrl,
  icon,
}: CredentialCardProps) {
  const cardContent = (
    <Card className="hover:shadow-[12px_12px_24px_rgba(0,0,0,0.95),-12px_-12px_24px_rgba(52,52,52,0.16)] transition-all duration-300 hover:border-primary/50 cursor-pointer h-full bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight flex-1 text-white">
            {title}
          </CardTitle>
          {credentialUrl ? (
            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          ) : (
            icon || <Award className="h-4 w-4 text-primary flex-shrink-0" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {institution && (
          <p className="text-sm font-medium text-gray-300">{institution}</p>
        )}
        {year && (
          <Badge variant="outline" className="text-xs neumorphic-flat">
            {year}
          </Badge>
        )}
      </CardContent>
    </Card>
  );

  const animatedContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.95 }}
      className="h-full">
      {cardContent}
    </motion.div>
  );

  if (credentialUrl) {
    return (
      <Link
        href={credentialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="h-full block">
        {animatedContent}
      </Link>
    );
  }

  return animatedContent;
}
