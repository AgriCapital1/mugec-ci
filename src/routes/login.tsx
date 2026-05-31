import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import logo from "@/assets/anzrbo-logo.png";

export const Route = createFileRoute("/login")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Accès administrateur — ANZRBO" },
      { name: "description", content: "Connexion réservée aux administrateurs ANZRBO." },
    ],
  }),
});

function Page() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const u = signIn(identifier, password);
      if (!u) {
        setErrorMsg("Identifiant ou mot de passe incorrect.");
        return;
      }
      toast.success("Bienvenue, administrateur ANZRBO.");
      nav({ to: "/admin/digitorg" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto max-w-md px-4 py-16">
        <Card>
          <CardContent className="p-8">
            <img src={logo} alt="ANZRBO" className="mx-auto h-16" />
            <div className="mt-4 flex items-center justify-center gap-2 text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Espace réservé</span>
            </div>
            <h1 className="mt-2 text-center text-2xl font-bold">Accès administrateur</h1>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Connectez-vous pour gérer les membres, cotisations et assistances ANZRBO.
            </p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              {errorMsg && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"
                >
                  {errorMsg}
                </div>
              )}
              <div>
                <Label htmlFor="identifier">Numéro de téléphone</Label>
                <Input
                  id="identifier"
                  type="tel"
                  required
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); if (errorMsg) setErrorMsg(null); }}
                  placeholder="Ex : 0759566087"
                  autoComplete="username"
                />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (errorMsg) setErrorMsg(null); }}
                    className="pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Connexion…" : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
      <SiteFooter />
    </div>
  );
}
