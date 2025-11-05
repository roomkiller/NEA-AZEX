import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Loader2, ShieldAlert, Shield } from "lucide-react";
import { motion } from "framer-motion";
import NeaCard from "../ui/NeaCard";
import NeaButton from "../ui/NeaButton";

const ROLE_HIERARCHY = {
  user: 1,
  technician: 2,
  developer: 3,
  admin: 4
};

export default function RoleGuard({ children, requiredRole = "user", fallbackUrl = "Home" }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAccess = async () => {
      setIsLoading(true);
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        const userRoleLevel = ROLE_HIERARCHY[currentUser?.role] || 1;
        const requiredRoleLevel = ROLE_HIERARCHY[requiredRole] || 1;

        if (userRoleLevel >= requiredRoleLevel) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        setHasAccess(false);
        navigate(createPageUrl(fallbackUrl));
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [requiredRole, fallbackUrl, navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--nea-bg-deep-space)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className="w-12 h-12 text-[var(--nea-primary-blue)] animate-spin mx-auto" />
          <p className="text-white">Vérification des accréditations...</p>
        </motion.div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[var(--nea-bg-deep-space)] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <NeaCard className="p-8 text-center">
            <ShieldAlert className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Accès Refusé</h2>
            <p className="text-[var(--nea-text-secondary)] mb-6">
              Votre niveau d'accréditation ({user?.role || "inconnu"}) est insuffisant pour accéder à cette ressource.
            </p>
            <p className="text-sm text-[var(--nea-text-muted)] mb-8">
              Niveau requis : <span className="font-bold text-[var(--nea-primary-blue)]">{requiredRole}</span>
            </p>
            <div className="flex gap-3">
              <NeaButton
                onClick={() => navigate(-1)}
                variant="secondary"
                className="flex-1"
              >
                Retour
              </NeaButton>
              <NeaButton
                onClick={() => navigate(createPageUrl("Home"))}
                className="flex-1"
              >
                <Shield className="w-4 h-4 mr-2" />
                Accueil
              </NeaButton>
            </div>
          </NeaCard>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}