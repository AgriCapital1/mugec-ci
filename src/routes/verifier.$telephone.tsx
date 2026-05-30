import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, ShieldCheck, UserCircle2 } from "lucide-react";

export const Route = createFileRoute("/verifier/$telephone")({
  component: Page,
  head: () => ({
    meta: [
      { title: "Vérification par téléphone — ANZRBO" },
      { name: "description", content: "Vérifiez une carte membre ANZRBO avec le numéro de téléphone du membre." },
    ],
  }),
});

function formatPhone(value: string) {
  return decodeURIComponent(value).replace(/[^+\d]/g, "").replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

function Page() {
  const { telephone } = Route.useParams();
  const phone = formatPhone(telephone);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto max-w-2xl px-4 py-12">
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/scanner" className="underline">← Nouvelle vérification</Link>
        </div>

        <Card className="overflow-hidden">
          <div className="p-4" style={{ background: "var(--gradient-primary)" }}>
            <div className="flex items-center gap-2 text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Recherche membre</span>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="flex items-start gap-5">
              <div className="flex h-28 w-24 shrink-0 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                <UserCircle2 className="h-10 w-10" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-bold">Vérification par téléphone</h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="font-mono">{phone || "—"}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary">Interface prête</Badge>
                  <Badge variant="outline">DB Supabase à connecter après</Badge>
                </div>
              </div>
            </div>

            <p className="mt-6 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
              La recherche se fait maintenant par numéro de téléphone. La connexion aux données Supabase sera branchée lors de l'étape DB.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild><Link to="/scanner">Scanner ou saisir un autre numéro</Link></Button>
              <Button asChild variant="outline"><Link to="/contact">Contacter l'association</Link></Button>
            </div>
          </CardContent>
        </Card>
      </section>
      <SiteFooter />
    </div>
  );
}