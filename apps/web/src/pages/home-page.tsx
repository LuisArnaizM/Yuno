export function HomePage() {
  return (
    <section className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Monorepo listo para escalar</h2>
      <p className="text-muted-foreground">
        Este setup usa DTOs compartidos con Zod y API con Drizzle sobre SQLite.
      </p>
      <p className="text-sm text-muted-foreground">
        Navega a Tasks para probar validacion en frontend y backend con el mismo
        schema.
      </p>
    </section>
  );
}
