import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Wrench, Cpu, User, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ROLE_CONFIG = {
  admin: { icon: Shield, label: "Admin", color: "text-red-400" },
  developer: { icon: Cpu, label: "Développeur", color: "text-purple-400" },
  technician: { icon: Wrench, label: "Technicien", color: "text-cyan-400" },
  user: { icon: User, label: "Utilisateur", color: "text-blue-400" }
};

const DASHBOARDS = [
  { role: "user", url: "UserDashboard" },
  { role: "technician", url: "TechnicianDashboard" },
  { role: "developer", url: "DeveloperDashboard" },
  { role: "admin", url: "AdminDashboard" }
];

export default function DashboardNav({ currentRole = "user" }) {
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 flex-wrap"
    >
      {DASHBOARDS.map((dashboard, index) => {
        const config = ROLE_CONFIG[dashboard.role];
        const Icon = config.icon;
        const isActive = location.pathname === createPageUrl(dashboard.url);
        const isCurrent = dashboard.role === currentRole;

        return (
          <React.Fragment key={dashboard.role}>
            {index > 0 && <ChevronRight className="w-4 h-4 text-[var(--nea-text-muted)]" />}
            <Link to={createPageUrl(dashboard.url)}>
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-[var(--nea-primary-blue)]/20 text-white border border-[var(--nea-primary-blue)]"
                    : "text-[var(--nea-text-secondary)] hover:bg-[var(--nea-bg-surface-hover)] hover:text-white"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? config.color : "")} />
                <span>{config.label}</span>
                {isCurrent && !isActive && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--nea-bg-surface-hover)] text-[var(--nea-text-muted)]">
                    Actuel
                  </span>
                )}
              </div>
            </Link>
          </React.Fragment>
        );
      })}
    </motion.div>
  );
}