"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "@/lib/constants";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = NAVIGATION_ITEMS.map((item) => item.href.substring(1));
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    closeMobileMenu();
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[10002] transition-all duration-300",
          isScrolled
            ? "bg-gray-medium-dark/90 backdrop-blur-md neumorphic-flat"
            : "bg-gray-medium-dark/90"
        )}
        style={{
          WebkitTransform: "translateZ(0)",
          transform: "translateZ(0)",
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex-shrink-0">
              <button
                onClick={() => scrollToSection("home")}
                className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity">
                Your Name
              </button>
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              {NAVIGATION_ITEMS.map((item) => {
                const Icon = item.icon;
                const sectionId = item.href.substring(1);
                const isActive = activeSection === sectionId;

                return (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(sectionId)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-primary neumorphic-pressed"
                        : "text-foreground hover:text-primary hover:neumorphic-flat"
                    )}>
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.name}
                  </button>
                );
              })}
            </nav>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className={cn(
                "lg:hidden p-2 fixed top-6 right-4 z-[10001] rounded-xl transition-all duration-200 pointer-events-auto",
                "bg-card neumorphic-raised"
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}>
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}>
                    <X className="h-6 w-6 text-foreground" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}>
                    <Menu className="h-6 w-6 text-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
              onClick={closeMobileMenu}
            />

            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-card neumorphic-raised z-50 lg:hidden overflow-y-auto"
              style={{
                WebkitOverflowScrolling: "touch",
              }}>
              <div className="flex flex-col h-full pt-24 pb-8 px-6">
                <div className="flex flex-col space-y-3">
                  {NAVIGATION_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const sectionId = item.href.substring(1);
                    const isActive = activeSection === sectionId;

                    return (
                      <motion.button
                        key={item.name}
                        onClick={() => scrollToSection(sectionId)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200",
                          isActive
                            ? "text-primary bg-primary/10 neumorphic-pressed"
                            : "text-foreground hover:text-primary hover:bg-accent"
                        )}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}>
                        {Icon && <Icon className="h-5 w-5" />}
                        {item.name}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
