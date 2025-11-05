import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = async () => {
      try {
        const user = await base44.auth.me();
        const role = user?.role || "user";
        const impersonatedRole = localStorage.getItem('impersonated_role');
        const effectiveRole = impersonatedRole || role;

        const dashboardMap = {
          user: "UserDashboard",
          technician: "TechnicianDashboard",
          developer: "DeveloperDashboard",
          admin: "AdminDashboard",
          master: "MasterDashboard"
        };

        // Admin accède au Master par défaut si pas d'impersonation
        const targetDashboard = effectiveRole === 'admin' && !impersonatedRole 
          ? "MasterDashboard"
          : dashboardMap[effectiveRole] || "UserDashboard";
        
        navigate(createPageUrl(targetDashboard), { replace: true });
      } catch (error) {
        console.error("Erreur redirection dashboard:", error);
        setError(error.message);
        // Attendre 2 secondes avant de rediriger vers Home en cas d'erreur
        setTimeout(() => {
          navigate(createPageUrl("Home"), { replace: true });
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    redirect();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--nea-bg-deep-space)]">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-red-400 mb-2">Erreur de connexion</p>
          <p className="text-[var(--nea-text-secondary)] text-sm">
            {error}
          </p>
          <p className="text-[var(--nea-text-muted)] text-xs mt-4">
            Redirection vers l'accueil...
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--nea-bg-deep-space)]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[var(--nea-primary-blue)] animate-spin mx-auto mb-4" />
          <p className="text-[var(--nea-text-primary)]">Redirection en cours...</p>
          <p className="text-[var(--nea-text-muted)] text-sm mt-2">
            Chargement de votre interface...
          </p>
        </div>
      </div>
    );
  }

  return null;
}