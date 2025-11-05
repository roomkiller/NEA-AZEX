import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const ROLE_DASHBOARDS = {
  admin: "AdminDashboard",
  developer: "DeveloperDashboard",
  technician: "TechnicianDashboard",
  user: "UserDashboard"
};

const PUBLIC_PAGES = ["Home", "Pricing", "LegalNotice"];

export default function AutoRedirect({ children, currentPageName }) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const hasChecked = useRef(false);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (hasChecked.current) return;
      hasChecked.current = true;

      const isPublicPage = PUBLIC_PAGES.includes(currentPageName) || location.pathname === "/";

      try {
        const user = await User.me();
        
        if (user && isPublicPage && location.pathname !== createPageUrl("Pricing") && location.pathname !== createPageUrl("LegalNotice")) {
          const impersonatedRole = localStorage.getItem('impersonated_role');
          const effectiveRole = impersonatedRole || user.role || "user";
          const targetDashboard = ROLE_DASHBOARDS[effectiveRole] || ROLE_DASHBOARDS.user;
          
          setShouldRedirect(true);
          setTimeout(() => {
            navigate(createPageUrl(targetDashboard), { replace: true });
          }, 500);
        } else {
          setIsCheckingAuth(false);
        }
      } catch (error) {
        if (!isPublicPage) {
          setShouldRedirect(true);
          setTimeout(() => {
            navigate(createPageUrl("Home"), { replace: true });
          }, 500);
        } else {
          setIsCheckingAuth(false);
        }
      }
    };

    checkAuthAndRedirect();
  }, [currentPageName, location.pathname, navigate]);

  if (isCheckingAuth || shouldRedirect) {
    return (
      <div className="min-h-screen bg-[var(--nea-bg-deep-space)] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className="w-12 h-12 text-[var(--nea-primary-blue)] animate-spin mx-auto" />
          <p className="text-white text-glow">
            {shouldRedirect ? "Redirection en cours..." : "Vérification des autorisations..."}
          </p>
        </motion.div>
      </div>
    );
  }

  return children;
}