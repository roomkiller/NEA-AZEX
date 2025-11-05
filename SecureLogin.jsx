import React, { useState } from "react";
import { AccreditationCredential } from "@/api/entities";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Loader2, AlertCircle, User as UserIcon, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import NeaButton from "../ui/NeaButton";

const ROLE_DASHBOARDS = {
  admin: "AdminDashboard",
  developer: "DeveloperDashboard",
  technician: "TechnicianDashboard",
  user: "UserDashboard"
};

export default function SecureLogin({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    try {
      const passwordHash = await hashPassword(password);
      
      const credentials = await AccreditationCredential.filter({
        username: username,
        password_hash: passwordHash,
        status: "Active"
      });

      if (credentials.length === 0) {
        toast.error("Identifiants invalides ou compte inactif");
        setIsLoading(false);
        return;
      }

      const credential = credentials[0];

      if (credential.locked_until && new Date(credential.locked_until) > new Date()) {
        toast.error("Compte temporairement verrouillé. Réessayez plus tard.");
        setIsLoading(false);
        return;
      }

      await AccreditationCredential.update(credential.id, {
        last_login: new Date().toISOString(),
        login_attempts: 0,
        locked_until: null
      });

      const currentUser = await User.me();
      
      if (currentUser.email !== credential.user_email) {
        toast.error("Erreur de synchronisation utilisateur");
        setIsLoading(false);
        return;
      }

      localStorage.setItem('impersonated_role', credential.role);
      
      toast.success(`Connexion réussie en tant que ${credential.role}`);

      const targetDashboard = ROLE_DASHBOARDS[credential.role] || ROLE_DASHBOARDS.user;
      
      if (onSuccess) {
        onSuccess(credential);
      }

      navigate(createPageUrl(targetDashboard));
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="bg-[var(--nea-bg-surface)] border-[var(--nea-border-default)]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-[var(--nea-primary-blue)]/10">
              <Shield className="w-8 h-8 text-[var(--nea-primary-blue)]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Connexion Sécurisée</CardTitle>
          <CardDescription className="text-[var(--nea-text-secondary)]">
            Authentification par accréditation système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Nom d'utilisateur
                </div>
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Entrez votre nom d'utilisateur"
                disabled={isLoading}
                className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Mot de passe
                </div>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                disabled={isLoading}
                className="bg-[var(--nea-bg-surface-hover)] border-[var(--nea-border-default)] text-white"
                autoComplete="current-password"
              />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-300">
                Cette connexion utilise un système d'accréditation sécurisé. Votre niveau d'accès dépend de votre accréditation.
              </p>
            </div>

            <NeaButton
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Vérification...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Se connecter
                </>
              )}
            </NeaButton>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}