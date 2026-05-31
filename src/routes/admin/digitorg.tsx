import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { DashboardHeader, ADMIN_NAV } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Wallet, TrendingUp, ArrowUpRight, Building2, Sparkles, Users, ShieldCheck, FileCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin/digitorg")({
  component: DigitOrgDashboard,
  head: () => ({
    meta: [
      { title: "DigitOrg — Pilotage financier ANZRBO" },
      { name: "description", content: "Tableau de bord DigitOrg : pilotage financier consolidé d'ANZRBO." },
    ],
  }),
});

// Données locales (UI uniquement — aucune base de données).
const TREND = [
  { mois: "Déc", cotisations: 1_440_000, assistances: 1_000_000 },
  { mois: "Jan", cotisations: 1_680_000, assistances: 1_500_000 },
  { mois: "Fév", cotisations: 1_920_000, assistances: 500_000 },
  { mois: "Mar", cotisations: 2_280_000, assistances: 2_000_000 },
  { mois: "Avr", cotisations: 2_640_000, assistances: 1_500_000 },
  { mois: "Mai", cotisations: 3_120_000, assistances: 2_500_000 },
];

const REPARTITION = [
  { name: "Cotisations encaissées", value: 13_080_000, color: "hsl(38 92% 50%)" },
  { name: "Assistances versées", value: 9_000_000, color: "hsl(0 72% 51%)" },
  { name: "Réserve mutuelle", value: 4_080_000, color: "hsl(142 71% 45%)" },
];

function DigitOrgDashboard() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [user, loading, nav]);

  const total = useMemo(() => REPARTITION.reduce((s, r) => s + r.value, 0), []);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">Chargement…</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/40">
      <DashboardHeader title="DigitOrg — Pilotage ANZRBO" nav={ADMIN_NAV} />

      <main className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
        <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary via-primary to-primary/80 p-8 text-primary-foreground shadow-xl">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge variant="secondary" className="mb-3 gap-1 border-white/20 bg-white/15 text-white">
                <Sparkles className="h-3 w-3" /> Pilotage DigitOrg
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Tableau de bord financier</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/85">
                Suivi consolidé des cotisations, assistances décès et réserve mutuelle d'ANZRBO.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link to="/admin"><Users className="mr-2 h-4 w-4" /> Gestion des membres</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <KPI icon={Wallet} label="Cotisations cumulées" value="13 080 000 F" gradient="from-amber-500 to-orange-600" trend="+18%" />
          <KPI icon={FileCheck} label="Assistances versées" value="9 000 000 F" gradient="from-red-500 to-rose-600" trend="+12%" />
          <KPI icon={ShieldCheck} label="Réserve mutuelle" value="4 080 000 F" gradient="from-emerald-500 to-green-600" trend="+24%" />
          <KPI icon={Building2} label="Partenariat NSIA" value="Actif" gradient="from-blue-500 to-indigo-600" />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="border-0 shadow-md lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Flux financiers — 6 derniers mois</CardTitle>
                  <CardDescription>Cotisations collectées vs assistances versées</CardDescription>
                </div>
                <Badge variant="outline" className="gap-1"><TrendingUp className="h-3 w-3" /> Tendance</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TREND}>
                    <defs>
                      <linearGradient id="gCoti" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gAss" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(0 72% 51%)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(0 72% 51%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="mois" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(v: number) => `${v.toLocaleString("fr-FR")} F`}
                      contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                    />
                    <Area type="monotone" dataKey="cotisations" stroke="hsl(var(--primary))" fill="url(#gCoti)" strokeWidth={2} />
                    <Area type="monotone" dataKey="assistances" stroke="hsl(0 72% 51%)" fill="url(#gAss)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Répartition</CardTitle>
              <CardDescription>Total mouvementé : {total.toLocaleString("fr-FR")} F</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={REPARTITION} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                      {REPARTITION.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${v.toLocaleString("fr-FR")} F`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-col gap-1.5 text-xs">
                {REPARTITION.map((r) => (
                  <div key={r.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                      <span className="text-muted-foreground">{r.name}</span>
                    </div>
                    <span className="font-semibold">{r.value.toLocaleString("fr-FR")} F</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ArrowUpRight className="h-5 w-5 text-primary" /> À propos de DigitOrg</CardTitle>
            <CardDescription>Maître d'œuvre de la plateforme numérique ANZRBO</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            DigitOrg ({" "}
            <a href="https://digitorg.net" target="_blank" rel="noreferrer" className="text-primary underline">
              digitorg.net
            </a>
            {" "}) édite et maintient la plateforme numérique de gestion d'ANZRBO :
            inscriptions par administrateur, cotisations solidaires (1 200 FCFA par décès),
            assistances décès (500 000 FCFA), souscriptions NSIA et notifications SMS/WhatsApp.
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function KPI({ icon: Icon, label, value, gradient, trend }: {
  icon: any; label: string; value: string | number; gradient: string; trend?: string;
}) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-xl">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.08]`} />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
            <div className="text-2xl font-bold tracking-tight">{value}</div>
            {trend && (
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <ArrowUpRight className="h-3 w-3" /> {trend}
              </div>
            )}
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
