import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Phone, ScanLine, Search, ShieldCheck, Users, HandCoins, Heart, Bell } from "lucide-react";
import logo from "@/assets/anzrbo-logo.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ANZRBO — Association des N'Zipris Résidents de Bonon" },
      { name: "description", content: "Plateforme officielle ANZRBO : entraide, assistance au décès et solidarité pour les N'Zipris résidents de Bonon." },
      { property: "og:title", content: "ANZRBO — Association des N'Zipris Résidents de Bonon" },
      { property: "og:description", content: "Entraide et assistance mutuelle — Bonon, Côte d'Ivoire." },
    ],
  }),
});

const stats = [
  { label: "Cotisation par décès", value: "1 200 F" },
  { label: "Assistance versée", value: "500 000 F" },
  { label: "Sous-préfecture", value: "Bonon" },
  { label: "Pays", value: "Côte d'Ivoire" },
];

const features = [
  { icon: Users, title: "Gestion des membres", desc: "Inscription, suivi et gestion centralisée par les administrateurs désignés." },
  { icon: HandCoins, title: "Cotisations solidaires", desc: "1 200 FCFA par décès déclaré, traçabilité totale des paiements." },
  { icon: Heart, title: "Assistance décès", desc: "Versement rapide de 500 000 FCFA à la famille du défunt." },
  { icon: ShieldCheck, title: "Assurance NSIA", desc: "Souscription et suivi du partenariat NSIA Décès intégrés." },
  { icon: Bell, title: "Alertes SMS & WhatsApp", desc: "Notifications instantanées des décès, cotisations et assistances." },
  { icon: Phone, title: "Recherche par téléphone", desc: "Vérification simple par numéro de téléphone, prête pour la connexion Supabase." },
];

function Index() {
  const nav = useNavigate();
  const [q, setQ] = useState("");

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const t = q.trim();
    if (!t) return;
    nav({ to: "/verifier/$telephone", params: { telephone: t } });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden border-b">
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />
        <div className="container relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Plateforme officielle
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              <span className="text-primary">ANZRBO</span> — l'entraide{" "}
              <span className="text-accent">N'Zipris</span> de Bonon.
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
              Association d'assistance mutuelle au décès. Solidarité, transparence et accompagnement
              des familles dans les moments difficiles.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/scanner">
                  <ScanLine className="mr-2 h-4 w-4" /> Scanner un QR Code
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">
                  Nous contacter <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <form onSubmit={onSearch} className="mt-6 flex max-w-md gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Téléphone membre (ex : 07 58 89 43 63)"
                  className="pl-9"
                />
              </div>
              <Button type="submit" variant="secondary">Vérifier</Button>
            </form>
          </div>

          <div className="relative">
            <div className="rounded-2xl border bg-card p-8 shadow-xl">
              <img src={logo} alt="ANZRBO" className="mx-auto h-32 w-auto md:h-40" />
              <p className="mt-6 text-center text-sm italic text-muted-foreground">
                « Unis dans la solidarité, forts dans l'entraide »
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-lg bg-secondary/60 p-4 text-center">
                    <div className="text-xl font-bold text-primary md:text-2xl">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Une plateforme pensée pour l'association
          </h2>
          <p className="mt-3 text-muted-foreground">
            Gestion administrative complète, alertes en temps réel, traçabilité totale.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 pb-20">
        <div
          className="rounded-2xl p-10 text-center text-white md:p-16"
          style={{ background: "var(--gradient-primary)" }}
        >
          <h2 className="text-3xl font-bold md:text-4xl">Vous êtes administrateur ANZRBO ?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/90">
            Accédez à votre tableau de bord pour gérer les membres, les cotisations et les
            assistances décès.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link to="/login">Accès administrateur</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
